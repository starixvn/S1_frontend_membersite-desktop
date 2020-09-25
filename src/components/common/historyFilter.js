import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Dropdown from "./dropdown";
import DateTime from "react-datetime";

const quickPickList = [
	{ id: 0, displayKey: "lbl_Today" },
	{ id: 1, displayKey: "lbl_YesterDay" },
	{ id: 2, displayKey: "lbl_ThisWeek" },
	{ id: 3, displayKey: "lbl_LastWeek" },
	{ id: 4, displayKey: "lbl_ThisMonth" },
	{ id: 5, displayKey: "lbl_LastMonth" }
];

export default props => {
	const { t } = useTranslation();

	const initQuickPick = props.keepData?.quickPick ?? 0;
	const [selectedIdx, setSelectedIdx] = useState(initQuickPick);

	const today = moment().format("YYYY-MM-DD");
	const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");

	const initStartDate = props.keepData?.startDate ?? today;
	const initEndDate = props.keepData?.endDate ?? today;

	const [startDate, setStartDate] = useState(initStartDate);
	const [endDate, setEndtDate] = useState(initEndDate);

	let _startDate = "";
	let _endDate = "";

	const start_valid = current => {
		return current.isBefore(endDate);
	};

	const end_valid = current => {
		return current.isBefore(tomorrow) && current.isAfter(startDate);
	};

	const onSelectItem = i => {
		setSelectedIdx(i);

		if (quickPickList[i].displayKey === "lbl_Today") {
			_startDate = moment().format("YYYY-MM-DD");
			_endDate = moment().format("YYYY-MM-DD");
		} else if (quickPickList[i].displayKey === "lbl_YesterDay") {
			_startDate = moment().subtract(1, "days").format("YYYY-MM-DD");
			_endDate = moment().subtract(1, "days").format("YYYY-MM-DD");
		} else if (quickPickList[i].displayKey === "lbl_ThisWeek") {
			_startDate = moment().startOf("week").format("YYYY-MM-DD");
			_endDate = moment().format("YYYY-MM-DD");
		} else if (quickPickList[i].displayKey === "lbl_LastWeek") {
			_startDate = moment()
				.subtract(1, "weeks")
				.startOf("week")
				.format("YYYY-MM-DD");
			_endDate = moment()
				.subtract(1, "weeks")
				.endOf("week")
				.format("YYYY-MM-DD");
		} else if (quickPickList[i].displayKey === "lbl_ThisMonth") {
			_startDate = moment().startOf("month").format("YYYY-MM-DD");
			_endDate = moment().format("YYYY-MM-DD");
		} else if (quickPickList[i].displayKey === "lbl_LastMonth") {
			_startDate = moment()
				.subtract(1, "months")
				.startOf("month")
				.format("YYYY-MM-DD");
			_endDate = moment()
				.subtract(1, "months")
				.endOf("month")
				.format("YYYY-MM-DD");
		}

		setStartDate(_startDate);
		setEndtDate(_endDate);
	};

	const onChangeDate = (col, val) => {
		let _val = moment.isMoment(val) ? val : moment(val);
		if (moment.isMoment(_val) && _val.isValid()) {
			col === "start" ? setStartDate(_val) : setEndtDate(_val);
		}
	};

	return (
		<div className="quickSelect">
			<div>
				<div className="inputBox-blue">
					<i className="txt-blue">{t("lbl_QuickPick")}</i>
					<Dropdown
						i18n={t}
						mainKey="history_"
						options={quickPickList}
						selectedIdx={selectedIdx}
						onSelectItem={onSelectItem}
					/>
				</div>
			</div>

			<div className="inputBox-blue">
				<DateTime
					value={moment(startDate).format("YYYY-MM-DD")}
					onChange={onChangeDate.bind(this, "start")}
					timeFormat={false}
					isValidDate={start_valid}
				/>
				<div className="iconModule">
					<i className="icon icon-calendar"></i>
				</div>
			</div>

			<div className="inputBox-blue">
				<DateTime
					value={moment(endDate).format("YYYY-MM-DD")}
					onChange={onChangeDate.bind(this, "end")}
					timeFormat={false}
					isValidDate={end_valid}
				/>
				<div className="iconModule">
					<i className="icon icon-calendar"></i>
				</div>
			</div>

			<div className="btnGroup">
				<button
					className="btn-check"
					onClick={props.submitHandler.bind(
						this,
						startDate,
						endDate,
						false,
						selectedIdx
					)}>
					{t("lbl_Submit")}
				</button>
			</div>
		</div>
	);
};
