import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import DropdownHeader, { defElemType } from "../common/dropdown.headerLink";
import { userInfoContext } from "../common/context";
import { Redirect } from "@reach/router";

const defLangList = ({ handleLanguage }) => [
	{
		href: handleLanguage,
		elemType: defElemType.btn,
		icon: "flag cs",
		value: "cs"
	},
	{
		href: handleLanguage,
		elemType: defElemType.btn,
		icon: "flag en",
		value: "en"
	},
	{
		href: handleLanguage,
		elemType: defElemType.btn,
		icon: "flag th",
		value: "th"
	},
	{
		href: handleLanguage,
		elemType: defElemType.btn,
		icon: "flag id",
		value: "id"
	}
];

const SetReplaceChar = (str, idx, newChar) => {
	return `${str.substr(0, idx)}${newChar}${str.substr(idx + newChar.length)}`;
};

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const [redirectPath, setRedirectPath] = useState(null);

	const handleLanguage = value => {
		let url =
			window.location.pathname +
			window.location.search +
			window.location.hash;
		let newPathArr = SetReplaceChar(url, 1, value);
		setRedirectPath(newPathArr);
	};

	return redirectPath === null ? (
		<DropdownHeader
			mainKey={`header-langList`}
			langId={userInfo.langId}
			className="country"
			subClassName="countryList"
			i18n={t}
			options={defLangList({ handleLanguage: handleLanguage })}
			placeholder={{
				icon: `flag ${userInfo.langId}`,
				elemType: defElemType.btn
			}}
		/>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
