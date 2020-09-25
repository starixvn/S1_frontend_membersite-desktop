import React from "react";
import path from "../../path";
import { Link } from "gatsby";
import { useTranslation } from "react-i18next";

const _path = path.deposit.sub.localBank.root;

export default ({ localBankList }) => {
	const { t } = useTranslation();

	return localBankList !== null && localBankList.length > 0 ? (
		<div className="subModule">
			<div className="subModuleTitle icon icon-plus">
				<div>
					<span>{t("lbl_WireTransfers")}</span>
					<span>
						{t("lbl_CreditTime")}: {t("lbl_5mins")}
					</span>
				</div>
			</div>
			<div className="subModuleBody">
				<ul>
					<li>
						<Link to={_path} className="icon icon-library"></Link>
					</li>
				</ul>
			</div>
		</div>
	) : (
		<></>
	);
};
