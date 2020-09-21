import React, { useContext, useState, useEffect, useRef } from "react";
import DropdownHeader from "../common/dropdown.langList";
import { userInfoContext } from "../common/context";
import { Redirect } from "@reach/router";

export default () => {
	const { userInfo } = useContext(userInfoContext);
	const [redirectPath] = useState(null);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	return redirectPath === null ? (
		<DropdownHeader
			mainKey={`header-langList`}
			className="country"
			subClassName="countryList"
			selectedValue={userInfo.langId}
			isLogin={userInfo.isLogin}
		/>
	) : (
		<Redirect to={redirectPath} noThrow />
	);
};
