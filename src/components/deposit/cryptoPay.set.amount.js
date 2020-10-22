import React from "react";
import { useTranslation } from "react-i18next";
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

	return (
		<div className="subModuleList">
			<div className="subModule">
				<form className="subModuleBody column">
					<div>
						<LimitTip
							minAmount={channelInfo.minAmount}
							maxAmount={channelInfo.maxAmount}
							displayTextLimit={"Limit"}
							displayTextUnLimit={"Unlimit"}
							_isConvert={_isConvert}
						/>
					</div>

					<div className="inputModuleRow">
						<Inputbox
							className="inputBox-white"
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

					{tip === "" ? (
						<div className="txt-orange tip active">
							{t("lbl_ExchangeRate")} :&nbsp;
							{channelInfo.sellRate?.toFixed(8)} &nbsp; (
							{t("lbl_ExchangeRateReferenceOnly")})
						</div>
					) : null}

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
