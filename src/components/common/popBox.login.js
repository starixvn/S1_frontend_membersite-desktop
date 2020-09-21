import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import loginBanner from "../../styles/img/loginBanner.jpg";
import Inputbox from "./inputbox";
import InputboxPSW from "./inputbox.password";
import { LOGIN } from "../../service/auth";
import { userInfoContext, popBoxContext } from "./context";
import { defPopBoxType } from "../common/popBox";
import { Link } from "@reach/router";
import path from "../../path";

const initValue = {
	username: "",
	password: ""
};

const initTip = {
	username: { checked: null, msg: "" },
	password: { checked: null, msg: "" }
};

const LoginPanel = () => {
	const { t } = useTranslation();
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const [userValue, setUserValue] = useState(initValue);
	const { setPopBox } = useContext(popBoxContext);
	const [tip, setTip] = useState(initTip);
	const [showPsw, setShowPsw] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const showPswHandler = () => {
		setShowPsw(!showPsw);
	};

	const clickInfo = col => {
		let _msg =
			col === "username" ? t("msg_UsernameReq") : t("msg_PasswordReq");

		if (tip[col].msg === _msg) {
			_msg = "";
		}

		setTip(prev => ({
			...prev,
			[col]: {
				checked: tip[col].checked,
				msg: _msg
			}
		}));
	};

	const EditField = (col, e) => {
		let val = e.target.value;

		if (col === "username") {
			val = val.replace(/[\W]/g, "");
		}

		setUserValue(prev => {
			return { ...prev, [col]: val };
		});
	};

	const checkValue = (col, e) => {
		let val = e.target.value;

		let checked = true;
		let msg = "";

		if (val === "") {
			msg =
				col === "username"
					? t("msg_UsernameReq")
					: t("msg_PasswordReq");
			checked = false;
		}

		setTip(prev => {
			return {
				...prev,
				[col]: {
					checked: checked,
					msg: msg
				}
			};
		});
	};

	const handleLogin = async e => {
		e.preventDefault();

		let checked = userValue.username && userValue.password;
		if (checked) {
			await LOGIN({
				userName: userValue.username,
				password: userValue.password,
				langId: userInfo.langId
			}).then(res => {
				if (res.errorCode === 0) {
					if (isMountedRef.current) {
						setUserInfo(() => ({
							...res.userData,
							isLogin: res.isLogin
						}));
						setPopBox({ isOpen: false });
					}
				} else if (
					res.errorCode === 1101 ||
					res.errorCode === 1102 ||
					res.errorCode === 9000
				) {
					if (isMountedRef.current) {
						setTip(prev => {
							return {
								...prev,
								username: {
									checked: false,
									msg: res.message
								}
							};
						});
					}
				} else if (res.errorCode === 1001) {
					if (isMountedRef.current) {
						setTip(prev => {
							return {
								...prev,
								password: {
									checked: false,
									msg: res.message
								}
							};
						});
					}
				}
			});
		} else {
			const usernameMsg =
				userValue.username === "" ? "msg_UsernameReq" : "";
			const passwordMsg =
				userValue.password === "" ? "msg_PasswordReq" : "";

			setTip({
				username: {
					checked: !(userValue.username === ""),
					msg: t(usernameMsg)
				},
				password: {
					checked: !(userValue.password === ""),
					msg: t(passwordMsg)
				}
			});
		}
	};

	const clickCancel = () => {
		setPopBox({ isOpen: false });
	};

	const openJoin = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Join
		});
	};

	return (
		<div className="loginpop active">
			<div className="joinloginModule">
				<img src={loginBanner} alt="" />
				<form className="joinloginFunction" onSubmit={handleLogin}>
					<span className="title txt-yellow">{t("lbl_Login")}</span>
					<div className="noAccount">
						{t("lbl_DontHaveAccount")}&nbsp;
						<button
							className="txt-blue2"
							type="button"
							onClick={openJoin}>
							{t("lbl_JoinNow")}
						</button>
					</div>
					<div className="inputModule">
						<Inputbox
							icon="icon-member txt-blue12"
							placeholder={t("lbl_Username")}
							value={userValue.username}
							onChange={EditField.bind(null, "username")}
							onBlur={checkValue.bind(null, "username")}
							clickInfo={clickInfo.bind(this, "username")}
							checked={tip.username.checked}
							tip={tip.username.msg}
							warningIcon="icon-warning"
						/>

						<InputboxPSW
							icon="icon-key txt-blue12"
							inputType={`${!showPsw ? "password" : "text"}`}
							placeholder={t("lbl_Password")}
							value={userValue.password}
							onChange={EditField.bind(null, "password")}
							onBlur={checkValue.bind(null, "password")}
							showPsw={showPsw}
							showPswHandler={showPswHandler}
							checked={tip.password.checked}
							clickInfo={clickInfo.bind(this, "password")}
							tip={tip.password.msg}
						/>

						<Link
							to={`/${userInfo.langId}/${path.forgetPassword.root}`}
							className="txt-blue2">
							{t("lbl_ForgetPassword")}
						</Link>
					</div>
					<div className="btnGroup">
						<button
							className="btn-cancel"
							type="button"
							onClick={clickCancel}>
							{t("lbl_Cancel")}
						</button>
						<button className="btn-check" type="submit">
							{t("lbl_Login")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPanel;
