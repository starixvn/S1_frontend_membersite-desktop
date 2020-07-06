import { siteRequest } from "./base";

export const api_site_ExistsUserName = ({ UserName }) =>
	siteRequest.post(`/ExistsUserName`, { UserName: UserName });

export const api_site_ExistsEmail = ({ Email }) =>
	siteRequest.post(`/ExistsEmail`, { Email: Email });

export const api_site_Register = data => siteRequest.post(`/Register/`, data);

export const api_site_GetSiteCurrencyList = () =>
	siteRequest.post(`/GetSiteCurrencyList/`);

export const api_site_GetSiteLangList = () =>
	siteRequest.post(`/GetSiteLangList/`);

export const api_site_CheckSignIn = () => siteRequest.post(`/CheckSignIn/`);

export const api_site_GetGamelist = () => siteRequest.post(`/GetGamelist`);

export const api_site_ForgetPwd = ({ Email }) =>
	siteRequest.post(`/ForgetPwd`, { Email: Email });

export const api_site_GetTpIds = () => siteRequest.post(`/GetTpIds`);

export const api_site_GetBanner = (FolderName, lang) =>
	siteRequest.post(`/GetBanner/${lang}`, `FolderName=${FolderName}`);
