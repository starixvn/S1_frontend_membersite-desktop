import React from "react";
import { useTranslation } from "react-i18next";
import { number_format } from "../common/common";

export default ({ btnBar, turnover, rollover, currencyId, _isConvert }) => {
	const { t } = useTranslation();

	let percentage =
		turnover > rollover ? 100 : ((turnover / rollover) * 100).toFixed(2);

	return (
		<div className="Success active">
			<div className="icon icon-icon32px_notification"></div>
			<div className="title">{t("lbl_Information")}</div>
			<div className="txt-lightgray">
				{t("lbl_TurnoverAccmulateHint")}
			</div>
			<div className="progressBarModule">
				<div className="bounsName">{t("lbl_TurnoverAccumulated")}</div>
				<div className="turnover">
					<span>{`${t(`Currency_${currencyId}`)} ${number_format(
						turnover,
						_isConvert
					)}`}</span>{" "}
					/ (
					{`${t("lbl_Req")} ${t(
						`Currency_${currencyId}`
					)} ${number_format(rollover, _isConvert)}`}
					)
				</div>
				<div className="progressBar">
					<div className="bar">
						<div
							className="progress"
							style={{ width: `${percentage}%` }}></div>
					</div>
					<div className="percentage">{percentage}%</div>
				</div>
			</div>
			{btnBar}
		</div>
	);
};
