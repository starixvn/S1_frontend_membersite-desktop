import React from "react";
import moment from "moment";
import { number_format } from "../common/common";

const statusClassName = {
	1: "pending",
	2: "pending",
	3: "pending",
	4: "pending",
	5: "cancel",
	6: "approved",
	7: "reject",
	8: "pending"
};

export const HistoryResult = props => {
	let btnGroup = null;
	if (props.status === 1 || props.status === 8) {
		btnGroup = (
			<button className="gray" onClick={props.ClickCancel}>
				{props.i18n("lbl_Cancel")}
			</button>
		);
	}

	return (
		<div>
			<div>{props.idx}</div>
			<div>
				{moment(props.createTime).format("DD/MM/YYYY")}
				<span className="txt-blue">
					{moment(props.createTime).format("HH:mm:ss")}
				</span>
			</div>
			<div>{props.transId}</div>
			<div>{number_format(props.amount, props._isConvert)}</div>
			<div className={statusClassName[props.status]}>
				{props.i18n(`lbl_WithdrawalStatus${props.status}`)}
				{/* { {props.status === 8
					? ""
					: props.i18n(`lbl_WithdrawalStatus${props.status}`)}} */}
			</div>
			<div className="btnGroup">{btnGroup}</div>
		</div>
	);
};
