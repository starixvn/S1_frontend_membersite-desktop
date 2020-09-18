import React from "react";

export default ({ btnBar, message, message2 }) => {
	return (
		<div className="Success active">
			<div className="icon icon-bell"></div>
			<div className="title">Oh</div>
			<div>
				{message}
				<br />
				{message2}
			</div>
			{btnBar}
		</div>
	);
};
