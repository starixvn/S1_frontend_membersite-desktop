import React, { useContext } from "react";
import { number_format } from "../common/common";
import { userInfoContext, popBoxContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { Link } from "@reach/router";
import config from "../../config";
import path from "../../path";
import { defActionType } from "./mobilePay.reducer";

export default ({ channelInfo, amount, _isConvert, dispatch }) => {
	const { userInfo } = useContext(userInfoContext);
	const { t } = useTranslation();
	const ClickCancel = () => {
		dispatch({
			type: defActionType.CLICK_BACK
		});
	};

	const ClickSubmit = () => {
		if (typeof window !== undefined) {
			let real_amount = _isConvert ? amount * 1000 : amount;
			window.open(
				`${config.openURL}/${userInfo.langId}/Cashier/DepositReqMobilePay?ChannelId=${channelInfo.channelId}&Amount=${real_amount}`
			);
		}
	};

	return (
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
						<Link
							to={`/${userInfo.langId}/${path.deposit.root}`}
							onClick={ClickSubmit}
							className="orange">
							{t("lbl_Confirm")}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
