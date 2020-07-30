import React from "react";
import LocalBankList from "./deposit.localBank.list";
import OnlineBankList from "./deposit.onlineBank.list";
import MobilePayList from "./deposit.mobilePay.list";

export default () => {
	return (
		<div className="subModuleList">
			<OnlineBankList />
			<LocalBankList />
			<MobilePayList />
		</div>
	);
};
