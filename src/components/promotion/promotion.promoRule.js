import React from "react";
import moment from "moment";
import { promoStatus } from "./promotion.def";
import { number_format } from "../common/common";

export default ({ promotionInfo, t }) => {
	const {
		isJoin,
		status,
		custExpiryTime,
		periodTo,
		requiredAmount,
		rollOver
	} = promotionInfo;

	let _expiryTime = moment.unix(
		isJoin && status === promoStatus.running && custExpiryTime
			? moment(custExpiryTime).unix()
			: periodTo
	);

	let diffDays = Math.ceil(
		moment.duration(_expiryTime.diff(moment())).asDays() - 1
	);

	let expiryTime = moment.duration(_expiryTime.diff(new Date()));

	let displayExpiryTime =
		diffDays +
		" " +
		t("lbl_Days") +
		" " +
		expiryTime.hours() +
		" " +
		t("lbl_Hours");

	return (
		<div className="rollover">
			<div>
				{requiredAmount > 0 ? (
					<div className="icon icon-icon32px_money">
						{t("lbl_MinAmount")}
					</div>
				) : null}
				<div className="icon icon-icon32px_time">
					{t("lbl_RemainingTime")}
				</div>
				<div className="icon icon-icon32px_">{t("lbl_RollOver")}</div>
			</div>
			<div className="txt-orange">
				{requiredAmount > 0 ? (
					<div>{number_format(requiredAmount)}</div>
				) : null}
				<div>{displayExpiryTime}</div>
				<div>{rollOver ? rollOver : 1}X</div>
			</div>
		</div>
	);
};
