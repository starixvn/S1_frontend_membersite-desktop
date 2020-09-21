import React, { useContext } from "react";
import {
	GET_OPEN_RULE,
	_ACTION_TYPE,
	OPEN_IN_BLANK
} from "../../service/enterPage";
import { Link } from "@reach/router";
import { defPopBoxType } from "./popBox";
import { popBoxContext } from "./context";
import path from "../../path";

const getUrl = (preUrl, info) => {
	return `/${preUrl}?tpId=${info.tpId}&gameId=${info.gameId}`;
};

export const getCurrentPage = () => {
	return typeof window !== undefined
		? `${window.location.pathname}${window.location.search}`
		: "";
};

export default ({
	defMenuLinks,
	t,
	showSubMenu,
	langId,
	isLogin,
	checkMatchPage,
	toUpperCase = false
}) => {
	const { setPopBox } = useContext(popBoxContext);
	const showLogin = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Login
		});
	};

	const _showSubMenu = key => {
		if (showSubMenu) {
			showSubMenu(key);
		}
	};

	let currentPage = checkMatchPage ? getCurrentPage() : "";

	let rows = Object.keys(defMenuLinks).map(key => {
		let m = defMenuLinks[key];

		let _className = m.className ? m.className : "";

		if (m.isHot) {
			_className = `${_className} hot`;
		}

		let displayText = toUpperCase
			? t(m.displayKey)?.toUpperCase()
			: t(m.displayKey);

		let _path = m.path;

		if (m.productInfo) {
			let rule = GET_OPEN_RULE(
				langId,
				m.productInfo.tpId,
				m.productInfo.gameId
			);

			if (m.tpId === 1 && rule.actionType === _ACTION_TYPE.redirect) {
				_path = path.sports.root;
			}

			let isBlank = rule.actionType === _ACTION_TYPE.blank;
			if (rule.needLogin && isLogin === false) {
				return (
					<button
						key={key}
						onClick={showLogin}
						className={_className}
						onMouseOver={_showSubMenu.bind(this, key)}>
						{displayText}
					</button>
				);
			} else if (isBlank) {
				return (
					<a
						key={key}
						className={_className}
						onMouseOver={_showSubMenu.bind(this, key)}
						onClick={OPEN_IN_BLANK.bind(
							this,
							rule.entPageUrl,
							rule.windowKey
						)}>
						{displayText}
					</a>
				);
			} else if (!_path) {
				return (
					<button
						key={key}
						className={_className}
						onMouseOver={_showSubMenu.bind(this, key)}>
						{displayText}
					</button>
				);
			} else {
				let _url = getUrl(`${langId}/${_path}`, m.productInfo);

				_className =
					checkMatchPage && _url === currentPage
						? _className
							? `${_className} active`
							: "active"
						: _className;
				return (
					<Link
						key={key}
						to={_url}
						className={_className}
						onMouseOver={_showSubMenu.bind(this, key)}>
						{displayText}
					</Link>
				);
			}
		} else {
			if (_path) {
				_className =
					checkMatchPage && `${langId}/${_path}` === currentPage
						? _className
							? `${_className} active`
							: "active"
						: _className;
				return (
					<Link
						key={key}
						to={`${langId}/${_path}`}
						onMouseOver={_showSubMenu.bind(this, key)}
						className={_className}>
						{displayText}
					</Link>
				);
			} else {
				return (
					<button
						key={key}
						onMouseOver={_showSubMenu.bind(this, key)}
						className={_className}>
						{displayText}
					</button>
				);
			}
		}
	});

	return <>{rows}</>;
};
