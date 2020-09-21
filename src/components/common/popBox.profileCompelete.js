import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, contentMsg }) => {
	const { t } = useTranslation();

	return (
		<div className="Cancel active">
			<div className="icon icon-icon32px_Profile"></div>
			<div className="title">{t("lbl_UpdateSuccessful")}</div>
			<div>
				{t("lbl_Awesome")}!
				<br />
				{contentMsg}
			</div>
			{btnBar}
		</div>
	);
};
