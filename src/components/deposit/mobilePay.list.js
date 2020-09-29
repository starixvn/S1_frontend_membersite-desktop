import React from "react";
import path from "../../path";
import { Link } from "gatsby";
import { useTranslation } from "react-i18next";

const _path = path.deposit.sub.mobilePay.root;

export default ({ paymentList }) => {
	const { t } = useTranslation();

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
			<div className="subModuleTitle">
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
