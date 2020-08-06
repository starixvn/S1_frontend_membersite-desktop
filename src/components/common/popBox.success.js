import React from "react";

export default ({ btnBar }) => {
	return (
		<div className="Success active">
			<div className="icon icon-library"></div>
			<div className="title">Information</div>
			<div className="txt-lightgray">
				Deposit Successful.
				<br />
				We will process your request ASAP!
			</div>
			{btnBar}
		</div>
	);
};
