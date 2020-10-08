import React, { useContext, useState, useEffect, useRef } from "react";
import { popBoxContext, userInfoContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { defPopBoxType } from "../common/popBox";
import {
	api_accountStrict_VerifyOTP,
	api_accountStrict_SendOTPSMS
} from "../../service/api/accountStrict";
import moment from "moment";

export default ({ startUnixTime }) => {
	const { setUserInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const isMountedRef = useRef(null);
	const { t } = useTranslation();
	const [code, setCode] = useState("");
	const [retransmitCountDownSecond, setRetransmitCountDownSecond] = useState(
		startUnixTime + 300 - moment().unix()
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

	const openErrorMessagePopBox = (
		message = t("msg_ApiServerError"),
		errorCode = null
	) => {
		setPopBox({
			message,
			errorCode,
			isOpen: true,
			popBoxType: defPopBoxType.ErrorMsg,
			icon: "icon-bell",
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={clickClose}>
						{t("lbl_Close")}
					</button>
				</div>
			)
		});
	};

	const onChanheCode = e => {
		setCode(e.target.value);
	};

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const startTimer = () => {
		timerRef.current = setInterval(() => {
			setRetransmitCountDownSecond(prev => {
				if (prev - 1 === 0 && timerRef.current) {
					clearInterval(timerRef.current);
					timerRef.current = null;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const secondsToTime = secondsInTime => {
		const pad = (num, size) => {
			return ("000" + num).slice(size * -1);
		};
		let time = parseFloat(secondsInTime).toFixed(3);
		// let hours = Math.floor(time / 60 / 60);
		let minutes = Math.floor(time / 60) % 60;
		let seconds = Math.floor(time - minutes * 60);
		// let milliseconds = time.slice(-3);
		return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
	};

	const sendOTPSMS = () => {
		setMobileVerificationLoading(true);

		api_accountStrict_SendOTPSMS().then(
			res => {
				if (isMountedRef.current) {
					const {
						data: {
							data: { startUnixTime },
							errorCode,
							message
						}
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
						setRetransmitCountDownSecond(
							startUnixTime + 300 - moment().unix()
						);
						startTimer();
					} else {
						clickClose();
						openErrorMessagePopBox(message || "error", errorCode);
					}
					setMobileVerificationLoading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					clickClose();
					openErrorMessagePopBox();
					setMobileVerificationLoading(false);
				}
			}
		);
	};

	const verifyOTP = () => {
		if (!code) return setVerifyPhoneError(t("msg_EnterOTPCode"));

		setVerifyPhoneloading(true);
		setCode("");
		setVerifyPhoneError("");

		api_accountStrict_VerifyOTP({
			inputOTPcode: code
		}).then(
			res => {
				if (isMountedRef.current) {
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
					} else if (errorCode === 1000) {
						setVerifyPhoneError(t("msg_OTP_Invalid"));
					} else {
						setVerifyPhoneError(message | "error");
					}
					setVerifyPhoneloading(false);
				}
			},
			err => {
				if (isMountedRef.current) {
					setVerifyPhoneloading(false);
					clickClose();
					openErrorMessagePopBox();
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
				<div className="inputBox-white">
					<input value={code} onChange={e => onChanheCode(e)} />
				</div>
			</div>
			<div className={`tip ${verifyPhoneError ? "active" : ""}`}>
				{verifyPhoneError}
			</div>
			<div className="btnGroup">
				{verifyPhoneloading ? (
					<MobileVerificationLoading />
				) : (
					<>
						<button className="btn-cancel" onClick={clickClose}>
							{t("lbl_Close")}
						</button>
						<button onClick={verifyOTP} className="btn-check">
							{t("lbl_Submit")}
						</button>
					</>
				)}
			</div>

			<div className="resend">
				{retransmitCountDownSecond > 0 ? (
					<>
						<div className="txt-blue2">
							( {secondsToTime(retransmitCountDownSecond)} )
						</div>
						{/* <div className="txt-blue2">
							{t("lbl_ResendAfter5Mins")}
						</div> */}
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
									className="blue"
									onClick={sendOTPSMS}>
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
