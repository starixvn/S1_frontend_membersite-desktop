import React, { useContext, useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import {
	userInfoContext,
	popBoxContext,
	loadingContext,
	walletInfoContext
} from "..//common/context";
import {
	api_account_GetWalletInfo,
	api_account_GetTpWalletList,
	api_account_GetTpWalletBalance,
	api_account_GetBalance
} from "../../service/api/account";
import { isConvert, checkAmount } from "../common/common.js";
import {
	api_tp_Transfer,
	api_tp_GetTransferRecent
} from "../../service/api/tp";
import { defPopBoxType } from "../common/popBox";
import ShowWallets from "./showWallets";
import SetAmount from "./setAmount";
import RecentHistory from "./recentHistory";

// const walletIcon = [
// 	"icon-icon32px_Main-Wallet",
// 	"icon-icon32px_Sportsbook-Wallet"
// ];

export default () => {
	const defDirection = {
		MainToTp: 1,
		TpToMain: 2
	};

	const initStatus = {
		checked: null,
		tip: ""
	};

	const initDirection = {
		transferFrom: "lbl_MainWallet",
		transferTo: "lbl_TpWallet_1"
	};

	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const [amount, setAmount] = useState("");
	///
	const [mainWallet, setMainWallet] = useState(null); // main
	const [tpWalletList, setTpWalletLsit] = useState([]); //tp
	const [walletInfo, setWalletInfo] = useState([]); //all

	const [selectedFromIdx, setSelectedFromIdx] = useState(0);
	const [selectedToIdx, setSelectedToIdx] = useState(0);
	const [fomOptions, setFromOptions] = useState([]);
	const [toOptions, setToOptions] = useState([]);
	///
	const [status, setStatus] = useState(initStatus);
	const [getHistory, setGetHistory] = useState(null);
	const [direction, setDirection] = useState(initDirection);

	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const { loading, setLoading } = useContext(loadingContext);
	const { getContentWalletInfo } = useContext(walletInfoContext);

	const _isConvert = isConvert(userInfo.currencyId);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		async function getData() {
			setLoading(true);
			await Promise.all([
				// getWalletList(),
				getMainWallet(),
				getTpWalletList(),
				getAllWalletData(),
				// getAllWalletData(),
				getTransferRecent()
			]);
			setLoading(false);
		}
		getData();
	}, []);

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	// ==========================================================

	useEffect(() => {
		getMainWallet();
		getTpWalletList();
	}, []);

	useEffect(() => {
		getAllWalletData();
		setFromOptions(tpWalletList);
		setToOptions(tpWalletList);
	}, [mainWallet, tpWalletList]);

	const getAllWalletData = () => {
		tpWalletList.unshift(mainWallet);
		setWalletInfo(tpWalletList);
	};

	const walletIcon = [
		"icon-icon32px_Main-Wallet",
		"icon-icon32px_Sportsbook-Wallet"
	];

	const getMainWallet = async () => {
		await api_account_GetBalance().then(res => {
			if (isMountedRef.current && res.data.errorCode === 0) {
				setMainWallet({
					id: 0,
					displayKey: "lbl_MainWallet",
					balance: res.data.data,
					walletIcon: walletIcon[0]
				});
			}
		});
	};

	const getTpWalletList = async () => {
		const getTpWalletInfo = async tpid => {
			let result = {};
			await api_account_GetTpWalletBalance(tpid).then(res => {
				if (res.data.errorCode === 0 && isMountedRef.current) {
					let tpItem = res.data.data;
					let tpWalletItem = {
						tpId: tpItem.tpId,
						balance: tpItem.balance
					};
					result = tpWalletItem;
				}
			});
			return result;
		};

		let allWallet = 0;
		await api_account_GetTpWalletList(allWallet).then(async res => {
			if (isMountedRef.current) {
				if (res.data.errorCode === 0) {
					let tpWalletIdArr = res.data.data.map((item, i) => {
						return {
							id: item.tpId,
							displayKey: `lbl_TpWallet_${item.tpId}`,
							walletIcon: walletIcon[1]
						};
					});

					let tpwalletBalanceArr = [];
					let walletIdArrPromiseMap = tpWalletIdArr.map(async i => {
						return await getTpWalletInfo(i.id).then(res => {
							return res;
						});
					});

					await Promise.all(walletIdArrPromiseMap).then(results => {
						tpwalletBalanceArr = results;
					});

					let tpWalletInfoArr = tpWalletIdArr.map((item, idx) => {
						if (item => item.id === tpwalletBalanceArr[idx].tpId) {
							return Object.assign(
								{},
								item,
								tpwalletBalanceArr[idx]
							);
						}
					});
					setTpWalletLsit(tpWalletInfoArr);
				}
			}
		});
	};

	const Transfer = async (_tpId, _amount, _direction) => {
		setLoading(true);
		await api_tp_Transfer({
			TpId: _tpId === 0 ? 1 : _tpId,
			amount: _amount,
			direction: _direction
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						getAllWalletData();
						getContentWalletInfo();
						getTransferRecent();
						setAmount("");
					} else if (res.data.errorCode === 9) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.TurnoverAccumulated,
							currencyId: userInfo.currencyId,
							_isConvert: _isConvert,
							turnover: res.data.data.turnover,
							rollover: res.data.data.rollover,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										OK
									</button>
								</div>
							)
						});
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
		setLoading(false);
	};

	const getTransferRecent = async () => {
		await api_tp_GetTransferRecent().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetHistory(res.data.data);
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	};

	// const changeDirection = () => {
	// 	direction.transferFrom === "lbl_MainWallet"
	// 		? setDirection({
	// 				transferFrom: "lbl_TpWallet_1",
	// 				transferTo: "lbl_MainWallet"
	// 		  })
	// 		: setDirection({
	// 				transferFrom: "lbl_MainWallet",
	// 				transferTo: "lbl_TpWallet_1"
	// 		  });
	// };

	const EditAmount = e => {
		let value = e.target.value;
		value = value.replace(/^(0+)|[^\d]+/g, "");
		ValidAmount(value);
		setAmount(value);
	};

	const ValidAmount = _amount => {
		const minAmount = 1;
		const _transferFrom = walletInfo.find(item => {
			return item.displayKey === direction.transferFrom;
		});
		console.log(_transferFrom);
		const maxAmount = _transferFrom.balance;

		let result = checkAmount(_amount, minAmount, maxAmount, _isConvert, t);
		if (result.status !== 0) {
			setStatus({
				checked: false,
				tip: result.msg
			});
		} else {
			setStatus({
				checked: true,
				tip: ""
			});
		}
		return result.status === 0;
	};

	const clickInfo = () => {
		let _msg =
			status.tip === ""
				? t("lbl_AmountTooltip")?.replace("{0}", "1")
				: "";
		setStatus({
			checked: null,
			tip: _msg
		});
	};

	const clickSubmit = e => {
		// MainToTp: 1,
		// TpToMain: 2
		e.preventDefault();
		let result = ValidAmount(amount);
		let _direction =
			direction.transferFrom === "lbl_MainWallet"
				? defDirection.MainToTp
				: defDirection.TpToMain;
		// console.log(_direction)

		if (result) {
			let real_amount = _isConvert
				? Number(amount) * 1000
				: Number(amount);

			let _wallet = walletInfo.find(item => {
				return item.displayKey === direction.transferFrom;
			});
			console.log(direction);
			console.log(direction.transferFrom);
			console.log(_wallet);

			// if (_wallet.balance < real_amount) {
			// 	setPopBox({
			// 		isOpen: true,
			// 		popBoxType: defPopBoxType.ErrorMsg,
			// 		message: t("msg_InsufficientFund"),
			// 		btnBar: (
			// 			<div className="btnGroup">
			// 				<button className="btn-cancel" onClick={ClickClose}>
			// 					{t("lbl_Close")}
			// 				</button>
			// 			</div>
			// 		)
			// 	});
			// } else {
			Transfer(_wallet.id, real_amount, _direction);
			// }
			setStatus(initStatus);
			setAmount("");
		}
	};

	const restoreAll = (idx, id) => {
		// let _direction =
		// 	walletInfo[idx].id === 0
		// 		? defDirection.TpToMain
		// : defDirection.MainToTp;

		let _direction =
			id === 0 ? defDirection.TpToMain : defDirection.MainToTp;

		// let startId = idx === 0 ? 1 : 0; //拿另一邊的
		// let statrList = idx === 0 ?  toOptions:fomOptions;

		let startWallet =
			idx === 0 ? toOptions[selectedToIdx] : fomOptions[selectedFromIdx];
		console.log("startWallet::", startWallet);
		console.log("balance::", startWallet.balance);
		if (startWallet.balance === 0) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ErrorMsg,
				message: t("msg_InsufficientFund") + "8888",
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={ClickClose}>
							{t("lbl_Close")}
						</button>
					</div>
				)
			});
		} else {
			Transfer(startWallet.id, startWallet.balance, _direction);
			getMainWallet();
			getTpWalletList();
		}
	};

	const onSelectFromItem = i => {
		setSelectedFromIdx(i);
		let isSelectMainWallet = fomOptions[i].displayKey === "lbl_MainWallet";
		setToOptions(
			walletInfo.filter(o =>
				isSelectMainWallet
					? o.displayKey !== "lbl_MainWallet"
					: o.displayKey === "lbl_MainWallet"
			)
		);
	};

	const onSelectToItem = i => {
		setSelectedToIdx(i);
		// setFromOptions(walletInfo.filter((o, idx) => idx !== i));
	};

	return loading ? (
		<></>
	) : (
		<div className="rightModule">
			<div className="infoModule">
				<div className="inside-title icon icon-icon32px_Funds-transfer">
					<span>{t("lbl_TransferFunds")}</span>
				</div>
				<ShowWallets
					i18n={t}
					// walletInfo={walletInfo}
					restoreAll={restoreAll}
					getAllWalletData={getAllWalletData}
					_isConvert={_isConvert}
					fomOptions={fomOptions}
					toOptions={toOptions}
					selectedFromIdx={selectedFromIdx}
					selectedToIdx={selectedToIdx}
				/>
				<SetAmount
					i18n={t}
					amount={amount}
					onChange={EditAmount}
					transferFrom={direction.transferFrom}
					transferTo={direction.transferTo}
					clickSubmit={clickSubmit}
					// changeDirection={changeDirection}
					onBlur={ValidAmount.bind(this, amount)}
					clickInfo={clickInfo}
					checked={status.checked}
					tip={status.tip}
					_isConvert={_isConvert}
					// options={walletInfo}
					fomOptions={fomOptions}
					toOptions={toOptions}
					selectedFromIdx={selectedFromIdx}
					selectedToIdx={selectedToIdx}
					onSelectFromItem={onSelectFromItem}
					onSelectToItem={onSelectToItem}
				/>
			</div>
			<RecentHistory
				getHistory={getHistory}
				getTransferRecent={getTransferRecent}
			/>
		</div>
	);
};
