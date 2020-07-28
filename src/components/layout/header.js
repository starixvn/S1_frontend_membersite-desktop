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
				<div className="logo">
					<Link className="logo" to={`/${userInfo.langId}`}>
						<img src={Logo} alt={config.siteName} />
					</Link>
				</div>
				<Menu />
				<div className="function">
					<LanguageDropDown />
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

const LanguageDropDown = () => {
	return (
		<div className="country">
			<button className="flag ch"></button>
			<div className="countryList">
				<button className="flag cs"></button>
				<button className="flag en"></button>
				<button className="flag th"></button>
				<button className="flag id"></button>
			</div>
		</div>
	);
};
