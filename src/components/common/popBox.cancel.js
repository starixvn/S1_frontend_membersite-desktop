import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar }) => {
	const { t } = useTranslation();

	return (
		<div className="Cancel active">
			<div className="icon icon-bell"></div>
			<div className="title">Oh</div>
			<div className="txt-lightgray">{t("lbl_CancelConfirm")}</div>
			{btnBar}
		</div>
	);
};
