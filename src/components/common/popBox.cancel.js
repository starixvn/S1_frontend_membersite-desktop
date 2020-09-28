import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar }) => {
	const { t } = useTranslation();

	return (
		<div className="Cancel active">
			<div className="icon icon-bell"></div>
			<div className="title">Oh</div>
			<div>
				{t("lbl_CancelConfirmHint1")}
				<br />
				{t("lbl_CancelConfirmHint2")}
			</div>
			{btnBar}
		</div>
	);
};
