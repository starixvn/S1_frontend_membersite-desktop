import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
	api_site_ExistsUserName,
	api_site_ExistsEmail,
	api_site_GetSiteCurrencyList,
	api_site_Register
} from "../service/api/site";
import { api_accountStrict_GetCustProfile } from "../service/api/accountStrict";
import { getUrlParameter, readCookie } from "../components/common/common";
import { userInfoContext } from "../components/common/context";
import { GET_LANG_ID } from "../service/language";
import config from "../config";
import TandC from "../service/t_and_c";
import Inputbox from "../components/common/inputbox";
import InputboxPSW from "../components/common/inputbox.password";
import Dropdown from "../components/common/dropdown";
import Checkbox from "../components/common/checkbox";
import joinBanner from "../styles/img/joinBanner.jpg";
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
	password: "",
	email: "",
	currency: 0,
	termsCheck: false,
	ageCheck: false
};

const initWarning = {
	username: false,
	password: false,
	email: false
};

const initTip = {
	username: "",
	password: "",
	email: "",
	currency: "",
	checkbox: ""
};

const defaultLangId = GET_LANG_ID();

const Content = () => {
	const { t } = useTranslation();
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const [userValue, setUserValue] = useState(initValue);
	const [warning, setWarning] = useState(initWarning);
	const [tip, setTip] = useState(initTip);
	const [showPsw, setShowPsw] = useState(false);
	const [siteCurrency, setSiteCurrency] = useState([]);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_site_GetSiteCurrencyList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						const data = res.data.data;
						let currencyArr = data.map(id => {
							return { id: id, displayKey: `Currency_${id}` };
						});
						setSiteCurrency(() => currencyArr);
					} else {
						alert(res.data.message);
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
				}
			}
		);
	}, []);

	const showPswHandler = () => {
		setShowPsw(!showPsw);
	};

	const onFocusCol = col => {
		let msg = "";

		if (col === "username") {
			msg = "lbl_UsernameTooltip";
		} else if (col === "password") {
			msg = "lbl_PasswordTooltip";
		} else if (col === "email") {
			msg = "lbl_EmailToolTip";
		}

		setTip(prev => {
			return { ...prev, [col]: t(msg) };
		});
	};

	const EditField = (col, e) => {
		let val = e.target.value;
		setUserValue(prev => ({
			...prev,
			[col]: val
		}));
	};

	const checkValue = (col, e) => {
		let val = e.target.value;
		let checked = false;
		let msg = "";

		if (col === "username") {
			let result = usernameCheck(val);
			checked = result.checked;
			msg = result.msg;
		} else if (col === "password") {
			let result = passwordCheck(val);
			checked = result.checked;
			msg = result.msg;
		} else if (col === "email") {
			let result = emailCheck(val);
			checked = result.checked;
			msg = result.msg;
		}

		setTip(prev => {
			return { ...prev, [col]: t(msg) };
		});
		setWarning(prev => {
			return { ...prev, [col]: t(msg) };
		});
	};

	const usernameCheck = val => {
		let checked = false;
		let msg = "";

		if (val === "") {
			checked = false;
			msg = "msg_UsernameReq";
		} else if (val !== "") {
			if (val.length < 6 || val.length > 18) {
				checked = false;
				msg = "msg_UsernameLength";
			} else {
				checked = true;
			}
		}

		if (checked === true) {
			api_site_ExistsUserName({ UserName: val }).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							if (res.data.data === true) {
								setTip(prev => {
									return {
										...prev,
										username: t("msg_UsernameNotAvailable")
									};
								});
								setWarning(prev => {
									return { ...prev, username: true };
								});
							} else {
								setTip(prev => {
									return { ...prev, username: "" };
								});
								setWarning(prev => {
									return { ...prev, username: false };
								});
							}
						}
					}
				},
				err => {
					if (isMountedRef.current) {
						alert(t("msg_ApiServerError"));
					}
				}
			);
		}

		return { checked, msg };
	};

	const passwordCheck = val => {
		let checked = false;
		let msg = "";

		const regx = /^[a-zA-Z0-9@$*!%#?&]*$/;
		if (val === "") {
			checked = false;
			msg = "msg_PasswordReq";
		} else if (val != null) {
			if (val.length < 6 || val.length > 18) {
				checked = false;
				msg = "msg_PasswordLength";
			} else if (!regx.test(val)) {
				checked = false;
				msg = "msg_PasswordVaildate";
			} else {
				checked = true;
			}
		}
		return { checked, msg };
	};

	const emailCheck = val => {
		let checked = false;
		let msg = "";
		const regx = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

		if (val === "") {
			checked = false;
			msg = "msg_MailWrongFormat";
		} else if (val !== "") {
			if (!regx.test(val)) {
				checked = false;
				msg = "msg_MailWrongFormat";
			} else {
				checked = true;
			}
		}

		if (checked === true) {
			api_site_ExistsEmail({ Email: val }).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							if (res.data.data === true) {
								setTip(prev => {
									return {
										...prev,
										email: t("msg_MailExisted")
									};
								});
								setWarning(prev => {
									return { ...prev, email: true };
								});
							} else {
								setTip(prev => {
									return { ...prev, email: "" };
								});
								setWarning(prev => {
									return { ...prev, email: false };
								});
							}
						}
					}
				},
				err => {
					if (isMountedRef.current) {
						alert(t("msg_ApiServerError"));
					}
				}
			);
		}

		return { checked, msg };
	};

	const clickDropdown = () => {
		setTip(prev => {
			return { ...prev, currency: t("lbl_PreferredCurrencyToolTip") };
		});
	};

	const onSelectItem = i => {
		setUserValue(prev => {
			return { ...prev, currency: i };
		});
	};

	const checkboxHandler = col => {
		let checked = !userValue[col];
		setUserValue(prev => {
			return { ...prev, [col]: checked };
		});
	};

	const clickSubmit = e => {
		e.preventDefault();
		let _usernameCheck = usernameCheck(userValue.username);
		let _passwordCheck = passwordCheck(userValue.password);
		let _emailCheck = emailCheck(userValue.email);
		let _termsCheck = userValue.termsCheck;
		let _ageCheck = userValue.ageCheck;

		let checked =
			_usernameCheck.checked &&
			_passwordCheck.checked &&
			_emailCheck.checked &&
			_termsCheck &&
			_ageCheck;

		if (!checked) {
			let checkboxMsg = "";
			if (!_termsCheck || !_ageCheck) {
				checkboxMsg = "lbl_Check18TCTooltip";
			}
			setTip({
				username: t(_usernameCheck.msg),
				password: t(_passwordCheck.msg),
				email: t(_emailCheck.msg),
				checkbox: t(checkboxMsg)
			});
			setWarning({
				username: !_usernameCheck.checked,
				password: !_passwordCheck.checked,
				email: !_emailCheck.checked
			});
		} else {
			let regData = {
				UserName: userValue.username,
				Userpwd: userValue.password,
				Email: userValue.email,
				CurrencyId: siteCurrency[userValue.currency].id,
				UserLang: defaultLangId
			};

			regData["RefId"] = getUrlParameter("RefId") || readCookie("RefId");
			regData["AffId"] = getUrlParameter("AffId") || readCookie("AffId");
			regData["Aff"] = getUrlParameter("Aff") || readCookie("Aff");

			api_site_Register(regData).then(
				res => {
					if (isMountedRef.current) {
						const errorCode = res.data.errorCode;
						const message = res.data.message;

						if (errorCode === 0) {
							api_accountStrict_GetCustProfile().then(
								res_custInfo => {
									if (isMountedRef.current) {
										let _user = {
											isLogin: true,
											langId: defaultLangId,
											userName: userValue.username
										};
										if (res_custInfo.data.errorCode === 0) {
											_user = {
												..._user,
												...res_custInfo.data.data
											};
										} else {
											alert(res_custInfo.data.message);
										}
										setUserInfo(_user);
									}
								},
								err => {
									if (isMountedRef.current) {
										alert(t("msg_ApiServerError"));
									}
								}
							);
						} else if (
							errorCode === -2 ||
							errorCode === -5 ||
							errorCode === -19
						) {
							setWarning(prev => {
								return { ...prev, username: true };
							});
							setTip(prev => {
								return { ...prev, username: message };
							});
						} else if (errorCode === -3) {
							setWarning(prev => {
								return { ...prev, password: true };
							});
							setTip(prev => {
								return { ...prev, password: message };
							});
						} else {
							alert(message);
						}
					}
				},
				err => {
					if (isMountedRef.current) {
						alert(t("msg_ApiServerError"));
					}
				}
			);
		}
	};

	return (
		<main className="joinlogin">
			<div className="joinloginModule">
				<img src={joinBanner} />
				<form className="joinloginFunction" onSubmit={clickSubmit}>
					<div className="loginSwitch">
						<span className="txt-orange">{t("lbl_JoinNow")}</span>
						<div className="switch">
							<button className="switchBtn"></button>
						</div>
						<span>{t("lbl_Login")}</span>
					</div>

					<div className="inputModule">
						<Inputbox
							icon="icon-member"
							placeholder={t("lbl_Username")}
							value={userValue.username}
							tip={tip.username}
							onFocus={onFocusCol.bind(null, "username")}
							onChange={EditField.bind(null, "username")}
							onBlur={checkValue.bind(null, "username")}
							warning={warning.username}
						/>

						<InputboxPSW
							icon="icon-key"
							inputType={`${!showPsw ? "password" : "text"}`}
							placeholder={t("lbl_Password")}
							value={userValue.password}
							tip={tip.password}
							onFocus={onFocusCol.bind(null, "password")}
							onChange={EditField.bind(null, "password")}
							onBlur={checkValue.bind(null, "password")}
							showPsw={showPsw}
							showPswHandler={showPswHandler}
							warning={warning.password}
						/>

						<Inputbox
							icon="icon-email"
							placeholder={t("lbl_Email")}
							value={userValue.email}
							tip={tip.email}
							onFocus={onFocusCol.bind(null, "email")}
							onChange={EditField.bind(null, "email")}
							onBlur={checkValue.bind(null, "email")}
							warning={warning.email}
						/>

						<div className="inputBox">
							<Dropdown
								mainKey="join_currency"
								icon="icon-coin-dollar"
								options={siteCurrency}
								selectedIdx={userValue.currency}
								i18n={t}
								onSelectItem={onSelectItem}
								clickDropdown={clickDropdown}
							/>
						</div>

						{tip.currency !== "" ? (
							<div className="tip active">{tip.currency}</div>
						) : null}
					</div>

					<div className="Terms">
						<Checkbox
							id="c1"
							checked={userValue.termsCheck}
							onChange={checkboxHandler.bind(null, "termsCheck")}>
							{t("lbl_Check18TC1")}&nbsp;
							<a
								target="_blank"
								href={TandC(defaultLangId).terms}>
								{t("lbl_TermsConditions")}
							</a>
							&nbsp;
							{t("lbl_Check18TC2")}&nbsp;
							<a target="_blank" href={TandC(defaultLangId).rule}>
								{t("lbl_RuleRegulations")}
							</a>
							&nbsp;
							{t("lbl_Check18TC3")}&nbsp;{config.siteName}.
						</Checkbox>

						<Checkbox
							id="c2"
							checked={userValue.ageCheck}
							onChange={checkboxHandler.bind(null, "ageCheck")}>
							{t("lbl_Check18TC4")}
						</Checkbox>
					</div>
					{tip.checkbox !== "" ? (
						<div className="tip active">{tip.checkbox}</div>
					) : null}

					<div className="btnGroup">
						<button type="submit" className="gray">
							{t("lbl_Cancel")}
						</button>
						<button className="orange" onClick={clickSubmit}>
							{t("lbl_Submit")}
						</button>
					</div>
				</form>
			</div>
		</main>
	);
};
