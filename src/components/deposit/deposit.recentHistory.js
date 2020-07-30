import React, { useContext, useEffect, useState, useRef } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { TransactionHistory } from "./deposit.historyResult";
import { api_payment_GetDepositInfoRecent } from "../../service/api/payment";
import { number_format, isConvert } from "../common/common";

export default props => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const [getHistory, setGetHistory] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_payment_GetDepositInfoRecent().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetHistory(res.data.data);
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

	let arr = getHistory?.map((item, i) => {
		return (
			<TransactionHistory
				key={`deposit-recent-${item.transId}`}
				{...item}
				_isConvert={_isConvert}
				idx={i + 1}
			/>
		);
	});

	return (
		<div className="list">
			<div className="listHeader">
				<div>NO.</div>
				<div>
					{t("lbl_Date")} ({moment().format("Z")})
				</div>
				<div>ID</div>
				<div>{t("lbl_Method")}</div>
				<div>{t("lbl_Amount")}</div>
				<div>{t("lbl_Status")}</div>
				<div>
					{t("lbl_Action")}
					<button className="icon icon-spinner11"></button>
				</div>
			</div>
			<div className="listBody">{arr}</div>
		</div>
	);
};
