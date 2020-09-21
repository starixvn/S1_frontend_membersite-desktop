import React, { useContext } from "react";
import { Link } from "@reach/router";
import { userInfoContext } from "../common/context";
import { useTranslation } from "react-i18next";
import path from "../../path";
import DropdownHeader, { defElemType } from "../common/dropdown.headerLink";
import Wallet from "./header.wallet";
import { LOGOUT } from "../../service/auth";

export default () => {
	const { userInfo } = useContext(userInfoContext);
	return userInfo.isLogin === true ? (
		<AfterLogin />
	) : (
		<BeforeLogin langId={userInfo.langId} />
	);
};

const BeforeLogin = ({ langId }) => {
	const { t } = useTranslation();
	return (
		<>
			<Link to={`${langId}/${path.join.root}`} className="join">
				{t("lbl_JoinNow")}
			</Link>
			<Link to={`${langId}/${path.login.root}`} className="login">
				{t("lbl_Login")}
			</Link>
		</>
	);
};

const defCashierLinks = [
	{
		displayKey: "lbl_Deposit",
		href: path.deposit.root
	},
	{
		displayKey: "lbl_TransferFunds",
		href: path.transferFunds.root
	},
	{
		displayKey: "lbl_Withdrawal",
		href: path.withdrawal.root
	}
];

const defSettingLinks = ({ logoutFunc }) => {
	return [
		{
			displayKey: "lbl_Profile",
			href: path.profile.root
		},
		{
			displayKey: "lbl_BankInfo",
			href: path.bankInfo.root
		},
		{
			displayKey: "lbl_ChangePassword",
			href: path.changePassword.root
		},
		{
			displayKey: "lbl_Logout",
			href: logoutFunc,
			elemType: defElemType.btn,
			icon: "icon icon-exit"
		}
	];
};

const AfterLogin = () => {
	const { userInfo, setUserInfo } = useContext(userInfoContext);
	const { t } = useTranslation();

	const handleLogout = () => {
		LOGOUT(() => {
			setUserInfo(prevState => ({
				isLogin: false,
				langId: prevState.langId
			}));
		});
	};

	return (
		<>
			<DropdownHeader
				mainKey={`header-cashierLink`}
				langId={userInfo.langId}
				className="cashier icon icon-library"
				subClassName="submenu"
				i18n={t}
				options={defCashierLinks}
				placeholder={t("lbl_Cashier")}
			/>
			<Wallet langId={userInfo.langId} i18n={t} />
			<DropdownHeader
				mainKey={`header-settingLink`}
				langId={userInfo.langId}
				className="memberfile icon icon-member"
				subClassName="submenu"
				i18n={t}
				options={defSettingLinks({ logoutFunc: handleLogout })}
				placeholder={userInfo.userName}
			/>
		</>
	);
};
