import React, { useState, useEffect, useRef } from "react";
import { Redirect, navigate, Link } from "@reach/router";
import * as ct from "../common/context";
import { defaultLang } from "../../i18n/config";
import { useTranslation } from "react-i18next";
import {
	getUrlParameter,
	setCookie,
	deleteCookie,
	getNewLanguagePath,
	readCookie
} from "../common/common";
import { IS_LOGGED_IN } from "../../service/auth";
import { api_accountStrict_GetCustProfile } from "../../service/api/accountStrict";
import {
	api_account_GetMsgCount,
	api_account_GetWalletInfo,
	api_account_onlineCheck
} from "../../service/api/account";
import { defPopBoxType } from "../common/popBox";
import useInterval from "../hook/useInterval";
import { GET_LANG_ID } from "../../service/language";
import { SiteInfo } from "../../config";
import path from "../../path";

export default ({ children, afterLogin = false }) => {
	const { t, i18n } = useTranslation();
	const [popBox, setPopBox] = useState({
		isOpen: false,
		popBoxType: null
	});
	const [loading, setLoading] = useState(false);
	const [walletInfo, setWalletInfo] = useState({
		main: null
	});
	const [msgCount, setMsgCount] = useState(0);
	const [userInfo, setUserInfo] = useState({
		isLogin: null,
		userName: null,
		langId: readCookie(SiteInfo.langCookie) ?? GET_LANG_ID()
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
			if (userInfo.kickout) {
				if (userInfo.willLogout) {
					setUserInfo(prevS => ({
						...prevS,
						kickout: false,
						willLogout: false
					}));
				} else {
					const ClickClose = () => {
						setPopBox({ isOpen: false });
						setUserInfo(prevS => ({
							...prevS,
							kickout: false
						}));
					};
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.LogoutHint,
						content: t("msg_ForceLogedout"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			} else if (afterLogin && !isLogin && isMountedRef.current) {
				setRedirectPath(`/${userInfo.langId}`);
			}
			if (isLogin !== userInfo.isLogin && isMountedRef.current) {
				setUserInfo(prevState => ({
					...prevState,
					isLogin: isLogin
				}));
			}
		});
	}, [
		userInfo.isLogin,
		userInfo.kickout,
		userInfo.willLogout,
		setUserInfo,
		setRedirectPath,
		setPopBox
	]);

	useEffect(() => {
		if (userInfo.isLogin) {
			if (!userInfo.regTime) {
				api_accountStrict_GetCustProfile().then(res_custInfo => {
					if (
						res_custInfo.data.errorCode === 0 &&
						isMountedRef.current
					) {
						let data = res_custInfo.data.data;
						setCookie(SiteInfo.langCookie, data.langId);
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
				getContentWalletInfo();
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
				let currentLang =
					readCookie(SiteInfo.langCookie) ?? userInfo.langId;

				if (!pathLang && currentLang !== defaultLang) {
					setRedirectPath(`/${currentLang}`);
				} else if (pathLang !== "" && pathLang !== currentLang) {
					setUserInfo(prevState => ({
						...prevState,
						langId: currentLang
					}));

					let newPathArr = getNewLanguagePath(currentLang);
					navigate(newPathArr);
				} else {
					setCorrectPath(true);
				}
			}
		}
	}, [currentPath, i18n.language, userInfo.langId, userInfo.isLogin]);

	useEffect(() => {
		if (userInfo.isLogin && userInfo.isJoin) {
			const clickClose = () => {
				setPopBox({ isOpen: false });
				setUserInfo(prev => ({ ...prev, isJoin: false }));
			};

			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.RegisterSuccess,
				closeBtn: (
					<button
						className="icon icon-close"
						onClick={clickClose}></button>
				),
				btnBar: (
					<div className="btnGroup">
						<Link
							className="blue"
							onClick={clickClose}
							to={`/${userInfo.langId}/${path.deposit.root}`}>
							{t("lbl_DepositNow")}
						</Link>
						<Link
							className="btn-check"
							onClick={clickClose}
							to={`/${userInfo.langId}/${path.profile.root}`}>
							{t("lbl_UpdatePersonalDetail")}
						</Link>
					</div>
				)
			});
		}
	}, [userInfo.isLogin, userInfo.isJoin, t]);

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

	useInterval(
		() => {
			api_account_onlineCheck().then(
				res => {
					if (res.data.errorCode !== 0) {
						setUserInfo(prev => ({
							...prev,
							isLogin: false,
							langId: prev.langId,
							kickout: true
						}));
					}
				},
				err => {}
			);
		},
		userInfo.isLogin ? 10000 : null
	);

	const getContentWalletInfo = () => {
		api_account_GetWalletInfo().then(res => {
			if (res.data.errorCode === 0 && isMountedRef.current) {
				let tpWallets = res.data.data.tpWallets?.map(t => {
					return {
						tpId: t.tpId,
						balance: t.balance,
						tpName: t.tpName,
						bonus: t.bonus
					};
				});
				setWalletInfo(prevState => ({
					...prevState,
					isHideBalance: res.data.data.isHideBalance,
					main: res.data.data?.balance,
					tpWallets,
					lastTransaction: res.data.data.lastTransaction
				}));
			}
		});
	};

	if (redirectPath === null) {
		if (
			(correctPath &&
				((afterLogin === true && userInfo.isLogin) || !afterLogin)) ||
			(afterLogin && userInfo.isLogin === false && userInfo.kickout)
		) {
			return (
				<ct.userInfoContext.Provider value={{ userInfo, setUserInfo }}>
					<ct.walletInfoContext.Provider
						value={{
							walletInfo,
							setWalletInfo,
							getContentWalletInfo
						}}>
						<ct.msgCountContext.Provider
							value={{ msgCount, setMsgCount }}>
							<ct.popBoxContext.Provider
								value={{ popBox, setPopBox }}>
								<ct.loadingContext.Provider
									value={{ loading, setLoading }}>
									{children}
								</ct.loadingContext.Provider>
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
