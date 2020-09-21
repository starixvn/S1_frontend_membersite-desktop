import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar }) => {
	const { t } = useTranslation();

	return (
		<div className="Cancel active">
			<div className="icon icon-library"></div>
			<div className="title">{t("lbl_Information")}</div>
			<div>{t("lbl_UpdateSuccessful")}</div>
			<div>{t("lbl_UpdateSuccessWillProcess")}</div>
			{btnBar}
		</div>
	);
};
