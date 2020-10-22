import React, { useContext } from "react";
import { number_format } from "../common/common";
import { userInfoContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { Link } from "@reach/router";
import config from "../../config";
import path from "../../path";
import { defActionType } from "./cryptoPay.reducer";

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
				`${config.openURL}/${userInfo.langId}/Cashier/DepositReqCryptoPay?ChannelId=${channelInfo.channelId}&Amount=${real_amount}`
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
					<div className="smallList">
						<ul>
							<li>{t("lbl_Amount")}</li>
							<li>
								{number_format(
									_isConvert ? amount * 1000 : amount,
									_isConvert
								)}
							</li>
						</ul>
						<ul>
							<li>{t("lbl_ExchangeRateReference")}</li>
							<li>{channelInfo.sellRate}</li>
						</ul>
						<ul>
							<li>{t("lbl_ExchangeAmount")}</li>
							<li>
								{(amount / channelInfo.sellRate).toFixed(4)}
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
