import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { defMenuLinks } from "./header.menu.def";
import LinkItems from "../common/linkItems";

export default ({ showSubMenu }) => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);

	return (
		<LinkItems
			defMenuLinks={defMenuLinks}
			t={t}
			showSubMenu={showSubMenu}
			langId={userInfo.langId}
			isLogin={userInfo.isLogin}
			checkMatchPage={true}
			toUpperCase={true}
		/>
	);
};
