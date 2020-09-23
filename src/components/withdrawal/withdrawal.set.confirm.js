import React, { useEffect, useRef, useContext } from "react";
import { popBoxContext } from "../common/context";
import { number_format } from "../common/common";
import { defPopBoxType } from "../common/popBox";
import { defActionType } from "./withdrawal.reducer";
import { api_payment_WithdrawalReq } from "../../service/api/payment";

export default ({
	dispatch,
	t,
	_isConvert,
	selectedAccount,
	accountName,
	amount,
	GetCustBankInfo,
	refreshData,
	KycCheck
}) => {
	const { setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);
	const _accountNo = selectedAccount.accountNo;

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const toAmountPanel = () => {
		dispatch({ type: defActionType.TO_OTHER_PANEL, step: 2 });
	};

	const clickSubmit = () => {
		let real_amount = _isConvert ? Number(amount) * 1000 : Number(amount);

		const setInitState = () => {
			dispatch({ type: defActionType.SET_INIT_STATE });

			GetCustBankInfo();
			refreshData();
			KycCheck();
			setPopBox({ isOpen: false });
		};

		const ClosePopBox = () => {
			setPopBox({ isOpen: false });
		};

		api_payment_WithdrawalReq(
			selectedAccount.accountNo,
			real_amount,
			selectedAccount.sysId
		).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0 || res.data.errorCode === 2) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.WithdrawalSuccess,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-check"
										onClick={setInitState}>
										OK
									</button>
								</div>
							)
						});
					} else if (res.data.errorCode === -1) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message:
								t("lbl_RolloverOver") + ":" + res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClosePopBox}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					} else if (res.data.errorCode === -2) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message:
								t("lbl_DepositOver") + ":" + res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClosePopBox}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					} else if (res.data.errorCode === -3) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message:
								t("lbl_WithdrawalOver") +
								": " +
								parseInt(res.data.message, 10).toString(),
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClosePopBox}>
										{t("lbl_Close")}
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
										onClick={ClosePopBox}>
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
									onClick={ClosePopBox}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	};

	return (
		<div className="subModule">
			<div className="subModuleBody column align-items-center">
				<span className="title">{t("lbl_ImportantNote")}</span>
				<div className="txt-lightgray">
					{t("lbl_ConfirmWithdrawal")}
				</div>
				<div className="smallList">
					<ul>
						<li>{t("lbl_WithdrawalTo")}</li>
						<li>{selectedAccount.bankName}</li>
					</ul>
					<ul>
						<li>{t("lbl_AccountNumber")}</li>
						<li className="accountNumber">
							<span>{_accountNo?.slice(0, 4)}</span>
							<span>{_accountNo?.slice(4, 8)}</span>
							<span>{_accountNo?.slice(8, 12)}</span>
							<span>{_accountNo?.slice(12, 16)}</span>
						</li>
					</ul>
					<ul>
						<li>{t("lbl_BankAccountName")}</li>
						<li>{accountName}</li>
					</ul>
					<ul>
						<li>{t("lbl_WithdrawalAmount")}</li>
						<li>
							{number_format(
								_isConvert ? amount * 1000 : amount,
								_isConvert
							)}
						</li>
					</ul>
				</div>
				<div className="btnGroup">
					<button className="btn-cancel" onClick={toAmountPanel}>
						{t("lbl_Cancel")}
					</button>
					<button className="btn-check" onClick={clickSubmit}>
						{t("lbl_Submit")}
					</button>
				</div>
			</div>
		</div>
	);
};
