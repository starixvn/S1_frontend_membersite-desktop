import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "@reach/router";
import * as ct from "../common/context";
import { GET_LANG_ID } from "../../service/language";
import { langList, defaultLang } from "../../i18n/config";
import { useTranslation } from "react-i18next";
import { getUrlParameter, setCookie, deleteCookie } from "../common/common";
import { IS_LOGGED_IN } from "../../service/auth";

export default ({ children, afterLogin = false }) => {
	const { t, i18n } = useTranslation();
	const [userInfo, setUserInfo] = useState({
		isLogin: null,
		userName: t("lbl_Guest"),
		langId: GET_LANG_ID()
	});

	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		IS_LOGGED_IN().then(isLogin => {
			if (isLogin !== userInfo.isLogin && isMountedRef.current) {
				setUserInfo(prevState => ({
					...prevState,
					isLogin: isLogin
				}));
			}
		});
	}, [userInfo.isLogin]);

	useEffect(() => {
		let pathLang = window.location.pathname.split("/")?.[1];
		let currentLang = i18n.language ?? userInfo.langId;
		if (!pathLang && currentLang !== defaultLang) {
			window.location.href = `/${currentLang}`;
		}
	}, [window.location.pathname, i18n.language, userInfo.langId]);

	useEffect(() => {
		let getLang = window.location.pathname.split("/")?.[1];
		if (
			langList.includes(getLang) &&
			i18n.language !== getLang &&
			isMountedRef.current
		) {
			setUserInfo(prevState => ({
				...prevState,
				langId: getLang
			}));
		}
	}, [i18n.language]);

	useEffect(() => {
		let AffId = getUrlParameter("AffId");
		let RefId = getUrlParameter("RefId");
		let Aff = getUrlParameter("Aff");

		if (AffId) {
			setCookie("AffId", AffId, 7);
			deleteCookie("RefId");
			deleteCookie("Aff");
		} else if (RefId) {
			setCookie("RefId", RefId, 7);
			deleteCookie("AffId");
			deleteCookie("Aff");
		} else if (Aff) {
			setCookie("Aff", Aff, 7);
			deleteCookie("AffId");
			deleteCookie("RefId");
		}
	}, []);

	return userInfo.isLogin === null ? (
		<></>
	) : (afterLogin === true && userInfo.isLogin) || !afterLogin ? (
		<ct.userInfoContext.Provider value={{ userInfo, setUserInfo }}>
			{children}
		</ct.userInfoContext.Provider>
	) : window.location.pathname === `/${userInfo.langId}` ? (
		<></>
	) : (
		<Redirect to={`/${userInfo.langId}`} noThrow />
	);
};
