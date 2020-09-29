import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../common/context";
import { InfoList, initValue, initStatus, DisplayRow } from "./profile.data";
import areaCode from "../../datas/areaCode";
import moment from "moment";
import { api_account_ExistsPhone } from "../../service/api/account";
import { api_accountStrict_SetProfile } from "../../service/api/accountStrict";
import { defPopBoxType } from "../common/popBox";
import EditModule from "./profile.edit";
import { getUrlParameter } from "../common/common";
import { Link } from "@reach/router";
import path from "../../path";
import Loading from "../common/loading";
import { api_site_GetCountryList } from "../../service/api/site";

export default () => {
	const { t } = useTranslation();
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [userValue, setUserValue] = useState(initValue);
	const [status, setStatus] = useState(initStatus);
	const [loading, setLoading] = useState(true);
	const isMountedRef = useRef(null);
	const [countryList, setCountryList] = useState([]);
	const infoList = InfoList({ countryList });

	const country = userInfo.country ? userInfo.country : userInfo.perCountry;
	const _areaCode = country ? areaCode[country].AreaCode : "";

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (isMountedRef.current) {
			if (userInfo.isLogin) {
				api_site_GetCountryList({ langId: userInfo.langId }).then(
					res => {
						if (res.data.errorCode === 0) {
							setCountryList(res.data.data);
						}
					}
				);
			}
		}
	}, [userInfo.langId]);

	useEffect(() => {
		if (
			userInfo.accountName !== undefined ||
			userInfo.phoneNo !== undefined
		) {
			setLoading(false);
		}
	}, [userInfo.accountName, userInfo.phoneNo]);

	const closePopBox = () => {
		setPopBox({ isOpen: false });
	};

	const clickInfo = col => {
		let _tip = "";

		if (col === "accountName") {
			_tip = status.accountName.tip === "" ? t("lbl_RemindForName") : "";
		} else {
			_tip = status.phoneNo.tip === "" ? t("lbl_PhoneTooltip") : "";
		}

		setStatus(prev => ({
			...prev,
			[col]: {
				checked: null,
				tip: _tip
			}
		}));
	};

	const editField = (col, e) => {
		let val = e.target.value;

		if (col === "birth") {
			val = moment(e).format("YYYY-MM-DD");
		} else if (col === "accountName") {
			let pattern = new RegExp(/["'`_^+-@#!<>%;)(&$.]/);
			val = val.replace(pattern, "");
		} else {
			val = val.replace(/[^\d]+/g, "");
		}

		setUserValue(prev => ({
			...prev,
			[col]: val
		}));
	};

	const phoneCheck = val => {
		let checked = true;
		let tip = "";

		if (!val) {
			checked = false;
			tip = t("lbl_PhoneRequired");
		} else {
			api_account_ExistsPhone({
				AreaCode: _areaCode,
				Phone: val
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							if (res.data.data) {
								setStatus(prev => ({
									...prev,
									phoneNo: {
										checked: false,
										tip: t("msg_PhoneExisted")
									}
								}));
							} else {
								setStatus(prev => ({
									...prev,
									phoneNo: {
										checked: true,
										tip: ""
									}
								}));
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
										onClick={closePopBox}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			);
		}

		setStatus(prev => ({
			...prev,
			phoneNo: {
				checked: checked,
				tip: tip
			}
		}));

		return checked;
	};

	const valueCheck = (val, col) => {
		let checked = true;
		let tip = "";

		if (col === "accountName") {
			tip = !val ? t("lbl_NameRequired") : "";
			checked = !!val;
		} else if (col === "birth") {
			tip = !val ? t("lbl_BirthRequired") : "";
			checked = !!val;
		}

		setStatus(prev => ({
			...prev,
			[col]: {
				checked: checked,
				tip: tip
			}
		}));

		return checked;
	};

	const clickSubmit = e => {
		e.preventDefault();

		let accountNameCheck = userInfo.accountName
			? true
			: valueCheck(userValue.accountName, "accountName");

		let birthCheck = userInfo.birth_d
			? true
			: valueCheck(userValue.birth, "birth");

		let phoneNoCheck = userInfo.phoneNo
			? true
			: phoneCheck(userValue.phoneNo, "phoneNo");

		const SetProfile = () => {
			let profileDatas = {
				AccountName: userInfo.accountName ?? userValue.accountName,
				Birth_d: userInfo.birth_d ?? userValue.birth.slice(8, 10),
				Birth_m: userInfo.birth_m ?? userValue.birth.slice(5, 7),
				Birth_y: userInfo.birth_y ?? userValue.birth.slice(0, 4),
				CountryCode: country,
				AreaCode: userInfo.areaCode ?? _areaCode,
				PhoneNo: userInfo.phoneNo ?? userValue.phoneNo
			};

			setLoading(true);

			api_accountStrict_SetProfile(profileDatas).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setUserInfo(prev => ({
								...prev,
								accountName: profileDatas.AccountName,
								birth_d: profileDatas.Birth_d,
								birth_m: profileDatas.Birth_m,
								birth_y: profileDatas.Birth_y,
								phoneNo: profileDatas.PhoneNo,
								country: country
							}));

							setUserValue(initValue);
							setStatus(initStatus);

							let prevPage = getUrlParameter("from");
							if (prevPage === path.withdrawal.root) {
								setPopBox({
									isOpen: true,
									popBoxType: defPopBoxType.ProfileCompelete,
									contentMsg: t("lbl_GoWithdrawalPage"),
									btnBar: (
										<div className="btnGroup">
											<button
												className="btn-cancel"
												onClick={closePopBox}>
												{t("lbl_Later")}
											</button>
											<Link
												className="btn-check"
												to={`/${userInfo.langId}/${path.withdrawal.root}`}>
												{t("lbl_WithdrawalNow")}
											</Link>
										</div>
									)
								});
							} else if (prevPage === path.promotion.root) {
								setPopBox({
									isOpen: true,
									popBoxType: defPopBoxType.ProfileCompelete,
									contentMsg: t("lbl_GoPromotionPage"),
									btnBar: (
										<div className="btnGroup">
											<button
												className="btn-cancel"
												onClick={closePopBox}>
												{t("lbl_Later")}
											</button>
											<Link
												className="btn-check"
												to={`/${userInfo.langId}/${
													path.promotion.root
												}/${
													path.promotion.sub
														.promotionInfo.root
												}?BonusCode=${getUrlParameter(
													"BonusCode"
												)}`}>
												{t("lbl_GoNow")}
											</Link>
										</div>
									)
								});
							} else {
								setPopBox({
									isOpen: true,
									popBoxType: defPopBoxType.ProfileCompelete,
									contentMsg: t("lbl_GoDepositPage"),
									btnBar: (
										<div className="btnGroup">
											<button
												className="btn-cancel"
												onClick={closePopBox}>
												{t("lbl_Later")}
											</button>
											<Link
												className="btn-check"
												to={`/${userInfo.langId}/${path.deposit.root}`}>
												{t("lbl_DepositNow")}
											</Link>
										</div>
									)
								});
							}
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: res.data.message,
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-cancel"
											onClick={closePopBox}>
											{t("lbl_Close")}
										</button>
									</div>
								)
							});
						}
					}
					setLoading(false);
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
										onClick={closePopBox}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
						setLoading(false);
					}
				}
			);
		};

		if (accountNameCheck && birthCheck && phoneNoCheck) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ProfileConfirmCheck,
				accountName: userValue.accountName,
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={closePopBox}>
							{t("lbl_ReModify")}
						</button>
						<button className="btn-check" onClick={SetProfile}>
							{t("lbl_Confirm")}
						</button>
					</div>
				)
			});
		}
	};

	const arr = infoList?.map(item => {
		let displayValue = item.content;
		if (item.format) {
			displayValue = item.format(item.content, item.bindingData);
		}

		return item.show ? (
			<DisplayRow
				key={`profile-${item.displayKey}`}
				t={t}
				displayKey={item.displayKey}
				content={displayValue}
				areaCode={_areaCode}
			/>
		) : null;
	});

	return loading ? (
		<Loading />
	) : (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_Profile">
				<span>{t("lbl_Profile")}</span>
				<div>{t("lbl_ProfileModifyWarning")}</div>
			</div>

			{userInfo.accountName && userInfo.birth_d && userInfo.phoneNo ? (
				<div className="profile">{arr}</div>
			) : (
				<EditModule
					t={t}
					userInfo={userInfo}
					userValue={userValue}
					status={status}
					arr={arr}
					editField={editField}
					valueCheck={valueCheck}
					phoneCheck={phoneCheck}
					clickInfo={clickInfo}
					clickSubmit={clickSubmit}
				/>
			)}
		</div>
	);
};
