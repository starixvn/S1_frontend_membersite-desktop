import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default ({ btnBar, message, errorCode, icon = "icon-library" }) => {
	const { t } = useTranslation();
	const [countDownSecond, setCountDownSecond] = useState(300);
	const timerRef = useRef(null);
	const hasTooManyRequestError = errorCode === 1004;

	const startTimer = () => {
		timerRef.current = setInterval(() => {
			console.log("!!");
			setCountDownSecond(prev => prev - 1);
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

	useEffect(() => {
		if (hasTooManyRequestError) {
			startTimer();
		}

		return () => {
			clearInterval(timerRef.current);
		};
	}, []);

	useEffect(() => {
		const timeIsUp = countDownSecond === 0 && timerRef.current;

		if (timeIsUp) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, [countDownSecond]);

	return (
		<div className="Success active">
			<div className={`icon ${icon}`}></div>
			<div className="title">{t("lbl_Information")}</div>
			<div>
				{hasTooManyRequestError ? (
					<span>
						{t(`msg_API_SendVerifySMS_1004`, {
							time: secondsToTime(countDownSecond)
						})}
					</span>
				) : (
					<span>{message}</span>
				)}
			</div>
			{btnBar}
		</div>
	);
};
