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
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { GetAllWallets } from "../common/wrapper.walletInfo";

export default () => {
	const defDirection = {
		MainToTp: 1,
		TpToMain: 2
	};

	const initStatus = {
		checked: null,
		tip: ""
	};

	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const [amount, setAmount] = useState("");
	const [mainWallet, setMainWallet] = useState(null);
	const [tpWalletList, setTpWalletList] = useState([]);
	const [tpWalletBalanceList, setTpWalletBalanceList] = useState([]);
	const [walletInfo, setWalletInfo] = useState([]);
	const [selectedFromIdx, setSelectedFromIdx] = useState(null);
	const [selectedToIdx, setSelectedToIdx] = useState(null);
	const [fomOptions, setFromOptions] = useState([]);
	const [toOptions, setToOptions] = useState([]);
	const [status, setStatus] = useState(initStatus);
	const [getHistory, setGetHistory] = useState(null);
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const { loading, setLoading } = useContext(loadingContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const { dispatch } = useContext(walletInfoContext);

	const walletIcon = [
		"icon-icon32px_Main-Wallet",
		"icon-icon32px_Sportsbook-Wallet"
	];

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		async function getInitialData() {
			setLoading(true);
			await getTransferRecent();
			await getMainWallet();
			getTpWalletList();
			setLoading(false);
		}
		getInitialData();
	}, []);

	const getAllWalletData = () => {
		getMainWallet();
		getTpWalletList();
	};

	useEffect(() => {
		let newArr = [mainWallet, ...tpWalletList];
		setWalletInfo(newArr);
		setFromOptions(newArr);
		setToOptions(newArr);
	}, [mainWallet, tpWalletList]);

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
		let allWallet = 0;
		await api_account_GetTpWalletList(allWallet).then(async res => {
			if (isMountedRef.current) {
				if (res.data.errorCode === 0) {
					let tpWalletInitArr = res.data.data.map((item, i) => {
						return {
							id: item.tpId,
							displayKey: `lbl_TpWallet_${item.tpId}`,
							walletIcon: walletIcon[1]
						};
					});
					setTpWalletList(tpWalletInitArr);
					GetTpWalletBalance(tpWalletInitArr);
				}
			}
		});
	};

	const GetTpWalletBalance = async tpWalletInitArr => {
		if (tpWalletInitArr?.length > 0) {
			tpWalletInitArr.forEach(async item => {
				await api_account_GetTpWalletBalance(item.id).then(res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						let tpItem = res.data.data;
						let tpWalletItem = {
							id: tpItem.tpId,
							balance: tpItem.balance
						};
						let idx = tpWalletBalanceList.findIndex(
							tp => tp.id === tpWalletItem.id
						);
						if (idx === -1) {
							tpWalletBalanceList.push(tpWalletItem);
							setTpWalletBalanceList(tpWalletBalanceList);
						} else {
							tpWalletBalanceList[idx] = tpWalletItem;
							setTpWalletBalanceList(tpWalletBalanceList);
						}

						let mergeArr = [];
						for (let i = 0; i < tpWalletInitArr.length; i++) {
							mergeArr.push({
								...tpWalletInitArr[i],
								...tpWalletBalanceList.find(
									o => o.id === tpWalletInitArr[i].id
								)
							});
						}
						setTpWalletList(mergeArr);
					}
				});
			});
		}
	};

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const Transfer = async (_tpId, _amount, _direction) => {
		setLoading(true);
		await api_tp_Transfer({
			TpId: _tpId,
			amount: _amount,
			direction: _direction
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						getAllWalletData();
						getTransferRecent();
						setAmount("");
						GetAllWallets({ isLogin: userInfo.isLogin, dispatch });
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

	const checkSelectWallet = () => {
		let checkPass = false;
		if (selectedFromIdx === null || selectedToIdx === null) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ErrorMsg,
				message:
					selectedFromIdx === null
						? t("lbl_please_select_from_wallet")
						: t("lbl_please_select_to_wallet"),
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={ClickClose}>
							{t("lbl_Close")}
						</button>
					</div>
				)
			});
		} else {
			checkPass = true;
		}
		return checkPass;
	};

	const EditAmount = e => {
		let value = e.target.value;
		value = value.replace(/^(0+)|[^\d]+/g, "");
		setAmount(value);
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
		checkSelectWallet();
		let result = amount > 0 && checkSelectWallet();
		if (result) {
			let _direction =
				fomOptions[selectedFromIdx].id === 0
					? defDirection.MainToTp
					: defDirection.TpToMain;

			let real_amount = _isConvert
				? Number(amount) * 1000
				: Number(amount);

			let _wallet = [
				fomOptions[selectedFromIdx],
				toOptions[selectedToIdx]
			].filter(item => item.id !== 0)[0];

			Transfer(_wallet.id, real_amount, _direction);
			setStatus(initStatus);
			setAmount("");
		}
	};

	const restoreAll = id => {
		let isClickMainWallet = id === 0;

		if (isClickMainWallet) {
			walletInfo
				.filter(o => o.id !== 0)
				.forEach(item => {
					if (item.balance > 0) {
						Transfer(item.id, item.balance, defDirection.TpToMain);
					}
				});
			getMainWallet();
			getTpWalletList();
		} else {
			Transfer(id, walletInfo[0].balance, defDirection.MainToTp);
			getMainWallet();
			getTpWalletList();
		}
	};

	const onSelectWallet = (col, i) => {
		if (col === "from") {
			setSelectedFromIdx(i);
			let isSelectFromMainWallet = fomOptions[i]?.id === 0;
			let isSelecToMainWallet = toOptions[selectedToIdx]?.id === 0;
			if (!isSelectFromMainWallet) {
				setToOptions(walletInfo.filter(o => o.id === 0));
			} else {
				setToOptions(walletInfo);
				if (isSelecToMainWallet) {
					setSelectedToIdx(null);
				}
			}
		} else {
			setSelectedToIdx(i);
			let isSelectFromMainWallet = fomOptions[selectedFromIdx]?.id === 0;
			let isSelecToMainWallet = toOptions[i]?.id === 0;
			if (!isSelecToMainWallet) {
				setFromOptions(walletInfo.filter(o => o.id === 0));
			} else {
				setFromOptions(walletInfo);
				if (isSelectFromMainWallet) {
					setSelectedFromIdx(null);
				}
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
					getAllWalletData={getAllWalletData}
					_isConvert={_isConvert}
				/>
				<SetAmount
					i18n={t}
					amount={amount}
					onChange={EditAmount}
					clickSubmit={clickSubmit}
					clickInfo={clickInfo}
					checked={status.checked}
					tip={status.tip}
					_isConvert={_isConvert}
					fomOptions={fomOptions}
					toOptions={toOptions}
					selectedFromIdx={selectedFromIdx}
					selectedToIdx={selectedToIdx}
					onSelectWallet={onSelectWallet}
				/>
			</div>
			<RecentHistory
				getHistory={getHistory}
				getTransferRecent={getTransferRecent}
			/>
		</div>
	);
};
