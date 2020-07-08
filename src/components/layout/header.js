import React from "react";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import Logo from "../../styles/Nova88/img/logo.svg";
import path from "../../path";
import Menu from "./header.menu";

export default () => {
	const { t, i18n } = useTranslation();
	return (
		<header>
			<div className="header">
				<Link className="logo" to={`/${i18n.language}`}>
					<img src={Logo} alt="Nova88" />
				</Link>
				<Menu />
				<div className="function">
					<div className="country">
						<button className="flag ch"></button>
					</div>
					<Link to={path.join.root} className="join">
						{t("lbl_JoinNow")}
					</Link>
					<a href="" className="login">
						{t("lbl_Login")}
					</a>
				</div>
			</div>
		</header>
	);
};
