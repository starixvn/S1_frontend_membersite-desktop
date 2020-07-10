import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "@reach/router";
import * as ct from "../common/context";
import { GET_LANG_ID } from "../../service/language";
import { langList, defaultLang } from "../../i18n/config";
import { useTranslation } from "react-i18next";
import { getUrlParameter, setCookie, deleteCookie } from "../common/common";
import { IS_LOGGED_IN } from "../../service/auth";
import { api_accountStrict_GetCustProfile } from "../../service/api/accountStrict";
import {
	api_account_GetMsgCount,
	api_account_GetBalnace
} from "../../service/api/account";

export default ({ children, afterLogin = false }) => {
	const { t, i18n } = useTranslation();
	const [walletInfo, setWalletInfo] = useState({
		main: null
	});
	const [msgCount, setMsgCount] = useState(0);
	const [userInfo, setUserInfo] = useState({
		isLogin: null,
		userName: t("lbl_Guest"),
		langId: GET_LANG_ID()
	});

	const [redirectPath, setRedirectPath] = useState(null);

	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		IS_LOGGED_IN().then(isLogin => {
			if (afterLogin && !isLogin && isMountedRef.current) {
				setRedirectPath(`/${userInfo.langId}`);
			}
			if (isLogin !== userInfo.isLogin && isMountedRef.current) {
				setUserInfo(prevState => ({
					...prevState,
					isLogin: isLogin
				}));
			}
		});
	}, [userInfo.isLogin]);

	useEffect(() => {
		if (userInfo.isLogin) {
			if (!userInfo.regTime) {
				api_accountStrict_GetCustProfile().then(res_custInfo => {
					if (
						res_custInfo.data.errorCode === 0 &&
						isMountedRef.current
					) {
						let data = res_custInfo.data.data;
						setUserInfo(prevState => ({
							...prevState,
							...data
						}));
					}
				});
			}

			api_account_GetMsgCount().then(res => {
				if (res.data.errorCode === 0 && isMountedRef.current) {
					setMsgCount(res.data.data);
				}
			});

			if (userInfo.userName) {
				api_account_GetBalnace().then(res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						setWalletInfo(prevState => ({
							...prevState,
							main: res.data.data
						}));
					}
				});
			}
		} else if (isMountedRef.current) {
			setMsgCount(0);
		}
	}, [userInfo]);

	useEffect(() => {
		let pathLang = window.location.pathname.split("/")?.[1];
		let currentLang = i18n.language ?? userInfo.langId;
		if (!pathLang && currentLang !== defaultLang) {
			setRedirectPath(`/${currentLang}`);
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

	if (redirectPath === null) {
		if ((afterLogin === true && userInfo.isLogin) || !afterLogin) {
			return (
				<ct.userInfoContext.Provider value={{ userInfo, setUserInfo }}>
					<ct.walletInfoContext.Provider
						value={{ walletInfo, setWalletInfo }}>
						<ct.msgCountContext.Provider
							value={{ msgCount, setMsgCount }}>
							{children}
						</ct.msgCountContext.Provider>
					</ct.walletInfoContext.Provider>
				</ct.userInfoContext.Provider>
			);
		} else {
			return <></>;
		}
	} else {
		return <Redirect to={redirectPath} noThrow />;
	}
};
