import React, {
	useEffect,
	useState,
	useContext,
	useRef,
	useReducer
} from "react";
import { api_payment_GetCryptoPayInfoList } from "../../service/api/payment";
import { getUrlParameter, isConvert } from "../common/common";
import { Redirect, Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import path from "../../path";
import { userInfoContext } from "../common/context";
import DepositWrapper from "./wrapper";
import AmountPanel from "./cryptoPay.set.amount";
import ConfirmPanel from "./cryptoPay.set.confirm";
import {
	reducer,
	initState,
	defModule,
	defActionType
} from "./cryptoPay.reducer";
import config from "../../config";

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
		let name = getUrlParameter("name");
		if (!name) {
			setRedirectPath(`/${userInfo.langId}/${path.deposit.root}`);
		}
	}, [setRedirectPath, userInfo.langId]);

	useEffect(() => {
		let url_name_value = getUrlParameter("name");
		if (url_name_value) {
			api_payment_GetCryptoPayInfoList().then(res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						let filterItem = res.data.data.find(
							i => i.channelName === url_name_value
						);
						dispatch({
							type: defActionType.SELECT_CHANNEL,
							channelItem: filterItem
						});
					}
				}
			});
		}
	}, [userInfo.langId]);

	let gName = getUrlParameter("name");
	let displayMoudle = null;
	const _isConvert = isConvert(userInfo.currencyId);
	switch (state.displayMoudle) {
		case defModule.AmountPanel:
			displayMoudle = (
				<AmountPanel
					dispatch={dispatch}
					channelInfo={state.channelItem}
					_isConvert={_isConvert}
					amount={state.amount}
					checked={state.checked}
					tip={state.tip}
				/>
			);
			break;

		case defModule.ConfirmPanel:
			displayMoudle = (
				<ConfirmPanel
					channelInfo={state.channelItem}
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
				<img
					src={`${config.cloudImgUrl}/SiteSkin/img/Payment/${gName}.png`}
				/>
				<div>
					<div>{t("lbl_CryptoPay")}</div>
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
