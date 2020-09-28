import React from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./bankInfo.reducer";

export default ({ dispatch, numberOfAccount }) => {
	const { t } = useTranslation();
	const toNextStep = () => {
		dispatch({ type: defActionType.TO_NEXT_STEP });
	};

	return (
		<div className="walletModule">
			<div className="addBank">
				{numberOfAccount < 3 ? (
					<div className="addBankName noBank" onClick={toNextStep}>
						<div className="icon icon-plus"></div>
						<div>{t("lbl_AddBankAccount")}</div>
					</div>
				) : null
				// <div className="addBankName noBank">
				// 	<div className="icon icon-warning"></div>
				// 	<div>{t("lbl_BankCardsFull")}</div>
				// </div>
				}

				<div className="remainder">
					{t("lbl_NumberOfBankAccounts")}:{" "}
					{numberOfAccount ? numberOfAccount : 0}/3
				</div>
			</div>
		</div>
	);
};
