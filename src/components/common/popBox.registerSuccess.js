import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, closeBtn }) => {
	const { t } = useTranslation();

	return (
		<div className="joinSuccess active">
			{closeBtn}
			<div className="icon icon-icon_1_cop"></div>
			<div className="title">{t("lbl_Congratulations")}</div>
			<div className="txt-orange">
				{t("lbl_BecomingDistinguishedPlayer")}
			</div>
			<div className="txt-lightgray">{t("lbl_ForAccountSecurity")}</div>
			<div className="txt-lightgray">{t("lbl_CompleteYourProfile")}</div>
			{btnBar}
		</div>
	);
};
