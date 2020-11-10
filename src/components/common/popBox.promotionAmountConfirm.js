import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { number_format, checkAmount, _isConvert } from "../common/common";

export default ({ langId, promotionInfo, clickClose, setClaimPromotion }) => {
	const { t } = useTranslation();
	const [amount, setAmount] = useState(null);
	const [validationError, setValidationError] = useState({});
	const { bonusCode, requiredAmount, maxAmount } = promotionInfo;

	const onSetClaimPromotion = () => {
		if (validationError.status !== 0) return;

		setClaimPromotion(langId, bonusCode, amount);
	};

	const validAmount = _amount => {
		let result = checkAmount(
			_amount,
			requiredAmount,
			maxAmount,
			_isConvert,
			t
		);
		setValidationError(result);
	};

	useEffect(() => {
		setAmount(String(amount).replace(/^(0+)|[^\d]+/g, ""));
	}, [amount]);

	return (
		<div className="loackAmount" style={{ display: "flex" }}>
			<div className="icon icon-gift"></div>
			<div className="title">{t("lbl_ImportantNote")}</div>
			<div className="txt-lightgray">
				{t("lbl_PleaseEnterClaimAmount")}
			</div>
			<div className="inputBox-white">
				<input
					autoFocus
					value={amount}
					onBlur={() => validAmount(amount)}
					onChange={e => setAmount(e.target.value)}
				/>
			</div>

			<div
				className={`tip ${
					validationError.status !== 0 ? "active" : ""
				}`}>
				{validationError.msg}
			</div>

			<div className="txt-orange">
				{`${t("lbl_ClaimAmountRange")}: 
				 ${number_format(requiredAmount, _isConvert)} ~ 
				 ${number_format(maxAmount, _isConvert)}`}
			</div>

			<div className="btnGroup">
				<button className="btn-cancel" onClick={clickClose}>
					{t("lbl_Cancel")}
				</button>
				<button className="orange" onClick={onSetClaimPromotion}>
					{t("lbl_PromoJoinNow")}
				</button>
			</div>
		</div>
	);
};
