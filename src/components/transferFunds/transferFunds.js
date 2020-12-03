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
import { isConvert } from "../common/common.js";
import {
	api_tp_Transfer,
	api_tp_GetTransferRecent
} from "../../service/api/tp";
import { defPopBoxType } from "../common/popBox";
import ShowWallets from "./showWallets";
import SetAmount from "./setAmount";
import RecentHistory from "./recentHistory";
import { GetAllWallets } from "../common/wrapper.walletInfo";

const defDirection = {
	MainToTp: 1,
	TpToMain: 2
};

const initStatus = {
	checked: null,
	tip: ""
};

const AfterUpdWalletList = ({ prev, tpId, balance, displayKey }) => {
	let idx = prev.findIndex(p => p.id === tpId);
	if (idx !== -1) {
		prev[idx].balance = balance;
	} else {
		prev.push({
			id: tpId,
			displayKey: displayKey,
			balance: balance
		});
	}
	return [...prev];
};

const OptFilter = ({ allWallets, oppositeTpId }) => {
	return allWallets.filter(w =>
		oppositeTpId === null || oppositeTpId === 0 ? true : w.id === 0
	);
};

export default () => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const [amount, setAmount] = useState("");
	const [walletInfo, setWalletInfo] = useState([]);
	const [selectedTpId, setSelectedTpId] = useState({
		from: null,
		to: null
	});
	const [status, setStatus] = useState(initStatus);
	const [getHistory, setGetHistory] = useState(null);
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const { loading, setLoading } = useContext(loadingContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const { dispatch } = useContext(walletInfoContext);

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

	const getMainWallet = async () => {
		await api_account_GetBalance().then(res => {
			if (isMountedRef.current && res.data.errorCode === 0) {
				setWalletInfo(prev =>
					AfterUpdWalletList({
						prev,
						tpId: 0,
						balance: res.data.data,
						displayKey: "lbl_MainWallet"
					})
				);
			}
		});
	};

	const getTpWalletList = () => {
		let allWallet = 0;
		api_account_GetTpWalletList(allWallet).then(res => {
			if (isMountedRef.current && res.data.errorCode === 0) {
				getTpWalletBalance(res.data.data);
			}
		});
	};

	const getTpWalletBalance = tpArr => {
		if (tpArr?.length > 0) {
			tpArr.forEach(item => {
				api_account_GetTpWalletBalance(item.tpId).then(res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						let { tpId, balance } = res.data.data;
						setWalletInfo(prev =>
							AfterUpdWalletList({
								prev,
								tpId,
								balance,
								displayKey: `lbl_TpWallet_${tpId}`
							})
						);
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
		let checkPass = true;
		if (selectedTpId.from === null || selectedTpId.to === null) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ErrorMsg,
				message:
					selectedTpId.from === null
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
			checkPass = false;
		}
		return checkPass;
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

	const EditAmount = e => {
		let value = e.target.value;
		value = value.replace(/^(0+)|[^\d]+/g, "");
		setAmount(value);
	};

	const checkAmount = () => {
		let _checked = true;
		if (!amount > 0) {
			setStatus({
				checked: false,
				tip: t("lbl_AmountTooltip")?.replace("{0}", 0)
			});
			_checked = false;
		} else {
			setStatus({
				checked: true,
				tip: ""
			});
		}
		return _checked;
	};

	const clickSubmit = e => {
		e.preventDefault();
		let result = checkAmount() && checkSelectWallet();
		if (result) {
			let _direction =
				selectedTpId.from === 0
					? defDirection.MainToTp
					: defDirection.TpToMain;

			let real_amount = _isConvert
				? Number(amount) * 1000
				: Number(amount);

			let _wallet =
				_direction === defDirection.MainToTp
					? selectedTpId.to
					: selectedTpId.from;

			Transfer(_wallet, real_amount, _direction);
			setStatus(initStatus);
			setAmount("");
		}
	};

	const restoreAll = id => {
		if (id === 0) {
			walletInfo
				.filter(o => o.id !== 0)
				.forEach(item => {
					if (item.balance > 0) {
						Transfer(item.id, item.balance, defDirection.TpToMain);
					}
				});
		} else {
			Transfer(id, walletInfo[0].balance, defDirection.MainToTp);
		}
		getMainWallet();
		getTpWalletList();
	};

	const onSelectWallet = (col, i, value) => {
		setSelectedTpId(prev => {
			let oppsCol = col === "from" ? "to" : "from";
			return {
				[col]: value.id,
				[oppsCol]:
					value.id === 0 && prev[oppsCol] === 0 ? null : prev[oppsCol]
			};
		});
	};

	let fromOptions = OptFilter({
		allWallets: walletInfo,
		oppositeTpId: selectedTpId.to
	});

	let toOptions = OptFilter({
		allWallets: walletInfo,
		oppositeTpId: selectedTpId.from
	});

	return loading ? null : (
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
					onBlur={checkAmount}
					checked={status.checked}
					tip={status.tip}
					_isConvert={_isConvert}
					fomOptions={fromOptions}
					toOptions={toOptions}
					selectedFromIdx={fromOptions.findIndex(
						f => f.id === selectedTpId.from
					)}
					selectedToIdx={toOptions.findIndex(
						t => t.id === selectedTpId.to
					)}
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
