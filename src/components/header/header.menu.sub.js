import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@reach/router";
import { defMenuType } from "./header.menu.def";
import { popBoxContext, userInfoContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { SET_ENTER_PAGE } from "../../service/enterPage";

export default ({ listClassName, subItems, menuKey, mainUrl }) => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);

	const ClickItem = (tpId, gameId) => {
		const loginCallback = () => {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.Login
			});
		};

		SET_ENTER_PAGE({
			isLogin: userInfo.isLogin,
			langId: userInfo.langId,
			tpId: tpId,
			gameId: gameId,
			loginCallback: loginCallback
		});
	};

	let rows = subItems.map(s => {
		let displayText = s.displayText ? s.displayText : t(s.displayKey);
		let key = `${menuKey}-${userInfo.isLogin}-${displayText}`;

		let params = null;
		if (s.parameter) {
			params = Object.keys(s.parameter).map(key => {
				return `${key}=${s.parameter[key]}`;
			});
		}

		let _urlParams = params !== null ? `?${params.join("&")}` : "";
		if (s.menuType === defMenuType.Link) {
			return (
				<Link
					key={key}
					className={s.className}
					to={`/${userInfo.langId}/${mainUrl}${_urlParams}`}>
					<span className={s.icon}>{displayText}</span>
				</Link>
			);
		} else {
			return (
				<button
					key={key}
					className={s.className}
					onClick={ClickItem.bind(this, s.tpId, s.gameId, userInfo)}>
					<span className={s.icon}>{displayText}</span>
				</button>
			);
		}
	});

	return <div className={`${listClassName} active`}>{rows}</div>;
};
