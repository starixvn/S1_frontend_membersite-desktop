import { api_account_UserLogin } from "../service/api/account";
import { api_accountStrict_GetCustProfile } from "../service/api/accountStrict";

const isBrowser = typeof window !== `undefined`;

export const LOGIN = async ({ userName, password }, CallbackLogin) => {
	if (!isBrowser) return false;

	await api_account_UserLogin({
		UserName: userName,
		Userpwd: password,
		isPersistent: true
	}).then(
		res => {
			if (res.data.errorCode === 0) {
				let userlangId = res.data.message.replace("/", "");

				api_accountStrict_GetCustProfile().then(res_custInfo => {
					let _loginUser = {
						userName: userName,
						langId: userlangId,
						isLogin: true
					};

					if (res_custInfo.data.errorCode === 0) {
						let data = res_custInfo.data.data;
						_loginUser = {
							..._loginUser,
							...data
						};
					}
					CallbackLogin(res.data.errorCode, "", true, _loginUser);
				});
			} else {
				CallbackLogin(res.data.errorCode, res.data.message, false, {});
			}
		},
		err => {
			CallbackLogin(999, "", false, {});
		}
	);
	return false;
};
