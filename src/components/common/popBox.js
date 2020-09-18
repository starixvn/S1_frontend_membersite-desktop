import React, { useContext } from "react";
import { popBoxContext } from "./context";
import Cancel from "./popBox.cancel";
import UploadBankSlip from "./popBox.uploadBankSlip";
import ConfirmDelete from "./popBox.ConfirmDelete";
import Success from "./popBox.success";
import ErrorMsg from "./popBox.errorMsg";

export const defPopBoxType = {
	Cancel: "Cancel",
	UploadBankSlip: "UploadBankSlip",
	Success: "Success",
	ErrorMsg: "ErrorMsg"
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

		case defPopBoxType.Success:
			content = <Success btnBar={popBox.btnBar} />;
			break;

		case defPopBoxType.ErrorMsg:
			content = (
				<ErrorMsg
					btnBar={popBox.btnBar}
					message={popBox.message}
					errorCode={popBox.errorCode}
					icon={popBox.icon}
				/>
			);
			break;

		case defPopBoxType.ConfirmDelete:
			content = (
				<ConfirmDelete
					btnBar={popBox.btnBar}
					message={popBox.message}
					message2={popBox.message2}
				/>
			);
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
