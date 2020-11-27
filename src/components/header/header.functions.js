import React, { useContext } from "react";
import { Link } from "@reach/router";
import {
	userInfoContext,
	popBoxContext,
	msgCountContext
} from "../common/context";
import { useTranslation } from "react-i18next";
import path from "../../path";
import DropdownHeader from "../common/dropdown.headerLink";
import Wallet from "./header.wallet";
import { defPopBoxType } from "../common/popBox";

export default () => {
	const { userInfo } = useContext(userInfoContext);

	return userInfo.isLogin === true ? (
		<AfterLogin />
	) : (
		<BeforeLogin langId={userInfo.langId} />
	);
};

const BeforeLogin = () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);

	const clickJoin = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Join
		});
	};

	const clickLogin = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Login
		});
	};

	return (
		<>
			<button className="join" onClick={clickJoin}>
				{t("lbl_JoinNow")}
			</button>
			<button className="login" onClick={clickLogin}>
				{t("lbl_Login")}
			</button>
		</>
	);
};

const defCashierLinks = [
	{
		displayKey: "lbl_TransferFunds",
		href: path.transferFunds.root
	},
	{
		displayKey: "lbl_Withdrawal",
		href: path.withdrawal.root
	},
	{
		displayKey: "lbl_TransferHistory",
		href: path.transferHistory.root
	},
	{
		displayKey: "lbl_Statement",
		href: path.statement.root
	},
	{
		displayKey: "lbl_Deposit",
		href: path.deposit.root
	}
];

const defSettingLinks = [
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
	}
];

const AfterLogin = () => {
	const { msgCount } = useContext(msgCountContext);
	const { userInfo } = useContext(userInfoContext);
	const { t } = useTranslation();

	const navMenu = defCashierLinks.map(item => (
		<Link key={item.displayKey} to={`/${userInfo.langId}/${item.href}`}>
			<span>{t(item.displayKey)}</span>
		</Link>
	));

	return (
		<>
			{navMenu}
			<Wallet i18n={t} />
			<DropdownHeader
				mainKey={`header-settingLink`}
				langId={userInfo.langId}
				className="memberfile icon icon-member"
				subClassName="submenu"
				i18n={t}
				options={defSettingLinks}
				placeholder={userInfo.userName}
			/>
			<Link
				className={`icon icon-email${msgCount > 0 ? " active" : ""}`}
				to={`/${userInfo.langId}/${path.message.root}`}></Link>
		</>
	);
};
