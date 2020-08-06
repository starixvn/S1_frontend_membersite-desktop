import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar }) => {
	const { t } = useTranslation();

	return (
		<div className="Success active">
			<div className="icon icon-library"></div>
			<div className="title">{t("lbl_Information")}</div>
			<div className="txt-lightgray">{t("lbl_UpdateSuccess")}</div>
			{btnBar}
		</div>
	);
};
