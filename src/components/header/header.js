import React, { useContext, useEffect, useState } from "react";
import { Link, navigate } from "@reach/router";
import { userInfoContext, popBoxContext } from "../common/context";
import Menu from "./header.menu";
import config, { SiteInfo } from "../../config";
import Functions from "./header.functions";
import LanguageDropDown from "./header.langDropdown";
import { api_site_GetTpIds } from "../../service/api/site";
import { LOGOUT } from "../../service/auth";
import path from "../../path";
import { defPopBoxType } from "../common/popBox";
import { useTranslation } from "react-i18next";

export default () => {
	const { t } = useTranslation();
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [casinoTpIds, setCasinoTpIds] = useState(null);

	useEffect(() => {
		if (userInfo.isLogin && casinoTpIds === null) {
			api_site_GetTpIds().then(
				res => {
					if (res.data.errorCode === 0) {
						setCasinoTpIds(res.data.data);
					}
				},
				err => {
					if (this.isMountedRef) {
					}
				}
			);
		} else if (userInfo.isLogin === false && casinoTpIds?.length > 0) {
			setCasinoTpIds(null);
		}
	}, [userInfo.isLogin, casinoTpIds]);

	const handleLogout = () => {
		LOGOUT(() => {
			const clickClose = () => {
				if (
					window.location.pathname.includes(
						`/${userInfo.langId}/${path.resetPassword.root}`
					)
				) {
					navigate(`/${userInfo.langId}`);
				}

				setPopBox({ isOpen: false });
				setUserInfo(prevState => ({
					isLogin: false,
					langId: prevState.langId,
					kickout: true,
					willLogout: true
				}));
			};

			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.LogoutHint,
				content: t("msg_loggedout"),
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={clickClose}>
							OK
						</button>
					</div>
				)
			});
		});
	};

	const LogoutButton = () => {
		if (!userInfo.isLogin) return null;

		return <button className="icon icon-exit" onClick={handleLogout} />;
	};

	return (
		<header>
			<div className="header">
				<div className="logo">
					<Link className="logo" to={`/${userInfo.langId}`}>
						<img src={SiteInfo.logo} alt={config.siteName} />
					</Link>
				</div>
				<Menu casinoTpIds={casinoTpIds} />
				<div className="function">
					<Functions />
					<LanguageDropDown />
					<LogoutButton />
				</div>
			</div>
		</header>
	);
};
