import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { api_site_ForgetPwd } from "../service/api/site";
import { popBoxContext, userInfoContext } from "../components/common/context";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import Inputbox from "../components/common/inputbox";
import { defPopBoxType } from "../components/common/popBox";

export default () => {
	return (
		<Wrapper afterLogin={false}>
			<Layout>
				<main>
					<section className="inside">
						<div className="rightModule">
							<Content />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};

const initStatus = { checked: null, msg: "" };

const Content = () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [userEmail, setUserEmail] = useState("");
	const [status, setStatus] = useState(initStatus);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const emailCheck = val => {
		let _checked = true;
		let _msg = "";
		const regx = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

		if (val === "") {
			_checked = false;
			_msg = "msg_MailWrongFormat";
		} else if (val !== "") {
			if (!regx.test(val)) {
				_checked = false;
				_msg = "msg_MailWrongFormat";
			}
		}

		setStatus({
			checked: _checked,
			msg: t(_msg)
		});

		return _checked;
	};

	const editField = e => {
		let val = e.target.value;
		setUserEmail(val);
	};

	const clickInfo = () => {
		let _msg = status.msg === "" ? t("lbl_EmailRequired") : "";

		setStatus({
			checked: null,
			msg: _msg
		});
	};

	const clickSubmit = e => {
		e.preventDefault();
		let checked = emailCheck(userEmail);

		const ClickClose = () => {
			setPopBox({ isOpen: false });
		};

		if (checked) {
			api_site_ForgetPwd({
				Email: userEmail,
				langId: userInfo.langId
			}).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ChangePsw,
								title: t("lbl_ForgetPsw"),
								message: t("lbl_ForgetPwdSuccess"),
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-cancel"
											onClick={ClickClose}>
											OK
										</button>
									</div>
								),
								ClickClose: ClickClose
							});
							setUserEmail("");
							setStatus(initStatus);
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
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_password">
				<span>{t("lbl_ForgetPassword")}</span>
				<div>{t("lbl_ForgetPwdHint")}</div>
			</div>
			<form onSubmit={clickSubmit} className="forgetPassWord">
				<Inputbox
					inputBoxClassName="inputBox-white"
					icon="txt-blue icon-email "
					title={t("lbl_Email")}
					value={userEmail}
					onChange={editField.bind(this)}
					onBlur={emailCheck.bind(this, userEmail)}
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
