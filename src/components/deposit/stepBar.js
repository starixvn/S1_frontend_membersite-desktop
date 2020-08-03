import React from "react";

const defStep = [
	{
		title: "01",
		description: "Select Payment Mode"
	},
	{
		title: "02",
		description: "Select Bank"
	},
	{
		title: "03",
		description: "Enter Amount"
	},
	{
		title: "OK",
		description: "Confirm"
	}
];

export default ({ step }) => {
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
