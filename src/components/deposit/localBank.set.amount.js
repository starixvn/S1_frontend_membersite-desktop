import React from "react";
import { useTranslation } from "react-i18next";
import { defActionType } from "./localBank.reducer";
import { checkAmount, getAmountTip } from "../common/common";
import Inputbox from "../common/inputbox";
import LimitTip from "./limitTip";
import config from "../../config";

export default ({ bankInfo, _isConvert, amount, dispatch, checked, tip }) => {
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
			bankInfo.minAmount,
			bankInfo.maxAmount,
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
			tip === "" ? getAmountTip(bankInfo.minAmount, _isConvert, t) : "";
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

	return (
		<div className="subModuleList">
			<div className="subModule">
				<form className="subModuleBody column">
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
						placeholder={t("lbl_DepositAmountReq")}
					/>
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
