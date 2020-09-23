import React, { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import BankCardPanel from "./withdrawal.set.bankCard";
import AmountPanel from "./withdrawal.set.amount";
import ConfirmPanel from "./withdrawal.set.confirm";
import { isConvert } from "../common/common";
import { userInfoContext, popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { defActionType } from "./withdrawal.reducer";
import { api_account_GetCustBankInfo } from "../../service/api/account";

export default ({ dispatch, state, refreshData, KycCheck }) => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		GetCustBankInfo();
	}, []);

	const GetCustBankInfo = () => {
		const ClosePopBox = () => {
			setPopBox({ isOpen: false });
		};

		api_account_GetCustBankInfo().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let datas = res.data.data;
						let _custBankInfo =
							datas === null ? [] : datas.bankInfoDetail;
						dispatch({
							type: defActionType.GET_CUST_BANKINFO,
							custBankInfo: _custBankInfo
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
								<button className="gray" onClick={ClosePopBox}>
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

	return (
		<div className="walletModule">
			<BankCardPanel
				dispatch={dispatch}
				state={state}
				t={t}
				accountName={userInfo.accountName}
				GetCustBankInfo={GetCustBankInfo}
				refreshData={refreshData}
				custBankInfo={state.custBankInfo ?? []}
			/>
			<div className="subModuleList">
				{state.step !== 3 ? (
					<AmountPanel
						dispatch={dispatch}
						state={state}
						t={t}
						_isConvert={_isConvert}
					/>
				) : (
					<ConfirmPanel
						dispatch={dispatch}
						t={t}
						_isConvert={_isConvert}
						selectedAccount={state.selectedAccount}
						accountName={userInfo.accountName}
						amount={state.amount}
						GetCustBankInfo={GetCustBankInfo}
						refreshData={refreshData}
						KycCheck={KycCheck}
					/>
				)}
			</div>
		</div>
	);
};
