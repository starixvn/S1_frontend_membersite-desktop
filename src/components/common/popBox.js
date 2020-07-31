import React, { useContext } from "react";
import { popBoxContext } from "./context";

export const defPopBoxType = {
	Cancel: "Cancel"
};

export default () => {
	const { popBox } = useContext(popBoxContext);

	let content = null;
	switch (popBox.popBoxType) {
		case defPopBoxType.Cancel:
			content = <PopBoxCancel btnBar={popBox.btnBar} />;
			break;

		default:
			break;
	}

	return popBox.isOpen ? (
		<div id="popup" className="active">
			<div className="pop">{content}</div>
		</div>
	) : (
		<></>
	);
};

const PopBoxCancel = ({ btnBar }) => {
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
