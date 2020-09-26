import React, { useContext, useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import {
	userInfoContext,
	popBoxContext,
	loadingContext
} from "..//common/context";
import { api_account_GetWalletInfo } from "../../service/api/account";
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
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const [walletInfo, setWalletInfo] = useState([]);
	const [amount, setAmount] = useState("");
	const [direction, setDirection] = useState(initDirection);
	const [getHistory, setGetHistory] = useState(null);
	const [status, setStatus] = useState(initStatus);
	const isMountedRef = useRef(null);
	const { loading, setLoading } = useContext(loadingContext);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		async function getData() {
			setLoading(true);
			await Promise.allSettled([getWalletData(), getTransferRecent()]);
			setLoading(false);
		}
		getData();
	}, []);

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const getWalletData = async () => {
		await api_account_GetWalletInfo().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let mainWallet = {
							id: 0,
							displayKey: "lbl_MainWallet",
							balance: res.data.data.balance
						};

						let tpWalletArr = res.data.data.tpWallets.map(item => {
							return {
								id: item.tpId,
								displayKey: `lbl_TpWallet_${item.tpId}`,
								balance: item.balance
							};
						});
						setWalletInfo([mainWallet, ...tpWalletArr]);
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
						getWalletData();
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

	const changeDirection = () => {
		direction.transferFrom === "lbl_MainWallet"
			? setDirection({
					transferFrom: "lbl_TpWallet_1",
					transferTo: "lbl_MainWallet"
			  })
			: setDirection({
					transferFrom: "lbl_MainWallet",
					transferTo: "lbl_TpWallet_1"
			  });
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
			direction.transferFrom === "lbl_MainWallet"
				? defDirection.MainToTp
				: defDirection.TpToMain;

		if (result) {
			let real_amount = _isConvert
				? Number(amount) * 1000
				: Number(amount);

			let _wallet = walletInfo.find(item => {
				return item.displayKey === direction.transferFrom;
			});

			if (_wallet.balance < real_amount) {
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.ErrorMsg,
					message: t("msg_InsufficientFund"),
					btnBar: (
						<div className="btnGroup">
							<button className="btn-cancel" onClick={ClickClose}>
								{t("lbl_Close")}
							</button>
						</div>
					)
				});
			} else {
				Transfer(_wallet.id, real_amount, _direction);
			}
			setStatus(initStatus);
			setAmount("");
			setDirection(initDirection);
		}
	};

	const restoreAll = idx => {
		let _direction =
			walletInfo[idx].id === 0
				? defDirection.TpToMain
				: defDirection.MainToTp;

		let startId = idx === 0 ? 1 : 0;
		let startWallet = walletInfo[startId];

		if (startWallet.balance === 0) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ErrorMsg,
				message: t("msg_InsufficientFund"),
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
		}
	};

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
					getWalletData={getWalletData}
					_isConvert={_isConvert}
				/>
				<SetAmount
					i18n={t}
					amount={amount}
					onChange={EditAmount}
					transferFrom={direction.transferFrom}
					transferTo={direction.transferTo}
					clickSubmit={clickSubmit}
					changeDirection={changeDirection}
					onBlur={ValidAmount.bind(this, amount)}
					clickInfo={clickInfo}
					checked={status.checked}
					tip={status.tip}
					_isConvert={_isConvert}
				/>
			</div>
			<RecentHistory
				getHistory={getHistory}
				getTransferRecent={getTransferRecent}
			/>
		</div>
	);
};
