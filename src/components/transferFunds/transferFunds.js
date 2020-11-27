import React, { useContext, useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import {
	userInfoContext,
	popBoxContext,
	loadingContext,
	walletInfoContext
} from "..//common/context";
import {
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
	const [mainWallet, setMainWallet] = useState(null);
	const [tpWalletList, setTpWalletLsit] = useState([]);
	const [walletInfo, setWalletInfo] = useState([]);
	const [selectedFromIdx, setSelectedFromIdx] = useState(null);
	const [selectedToIdx, setSelectedToIdx] = useState(null);
	const [fomOptions, setFromOptions] = useState([]);
	const [toOptions, setToOptions] = useState([]);
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
				getMainWallet(),
				getTpWalletList(),
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

	const getAllWalletData = () => {
		let newArr = [mainWallet, ...tpWalletList];
		setWalletInfo(newArr);
	};

	const reloadData = () => {
		getMainWallet();
		getTpWalletList();
	};

	useEffect(() => {
		reloadData();
	}, []);

	useEffect(() => {
		getAllWalletData();
		let newArr = [mainWallet, ...tpWalletList];
		setFromOptions(newArr);
		setToOptions(newArr);
	}, [mainWallet, tpWalletList]);

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
						// getContentWalletInfo();
						reloadData();
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
		e.preventDefault();
		let result = ValidAmount(amount);
		let _direction =
			fomOptions[selectedFromIdx].id === 0
				? defDirection.MainToTp
				: defDirection.TpToMain;

		if (result) {
			let real_amount = _isConvert
				? Number(amount) * 1000
				: Number(amount);

			let _wallet = [
				fomOptions[selectedFromIdx],
				toOptions[selectedToIdx]
			].filter(item => item.id !== 0)[0];

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
			setStatus(initStatus);
			setAmount("");
			// }
		}
	};

	const restoreAll = id => {
		let isClickMainWallet = id === 0;

		if (isClickMainWallet) {
			walletInfo.slice(1, walletInfo.length).forEach(item => {
				if (item.balance > 0) {
					Transfer(item.id, item.balance, defDirection.TpToMain);
				}
			});
			getMainWallet();
			getTpWalletList();
		} else {
			Transfer(
				walletInfo.filter(i => i.id === id)[0].id,
				walletInfo[0].balance,
				defDirection.MainToTp
			);
			getMainWallet();
			getTpWalletList();
		}
	};

	const onSelectFromItem = i => {
		setSelectedFromIdx(i);
		let isSelectFromMainWallet =
			fomOptions[i]?.displayKey === "lbl_MainWallet";
		let isSelecTotMainWallet =
			toOptions[selectedToIdx]?.displayKey === "lbl_MainWallet";
		if (!isSelectFromMainWallet) {
			setToOptions(
				walletInfo.filter(o => o.displayKey === "lbl_MainWallet")
			);
		} else {
			setToOptions(walletInfo);
			if (isSelecTotMainWallet) {
				setSelectedToIdx(null);
			}
		}
	};

	const onSelectToItem = i => {
		setSelectedToIdx(i);

		let isSelectFromMainWallet =
			fomOptions[selectedFromIdx]?.displayKey === "lbl_MainWallet";
		let isSelecTotMainWallet =
			toOptions[i]?.displayKey === "lbl_MainWallet";
		if (!isSelecTotMainWallet) {
			setFromOptions(
				walletInfo.filter(o => o.displayKey === "lbl_MainWallet")
			);
		} else {
			setFromOptions(walletInfo);
			if (isSelectFromMainWallet) {
				setSelectedFromIdx(null);
			}
		}
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
					walletInfo={walletInfo}
					restoreAll={restoreAll}
					reloadData={reloadData}
					_isConvert={_isConvert}
				/>
				<SetAmount
					i18n={t}
					amount={amount}
					onChange={EditAmount}
					transferFrom={direction.transferFrom}
					transferTo={direction.transferTo}
					clickSubmit={clickSubmit}
					onBlur={ValidAmount.bind(this, amount)}
					clickInfo={clickInfo}
					checked={status.checked}
					tip={status.tip}
					_isConvert={_isConvert}
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
