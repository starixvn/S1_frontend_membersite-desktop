import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { defPopBoxType } from "../common/popBox";
import { popBoxContext } from "../common/context";

const usePopBox = () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);

	const closePopBox = () => {
		setPopBox({ isOpen: false });
	};

	const errorPopBox = (
		message = t("msg_ApiServerError"),
		errorCode = null
	) => {
		setPopBox({
			message,
			errorCode,
			isOpen: true,
			popBoxType: defPopBoxType.ErrorMsg,
			icon: "icon-bell",
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={closePopBox}>
						{t("lbl_Close")}
					</button>
				</div>
			)
		});
	};

	return { closePopBox, errorPopBox };
};

export default usePopBox;
