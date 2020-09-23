import React from "react";
import moment from "moment";
import { number_format } from "../common/common";

export const TransactionHistory = props => {
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
			<div>
				<span className="txt-blue">{props.startWallet}</span>
				<i className="icon icon-keyboard_arrow_right"></i>
				{props.endWallet}
			</div>
			<div>{number_format(props.amount, props._isConvert)}</div>
			<div className={props.statusColor}>{props.status}</div>
		</div>
	);
};
