import React from "react";

export default ({ bonus, rollover }) => {
	let percentage =
		bonus > rollover ? 100 : ((bonus / rollover) * 100).toFixed(2);
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
