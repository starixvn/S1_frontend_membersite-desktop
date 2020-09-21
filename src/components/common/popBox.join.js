import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
	api_site_ExistsUserName,
	api_site_GetSiteCurrencyList,
	api_site_Register
} from "../../service/api/site";
import { api_accountStrict_GetCustProfile } from "../../service/api/accountStrict";
import { getUrlParameter, readCookie } from "./common";
import { defPopBoxType } from "../common/popBox";
import { userInfoContext, popBoxContext } from "./context";
import { GET_LANG_ID } from "../../service/language";
import config from "../../config";
import TandC from "../../service/t_and_c";
import Inputbox from "./inputbox";
import InputboxPSW from "./inputbox.password";
import Dropdown from "./dropdown";
import Checkbox from "./checkbox";
import joinBanner from "../../styles/img/joinBanner.jpg";

const initValue = {
	username: "",
	password: "",
	// email: "",
	currency: 0,
	termsCheck: false,
	ageCheck: false
};

const initTip = {
	username: { checked: null, msg: "" },
	password: { checked: null, msg: "" },
	// email: { checked: null, msg: "" },
	currency: { checked: null, msg: "" },
	checkbox: { checked: null, msg: "" }
};

const defaultLangId = GET_LANG_ID();

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

const JoinPanel = () => {
	const { t } = useTranslation();
	const { setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [userValue, setUserValue] = useState(initValue);
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
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
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
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	}, []);

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const showPswHandler = () => {
		setShowPsw(!showPsw);
	};

	const clickInfo = col => {
		let msg = "";
		if (col === "username") {
			msg = t("lbl_UsernameTooltip");
		} else if (col === "password") {
			msg = t("lbl_PasswordTooltip");
		}
		// else if (col === "email") {
		// 	msg = t("lbl_EmailToolTip");
		// }

		if (tip[col].msg === msg) {
			msg = "";
		}

		setTip(prev => {
			return {
				...prev,
				[col]: {
					checked: tip[col].checked,
					msg: msg
				}
			};
		});
	};

	const EditField = (col, e) => {
		let val = e.target.value;

		if (col === "username") {
			val = val.replace(/[\W]/g, "");
		}

		setUserValue(prev => ({
			...prev,
			[col]: val
		}));
	};

	const checkValue = (col, e) => {
		let val = e.target.value;
		let checked = true;
		let msg = "";

		if (col === "username") {
			let result = usernameCheck(val);
			checked = result.checked;
			msg = result.msg;
		} else if (col === "password") {
			let result = passwordCheck(val);
			checked = result.checked;
			msg = result.msg;
		}
		// else if (col === "email") {
		// 	let result = emailCheck(val);
		// 	checked = result.checked;
		// 	msg = result.msg;
		// }

		setTip(prev => {
			return {
				...prev,
				[col]: {
					checked: checked,
					msg: t(msg)
				}
			};
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
										username: {
											checked: false,
											msg: t("msg_UsernameNotAvailable")
										}
									};
								});
							} else {
								setTip(prev => {
									return {
										...prev,
										username: {
											checked: true,
											msg: ""
										}
									};
								});
							}
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
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			);
		}

		return { checked, msg };
	};

	// const emailCheck = val => {
	// 	let checked = false;
	// 	let msg = "";
	// 	const regx = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

	// 	if (val === "") {
	// 		checked = false;
	// 		msg = "msg_MailWrongFormat";
	// 	} else if (val !== "") {
	// 		if (!regx.test(val)) {
	// 			checked = false;
	// 			msg = "msg_MailWrongFormat";
	// 		} else {
	// 			checked = true;
	// 		}
	// 	}

	// 	if (checked === true) {
	// 		api_site_ExistsEmail({ Email: val }).then(
	// 			res => {
	// 				if (isMountedRef.current) {
	// 					if (res.data.errorCode === 0) {
	// 						if (res.data.data === true) {
	// 							setTip(prev => {
	// 								return {
	// 									...prev,
	// 									email: {
	// 										checked: false,
	// 										msg: t("msg_MailExisted")
	// 									}
	// 								};
	// 							});
	// 						} else {
	// 							setTip(prev => {
	// 								return {
	// 									...prev,
	// 									email: {
	// 										checked: true,
	// 										msg: ""
	// 									}
	// 								};
	// 							});
	// 						}
	// 					}
	// 				}
	// 			},
	// 			err => {
	// 				if (isMountedRef.current) {
	// 					setPopBox({
	// 						isOpen: true,
	// 						popBoxType: defPopBoxType.ErrorMsg,
	// 						message: t("msg_ApiServerError"),
	// 						btnBar: (
	// 							<div className="btnGroup">
	// 								<button
	// 									className="btn-cancel"
	// 									onClick={ClickClose}>
	// 									{t("lbl_Close")}
	// 								</button>
	// 							</div>
	// 						)
	// 					});
	// 				}
	// 			}
	// 		);
	// 	}

	// 	return { checked, msg };
	// };

	const clickDropdown = () => {
		setTip(prev => {
			return {
				...prev,
				currency: {
					checked: true,
					msg: t("lbl_PreferredCurrencyToolTip")
				}
			};
		});
	};

	const onSelectItem = i => {
		setUserValue(prev => {
			return { ...prev, currency: i };
		});
	};

	const checkboxHandler = col => {
		setUserValue(prev => {
			return { ...prev, [col]: !userValue[col] };
		});
	};

	const clickCancel = () => {
		setPopBox({ isOpen: false });
	};

	const checkAll = () => {
		let _usernameCheck = usernameCheck(userValue.username);
		let _passwordCheck = passwordCheck(userValue.password);
		// let _emailCheck = emailCheck(userValue.email);
		let _termsCheck = userValue.termsCheck;
		let _ageCheck = userValue.ageCheck;

		let checked =
			_usernameCheck.checked &&
			_passwordCheck.checked &&
			// _emailCheck.checked &&
			_termsCheck &&
			_ageCheck;

		if (!checked) {
			let checkboxMsg = "";
			if (!_termsCheck || !_ageCheck) {
				checkboxMsg = "lbl_Check18TCTooltip";
			}
			setTip(prev => {
				return {
					...prev,
					username: {
						checked: _usernameCheck.checked,
						msg: t(_usernameCheck.msg)
					},
					password: {
						checked: _passwordCheck.checked,
						msg: t(_passwordCheck.msg)
					},
					// email: {
					// 	checked: _emailCheck.checked,
					// 	msg: t(_emailCheck.msg)
					// },
					checkbox: {
						checked: true,
						msg: t(checkboxMsg)
					}
				};
			});
		}
		return checked;
	};

	const clickSubmit = e => {
		e.preventDefault();
		let checked = checkAll();

		if (checked) {
			let regData = {
				UserName: userValue.username,
				Userpwd: userValue.password,
				// Email: userValue.email,
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
											setPopBox({
												isOpen: true,
												popBoxType:
													defPopBoxType.ErrorMsg,
												message:
													res_custInfo.data.message,
												btnBar: (
													<div className="btnGroup">
														<button
															className="btn-cancel"
															onClick={
																ClickClose
															}>
															{t("lbl_Close")}
														</button>
													</div>
												)
											});
										}
										setUserInfo(_user);
										setPopBox({ isOpen: false });
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
														onClick={ClickClose}>
														{t("lbl_Close")}
													</button>
												</div>
											)
										});
										setPopBox({ isOpen: false });
									}
								}
							);
						} else if (
							errorCode === -2 ||
							errorCode === -5 ||
							errorCode === -19
						) {
							setTip(prev => {
								return {
									...prev,
									username: {
										checked: false,
										msg: message
									}
								};
							});
						} else if (errorCode === -3) {
							setTip(prev => {
								return {
									...prev,
									password: {
										checked: false,
										msg: message
									}
								};
							});
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: message,
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
										onClick={ClickClose}>
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

	const openLogin = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Login
		});
	};

	return (
		<div className="joinpop active">
			<div className="joinloginModule">
				<img src={joinBanner} alt="joinBanner" />
				<form className="joinloginFunction" onSubmit={clickSubmit}>
					<span className="title txt-yellow">{t("lbl_JoinNow")}</span>
					<div>
						{t("lbl_LoginMsg")}
						<button
							className="txt-blue2"
							type="button"
							onClick={openLogin}>
							{t("lbl_LoginHere")}
						</button>
					</div>
					<div className="inputModule">
						<Inputbox
							icon="icon-member txt-blue12"
							placeholder={t("lbl_Username")}
							value={userValue.username}
							tip={tip.username.msg}
							checked={tip.username.checked}
							clickInfo={clickInfo.bind(this, "username")}
							onChange={EditField.bind(null, "username")}
							onBlur={checkValue.bind(null, "username")}
						/>

						<InputboxPSW
							icon="icon-key txt-blue12"
							inputType={`${!showPsw ? "password" : "text"}`}
							placeholder={t("lbl_Password")}
							value={userValue.password}
							tip={tip.password.msg}
							onChange={EditField.bind(null, "password")}
							onBlur={checkValue.bind(null, "password")}
							showPsw={showPsw}
							showPswHandler={showPswHandler}
							checked={tip.password.checked}
							clickInfo={clickInfo.bind(this, "password")}
						/>

						{/* <Inputbox
							icon="icon-email txt-blue12"
							placeholder={t("lbl_Email")}
							value={userValue.email}
							tip={tip.email.msg}
							checked={tip.email.checked}
							clickInfo={clickInfo.bind(this, "email")}
							onChange={EditField.bind(null, "email")}
							onBlur={checkValue.bind(null, "email")}
						/> */}

						<div className="inputBox">
							<Dropdown
								mainKey="join_currency"
								icon="icon-coin-dollar txt-blue12"
								options={siteCurrency}
								selectedIdx={userValue.currency}
								i18n={t}
								onSelectItem={onSelectItem}
								clickDropdown={clickDropdown}
							/>
						</div>

						{tip.currency.msg !== "" ? (
							<div className="tip active">{tip.currency.msg}</div>
						) : null}
					</div>

					<div className="Terms">
						<Checkbox
							id="joinTermsCheck"
							checked={userValue.termsCheck}
							onChange={checkboxHandler.bind(null, "termsCheck")}>
							{t("lbl_Check18TC1")}&nbsp;
							<a
								target="_blank"
								rel="noreferrer"
								href={TandC(defaultLangId).terms}>
								{t("lbl_TermsConditions")}
							</a>
							&nbsp;
							{t("lbl_Check18TC2")}&nbsp;
							<a
								target="_blank"
								rel="noreferrer"
								href={TandC(defaultLangId).rule}>
								{t("lbl_RuleRegulations")}
							</a>
							&nbsp;
							{t("lbl_Check18TC3")}&nbsp;{config.siteName}.
						</Checkbox>

						<Checkbox
							id="joinAgeCheck"
							checked={userValue.ageCheck}
							onChange={checkboxHandler.bind(null, "ageCheck")}>
							{t("lbl_Check18TC4")}
						</Checkbox>
					</div>
					{tip.checkbox.msg !== "" ? (
						<div className="tip active">{tip.checkbox.msg}</div>
					) : null}

					<div className="btnGroup">
						<button
							type="button"
							className="btn-cancel"
							onClick={clickCancel}>
							{t("lbl_Cancel")}
						</button>
						<button className="btn-check" type="submit">
							{t("lbl_Submit")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default JoinPanel;
