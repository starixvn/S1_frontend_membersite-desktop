import { siteRequest } from "./base";

export const api_site_ExistsUserName = ({ UserName }) =>
	siteRequest.post(`/ExistsUserName`, { UserName: UserName });

export const api_site_ExistsEmail = ({ Email }) =>
	siteRequest.post(`/ExistsEmail`, { Email: Email });

// export const api_site_Register = data => siteRequest.post(`/Register/`, data);
export const api_site_Signup = (data, langId) =>
	siteRequest.post(`/Signup/${langId}`, data);

export const api_site_GetSiteCurrencyList = () =>
	siteRequest.post(`/GetSiteCurrencyList/`);

export const api_site_GetSiteLangList = () =>
	siteRequest.post(`/GetSiteLangList/`);

export const api_site_CheckSignIn = () => siteRequest.post(`/CheckSignIn/`);

export const api_site_GetGamelist = () => siteRequest.post(`/GetGamelist`);

export const api_site_ForgetPwd = ({ Email }) =>
	siteRequest.post(`/ForgetPwdV2`, { Email: Email });

export const api_site_GetTpIds = () => siteRequest.post(`/GetTpIds`);

export const api_site_GetBanner = (
	FolderName,
	refId,
	lang,
	filterHideInHome = false
) =>
	siteRequest.post(
		`/GetBanner/${lang}`,
		`FolderName=${FolderName}&refId=${refId}&filterHideInHome=${filterHideInHome}`
	);

export const api_site_CheckResetPwdTokens = ({ key }) =>
	siteRequest.post(`/CheckResetPwdToken`, `key=${key}`);

export const api_site_GetCountryList = ({ langId }) =>
	siteRequest.post(`/GetCountryList/${langId}`);
