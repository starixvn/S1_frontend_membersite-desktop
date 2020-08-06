import React, {
	useEffect,
	useReducer,
	useRef,
	useContext,
	useState
} from "react";
import { api_payment_GetBankInfoOffList } from "../../service/api/payment";
import { Redirect, Link } from "@reach/router";
import { isConvert } from "../common/common";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import DepositWrapper from "./wrapper";
import BankPanel from "./localBank.set.bank";
import AmountPanel from "./localBank.set.amount";
import ConfirmPanel from "./localBank.set.confirm";
import BankSlip from "./deposit.bankSlip";
import path from "../../path";
import {
	reducer,
	initState,
	defModule,
	defActionType
} from "./localBank.reducer";

export default () => {
	const { t } = useTranslation();
	const [redirectPath, setRedirectPath] = useState(null);
	const { userInfo } = useContext(userInfoContext);
	const [state, dispatch] = useReducer(reducer, initState);
	const _isConvert = isConvert(userInfo.currencyId);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_payment_GetBankInfoOffList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let datas = res.data.data;
						if (datas.length > 0) {
							dispatch({
								type: defActionType.SET_BANKLIST,
								bankList: datas
							});
						} else {
							setRedirectPath(
								`/${userInfo.langId}/${path.deposit.root}`
							);
						}
					} else {
						alert(res.data.message);
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
				}
			}
		);
	}, []);

	let displayModule = null;
	switch (state.displayModule) {
		case defModule.BankPanel:
			displayModule = (
				<BankPanel dispatch={dispatch} bankList={state.bankList} />
			);
			break;

		case defModule.AmountPanel:
			displayModule = (
				<AmountPanel
					bankInfo={state.bankList[state.bankIdx]}
					_isConvert={_isConvert}
					amount={state.amount}
					dispatch={dispatch}
				/>
			);
			break;

		case defModule.ConfirmPanel:
			displayModule = (
				<ConfirmPanel
					bankInfo={state.bankList[state.bankIdx]}
					_isConvert={_isConvert}
					amount={state.amount}
					dispatch={dispatch}
				/>
			);
			break;

		default:
			break;
	}

	const ClickBack = () => {
		dispatch({ type: defActionType.CLICK_BACK });
	};

	return redirectPath === null ? (
		<DepositWrapper step={state.step}>
			<div className="platformName">
				<div className="icon icon-library"></div>
				<div>
					<div>{t("lbl_WireTransfers")}</div>
					<div className="txt-orange">
						{t("lbl_CreditTime")}: {t("lbl_5mins")}
					</div>
				</div>
				{state.step === 2 ? (
					<Link
						to={`/${userInfo.langId}/${path.deposit.root}`}
						className="icon icon-arrow-left2"></Link>
				) : (
					<a
						className="icon icon-arrow-left2"
						onClick={ClickBack}></a>
				)}
			</div>
			{displayModule}
		</DepositWrapper>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
