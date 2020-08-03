import React from "react";

export default ({ btnBar }) => {
	return (
		<div className="Cancel active">
			<div className="icon icon-bell"></div>
			<div className="title">Oh</div>
			<div className="txt-lightgray">
				Are You Sure You Want To Cancel?
				<br />
				It Cannot Restore After Cancellation!
			</div>
			{btnBar}
		</div>
	);
};
