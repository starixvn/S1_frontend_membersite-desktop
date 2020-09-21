import React from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, accountName }) => {
	const { t } = useTranslation();

	return (
		<div className="Cancel active">
			<div className="icon icon-icon32px_notification"></div>
			<div className="title">
				{t("lbl_Hi")} {accountName}
			</div>
			<div>
				{t("lbl_EnsureTransactionsCorrect")}
				<br />
				{t("lbl_BankAccountNameHint")}
			</div>
			{btnBar}
		</div>
	);
};
