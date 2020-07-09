import React, { useContext } from "react";
import { Link } from "@reach/router";
import { userInfoContext } from "../common/context";
import { useTranslation } from "react-i18next";
import Logo from "../../styles/img/logo.svg";
import path from "../../path";
import Menu from "./header.menu";
import config from "../../config";

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);

	return (
		<header>
			<div className="header">
				<Link className="logo" to={`/${userInfo.langId}`}>
					<img src={Logo} alt={config.siteName} />
				</Link>
				<Menu />
				<div className="function">
					<div className="country">
						<button className="flag ch"></button>
					</div>
					<Link
						to={`${userInfo.langId}/${path.join.root}`}
						className="join">
						{t("lbl_JoinNow")}
					</Link>
					<Link
						to={`${userInfo.langId}/${path.login.root}`}
						className="login">
						{t("lbl_Login")}
					</Link>
				</div>
			</div>
		</header>
	);
};
