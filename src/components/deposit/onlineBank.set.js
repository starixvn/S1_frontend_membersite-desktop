import React, {
	useEffect,
	useState,
	useContext,
	useRef,
	useReducer
} from "react";
import {
	api_payment_GetOnlineBankInfoSysList,
	api_payment_GetOnlinePaymentList
} from "../../service/api/payment";
import { navigate } from "@reach/router";
import { getUrlParameter, isConvert } from "../common/common";
import { Redirect, Link, useLocation } from "@reach/router";
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

const _path = path.deposit.sub.onlineBank.root;

export default () => {
	const { t } = useTranslation();

	const [redirectPath, setRedirectPath] = useState(null);
	const isMountedRef = useRef(null);
	const [state, dispatch] = useReducer(reducer, initState);
	const location = useLocation();

	const { userInfo } = useContext(userInfoContext);

	const getOnlinePaymentInfo = async pId => {
		return await api_payment_GetOnlinePaymentList().then(
			({ data: { data, errorCode } }) => {
				if (!isMountedRef.current) return;

				const success = errorCode === 0;
				if (success) {
					return data.find(item => item.payId === pId);
				}
			}
		);
	};

	const getOnlineBankInfoSysList = async pId => {
		await api_payment_GetOnlineBankInfoSysList({
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
	};

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
		async function fetchData() {
			let pId = getUrlParameter("pId");

			if (location.state?.selBank === undefined) {
				let paymentInfo = await getOnlinePaymentInfo(Number(pId));
				if (!paymentInfo?.selBank)
					return navigate(`/${userInfo.langId}/${path.deposit.root}`);

				const {
					channelId,
					payName,
					maxAmount,
					minAmount
				} = paymentInfo;

				let cId = getUrlParameter("cId");
				let name = getUrlParameter("name");
				let max = getUrlParameter("max");
				let min = getUrlParameter("min");

				if (
					payName !== name ||
					String(channelId) !== cId ||
					String(maxAmount) !== max ||
					String(minAmount) !== min
				)
					return navigate(
						`${_path}?name=${payName}&pId=${pId}&cId=${channelId}&max=${maxAmount}&min=${minAmount}`
					);
			} else if (!location.state.selBank)
				return dispatch({
					type: defActionType.JUNP_TO_ENTER_AMOUNT
				});

			if (pId) {
				await getOnlineBankInfoSysList(pId);
			}
		}
		fetchData();
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
			let maxAmount = getUrlParameter("max");
			let minAmount = getUrlParameter("min");
			displayMoudle = (
				<AmountPanel
					dispatch={dispatch}
					bankInfo={state.bankList[state.bankIdx]}
					_isConvert={_isConvert}
					amount={state.amount}
					checked={state.checked}
					tip={state.tip}
					maxAmount={maxAmount}
					minAmount={minAmount}
				/>
			);
			break;

		case defModule.ConfirmPanel:
			displayMoudle = (
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
				<div className={`icon icon-${pName}`}></div>
				<div>
					<div>{t("lbl_OnlineBanking")}</div>
					<div className="txt-orange">
						{t("lbl_CreditTime")}:{t("lbl_Instant")}
					</div>
				</div>
				{state.step === 2 || !location.state?.selBank ? (
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
