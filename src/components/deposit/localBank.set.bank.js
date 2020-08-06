import React from "react";
import config from "../../config";
import { defActionType } from "./localBank.reducer";

export default ({ bankList, dispatch }) => {
	const SelectBank = bankIdx => {
		dispatch({ type: defActionType.SELECT_BANK, bankIdx });
	};

	let rows = bankList.map((b, bIdx) => {
		return (
			<li key={`localBank-selBank-${b.sysId}`}>
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
