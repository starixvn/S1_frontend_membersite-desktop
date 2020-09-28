import React from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import LimitTip from "./limitTip";
import { defActionType } from "./mobilePay.reducer";
import { checkAmount, getAmountTip, number_format } from "../common/common";
import Inputbox from "../common/inputbox";

export default ({
	channelInfo,
	_isConvert,
	amount,
	dispatch,
	checked,
	tip
}) => {
	const { t } = useTranslation();
	const EditAmount = e => {
		let value = e.target.value;
		value = value.replace(/^(0+)|[^\d]+/g, "");

		ValidAmount(value);
		dispatch({ type: defActionType.EDIT_AMOUNT, amount: value });
	};

	const ValidAmount = _amount => {
		let result = checkAmount(
			_amount,
			channelInfo.minAmount,
			channelInfo.maxAmount,
			_isConvert,
			t
		);
		if (result.status !== 0) {
			dispatch({
				type: defActionType.SET_CHECK_STATUS,
				checked: false,
				tip: result.msg
			});
		} else {
			dispatch({
				type: defActionType.SET_CHECK_STATUS,
				checked: true,
				tip: ""
			});
		}
		return result.status === 0;
	};

	const clickInfo = () => {
		let _msg =
			tip === ""
				? getAmountTip(channelInfo.minAmount, _isConvert, t)
				: "";
		dispatch({
			type: defActionType.SET_CHECK_STATUS,
			checked: null,
			tip: _msg
		});
	};

	const SubmitAmount = e => {
		e.preventDefault();

		let result = ValidAmount(amount);
		if (result) {
			dispatch({ type: defActionType.SUBMIT_AMOUNT });
		}
	};

	const SelectAmount = (amount, e) => {
		e.preventDefault();
		ValidAmount(amount);
		dispatch({ type: defActionType.EDIT_AMOUNT, amount: amount });
	};

	const typeIsSelAmount = channelInfo.amountRule === 3;

	return (
		<div className="subModuleList">
			<div className="subModule">
				<form className="subModuleBody column">
					<div>
						<div className="bankName">
							<img
								src={`${config.imgUrl}/common/images/MobilePay/${channelInfo.groupName}.png`}
								alt={channelInfo.groupName}
							/>
						</div>
						<LimitTip
							minAmount={channelInfo.minAmount}
							maxAmount={channelInfo.maxAmount}
							displayTextLimit={"Limit"}
							displayTextUnLimit={"Unlimit"}
							_isConvert={_isConvert}
						/>
					</div>

					{typeIsSelAmount ? (
						<FixedAmountList
							{...channelInfo}
							_isConvert={_isConvert}
							onSelectAmount={SelectAmount}
							amount={amount}
						/>
					) : null}
					<div className="inputModuleRow">
						<Inputbox
							className="inputBox-white"
							readOnly={typeIsSelAmount}
							title={t("lbl_Amount")}
							value={amount}
							onChange={EditAmount}
							onBlur={ValidAmount.bind(this, amount)}
							clickInfo={clickInfo}
							checked={checked}
							tip={tip}
							_isConvert={_isConvert}
							isAmount={true}
						/>
					</div>
					<div className="btnGroup">
						<button
							className={`${checked ? "btn-check" : "darkGray"}`}
							onClick={SubmitAmount}>
							{t("lbl_Submit")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const FixedAmountList = ({
	minAmount,
	maxAmount,
	amountList,
	_isConvert,
	amount,
	onSelectAmount
}) => {
	let rows = amountList
		?.filter(a => a >= minAmount && a <= maxAmount)
		.map(a => {
			let _afterConvertAmount = _isConvert ? a / 1000 : a;
			let isSelected = amount === _afterConvertAmount;

			return (
				<button
					onClick={onSelectAmount.bind(this, _afterConvertAmount)}
					className={`blue${isSelected ? " active" : ""}`}
					key={`deposit-mobile-${a}`}>
					{number_format(a, _isConvert)}
					<i className="icon icon-checkmark"></i>
				</button>
			);
		});
	return <div className="btnGroup buttonBox">{rows}</div>;
};
