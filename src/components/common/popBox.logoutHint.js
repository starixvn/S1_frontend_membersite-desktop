import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, content }) => {
	const { t } = useTranslation();

	return (
		<div className="Success active">
			<div className="icon icon-exit"></div>
			<div className="title">{t("lbl_Logout")}</div>
			<div>{content}</div>
			{btnBar}
		</div>
	);
};
