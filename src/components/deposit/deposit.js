import React, { useContext, useEffect } from "react";
import LocalBankList from "./localBank.list";
import OnlineBankList from "./onlineBank.list";
import MobilePayList from "./mobilePay.list";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../common/context";
import path from "../../path";
import { Link } from "@reach/router";
import { defPopBoxType } from "../common/popBox";

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);

	useEffect(() => {
		if (userInfo.isLogin === true) {
			if (
				(!userInfo.accountName && userInfo.accountName !== undefined) ||
				(!userInfo.phoneNo && userInfo.phoneNo !== undefined) ||
				(!userInfo.email && userInfo.email !== undefined)
			) {
				const clickClose = () => {
					setPopBox({ isOpen: false });
				};

				setPopBox({
					isOpen: true,
					popBoxType: defPopBoxType.UpdateProfile,
					title: t("lbl_ImportantNote"),
					content: t("lbl_UpdatePersonalInfoDeposit"),
					btnBar: (
						<div className="btnGroup">
							<Link
								className="btn-check"
								to={`/${userInfo.langId}/${path.profile.root}?from=${path.deposit.root}`}>
								{t("lbl_UpdatePersonalDetail")}
							</Link>
						</div>
					)
				});
			}
		}
	}, [userInfo]);

	return (
		<div className="subModuleList">
			<OnlineBankList />
			<LocalBankList />
			<MobilePayList />
		</div>
	);
};
