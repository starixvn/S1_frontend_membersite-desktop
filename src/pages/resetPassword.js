import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { api_site_CheckResetPwdTokens } from "../service/api/site";
import { api_accountStrict_ResetPassword } from "../service/api/accountStrict";
import { popBoxContext, userInfoContext } from "../components/common/context";
import { navigate } from "@reach/router";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import { defPopBoxType } from "../components/common/popBox";
import InputboxPassword from "../components/common/inputbox.password";
import { getUrlParameter } from "../components/common/common";
import { LOGOUT } from "../service/auth";
import path from "../path";
import SideBarQuickLink from "../components/home/sideBarQuickLink";

export default () => {
	return (
		<Wrapper>
			<Layout>
				<main>
					<section className="inside">
						<div className="rightModule">
							<Content />
						</div>
					</section>
					<SideBarQuickLink />
				</main>
			</Layout>
		</Wrapper>
	);
};

const initStatus = { checked: null, msg: "" };

const Content = () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const [newPsw, setNewPsw] = useState("");
	const [showPsw, setShowPsw] = useState(false);
	const [status, setStatus] = useState(initStatus);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin === false) {
			let _key = getUrlParameter("key");
			api_site_CheckResetPwdTokens({ key: _key }).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setUserInfo(prev => ({
								...prev,
								isLogin: true,
								loginFromResetPwd: true
							}));
						} else {
							navigate(`/${userInfo.langId}`);
						}
					}
				},
				err => {
					if (isMountedRef.current) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: t("msg_ApiServerError"),
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={clickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			);
		} else if (userInfo.isLogin && !userInfo.loginFromResetPwd) {
			navigate(`/${userInfo.langId}`);
		}
	}, [userInfo.isLogin]);

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const editField = e => {
		let val = e.target.value;
		setNewPsw(val);
	};

	const clickInfo = () => {
		let _msg = status.msg === "" ? t("msg_PasswordVaildate") : "";

		setStatus({
			checked: null,
			msg: _msg
		});
	};

	const showPswHandler = () => {
		let _showPsw = !showPsw;
		setShowPsw(_showPsw);
	};

	const pswCheck = val => {
		let isPass = true;
		let _msg = "";

		const regx = /^[a-zA-Z0-9@$*!%#?&]*$/;
		if (val === "") {
			isPass = false;
			_msg = t("msg_PasswordReq");
		} else if (val !== null) {
			if (val.length < 6 || val.length > 18) {
				isPass = false;
				_msg = t("msg_PasswordLength");
			} else if (!regx.test(val)) {
				isPass = false;
				_msg = t("msg_PasswordVaildate");
			}
		}

		setStatus({
			checked: isPass,
			msg: _msg
		});

		return isPass;
	};

	const clickSubmit = e => {
		e.preventDefault();
		let checked = pswCheck(newPsw);

		if (checked) {
			api_accountStrict_ResetPassword({ NewPassword: newPsw }).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
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
												<button
													className="btn-cancel"
													onClick={clickClose}>
													{t("lbl_Close")}
												</button>
											</div>
										)
									});
								});
							};

							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ChangePsw,
								title: t("lbl_ResetPassword"),
								message: (
									<>
										{t("msg_changePswUpdateSuccess")}
										<br />
										{t("msg_changePswSuccessHint")}
									</>
								),
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-cancel"
											onClick={handleLogout}>
											OK
										</button>
									</div>
								),
								clickClose: handleLogout
							});
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: res.data.message,
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-cancel"
											onClick={clickClose}>
											{t("lbl_Close")}
										</button>
									</div>
								)
							});
						}
					}
				},
				err => {
					if (isMountedRef.current) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: t("msg_ApiServerError"),
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={clickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			);
		}
	};

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_password">
				<span>{t("lbl_ResetPassword")}</span>
			</div>
			<form className="forgetPassWord" onSubmit={clickSubmit}>
				<InputboxPassword
					className="inputBox-white"
					inputType={showPsw ? "text" : "password"}
					showPswHandler={showPswHandler}
					title={t("lbl_NewPassword")}
					value={newPsw}
					onChange={editField.bind(this)}
					onBlur={pswCheck.bind(this, newPsw)}
					checked={status.checked}
					clickInfo={clickInfo.bind(this)}
					tip={status.msg}
				/>
				<div className="btnGroup">
					<button className="btn-check" type="submit">
						{t("lbl_Submit")}
					</button>
				</div>
			</form>
		</div>
	);
};
