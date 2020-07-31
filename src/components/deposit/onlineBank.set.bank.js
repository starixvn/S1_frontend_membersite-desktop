import React from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import { defActionType } from "./onlineBank.reducer";

export default ({ bankList, dispatch }) => {
	const { t } = useTranslation();

	const SelectBank = bankIdx => {
		dispatch({ type: defActionType.SELECT_BANK, bankIdx });
	};

	let rows = bankList.map((b, bIdx) => {
		return (
			<li key={`onlineBank-selBank-${b.sysId}`}>
				<a onClick={SelectBank.bind(this, bIdx)}>
					<img
						src={`${config.imgUrl}/common/images/BankLogo/${b.bankLogo}`}
						alt={b.bankName}
					/>
				</a>
			</li>
		);
	});

	return (
		<div className="subModuleList">
			<div className="subModule">
				<div className="subModuleBody">
					<ul>{rows}</ul>
				</div>
			</div>
		</div>
	);
};
