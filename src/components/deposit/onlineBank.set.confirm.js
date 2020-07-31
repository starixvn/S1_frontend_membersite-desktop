import React, { useContext, useState } from "react";
import { number_format, getUrlParameter } from "../common/common";
import { userInfoContext, popBoxContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { Redirect } from "@reach/router";
import config from "../../config";
import path from "../../path";
import { defPopBoxType } from "../common/popBox";

export default ({ bankInfo, amount, _isConvert }) => {
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
						No
					</button>
					<button className="orange" onClick={ClickYes}>
						Yes
					</button>
				</div>
			)
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
			setRedirectPath(`/${path.deposit.root}`);
		}
	};

	return redirectPath === null ? (
		<div className="subModuleList">
			<div className="subModule">
				<div className="subModuleBody column align-items-center">
					<span className="title">Important Note</span>
					<div className="txt-lightgray">
						Please confirm the deposit information.
					</div>
					<div className="bankName">
						<img
							src={`${config.imgUrl}/common/images/BankLogo/${bankInfo.bankLogo}`}
							alt={bankInfo.bankName}
						/>
					</div>
					<div className="smallList">
						<ul>
							<li>Selected Bank</li>
							<li>{bankInfo.bankName}</li>
						</ul>
						<ul>
							<li>Deposit Amount</li>
							<li>{number_format(amount, _isConvert)}</li>
						</ul>
					</div>
					<div className="btnGroup">
						<button onClick={ClickCancel} className="gray">
							{t("lbl_Cancel")}
						</button>
						<button onClick={ClickSubmit} className="orange">
							{t("lbl_Submit")}
						</button>
					</div>
				</div>
			</div>
		</div>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
