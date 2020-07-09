import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import loginBanner from "../styles/img/loginBanner.jpg";
import Inputbox from "../components/common/inputbox";
import InputboxPSW from "../components/common/inputbox.password";
import { LOGIN } from "../service/auth";
import { userInfoContext } from "../components/common/context";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";

export default () => {
	return (
		<Wrapper>
			<Layout>
				<main>
					<Content />
				</main>
			</Layout>
		</Wrapper>
	);
};

const initValue = {
	username: "",
	password: ""
};

const initWarning = {
	username: false,
	password: false
};

const Content = () => {
	const { t } = useTranslation();
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const [userValue, setUserValue] = useState(initValue);
	const [warning, setWarning] = useState(initWarning);
	const [tip, setTip] = useState(initValue);
	const [showPsw, setShowPsw] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const showPswHandler = () => {
		setShowPsw(!showPsw);
	};

	const EditField = (col, e) => {
		let val = e.target.value;
		setUserValue(prev => {
			return { ...prev, [col]: val };
		});
	};

	const checkValue = (col, e) => {
		let val = e.target.value;
		let msg = col === "username" ? "msg_UsernameReq" : "msg_PasswordReq";

		if (val === "") {
			setTip(prev => {
				return { ...prev, [col]: t(msg) };
			});
			setWarning(prev => {
				return { ...prev, [col]: true };
			});
		} else {
			setTip(prev => {
				return { ...prev, [col]: "" };
			});
			setWarning(prev => {
				return { ...prev, [col]: false };
			});
		}
	};

	const handleLogin = () => {
		let checked = userValue.username && userValue.password;
		if (checked) {
			const CallBackLogin = (errorCode, message, isLogin, userData) => {
				if (errorCode === 0) {
					if (isMountedRef.current) {
						setUserInfo(() => ({
							...userData,
							isLogin: isLogin
						}));
					}
				} else if (
					errorCode === 1101 ||
					errorCode === 1102 ||
					errorCode === 9000
				) {
					if (isMountedRef.current) {
						setTip(prev => {
							return { ...prev, username: message };
						});
						setWarning(prev => {
							return { ...prev, username: true };
						});
					}
				} else if (errorCode === 1001) {
					if (isMountedRef.current) {
						setTip(prev => {
							return { ...prev, password: message };
						});
						setWarning(prev => {
							return { ...prev, password: true };
						});
					}
				}
			};

			LOGIN(
				{
					userName: userValue.username,
					password: userValue.password
				},
				CallBackLogin
			);
		} else {
			const m1 = userValue.username === "" ? "msg_UsernameReq" : "";
			const m2 = userValue.password === "" ? "msg_PasswordReq" : "";

			setTip({
				username: t(m1),
				password: t(m2)
			});
			setWarning({
				username: userValue.username === "",
				password: userValue.password === ""
			});
		}
	};

	return (
		<main className="joinlogin">
			<div className="joinloginModule">
				<img src={loginBanner} alt="" />
				<form className="joinloginFunction" onSubmit={handleLogin}>
					<div className="loginSwitch">
						<span>{t("lbl_JoinNow")}</span>
						<div className="switch active">
							<button className="switchBtn"></button>
						</div>
						<span className="txt-orange">{t("lbl_Login")}</span>
					</div>
					<div className="noAccount">
						{t("lbl_DontHaveAccount")}&nbsp;
						<a href="" className="txt-orange">
							{t("lbl_JoinNow")}
						</a>
					</div>
					<div className="inputModule">
						<Inputbox
							icon="icon-member"
							placeholder={t("lbl_Username")}
							value={userValue.username}
							onChange={EditField.bind(null, "username")}
							onBlur={checkValue.bind(null, "username")}
							warning={warning.username}
							tip={tip.username}
						/>

						<InputboxPSW
							icon="icon-key"
							inputType={`${!showPsw ? "password" : "text"}`}
							placeholder={t("lbl_Password")}
							value={userValue.password}
							onChange={EditField.bind(null, "password")}
							onBlur={checkValue.bind(null, "password")}
							showPsw={showPsw}
							showPswHandler={showPswHandler}
							warning={warning.password}
							tip={tip.password}
						/>

						<a href="" className="txt-orange">
							{t("lbl_ForgetPassword")}
						</a>
					</div>
					<div className="btnGroup">
						<button className="gray">{t("lbl_Cancel")}</button>
						<button className="orange" onClick={handleLogin}>
							{t("lbl_Login")}
						</button>
					</div>
				</form>
			</div>
		</main>
	);
};
