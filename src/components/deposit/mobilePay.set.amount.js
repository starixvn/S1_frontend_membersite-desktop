import React from "react";
import { useTranslation } from "react-i18next";
import config from "../../config";
import LimitTip from "./limitTip";
import { defActionType } from "./mobilePay.reducer";
import { checkAmount } from "../common/common";

export default ({ channelInfo, _isConvert, amount, dispatch }) => {
	const { t } = useTranslation();
	const EditAmount = e => {
		let value = e.target.value;
		VaildAmount(value);
		dispatch({ type: defActionType.EDIT_AMOUNT, amount: value });
	};

	const VaildAmount = _amount => {
		let result = checkAmount(
			_amount,
			channelInfo.minAmount,
			channelInfo.maxAmount,
			_isConvert,
			t
		);
		if (result.status !== 0) {
			// setWarning({
			// 	status: true,
			// 	msg: result.msg
			// });
		} else {
			// setWarning({
			// 	status: false,
			// 	msg: ""
			// });
		}
		return result.status === 0;
	};

	const SubmitAmount = () => {
		let result = VaildAmount(amount);
		if (result) {
			dispatch({ type: defActionType.SUBMIT_AMOUNT });
		}
	};

	return (
		<div className="subModule">
			<div className="subModuleBody column">
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
				<div className="inputBox-white">
					<i className="Amount"></i>
					<input
						placeholder="Please Enter The Deposit Amount"
						defaultValue={amount}
						onBlur={EditAmount}
					/>
					<i className="rate"></i>
				</div>
				<div className="btnGroup">
					<button className="darkGray" onClick={SubmitAmount}>
						{t("lbl_Submit")}
					</button>
				</div>
			</div>
		</div>
	);
};
