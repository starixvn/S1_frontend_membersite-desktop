import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@reach/router";
import path from "../../path";
import { popBoxContext, userInfoContext } from "../common/context";

export default () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);

	const closePopBox = () => {
		setPopBox({ isOpen: false });
	};

	return (
		<div className="Cancel active">
			<div className="icon icon-bell"></div>
			<div className="title">{t("lbl_Information")}</div>
			<div>{t("msg_DepositHint")}</div>
			<div className="btnGroup">
				<button className="btn-cancel" onClick={closePopBox}>
					{t("lbl_Later")}
				</button>
				<Link
					to={`/${userInfo.langId}/${path.deposit.root}`}
					className="btn-check"
					onClick={closePopBox}>
					{t("lbl_DepositNow")}
				</Link>
			</div>
		</div>
	);
};
