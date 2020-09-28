import React, { useContext } from "react";
import { number_format, checkAmount, getAmountTip } from "../common/common";
import { defActionType } from "./withdrawal.reducer";
import { popBoxContext, userInfoContext } from "../common/context";
import Inputbox from "../common/inputbox";
import { api_payment_WithdrawalReq } from "../../service/api/payment";
import { defPopBoxType } from "../common/popBox";
import CashBar from "./withdrawal.set.cashBar";

export default ({ dispatch, state, t, _isConvert }) => {
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);

	const EditAmount = value => {
		value = String(value).replace(/^(0+)|[^\d]+/g, "");

		ValidAmount(value);
		dispatch({
			type: defActionType.EDIT_AMOUNT,
			amount: value
		});
	};

	const ValidAmount = _amount => {
		let result = checkAmount(
			_amount,
			0,
			state.balanceData?.availableBalance,
			_isConvert,
			t
		);
		if (result.status !== 0) {
			dispatch({
				type: defActionType.CHECK_AMOUNT,
				checked: false,
				tip: result.msg
			});
		} else {
			dispatch({
				type: defActionType.CHECK_AMOUNT,
				checked: true,
				tip: ""
			});
		}
		return result.status === 0;
	};

	const clickInfo = () => {
		let _msg =
			state.tip === "" || !state.tip
				? getAmountTip(0, _isConvert, t)
				: "";
		dispatch({
			type: defActionType.CHECK_AMOUNT,
			checked: null,
			tip: _msg
		});
	};

	const ClosePopBox = () => {
		setPopBox({ isOpen: false });
	};

	const clickSubmit = () => {
		let amountChecked = ValidAmount(state.amount);

		if (state.selectedAccount.accountNo && amountChecked) {
			dispatch({ type: defActionType.TO_OTHER_PANEL, panel: "confirm" });
		} else if (!state.selectedAccount.accountNo) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ErrorMsg,
				message: t("lbl_SelectBank_Required"),
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={ClosePopBox}>
							{t("lbl_Close")}
						</button>
					</div>
				)
			});
		}
	};

	return (
		<div className="subModule">
			<div className="subModuleBody">
				<div className="calculation">
					<div>
						<div>{t("lbl_Balance")}</div>
						<div>
							{t(`Currency_${userInfo.currencyId}`)}
							<span>
								{number_format(
									state.balanceData?.balance,
									_isConvert
								)}
							</span>
						</div>
					</div>
					<div>-</div>
					<div>
						<div>{t("lbl_Deduction")}</div>
						<div>
							{t(`Currency_${userInfo.currencyId}`)}
							<span>
								{number_format(
									state.balanceData?.deduction,
									_isConvert
								)}
							</span>
						</div>
					</div>
					<div>=</div>
					<div>
						<div>{t("lbl_EligibleWithdrawalAmount")}</div>
						<div>
							{t(`Currency_${userInfo.currencyId}`)}
							<span>
								{number_format(
									state.balanceData?.availableBalance,
									_isConvert
								)}
							</span>
						</div>
					</div>
				</div>
				<CashBar
					onChangeAmount={EditAmount}
					amountValue={state.amount ?? 0}
					availableBalance={state.balanceData?.availableBalance}
					_isConvert={_isConvert}
				/>
				<div className="inputModuleRow">
					<Inputbox
						className="inputBox-white"
						value={state.amount}
						onChange={e => EditAmount(e.target.value)}
						clickInfo={clickInfo}
						title={t("lbl_Amount")}
						checked={state.checked ?? null}
						tip={state.tip}
						_isConvert={_isConvert}
						onBlur={ValidAmount.bind(this, state.amount)}
					/>
					<div className="btnGroup">
						<button
							className={state.checked ? "btn-check" : "gray"}
							disabled={!state.checked}
							onClick={clickSubmit}>
							{t("lbl_Submit")}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
