import React, { useContext, useState, useEffect, useRef } from "react";
import { popBoxContext, userInfoContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { defPopBoxType } from "../common/popBox";
import {
	api_accountStrict_VerifyPhone,
	api_accountStrict_SendVerifySMS
} from "../../service/api/accountStrict";

export default ({ request_id }) => {
	const { setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);
	const { t } = useTranslation();

	const [code, setCode] = useState("");
	const [requestId, setRequestId] = useState(request_id);
	const [retransmitCountDownSecond, setRetransmitCountDownSecond] = useState(
		300
	);
	const [verifyPhoneError, setVerifyPhoneError] = useState("");
	const [verifyPhoneloading, setVerifyPhoneloading] = useState(false);
	const [mobileVerificationLoading, setMobileVerificationLoading] = useState(
		false
	);

	const timerRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		startTimer();
		return () => {
			clearInterval(timerRef.current);
		};
	}, []);

	useEffect(() => {
		const timeIsUp = retransmitCountDownSecond === 0 && timerRef.current;

		if (timeIsUp) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, [retransmitCountDownSecond]);

	const onChanheCode = e => {
		setCode(e.target.value);
	};

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const startTimer = () => {
		timerRef.current = setInterval(() => {
			setRetransmitCountDownSecond(prev => prev - 1);
		}, 1000);
	};

	const secondsToTime = secondsInTime => {
		const pad = (num, size) => {
			return ("000" + num).slice(size * -1);
		};
		let time = parseFloat(secondsInTime).toFixed(3);
		let hours = Math.floor(time / 60 / 60);
		let minutes = Math.floor(time / 60) % 60;
		let seconds = Math.floor(time - minutes * 60);
		let milliseconds = time.slice(-3);
		return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
	};

	const sendVerifySMS = () => {
		setMobileVerificationLoading(true);

		api_accountStrict_SendVerifySMS().then(
			res => {
				if (isMountedRef.current) {
					const {
						data: { errorCode, message }
					} = res;
					const success = errorCode === 0;
					const alreadyVerifiedPhone = errorCode === 5001;

					if (alreadyVerifiedPhone) {
						setUserInfo(prev => ({
							...prev,
							phoneVerified: true
						}));
						clickClose();
					} else if (success) {
						startTimer();
						setRequestId(message);
					} else {
						clickClose();
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: message || "error",
							icon: "icon-bell",
							errorCode,
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
					setMobileVerificationLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					clickClose();
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						icon: "icon-bell",
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
					setMobileVerificationLoading(false);
				}
			}
		);
	};

	const verifyPone = () => {
		if (!code) return setVerifyPhoneError(t("msg_EnterOTPCode"));

		setVerifyPhoneloading(true);
		setCode("");
		setVerifyPhoneError("");

		api_accountStrict_VerifyPhone({
			request_id: requestId,
			code
		}).then(
			res => {
				if (isMountedRef.current) {
					setVerifyPhoneloading(false);
					const {
						data: { errorCode, message }
					} = res;
					const success = errorCode === 0;
					if (success) {
						setUserInfo(prev => ({
							...prev,
							phoneVerified: true
						}));
						clickClose();
					} else {
						setVerifyPhoneError(message);
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setVerifyPhoneloading(false);
					clickClose();
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						icon: "icon-bell",
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
	};

	return (
		<div className="editSuccess active" style={{ display: "flex" }}>
			<div className="icon icon-icon32px_notification"></div>
			<div className="title">{t("lbl_ImportantNote")}</div>
			<div>{t("msg_OTPSendCode")}</div>
			<div className="inputModuleRow">
				<div className="inputBox">
					<input value={code} onChange={e => onChanheCode(e)} />
				</div>
			</div>
			<div className={`tip ${verifyPhoneError ? "active" : ""}`}>
				{verifyPhoneError}
			</div>
			<div className="btnGroup">
				<button className="btn-cancel" onClick={clickClose}>
					{t("lbl_Close")}
				</button>
				{verifyPhoneloading ? (
					<MobileVerificationLoading />
				) : (
					<button onClick={verifyPone} className="btn-check">
						{t("lbl_Submit")}
					</button>
				)}
			</div>

			<div className="resend">
				{retransmitCountDownSecond > 0 ? (
					<>
						<div className="txt-blue2">
							{secondsToTime(retransmitCountDownSecond)}
						</div>
						<div className="txt-blue2">
							Re-send in five minutes.
						</div>
					</>
				) : (
					<>
						{t("msg_OTP_NotReceiveVerificationCode")}

						<div className="btnGroup">
							{mobileVerificationLoading ? (
								<MobileVerificationLoading />
							) : (
								<button
									disabled={retransmitCountDownSecond > 0}
									className="yellow"
									onClick={sendVerifySMS}>
									{t("lbl_Retransmit")}
								</button>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

const MobileVerificationLoading = () => {
	return (
		<div style={{ minWidth: "128px" }}>
			<div className="otpLoading">
				<i className="icon icon-spinner11"></i>
			</div>
		</div>
	);
};
