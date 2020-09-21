import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar }) => {
	const { t } = useTranslation();
	return (
		<div className="editSuccess" style={{ display: "flex" }}>
			<div className="icon icon-icon32px_notification"></div>
			<div className="title">{t("lbl_ImportantNote")}</div>
			<div>{t("msg_OTPHint")}</div>
			{btnBar}
		</div>
	);
};
