import React, {
	useEffect,
	useState,
	useContext,
	useRef,
	useReducer
} from "react";
import { api_payment_GetOnlineBankInfoSysList } from "../../service/api/payment";
import { getUrlParameter, isConvert } from "../common/common";
import { Redirect, Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import path from "../../path";
import { userInfoContext } from "../common/context";
import DepositWrapper from "./wrapper";
import BankPanel from "./onlineBank.set.bank";
import AmountPanel from "./onlineBank.set.amount";
import ConfirmPanel from "./onlineBank.set.confirm";
import {
	reducer,
	initState,
	defModule,
	defActionType
} from "./onlineBank.reducer";

export default () => {
	const { t } = useTranslation();
	const [redirectPath, setRedirectPath] = useState(null);
	const { userInfo } = useContext(userInfoContext);
	const isMountedRef = useRef(null);
	const [state, dispatch] = useReducer(reducer, initState);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		let pId = getUrlParameter("pId");
		let cId = getUrlParameter("cId");
		let name = getUrlParameter("name");
		if (!pId || !cId || !name) {
			setRedirectPath(`/${userInfo.langId}/${path.deposit.root}`);
		}
	}, [setRedirectPath]);

	useEffect(() => {
		let pId = getUrlParameter("pId");
		if (pId) {
			api_payment_GetOnlineBankInfoSysList({
				payId: Number(pId)
			}).then(res => {
				if (res.data.errorCode === 0) {
					let datas = res.data.data.map(b => {
						let { bankLogo, sysId, bankName, ...rest } = b;
						return {
							...rest,
							bankLogo,
							sysId,
							bankName
						};
					});

					if (isMountedRef.current) {
						if (datas.length > 0) {
							dispatch({
								type: defActionType.SET_BANKLIST,
								bankList: datas
							});
						} else {
							setRedirectPath(
								`${userInfo.langId}/${path.deposit.root}`
							);
						}
					}
				}
			});
		}
	}, [userInfo.langId]);

	let pName = getUrlParameter("name");
	let displayMoudle = null;
	const _isConvert = isConvert(userInfo.currencyId);
	switch (state.displayMoudle) {
		case defModule.BankPanel:
			displayMoudle = (
				<BankPanel dispatch={dispatch} bankList={state.bankList} />
			);
			break;
		case defModule.AmountPanel:
			displayMoudle = (
				<AmountPanel
					dispatch={dispatch}
					bankInfo={state.bankList[state.bankIdx]}
					_isConvert={_isConvert}
					amount={state.amount}
				/>
			);
			break;

		case defModule.ConfirmPanel:
			displayMoudle = (
				<ConfirmPanel
					bankInfo={state.bankList[state.bankIdx]}
					_isConvert={_isConvert}
					amount={state.amount}
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
				<div className={`icon icon-${pName}`}></div>
				<div>
					<div>{t("lbl_OnlineBanking")}</div>
					<div className="txt-orange">
						{t("lbl_CreditTime")}:{t("lbl_Instant")}
					</div>
				</div>
				{state.step === 2 ? (
					<Link
						to={`/${userInfo.langId}/${path.deposit.root}`}
						className="icon icon-arrow-left2"></Link>
				) : (
					<a
						onClick={ClickBack}
						className="icon icon-arrow-left2"></a>
				)}
			</div>
			{displayMoudle}
		</DepositWrapper>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
