export const initValue = {
	username: "",
	password: "",
	phone: "",
	email: "",
	currency: null,
	termsCheck: false,
	ageCheck: false
};

export const initTip = {
	username: { checked: null, msg: "" },
	password: { checked: null, msg: "" },
	phone: { checked: null, msg: "" },
	email: { checked: null, msg: "" },
	currency: { checked: null, msg: "" },
	checkbox: { checked: null, msg: "" }
};

export const currencyToAreacode = {
	0: "MY",
	1: "TH",
	2: "CS",
	3: "ID",
	4: "VN"
};

export const passwordCheck = val => {
	let checked = true;
	let msg = "";

	const regx = /^[a-zA-Z0-9@$*!%#?&]*$/;
	if (val === "") {
		checked = false;
		msg = "msg_PasswordReq";
	} else if (val != null) {
		if (val.length < 6 || val.length > 18) {
			checked = false;
			msg = "msg_PasswordLength";
		} else if (!regx.test(val)) {
			checked = false;
			msg = "msg_PasswordVaildate";
		}
	}
	return { checked, msg };
};
