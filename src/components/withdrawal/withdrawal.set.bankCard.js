import React, { useEffect, useRef, useContext } from "react";
import config from "../../config";
import { defActionType } from "./withdrawal.reducer";
import { api_accountStrict_DelCustBankInfo } from "../../service/api/accountStrict";
import { api_payment_GetBankInfoSysList } from "../../service/api/payment";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";

export default ({
	dispatch,
	state,
	t,
	accountName,
	GetCustBankInfo,
	custBankInfo,
	refreshData
}) => {
	const { setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const selectAccount = accountData => {
		dispatch({
			type: defActionType.SELECT_ACCOUNT,
			selectedAccount: {
				bankName: accountData.bankName,
				accountNo: accountData.accountNo,
				sysId: accountData.sysId
			}
		});
	};

	const ClosePopBox = () => {
		setPopBox({ isOpen: false });
	};

	const addBankAccount = () => {
		api_payment_GetBankInfoSysList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let datas = res.data.data;
						let _bankInfoSysList = datas.map((item, i) => {
							return {
								id: i,
								sysId: item.sysId,
								displayText: item.bankName,
								image: item.bankLogo
							};
						});
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.AddBankAccount,
							bankInfoSysList: _bankInfoSysList,
							GetCustBankInfo: GetCustBankInfo
						});
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="gray"
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
								<button className="gray" onClick={ClosePopBox}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	};

	const delAccount = (accountNo, sysId) => {
		const delBankInfo = () => {
			api_accountStrict_DelCustBankInfo({
				AccountName: accountName,
				AccountNo: accountNo,
				SysId: sysId
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							dispatch({
								type: defActionType.SET_INIT_STATE
							});
							GetCustBankInfo();
							refreshData();
							setPopBox({ isOpen: false });
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: res.data.message,
								btnBar: (
									<div className="btnGroup">
										<button
											className="gray"
											onClick={ClosePopBox}>
											{t("lbl_Close")}
										</button>
									</div>
								)
							});
						}
						dispatch({
							type: defActionType.SET_LOADING,
							loading: false
						});
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
										className="gray"
										onClick={ClosePopBox}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
						dispatch({
							type: defActionType.SET_LOADING,
							loading: false
						});
					}
				}
			);
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.ConfirmDelete,
			message: t("lbl_AreYouSureDelete"),
			message2: t("lbl_CantBeRestore"),
			btnBar: (
				<div className="btnGroup">
					<button className="gray" onClick={delBankInfo}>
						{t("lbl_Yes")}
					</button>
					<button className="btn-check" onClick={ClosePopBox}>
						{t("lbl_No")}
					</button>
				</div>
			)
		});
	};

	let arr = custBankInfo?.map(item => {
		let _key = `withdrawal-bankCard-${item.accountNo}`;
		let _checked = item.accountNo === state.selectedAccount?.accountNo;

		return (
			<BankCard
				key={_key}
				checkKey={item.accountNo}
				{...item}
				selectAccount={selectAccount.bind(this, item)}
				checked={_checked}
				delAccount={delAccount.bind(this, item.accountNo, item.sysId)}
			/>
		);
	});

	return (
		<div className="addBank">
			{custBankInfo.length > 0 ? arr : null}

			{custBankInfo.length < 3 ? (
				<div className="addBankName noBank" onClick={addBankAccount}>
					<div className="icon icon-plus"></div>
					<div>{t("lbl_AddBankAccount")}</div>
				</div>
			) : (
				<div className="addBankName noBank">
					<div className="icon icon-warning"></div>
					<div>{t("lbl_BankCardsFull")}</div>
				</div>
			)}

			<div className="remainder">
				{t("lbl_NumberOfBankAccounts")}:{custBankInfo?.length ?? 0}/3
			</div>
		</div>
	);
};

const BankCard = props => {
	return (
		<div className="addBankName">
			<div className="addBankInfo">
				<div className="bankName">
					<img
						src={`${config.imgUrl}/common/images/BankLogo/${props.bankLogo}`}
						alt=""
					/>
				</div>
				<div className="checkbox">
					<input
						type="checkbox"
						id={props.checkKey}
						onChange={props.selectAccount}
						checked={props.checked}
					/>
					<label
						htmlFor={props.checkKey}
						className="icon icon-checkbox-checked"></label>
				</div>
			</div>
			<div className="addBankInfo">
				<div className="txt-blue">
					<span>{props.accountNo?.slice(0, 4)}</span>
					<span>{props.accountNo?.slice(4, 8)}</span>
					<span>{props.accountNo?.slice(8, 12)}</span>
					<span>{props.accountNo?.slice(12, 16)}</span>
				</div>
				<button
					className="icon icon-bin"
					onClick={props.delAccount}></button>
			</div>
		</div>
	);
};
