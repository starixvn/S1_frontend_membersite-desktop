import React, { useEffect, useRef, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext } from "../common/context";
import { number_format, isConvert } from "../common/common";
import ReloadSpin from "../common/reloadSpin";

export default ({ balanceData, GetWithdrawalAvailableBalance }) => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const [realNameTip, setRealNameTip] = useState("");
	const _isConvert = isConvert(userInfo.currencyId);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const showRealNameTip = () => {
		let tip = realNameTip === "" ? t("lbl_ContactCSD") : "";
		setRealNameTip(tip);
	};

	return (
		<div className="walletModule">
			{userInfo.accountName ? (
				<div className="walletBalanceModule">
					<span className="icon icon-balance">
						{userInfo?.accountName}
					</span>
					<button
						className="icon icon-error"
						onClick={showRealNameTip}></button>
					<div className={`tip${realNameTip ? " active" : ""}`}>
						{realNameTip}
					</div>
				</div>
			) : null}
			<div className="walletBalanceModule">
				<span className="icon icon-balance">
					{t("lbl_EligibleWithdrawalAmount")}
				</span>
				<span>
					{number_format(balanceData?.availableBalance, _isConvert)}
				</span>
				<ReloadSpin
					func={GetWithdrawalAvailableBalance}
					btnActive={false}
				/>
			</div>
		</div>
	);
};
