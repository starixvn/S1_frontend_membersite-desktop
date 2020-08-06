import React, { useContext, useState } from "react";
import { number_format, getUrlParameter } from "../common/common";
import { userInfoContext, popBoxContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { Redirect } from "@reach/router";
import config from "../../config";
import path from "../../path";
import { defPopBoxType } from "../common/popBox";

export default ({ channelInfo, amount, _isConvert }) => {
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [redirectPath, setRedirectPath] = useState(null);
	const { t } = useTranslation();
	const ClickCancel = () => {
		const ClickYes = () => {
			setPopBox({
				isOpen: false
			});
			setRedirectPath(`/${userInfo.langId}/${path.deposit.root}`);
		};

		const ClickNo = () => {
			setPopBox({
				isOpen: false
			});
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Cancel,
			btnBar: (
				<div className="btnGroup">
					<button className="gray" onClick={ClickNo}>
						{t("lbl_Cancel")}
					</button>
					<button className="orange" onClick={ClickYes}>
						{t("lbl_Confirm")}
					</button>
				</div>
			)
		});
	};

	const ClickSubmit = () => {
		if (typeof window !== undefined) {
			let real_amount = _isConvert ? amount * 1000 : amount;
			window.open(
				`${config.openURL}/${userInfo.langId}/Cashier/DepositReqMobilePay?ChannelId=${channelInfo.channelId}&Amount=${real_amount}`
			);
			setRedirectPath(`/${path.deposit.root}`);
		}
	};

	return redirectPath === null ? (
		<div className="subModuleList">
			<div className="subModule">
				<div className="subModuleBody column align-items-center">
					<span className="title">{t("lbl_ImportantNote")}</span>
					<div className="txt-lightgray">
						{t("lbl_ConfirmDeposit")}
					</div>
					<div className="bankName">
						<img
							src={`${config.imgUrl}/common/images/MobilePay/${channelInfo.groupName}.png`}
							alt={channelInfo.groupName}
						/>
					</div>
					<div className="smallList">
						<ul>
							<li>{t("lbl_SelectedChannel")}</li>
							<li>{channelInfo.channelName}</li>
						</ul>
						<ul>
							<li>{t("lbl_Amount")}</li>
							<li>
								{number_format(
									_isConvert ? amount * 1000 : amount,
									_isConvert
								)}
							</li>
						</ul>
					</div>
					<div className="btnGroup">
						<button onClick={ClickCancel} className="gray">
							{t("lbl_Cancel")}
						</button>
						<button onClick={ClickSubmit} className="orange">
							{t("lbl_Confirm")}
						</button>
					</div>
				</div>
			</div>
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
