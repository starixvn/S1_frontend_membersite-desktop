import React from "react";
import { useTranslation } from "react-i18next";

const APPDownloadLink = {
	Android:
		"https://s3-ap-southeast-1.amazonaws.com/app918kiss/apk/918Kiss.apk",
	IOS:
		"itms-services://?action=download-manifest&url=itms-services://?action=download-manifest&url=https://s3-ap-southeast-1.amazonaws.com/app918kiss/ios/918Kiss.plist",
	IOS32:
		"itms-services://?action=download-manifest&url=itms-services://?action=download-manifest&url=https://s3-ap-southeast-1.amazonaws.com/app918kiss/ios32/918Kiss.plist"
};

export default ({ ClickClose }) => {
	const { t } = useTranslation();
	const OnClick = e => {
		return typeof window !== undefined ? window.open(e.target.value) : null;
	};
	return (
		<div className="download active">
			<button onClick={ClickClose} className="icon icon-close"></button>
			<div>
				<div className="icon icon-android">Android</div>
				<div>918Kiss Android</div>
				<div className="btnGroup">
					<button
						value={APPDownloadLink.Android}
						className="blue"
						onClick={OnClick}>
						{t("lbl_Download")}
					</button>
				</div>
			</div>
			<div>
				<div className="icon icon-appleinc">IOS</div>
				<div>Iphone 5s+</div>
				<div className="btnGroup">
					<button
						value={APPDownloadLink.IOS}
						className="blue"
						onClick={OnClick}>
						{t("lbl_Download")}
					</button>
				</div>
			</div>
			<div>
				<div className="icon icon-appleinc">IOS</div>
				<div>Iphone 5 Or Iphone 5-</div>
				<div className="btnGroup">
					<button
						value={APPDownloadLink.IOS32}
						className="blue"
						onClick={OnClick}>
						{t("lbl_Download")}
					</button>
				</div>
			</div>
		</div>
	);
};
