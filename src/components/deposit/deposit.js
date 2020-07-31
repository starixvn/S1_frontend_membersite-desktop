import React from "react";
import LocalBankList from "./localBank.list";
import OnlineBankList from "./onlineBank.list";
import MobilePayList from "./mobilePay.list";

export default () => {
	return (
		<div className="subModuleList">
			<OnlineBankList />
			<LocalBankList />
			<MobilePayList />
		</div>
	);
};
