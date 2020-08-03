import React from "react";
import { useTranslation } from "react-i18next";
import StepBar from "./stepBar";

export default ({ step, children }) => {
	const { t } = useTranslation();

	return (
		<div className="infoModule">
			<div className="deposit-title icon icon-library">
				<span>{t("lbl_Deposit")}</span>
				<div>
					You can choose the most suitable deposit option from the
					ones provided below:
				</div>
			</div>
			<StepBar step={step} />
			{children}
		</div>
	);
};
