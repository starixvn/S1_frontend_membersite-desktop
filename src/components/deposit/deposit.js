import React, { useState, useEffect, useRef, useContext } from "react";
import {
	api_payment_GetOnlinePaymentList,
	api_payment_GetBankInfoOffList,
	api_payment_GetMobilePayGroupList
} from "../../service/api/payment";
import LocalBankList from "./localBank.list";
import OnlineBankList from "./onlineBank.list";
import MobilePayList from "./mobilePay.list";
import DepositWrapper from "./wrapper";
import RecentHistory from "./deposit.recentHistory";
import { useTranslation } from "react-i18next";
import {
	popBoxContext,
	loadingContext,
	userInfoContext
} from "../common/context";
import { defPopBoxType } from "../common/popBox";
import path from "../../path";
import { Link } from "@reach/router";

export default () => {
	const { t } = useTranslation();

	const isMountedRef = useRef(null);
	const [onlineBankingList, setOnlineBankingList] = useState([]);
	const [localBankList, setLocalBankList] = useState([]);
	const [paymentList, setPaymentList] = useState([]);

	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);
	const { loading, setLoading } = useContext(loadingContext);

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const openErrorMessagePopBox = (
		message = t("msg_ApiServerError"),
		errorCode = null
	) => {
		setPopBox({
			message,
			errorCode,
			isOpen: true,
			popBoxType: defPopBoxType.ErrorMsg,
			icon: "icon-bell",
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={clickClose}>
						{t("lbl_Close")}
					</button>
				</div>
			)
		});
	};

	const getOnlinePaymentList = async () => {
		await api_payment_GetOnlinePaymentList().then(
			({ data: { data, message, errorCode } }) => {
				if (!isMountedRef.current) return;

				const success = errorCode === 0;
				if (success) {
					setOnlineBankingList(data);
				} else openErrorMessagePopBox(message || "error", errorCode);
			}
		);
	};

	const getBankInfoOffList = async () => {
		await api_payment_GetBankInfoOffList().then(
			({ data: { data, message, errorCode } }) => {
				if (!isMountedRef.current) return;

				const success = errorCode === 0;
				if (success) {
					if (data.length > 0) setLocalBankList(data);
				} else openErrorMessagePopBox(message || "error", errorCode);
			}
		);
	};

	const getMobilePayGroupList = async () => {
		await api_payment_GetMobilePayGroupList().then(
			({ data: { data, message, errorCode } }) => {
				if (!isMountedRef.current) return;

				const success = errorCode === 0;
				if (success) {
					if (data.length > 0) setPaymentList(data);
				} else openErrorMessagePopBox(message || "error", errorCode);
			}
		);
	};

	useEffect(() => {
		async function getData() {
			setLoading(true);
			await Promise.all([
				getBankInfoOffList(),
				getOnlinePaymentList(),
				getMobilePayGroupList()
			]);
			setLoading(false);
		}
		getData();
	}, []);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin === true) {
			if (
				(!userInfo.accountName && userInfo.accountName !== undefined) ||
				(!userInfo.phoneNo && userInfo.phoneNo !== undefined) ||
				(!userInfo.email && userInfo.email !== undefined)
			) {
				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.UpdateProfile,
					title: t("lbl_ImportantNote"),
					content: t("lbl_UpdatePersonalInfoDeposit"),
					btnBar: (
						<div className="btnGroup">
							<Link
								className="btn-check"
								to={`/${userInfo.langId}/${path.profile.root}?prevPage=${path.deposit.root}`}>
								{t("lbl_UpdatePersonalDetail")}
							</Link>
						</div>
					)
				});
			}
		}
	}, [userInfo]);

	return loading ? (
		<></>
	) : (
		<>
			<DepositWrapper step={1}>
				<div className="subModuleList">
					<OnlineBankList onlineBankingList={onlineBankingList} />
					<LocalBankList localBankList={localBankList} />
					<MobilePayList paymentList={paymentList} />
				</div>
			</DepositWrapper>
			<RecentHistory />
		</>
	);
};
