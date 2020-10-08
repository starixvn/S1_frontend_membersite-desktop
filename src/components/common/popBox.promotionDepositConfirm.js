import React from "react";
import { useTranslation } from "react-i18next";

export default ({ hint, btnBar }) => {
	const { t } = useTranslation();

	return (
		<div className="editSuccess active">
			<div className="icon icon-icon32px_notification"></div>
			<div className="title">{t("lbl_ImportantNote")}</div>
			<div className="txt-lightgray">
				{t("lbl_RequireMinAmountHint_Front")}{" "}
				<span className="txt-orange">{hint}</span>
				<br />
				{t("lbl_RequireMinAmountHint_Back")}
			</div>
			{btnBar}
		</div>
	);
};
