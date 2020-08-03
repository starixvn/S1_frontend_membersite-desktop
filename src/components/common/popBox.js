import React, { useContext } from "react";
import { popBoxContext } from "./context";
import Cancel from "./popBox.cancel";
import UploadBankSlip from "./popBox.uploadBankSlip";

export const defPopBoxType = {
	Cancel: "Cancel",
	UploadBankSlip: "UploadBankSlip"
};

export default () => {
	const { popBox } = useContext(popBoxContext);

	let content = null;
	switch (popBox.popBoxType) {
		case defPopBoxType.Cancel:
			content = <Cancel btnBar={popBox.btnBar} />;
			break;

		case defPopBoxType.UploadBankSlip:
			const { isOpen, ...restProps } = popBox;
			content = <UploadBankSlip {...restProps} />;
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
