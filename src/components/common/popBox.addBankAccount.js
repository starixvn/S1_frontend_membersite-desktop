import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api_accountStrict_SetCustBankInfo } from "../../service/api/accountStrict";
import { popBoxContext, userInfoContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import config from "../../config";
import Dropdown from "../common/dropdown";
import Inputbox from "../common/inputbox";

const initValue = {
	realName: "",
	bankId: 0,
	accountNo: ""
};

export default ({ bankInfoSysList = [] }) => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const [userValue, setUserValue] = useState(initValue);
	const [status, setStatus] = useState({
		realName: {
			checked: null,
			tip: ""
		},
		accountNo: {
			checked: null,
			tip: ""
		},
		realName_after: {
			tip: ""
		}
	});
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {}, []);

	const onSelectItem = i => {
		setUserValue(prev => ({ ...prev, bankId: i }));
	};

	const editField = (col, e) => {
		let val = e.target.value;

		val =
			col === "realName"
				? val.replace(/[\W]/g, "")
				: val.replace(/^(0+)|[^\d]+/g, "");
		setUserValue(prev => ({ ...prev, [col]: val }));
	};

	const clickInfo = col => {
		let _tip = "";

		if (col === "realName") {
			_tip = t("lbl_BankAccountNameHint");
		} else if (col === "realName_after") {
			_tip = t("lbl_ContactCSD");
		} else {
			_tip = t("lbl_BankNumber");
		}

		if (status[col].tip === _tip) {
			_tip = "";
		}

		setStatus(prev => ({
			...prev,
			[col]: {
				checked: status[col].checked,
				tip: _tip
			}
		}));
	};

	const ClickCancel = () => {
		setPopBox({ isOpen: false, refresh: true });
	};

	const checkAll = (val, col) => {
		let checked = true;
		let message = "";

		if (userInfo.accountName !== null && userInfo.accountName !== "") {
			if (col === "accountNo" && !val) {
				message = t("msg_NeedAccountNo");
				checked = false;
			}
		} else {
			if (col === "realName" && !val) {
				message = t("msg_EnterRealName");
				checked = false;
			} else if (col === "accountNo" && !val) {
				message = t("msg_NeedAccountNo");
				checked = false;
			}
		}

		setStatus(prev => ({
			...prev,
			[col]: {
				checked: checked,
				tip: message
			}
		}));

		if (bankInfoSysList?.length <= 0) {
			console.log("Bank list is null.");
			checked = false;
		}

		return { checked, message };
	};

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const ClickSubmit = e => {
		e.preventDefault();
		let _realName = checkAll(userValue.realName, "realName");
		let _accountNo = checkAll(userValue.accountNo, "accountNo");

		if (_realName.checked && _accountNo.checked) {
			api_accountStrict_SetCustBankInfo({
				AccountName: userValue.realName,
				AccountNo: userValue.accountNo,
				SysId: bankInfoSysList[userValue.bankId].sysId
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							if (!userInfo.accountName) {
								setUserInfo(prev => ({
									...prev,
									accountName: userValue.realName
								}));
							}
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.AddBankSuccess,
								refresh: true,
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-check"
											onClick={ClickCancel}>
											OK
										</button>
									</div>
								)
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

	return (
		<div className="addBankpop active" onSubmit={ClickSubmit}>
			<span className="title">{t("lbl_AddNewAccount")}</span>
			<div>{t("lbl_UpdateBankInfo")}</div>
			{!userInfo.accountName ? (
				<Inputbox
					value={userValue.realName}
					onChange={editField.bind(this, "realName")}
					title={t("lbl_RealName")}
					onBlur={checkAll.bind(this, userValue.realName, "realName")}
					clickInfo={clickInfo.bind(this, "realName")}
					checked={status.realName.checked}
					tip={status.realName.tip}
				/>
			) : (
				<>
					<div className="txt">
						<div>
							<span className="txt-blue2">
								{t("lbl_RealName")}
							</span>
							<span>{userInfo.accountName}</span>
						</div>
						<div
							className="iconModule"
							onClick={clickInfo.bind(this, "realName_after")}>
							<i className="icon icon-information-solid"></i>
						</div>
					</div>
					<div>{status.realName_after.tip}</div>
				</>
			)}
			<div className="inputBox">
				<Dropdown
					mainkey="bankList"
					options={bankInfoSysList}
					onSelectItem={onSelectItem}
					selectedIdx={userValue.bankId}
					imgUrl={`${config.imgUrl}/common/images/BankLogo/`}
					className="bankLogo"
				/>
			</div>
			<Inputbox
				value={userValue.accountNo}
				onChange={editField.bind(this, "accountNo")}
				onBlur={checkAll.bind(this, userValue.accountNo, "accountNo")}
				title={t("lbl_BankNumber")}
				clickInfo={clickInfo.bind(this, "accountNo")}
				checked={status.accountNo.checked}
				tip={status.accountNo.tip}
			/>
			<div className="btnGroup">
				<button className="btn-cancel" onClick={ClickCancel}>
					{t("lbl_Cancel")}
				</button>
				<button className="btn-check" onClick={ClickSubmit}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
