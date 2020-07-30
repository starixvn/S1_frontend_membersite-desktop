import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { number_format, isConvert } from "../common/common";

const statusClassName = {
	1: "pending",
	2: "paid",
	3: "approved",
	4: "reject",
	5: "cancel"
};

export const TransactionHistory = props => {
	const { t } = useTranslation();

	let btnGroup = null;
	if (props.depositType === 3 && (props.status === 1 || props.status === 7)) {
		btnGroup = (
			<div className="btnGroup">
				<button
					className="orange icon icon-pencil"
					onClick={props.SubmitProof}>
					{t("lbl_SubmitProof")}
				</button>
				<button className="gray" onClick={props.ClickCancel}>
					{t("lbl_Cancel")}
				</button>
			</div>
		);
	}

	return (
		<div>
			<div>{props.idx}</div>
			<div>
				{moment(props.createTime).format("MM/DD/YYYY")}
				<span className="txt-blue">
					{moment(props.createTime).format("hh:mm:ss A")}
				</span>
			</div>
			<div>{props.transId}</div>
			<div>{t(`lbl_DepositType${props.depositType}`)}</div>
			<div>{number_format(props.amount, props._isConvert)}</div>
			<div className={statusClassName[props.status]}>
				{t(`lbl_DepositStatus${props.status}`)}
			</div>
			<div className="btnGroup">{btnGroup}</div>
		</div>
	);
};
