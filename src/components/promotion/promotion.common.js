import moment from "moment";
import { promoStatus } from "./promotion.def";

export const isArrayNotEmpty = arr => {
	return Array.isArray(arr) && arr.length;
};

export const isExpiry = ({
	periodTo,
	custExpiryTime,
	isLogin,
	isJoin,
	status
}) => {
	let bonusExpiry = false;
	if (isLogin && isJoin) {
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
