import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { number_format } from "../common/common";

const statusClassName = {
	1: "pending",
	2: "pending",
	3: "approved",
	4: "reject",
	5: "cancel"
};

export const TransactionHistory = props => {
	const { t } = useTranslation();

	let btnGroup = null;
	if (props.status === 1) {
		btnGroup = (
			<button className="btn-cancel" onClick={props.ClickCancel}>
				{t("lbl_Cancel")}
			</button>
		);
	}
	return (
		<div>
			<div>{props.idx}</div>
			<div>
				{moment(props.createTime).format("DD/MM/YYYY")}
				<span className="txt-blue2">
					{moment(props.createTime).format("HH:mm:ss")}
				</span>
			</div>
			<div>{props.transId}</div>
			<div>{number_format(props.amount, props._isConvert)}</div>
			<div className={statusClassName[props.status]}>
				{props.status === 8
					? ""
					: t(`lbl_WithdrawalStatus${props.status}`)}
			</div>
			<div className="btnGroup">{btnGroup}</div>
		</div>
	);
};
