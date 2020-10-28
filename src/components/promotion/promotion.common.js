import React from "react";
import moment from "moment";
import { promoStatus, defPromotionType } from "./promotion.def";
import { defPopBoxType } from "../common/popBox";
import { Link } from "@reach/router";
import path from "../../path";
import { isConvert, number_format } from "../../components/common/common";

export const isArrayNotEmpty = arr => {
	return Array.isArray(arr) && arr.length;
};

export const isExpiry = ({
	periodTo,
	custExpiryTime,
	isLogin,
	isJoin,
	status,
	promotionType
}) => {
	let bonusExpiry = false;
	if (
		isLogin &&
		isJoin &&
		promotionType !== defPromotionType.rebate &&
		promotionType !== defPromotionType.cashback
	) {
		bonusExpiry =
			moment(moment.unix(custExpiryTime)).isBefore(new moment()) ||
			(status !== promoStatus.running &&
				status !== promoStatus.TransferOut);
	}

	return moment(moment.unix(periodTo)).isBefore(new moment()) || bonusExpiry;
};

export const isNew = ({ periodFrom }) => {
	return moment(moment.unix(periodFrom)).isAfter(
		new moment().add(-14, "days")
	);
};

export const isClaimed = ({ isJoin, status }) => {
	return (
		isJoin ||
		status === promoStatus.running ||
		status === promoStatus.TransferOut
	);
};

export const checkPromotion = ({ promotionInfo, userInfo, setPopBox, t }) => {
	const {
		canJoin,
		isJoin,
		result,
		requiredAmount,
		depositAmount,
		bonusCode
	} = promotionInfo;

	const {
		isLogin,
		currencyId,
		accountName,
		phoneNo,
		email,
		langId
	} = userInfo;

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	if (isLogin === false)
		return setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Login
		});

	if (currencyId && (!accountName || !phoneNo || !email))
		return setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.UpdateProfile,
			title: t("lbl_ImportantNote"),
			content: t("lbl_UpdatePersonalInfoPromotion"),
			btnBar: (
				<div className="btnGroup">
					<Link
						className="btn-check"
						to={`/${langId}/${path.profile.root}?prevPage=${path.promotion.root}&BonusCode=${bonusCode}`}>
						{t("lbl_UpdatePersonalDetail")}
					</Link>
				</div>
			)
		});

	if (canJoin && !isJoin && result === 1 && requiredAmount > 0) {
		let lessAmount = number_format(
			requiredAmount - depositAmount,
			isConvert(currencyId)
		);
		let _currency = t(`Currency_${currencyId}`);
		let hint = `${_currency} ${lessAmount}$`;

		return setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.PromotionDepositConfirm,
			hint,
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={clickClose}>
						{t("lbl_Later")}
					</button>
					<Link
						to={`/${langId}/${path.deposit.root}`}
						type="button"
						className="btn-check">
						{t("lbl_DepositNow")}
					</Link>
				</div>
			)
		});
	}

	return true;
};
