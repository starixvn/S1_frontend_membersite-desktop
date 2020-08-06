import React from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./onlineBank.reducer";
import { checkAmount } from "../common/common";
import LimitTip from "./limitTip";
import config from "../../config";

export default ({ bankInfo, _isConvert, amount, dispatch }) => {
	const { t } = useTranslation();

	const EditAmount = e => {
		let value = e.target.value;
		ValidAmount(value);
		dispatch({ type: defActionType.EDIT_AMOUNT, amount: value });
	};

	const ValidAmount = _amount => {
		let result = checkAmount(
			_amount,
			bankInfo.minAmount,
			bankInfo.maxAmount,
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
		let result = ValidAmount(amount);
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
							src={`${config.imgUrl}/common/images/BankLogo/${bankInfo.bankLogo}`}
							alt={bankInfo.bankName}
						/>
					</div>
					<LimitTip
						minAmount={bankInfo.minAmount}
						maxAmount={bankInfo.maxAmount}
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
