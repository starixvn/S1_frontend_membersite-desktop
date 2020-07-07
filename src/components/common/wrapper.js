import React, { useState, useEffect, useRef } from "react";
import * as ct from "../common/context";
import { GET_LANG_ID } from "../../service/language";
import { langList } from "../../i18n/config";
import { useTranslation } from "react-i18next";
import { getUrlParameter, setCookie, deleteCookie } from "../common/common";

export default ({ children }) => {
	const { t } = useTranslation();
	const [userInfo, setUserInfo] = useState({
		isLogin: null,
		langId: GET_LANG_ID(),
		userName: t("lbl_Guest")
	});

	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		let getLang = window.location.pathname.split("/")?.[1];
		if (!getLang && userInfo.langId !== "en") {
			window.location.href = `/${userInfo.langId}`;
		}
	}, [window.location.pathname]);

	useEffect(() => {
		let getLang = window.location.pathname.split("/")?.[1];
		if (
			langList.includes(getLang) &&
			userInfo.langId !== getLang &&
			isMountedRef.current
		) {
			console.log(userInfo.langId, getLang);
			setUserInfo(prevState => ({
				...prevState,
				langId: getLang
			}));
		}
	}, [userInfo.langId]);

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

	return (
		<ct.userInfoContext.Provider value={{ userInfo, setUserInfo }}>
			{children}
		</ct.userInfoContext.Provider>
	);
};
