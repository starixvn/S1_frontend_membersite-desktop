import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "@reach/router";
import * as ct from "../common/context";
import { GET_LANG_ID } from "../../service/language";
import { defaultLang } from "../../i18n/config";
import { useTranslation } from "react-i18next";
import { getUrlParameter, setCookie, deleteCookie } from "../common/common";
import { IS_LOGGED_IN } from "../../service/auth";
import { api_accountStrict_GetCustProfile } from "../../service/api/accountStrict";
import {
	api_account_GetMsgCount,
	api_account_GetWalletInfo
} from "../../service/api/account";

export default ({ children, afterLogin = false }) => {
	const { t, i18n } = useTranslation();
	const [popBox, setPopBox] = useState({
		isOpen: false,
		popBoxType: null
	});

	const [walletInfo, setWalletInfo] = useState({
		main: null
	});
	const [msgCount, setMsgCount] = useState(0);
	const [userInfo, setUserInfo] = useState({
		isLogin: null,
		userName: null,
		langId: GET_LANG_ID()
	});

	const [currentPath] = useState(
		typeof window !== `undefined` ? window.location.pathname : null
	);
	const [correctPath, setCorrectPath] = useState(false);
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
	}, [userInfo.isLogin, setUserInfo, setRedirectPath]);

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
				api_account_GetWalletInfo().then(res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						let tpWallets = res.data.data.tpWallets?.map(t => {
							return {
								tpId: t.tpId,
								balance: t.balance
							};
						});
						setWalletInfo(prevState => ({
							...prevState,
							main: res.data.data.balance,
							tpWallets: tpWallets,
							lastTransaction: res.data.data.lastTransaction
						}));
					}
				});
			}
		} else if (isMountedRef.current) {
			if (userInfo.isLogin === false) {
				setUserInfo(prevState => ({
					...prevState,
					userName: t("lbl_Guest")
				}));
			}
			setMsgCount(0);
		}
	}, [userInfo.isLogin, userInfo.regTime]);

	useEffect(() => {
		if (userInfo.isLogin !== null) {
			if (typeof window !== `undefined`) {
				let pathLang = window.location.pathname.split("/")?.[1];
				let currentLang = userInfo.langId;
				if (!pathLang && currentLang !== defaultLang) {
					setRedirectPath(`/${currentLang}`);
				} else if (pathLang !== "" && pathLang !== userInfo.langId) {
					setUserInfo(prevState => ({
						...prevState,
						langId: pathLang
					}));
				} else {
					setCorrectPath(true);
				}
			}
		}
	}, [currentPath, i18n.language, userInfo.langId, userInfo.isLogin]);

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
		if (
			correctPath &&
			((afterLogin === true && userInfo.isLogin) || !afterLogin)
		) {
			return (
				<ct.userInfoContext.Provider value={{ userInfo, setUserInfo }}>
					<ct.walletInfoContext.Provider
						value={{ walletInfo, setWalletInfo }}>
						<ct.msgCountContext.Provider
							value={{ msgCount, setMsgCount }}>
							<ct.popBoxContext.Provider
								value={{ popBox, setPopBox }}>
								{children}
							</ct.popBoxContext.Provider>
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
