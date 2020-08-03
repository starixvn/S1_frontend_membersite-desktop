import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { api_payment_GetMobilePayGroupList } from "../../service/api/payment";
import path from "../../path";
import { Link } from "gatsby";

const _path = path.deposit.sub.mobilePay.root;

export default () => {
	const { t } = useTranslation();
	const [paymentList, setPaymentList] = useState([]);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_payment_GetMobilePayGroupList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						if (res.data.data.length > 0) {
							setPaymentList(res.data.data);
						}
					} else {
						// setPopBox({
						// 	isOpen: true,
						// 	title: i18n.lbl_ImportantNote,
						// 	content: res.data.message
						// });
					}
					// setLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					// setLoading(false);
					// setPopBox({
					// 	isOpen: true,
					// 	title: i18n.lbl_ImportantNote,
					// 	content: i18n.msg_ApiServerError
					// });
				}
			}
		);
	}, []);

	let rows = paymentList?.map(p => {
		return (
			<li key={`deposit-mobilePay-${p.groupName}}`}>
				<Link
					to={`${_path}?name=${p.groupName}&gId=${p.groupId}`}
					className={`icon icon-${p.groupName}`}></Link>
			</li>
		);
	});

	return paymentList !== null && paymentList.length > 0 ? (
		<div className="subModule">
			<div className="subModuleTitle icon icon-plus">
				<div>
					<span>{t("lbl_MobileDeposit")}</span>
					<span>
						{t("lbl_CreditTime")}: {t("lbl_Instant")}
					</span>
				</div>
			</div>
			<div className="subModuleBody">
				<ul>{rows}</ul>
			</div>
		</div>
	) : (
		<></>
	);
};
