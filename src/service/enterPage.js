import config from "../config";
import path from "../path";

export const _ACTION_TYPE = {
	blank: 1,
	redirect: 2
};

export const SET_CASINO_ENTER_PAGE = (tpId, gameId, isFree, langId) => {
	if (typeof window !== `undefined`) {
		const appUrl = window.location.href;
		let homeUrl = `${appUrl}`;
		let signupUrl = `${appUrl}${path.join.root}`;
		let LoginUrl = `${appUrl}${path.login.root}`;
		let entPageUrl = `${config.openURL}/${langId}/entPage?homeUrl=${homeUrl}&signupUrl=${signupUrl}&LoginUrl=${LoginUrl}&tpId=${tpId}&gameId=${gameId}`;
		window
			.open(
				`${entPageUrl}&fun=${
					isFree ? 1 : 0
				}&gameId=${gameId}&tpId=${tpId}&gameType=slots`,
				`Tp_${tpId}`,
				"toolbar=no, menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no, top=0, left=0"
			)
			.focus();
	}
};

export const SET_ENTER_PAGE = ({
	langId,
	tpId,
	gameId,
	isLogin,
	loginCallback
}) => {
	let result = GET_OPEN_RULE(langId, tpId, gameId);
	if (!isLogin && result.needLogin) {
		loginCallback();
	} else if (result.actionType === _ACTION_TYPE.blank) {
		OPEN_IN_BLANK(result.entPageUrl, result.windowKey);
	} else if (result.actionType === _ACTION_TYPE.redirect) {
		if (typeof window !== `undefined`) {
			window.location.href = result.entPageUrl;
		}
	}
};

export const OPEN_IN_BLANK = (url, windowKey) => {
	if (typeof window !== `undefined`) {
		window.open(
			url,
			windowKey,
			"toolbar=no, menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no, top=0, left=0"
		);
	}
};

export const GET_OPEN_RULE = (langId, tpId, gameId) => {
	let result = setResult("", true, _ACTION_TYPE.blank);
	if (tpId === 1) {
		if (gameId === 43 || gameId === 220 || gameId === 202) {
			result = setResult("", true, _ACTION_TYPE.redirect, tpId, gameId);
		} else if (gameId < 100) {
			result = setResult("", false, _ACTION_TYPE.redirect, tpId, gameId);
		} else if (gameId === 161 || gameId === 180) {
			result = setResult("", false, _ACTION_TYPE.redirect, tpId, gameId);
		} else if (gameId >= 200) {
			result = setResult("", true, _ACTION_TYPE.blank, tpId, gameId);
		}
	} else {
		result = setResult("", true, _ACTION_TYPE.blank, tpId, gameId);
	}

	return {
		...result,
		entPageUrl: GET_ENTER_PAGE_URL(langId, tpId, gameId)
	};
};

export const GET_ENTER_PAGE_URL = (langId, tpId, gameId) => {
	const appUrl = typeof window !== `undefined` ? window.location.href : null;
	let homeUrl = `${appUrl}`;
	let signupUrl = `${appUrl}${path.join.root}`;
	let LoginUrl = `${appUrl}${path.login.root}`;
	let lobbyUrl = ``;
	let cashierUrl = `${appUrl}${path.deposit.root}`;
	return `${config.openURL}/${langId}/entPage?homeUrl=${homeUrl}&signupUrl=${signupUrl}&LoginUrl=${LoginUrl}&tpId=${tpId}&gameId=${gameId}&CashierUrl=${cashierUrl}&&LobbyUrl=${lobbyUrl}`;
};

const setResult = (url, needLogin, actionType, tpId, gameId) => {
	return {
		url: url,
		needLogin: needLogin,
		actionType: actionType,
		windowKey: tpId === 1 ? `Tp_${tpId}_${gameId}` : `Tp_${tpId}`
	};
};
