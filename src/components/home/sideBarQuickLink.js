import React, { useState } from "react";
import { SiteInfo } from "../../config";
import { useTranslation } from "react-i18next";

export default () => {
	const { t } = useTranslation();

	const [active, setActive] = useState(false);

	const activeToggleHandler = () => {
		setActive(!active);
	};

	const openLink = (href, target) => {
		window.open(href, target);
	};

	const openLiveChat = () => {
		window.LiveChatWidget.call("maximize");
	};

	return (
		<div
			className="quickLink"
			className={`quickLink ${active ? "active" : ""}`}>
			<div>
				<button
					className="icon icon-chat"
					onClick={openLiveChat}></button>

				<i
					className={`icon ${
						active ? "icon-cancel-circle" : "icon-arrow-up2"
					} `}
					onClick={activeToggleHandler}>
					{t("lbl_ContactUs")}
				</i>
			</div>
			<div>
				<ul>
					<li className="icon icon-chat" onClick={openLiveChat}>
						<a>Live Chat</a>
					</li>
					{/* <li className="icon icon-instagram">
						<a href={SiteInfo.socialMedia.ig.link} target="_blank">
							{t(SiteInfo.socialMedia.ig.displayKey)}
						</a>
					</li>
					<li className="icon icon-facebook2">
						<a href={SiteInfo.socialMedia.fb.link} target="_blank">
							{t(SiteInfo.socialMedia.fb.displayKey)}
						</a>
					</li>
					<li className="icon icon-twitter">
						<a
							href={SiteInfo.socialMedia.twitter.link}
							target="_blank">
							{t(SiteInfo.socialMedia.twitter.displayKey)}
						</a>
					</li> */}
					<li
						className="icon icon-whatsapp"
						onClick={() =>
							openLink("https://wa.me/639456388147", "whatsapp")
						}>
						Whatsapp
						<div className="txt-blue">
							+63 945 638 8147
							<img
								src={require("../../styles/img/whatsappQR.jpg")}
							/>
						</div>
					</li>
					<li
						className="icon icon-line"
						onClick={() =>
							openLink("https://lin.ee/SAPymLI ", "line.me")
						}>
						Line
						<div className="txt-blue">
							@nova88thai
							<img src={require("../../styles/img/lineQR.jpg")} />
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
};
