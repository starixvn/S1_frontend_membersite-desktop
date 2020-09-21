import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar }) => {
	const { t } = useTranslation();
	return (
		<div className="updateSuccess active">
			<div className="icon icon-library"></div>
			<div className="title">{t("lbl_AddBankAccount")}</div>
			<div>{t("lbl_UpdateSuccessful")}</div>
			{btnBar}
		</div>
	);
};
