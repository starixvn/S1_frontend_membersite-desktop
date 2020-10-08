export const getUrlParameter = name => {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)", "i");
	if (typeof window !== `undefined`) {
		var results = regex.exec(window.location.search);
		return results === null
			? ""
			: decodeURIComponent(results[1].replace(/\+/g, " "));
	}
};

export const number_format = (n, IsConvertRequired = false) => {
	if (!isNaN(n)) {
		if (IsConvertRequired) {
			n /= 1000;
		}
		n = Number(n).toFixed(2);
	}

	n += "";
	var arr = n.split(".");
	var re = /(\d{1,3})(?=(\d{3})+$)/g;
	return (
		arr[0].replace(re, "$1,") +
		(arr.length == 2 ? "." + arr[1] : "") +
		(IsConvertRequired ? " ('000)" : "")
	);
};

const _isConvertList = {
	51: true,
	15: true
};

export const isConvert = currencyId => {
	return _isConvertList[currencyId] === true;
};

export const checkAmount = (amount, minAmount, maxAmount, _isConvert, i18n) => {
	let status = 0;
	let msg = "";
	if (amount !== null && amount !== undefined) {
		let num_Amount = isNaN(amount) ? 0 : Number(amount);
		if (_isConvert) {
			num_Amount *= 1000;
		}
		if (num_Amount <= 0) {
			status = 2;
			msg = i18n("lbl_AmountTooltip")?.replace("{0}", minAmount);
		} else if (
			minAmount !== 0 &&
			maxAmount !== 0 &&
			(num_Amount > maxAmount || num_Amount < minAmount)
		) {
			status = 2;
			msg =
				number_format(num_Amount, _isConvert) +
				" " +
				i18n("lbl_NotinLimit");
		}
	} else {
		status = 3;
		msg = i18n("lbl_NotinLimit");
	}

	return { status: status, msg: msg };
};

export const getAmountTip = (minAmount, _isConvert, i18n) => {
	return isNaN(minAmount)
		? i18n("lbl_AmountTooltip")?.replace("{0}", 0)
		: i18n("lbl_AmountTooltip")?.replace(
				"{0}",
				number_format(minAmount, _isConvert)
		  );
};

export const setCookie = (cookieName, cookieValue, exdays) => {
	let d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	var expires = "expires=" + d.toUTCString();
	if (typeof document !== `undefined`) {
		document.cookie =
			cookieName + "=" + cookieValue + ";" + expires + ";path=/";
	}
};

export const readCookie = cookieName => {
	if (typeof document !== `undefined`) {
		let match = document.cookie.match(
			new RegExp("(^| )" + cookieName + "=([^;]+)")
		);
		return match ? match[2] : null;
	} else {
		return null;
	}
};

export const deleteCookie = cookieName => {
	if (typeof document !== `undefined`) {
		document.cookie =
			cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	}
};

const SetReplaceChar = (str, idx, newChar) => {
	return `${str.substr(0, idx)}${newChar}${str.substr(idx + newChar.length)}`;
};

export const getNewLanguagePath = langId => {
	let url =
		window.location.pathname +
		window.location.search +
		window.location.hash;
	return SetReplaceChar(url, 1, langId);
};
