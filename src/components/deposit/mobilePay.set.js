import React, {
	useEffect,
	useState,
	useContext,
	useRef,
	useReducer
} from "react";
import { api_payment_GetMobilePayInfoList } from "../../service/api/payment";
import { getUrlParameter, isConvert } from "../common/common";
import { Redirect, Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import path from "../../path";
import { userInfoContext } from "../common/context";
import DepositWrapper from "./wrapper";
import ChannelPanel from "./mobilePay.set.channel";
import AmountPanel from "./mobilePay.set.amount";
import ConfirmPanel from "./mobilePay.set.confirm";
import {
	reducer,
	initState,
	defModule,
	defActionType
} from "./mobilePay.reducer";

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
		let gId = getUrlParameter("gId");
		let name = getUrlParameter("name");
		if (!gId || !name) {
			setRedirectPath(`/${userInfo.langId}/${path.deposit.root}`);
		}
	}, [setRedirectPath, userInfo.langId]);

	useEffect(() => {
		let gId = getUrlParameter("gId");
		if (gId) {
			api_payment_GetMobilePayInfoList(Number(gId)).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							dispatch({
								type: defActionType.SET_CHANNELLIST,
								channelList: res.data.data
							});
						}
					}
				},
				err => {
					if (isMountedRef.current) {
					}
				}
			);
		}
	}, [userInfo.langId]);

	let gName = getUrlParameter("name");
	let displayMoudle = null;
	const _isConvert = isConvert(userInfo.currencyId);
	switch (state.displayMoudle) {
		case defModule.ChannelPanel:
			displayMoudle = (
				<ChannelPanel
					dispatch={dispatch}
					channelList={state.channelList}
				/>
			);
			break;
		case defModule.AmountPanel:
			displayMoudle = (
				<AmountPanel
					dispatch={dispatch}
					channelInfo={state.channelList[state.channelIdx]}
					_isConvert={_isConvert}
					amount={state.amount}
				/>
			);
			break;

		case defModule.ConfirmPanel:
			displayMoudle = (
				<ConfirmPanel
					channelInfo={state.channelList[state.channelIdx]}
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
				<div className={`icon icon-${gName}`}></div>
				<div>
					<div>{t("lbl_MobileDeposit")}</div>
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
