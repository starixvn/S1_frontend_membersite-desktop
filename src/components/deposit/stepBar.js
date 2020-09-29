import React from "react";
import { useTranslation } from "react-i18next";

export default ({ step }) => {
	const { t } = useTranslation();

	const defStep = [
		{
			title: "01",
			description: t("lbl_SelectPaymentModes")
		},
		{
			title: "02",
			description: t("lbl_SelectBank")
		},
		{
			title: "03",
			description: t("lbl_EnterAmount")
		},
		{
			title: "OK",
			description: t("lbl_Confirm")
		}
	];

	let rows = defStep.map((s, sIdx) => {
		return (
			<div
				className={sIdx <= step - 1 ? "active" : ""}
				key={`deposit-step-${s.title}`}>
				<span>{s.title}</span>
				<span>{s.description}</span>
			</div>
		);
	});

	let percent = (step / defStep.length) * 100;

	return (
		<div className="stepBar">
			<div className="stepLine" style={{ width: percent + "%" }}></div>
			{rows}
		</div>
	);
};