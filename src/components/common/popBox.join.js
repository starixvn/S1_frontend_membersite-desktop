import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
	api_site_ExistsUserName,
	api_site_GetSiteCurrencyList,
	// api_site_Register,
	api_site_Signup,
	api_site_ExistsEmail,
	api_site_ExistsPhoneNo
} from "../../service/api/site";
import { api_accountStrict_GetCustProfile } from "../../service/api/accountStrict";
import areaCode from "../../datas/areaCode";
import { getUrlParameter, readCookie, setCookie } from "./common";
import { defPopBoxType } from "../common/popBox";
import { userInfoContext, popBoxContext } from "./context";
import { GET_LANG_ID } from "../../service/language";
import config from "../../config";
import TandC from "../../service/t_and_c";
import Inputbox from "./inputbox";
import InputboxPSW from "./inputbox.password";
import Dropdown from "./dropdown";
import Checkbox from "./checkbox";
import { Iov_GetBlackBox } from "../common/iovation";

import {
	initValue,
	initTip,
	passwordCheck,
	currencyToAreacode
} from "./join.data";

const defaultLangId = GET_LANG_ID();

export default () => {
	const { t } = useTranslation();
	const { setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [userValue, setUserValue] = useState(initValue);
	const [tip, setTip] = useState(initTip);
	const [showPsw, setShowPsw] = useState(false);
	const [siteCurrency, setSiteCurrency] = useState([]);
	const isMountedRef = useRef(null);
	const [defaultOption, setDefaultOption] = useState(
		t("lbl_PrefferedCurrency")
	);

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
										onClick={ClosePopBox}>
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
									onClick={ClosePopBox}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	}, []);

	const ClosePopBox = () => {
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
		} else if (col === "email") {
			msg = t("lbl_EmailToolTip");
		} else if (col === "currency") {
			msg = t("lbl_CantChangePreferredCurrency");
		} else if (col === "phone") {
			msg = t("lbl_PhoneTooltip");
		} else if (col === "aff") {
			msg = t("lbl_Please_enter_Affiliate_ID");
		}
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
		if (col === "phone") {
			val = val.replace(/[^0-9]+/g, "");
		}

		setUserValue(prev => ({
			...prev,
			[col]: val
		}));
	};

	const checkValue = async (col, e) => {
		let val = e.target.value;
		let checked = true;
		let msg = "";

		if (col === "username") {
			let result = await usernameCheck(val);
			checked = result.checked;
			msg = result.msg;
		} else if (col === "password") {
			let result = passwordCheck(val);
			checked = result.checked;
			msg = result.msg;
		} else if (col === "email") {
			let result = await emailCheck(val);
			checked = result.checked;
			msg = result.msg;
		} else if (col === "currency") {
			let result = currencyCheck();
			checked = result.checked;
			msg = result.msg;
		} else if (col === "phone") {
			let result = await phoneCheck(val);
			checked = result.checked;
			msg = result.msg;
		}

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

	const usernameCheck = async val => {
		let checked = false;
		let msg = "";

		if (val === "") {
			checked = false;
			msg = "msg_UsernameReq";
		} else if (val.length < 6 || val.length > 18) {
			checked = false;
			msg = "msg_UsernameLength";
		} else {
			checked = true;
			msg = "lbl_CantChangeUsername";
		}

		if (checked === true) {
			const res = await api_site_ExistsUserName({ UserName: val });
			if (isMountedRef.current) {
				if (res.data.errorCode === 0) {
					if (res.data.data === true) {
						checked = false;
						msg = "msg_UsernameNotAvailable";
					}
				}
			}
		}

		return { checked, msg };
	};

	const emailCheck = async val => {
		let checked = false;
		let msg = "";
		const regx = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

		if (val === "") {
			checked = false;
			msg = "msg_MailWrongFormat";
		} else if (!regx.test(val)) {
			checked = false;
			msg = "msg_MailWrongFormat";
		} else {
			checked = true;
			msg = "lbl_CantChangeEmail";
		}

		if (checked === true) {
			const res = await api_site_ExistsEmail({ Email: val });
			if (isMountedRef.current) {
				if (res.data.errorCode === 0) {
					if (res.data.data === true) {
						checked = false;
						msg = "msg_MailExisted";
					}
				}
			}
		}

		return { checked, msg };
	};

	const phoneCheck = async val => {
		let checked = false;
		let msg = "";

		if (val === "") {
			checked = false;
			msg = "lbl_PhoneRequired";
		} else {
			checked = true;
			msg = "lbl_CantChangePhone";
		}

		if (checked) {
			const res = await api_site_ExistsPhoneNo({
				AreaCode: _areaCode,
				Phone: val
			});
			if (isMountedRef.current) {
				if (res.data.errorCode === 0) {
					if (res.data.data === true) {
						checked = false;
						msg = "msg_PhoneExisted";
					}
				}
			}
		}

		return { checked, msg };
	};

	let _currencyId = siteCurrency[userValue.currencyIdx]?.id;

	let currencyToCountryCode = _currencyId
		? currencyToAreacode[_currencyId]
		: null;

	const _areaCode =
		currencyToCountryCode !== null
			? areaCode[currencyToCountryCode]?.AreaCode
			: null;

	const currencyCheck = () => {
		let checked = true;
		let msg = "";
		if (defaultOption !== null) {
			checked = false;
			msg = "lbl_RemindPrefferedCurrency";
		}
		return { checked, msg };
	};

	const onSelectItem = i => {
		setDefaultOption(null);

		setUserValue(prev => {
			return { ...prev, currencyIdx: i };
		});
	};

	const checkboxHandler = col => {
		setUserValue(prev => {
			return { ...prev, [col]: !userValue[col] };
		});
	};

	const checkAll = async () => {
		return await Promise.all([
			usernameCheck(userValue.username),
			phoneCheck(userValue.phone),
			emailCheck(userValue.email)
		]).then(
			res => {
				let _usernameCheck = res[0];
				let _phoneCheck = res[1];
				let _emailCheck = res[2];
				let _passwordCheck = passwordCheck(userValue.password);
				let _currencyCheck = currencyCheck();
				let _termsCheck = userValue.termsCheck;
				let _ageCheck = userValue.ageCheck;

				let checked =
					_usernameCheck.checked &&
					_passwordCheck.checked &&
					_phoneCheck.checked &&
					_emailCheck.checked &&
					_currencyCheck.checked &&
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
							phone: {
								checked: _phoneCheck.checked,
								msg: t(_phoneCheck.msg)
							},
							email: {
								checked: _emailCheck.checked,
								msg: t(_emailCheck.msg)
							},
							currency: {
								checked: _currencyCheck.checked,
								msg: t(_currencyCheck.msg)
							},
							checkbox: {
								checked: true,
								msg: t(checkboxMsg)
							}
						};
					});
				}
				return checked;
			},
			err => {
				return false;
			}
		);
	};

	const isUrlAff =
	getUrlParameter("aff") || readCookie("aff");

	const clickSubmit = async e => {
		e.preventDefault();
		let checked = await checkAll();

		if (checked) {
			let regData = {
				UserName: userValue.username,
				Userpwd: userValue.password,
				Email: userValue.email,
				PhoneNo: userValue.phone,
				CurrencyId: _currencyId,
				UserLang: defaultLangId,
				AreaCode: _areaCode
			};

			regData["RefId"] = getUrlParameter("RefId") || readCookie("RefId");
			regData["AffId"] = getUrlParameter("AffId") || readCookie("AffId");
			regData["Aff"] = isUrlAff ?? userValue.aff;
			regData["blackbox"] = await Iov_GetBlackBox();

			api_site_Signup(regData, defaultLangId).then(
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
											let cookieName = `balanceHint${_user.userName}`;
											setCookie(cookieName, "1", 1);
											_user = {
												isJoin: true,
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
																ClosePopBox
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
														onClick={ClosePopBox}>
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
											onClick={ClosePopBox}>
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
										onClick={ClosePopBox}>
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
				<div className="joinAnimation">
					<img
						src={require("../../styles/img/animationLogo.png")}
						className="animationlogo"
					/>
					<img
						src={require("../../styles/img/joinNpc01.png")}
						className="npc1"
					/>
					<img
						src={require("../../styles/img/joinNpc02.png")}
						className="npc2"
					/>
					<img
						src={require("../../styles/img/welcome.png")}
						className="welcome"
					/>
					<img
						src={require("../../styles/img/back.png")}
						className="back"
					/>
				</div>
				<form className="joinloginFunction" onSubmit={clickSubmit}>
					<span className="title txt-orange">{t("lbl_JoinNow")}</span>
					<div>
						{t("lbl_LoginMsg")}
						<button
							className="txt-orange"
							type="button"
							onClick={openLogin}>
							{t("lbl_LoginHere")}
						</button>
					</div>
					<div className="inputModule">
						<Inputbox
							className={`inputBox-org${
								!tip.username.checked && tip.username.msg !== ""
									? " error"
									: ""
							}`}
							icon="icon-member txt-orange"
							placeholder={t("lbl_Username")}
							value={userValue.username}
							tip={tip.username.msg}
							checked={tip.username.checked}
							clickInfo={clickInfo.bind(this, "username")}
							onChange={EditField.bind(null, "username")}
							onBlur={checkValue.bind(null, "username")}
						/>

						<InputboxPSW
							className={`inputBox-org${
								!tip.password.checked && tip.password.msg !== ""
									? " error"
									: ""
							}`}
							icon="icon-key txt-orange"
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

						<Inputbox
							className={`inputBox-org${
								!tip.email.checked && tip.email.msg !== ""
									? " error"
									: ""
							}`}
							icon="icon-email txt-orange"
							placeholder={t("lbl_Email")}
							value={userValue.email}
							tip={tip.email.msg}
							checked={tip.email.checked}
							clickInfo={clickInfo.bind(this, "email")}
							onChange={EditField.bind(null, "email")}
							onBlur={checkValue.bind(null, "email")}
						/>

						<div
							className={`inputBox-org${
								tip.currency.msg !== "" ? " error" : ""
							}`}
							tabIndex="0"
							onBlur={checkValue.bind(null, "currency")}>
							<Dropdown
								defaultOption={defaultOption}
								mainKey="join_currency"
								icon="icon-coin-dollar txt-orange"
								options={siteCurrency}
								selectedIdx={userValue.currencyIdx}
								i18n={t}
								onSelectItem={onSelectItem}
							/>
						</div>
						{tip.currency.msg ? (
							<div className="active">{tip.currency.msg}</div>
						) : null}

						<div className="tip active">
							{t("lbl_CantChangePreferredCurrency")}
						</div>

						{userValue.currencyIdx !== null ? (
							<Inputbox
								className={`inputBox-org${
									!tip.phone.checked && tip.phone.msg !== ""
										? " error"
										: ""
								}`}
								icon="icon-phone txt-orange"
								areaCode={_areaCode}
								placeholder={t("lbl_Phone")}
								value={userValue.phone}
								tip={tip.phone.msg}
								checked={tip.phone.checked}
								clickInfo={clickInfo.bind(this, "phone")}
								onChange={EditField.bind(null, "phone")}
								onBlur={checkValue.bind(null, "phone")}
							/>
						) : (
							<></>
						)}

						<Inputbox
							className={`inputBox-org`}
							icon="icon-affiliate txt-orange"
							placeholder={t("lbl_Affiliate_ID")}
							value={isUrlAff ?? userValue.aff}
							onChange={EditField.bind(null, "aff")}
							readOnly={isUrlAff}
							checked={tip.aff.checked}
							tip={tip.aff.msg}
							clickInfo={clickInfo.bind(this, "aff")}
						/>
					</div>

					<div className="Terms">
						<Checkbox
							id="joinTermsCheck"
							checked={userValue.termsCheck}
							onChange={checkboxHandler.bind(null, "termsCheck")}>
							{t("lbl_Check18TC1")}
							<a
								target="_blank"
								rel="noreferrer"
								href={TandC(defaultLangId).terms}>
								{t("lbl_TermsConditions")}
							</a>
							&nbsp;
							{t("lbl_Check18TC2")}
							<a
								target="_blank"
								rel="noreferrer"
								href={TandC(defaultLangId).rule}>
								{t("lbl_RuleRegulations")}
							</a>
							&nbsp;
							{t("lbl_Check18TC3")} &nbsp;
							{config.siteName}.
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
							onClick={ClosePopBox}>
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
