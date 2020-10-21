import React from "react";

export default ({ turnover, rollover }) => {
	let percentage =
		turnover > rollover ? 100 : ((turnover / rollover) * 100).toFixed(2);
	return (
		<div className="progressBar">
			<div className="bar">
				<div
					className="progress"
					style={{ width: `${percentage}%` }}></div>
			</div>
			<div className="percentage">{percentage}%</div>
		</div>
	);
};
