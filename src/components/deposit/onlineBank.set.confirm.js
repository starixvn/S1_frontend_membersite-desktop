import React, { useContext } from "react";
import { number_format, getUrlParameter } from "../common/common";
import { userInfoContext, popBoxContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { Link } from "@reach/router";
import config from "../../config";
import path from "../../path";
import { defActionType } from "./onlineBank.reducer";

export default ({ bankInfo, amount, _isConvert, dispatch }) => {
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
				`${config.openURL}/${userInfo.langId}/Cashier/DepositReqOnlineBanking` +
					"?sysId=" +
					bankInfo.sysId +
					"&payId=" +
					getUrlParameter("pId") +
					"&ChannelId=" +
					getUrlParameter("cId") +
					"&Amount=" +
					real_amount
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
							src={`${config.imgUrl}/common/images/BankLogo/${bankInfo.bankLogo}`}
							alt={bankInfo.bankName}
						/>
					</div>
					<div className="smallList">
						<ul>
							<li>{t("lbl_SelectedBank")}</li>
							<li>{bankInfo.bankName}</li>
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
