import React, {
	useEffect,
	useRef,
	useContext,
	useReducer,
	useState
} from "react";
import { useTranslation } from "react-i18next";
import { api_account_GetCustBankInfo } from "../../service/api/account";
import {
	defModule,
	reducer,
	initState,
	defActionType
} from "./bankInfo.reducer";
import { userInfoContext, popBoxContext } from "../common/context";
import InitPanel from "./bankInfo.set.init";
import BankPanel from "./bankInfo.set.selectBank";
import AccountPanel from "./bankInfo.set.account";
import ShowCard from "./bankInfo.set.bankCard";
import { defPopBoxType } from "../common/popBox";
import Loading from "../common/loading";

export default () => {
	const { t } = useTranslation();
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [state, dispatch] = useReducer(reducer, initState);
	const [showTip, setShowTip] = useState(false);
	const isMountedRef = useRef(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		getBankInfo(false);
	}, []);

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const clickTip = () => {
		setShowTip(!showTip);
	};

	const getBankInfo = setAccountName => {
		api_account_GetCustBankInfo().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let resData = res.data.data;
						if (setAccountName) {
							setUserInfo(prev => ({
								...prev,
								accountName: resData.accountName
							}));
						}

						dispatch({
							type: defActionType.GET_CUST_BANK_INFO,
							datas: resData
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
										onClick={clickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
					setLoading(false);
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
									onClick={clickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
					setLoading(false);
				}
			}
		);
	};

	let displayModule = null;
	switch (state.displayModule) {
		case defModule.InitPanel:
			displayModule = (
				<InitPanel
					dispatch={dispatch}
					numberOfAccount={
						state.custBankList ? state.custBankList?.length : 0
					}
				/>
			);
			break;

		case defModule.BankPanel:
			displayModule = (
				<BankPanel dispatch={dispatch} bankList={state.bankList} />
			);
			break;

		case defModule.AccountPanel:
			displayModule = (
				<AccountPanel
					dispatch={dispatch}
					bankInfo={state.bankList[state.bankIdx]}
					accountNumber={state.accountNumber}
					accountName={
						userInfo.accountName
							? userInfo.accountName
							: state.accountName
					}
					alreadyHasAccountName={userInfo.accountName ? true : false}
					reload={getBankInfo}
				/>
			);
			break;

		default:
			break;
	}

	return loading ? (
		<Loading />
	) : (
		<>
			<div className="infoModule">
				<div className="inside-title icon icon-icon32px_bank-account">
					<span>{t("lbl_BankInfo")}</span>
					<div>{t("lbl_UpdateBankInfo")}</div>
				</div>

				<div className="accountName">
					{userInfo.accountName ? (
						<>
							{t("lbl_BankAccountName")}
							<span>{userInfo.accountName}</span>
							<button
								className="icon icon-error"
								onClick={clickTip}></button>
							{showTip ? (
								<div className="tip active">
									{t("lbl_ContactCSD")}
								</div>
							) : null}
						</>
					) : null}
				</div>

				{displayModule}
			</div>
			<ShowCard
				accountName={state.accountName}
				custBankList={state.custBankList}
				reload={getBankInfo.bind(this, false)}
			/>
		</>
	);
};
