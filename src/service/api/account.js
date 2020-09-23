import { loginRequest } from "./base";
import { accountRequest } from "./base";

export const api_account_SetLanguage = lang =>
	accountRequest.post("/SetLanguage", { LangId: lang });

export const api_account_UserLogout = () => accountRequest.post("/SignOut");

export const api_account_UserLogin = data => loginRequest.post("/SignIn", data);

export const api_account_onlineCheck = () =>
	accountRequest.post("/onlineCheck");

export const api_account_GetBalnace = () => accountRequest.post("/GetBalance");

export const api_account_GetCustBankInfo = () =>
	accountRequest.post("/GetCustBankInfo");

export const api_account_GetMsgList = ({ PageNumber }) =>
	accountRequest.post("/GetMsgList", { PageNumber });

export const api_account_GetMsgContent = MsgId =>
	accountRequest.post("/GetMsgContent", {
		MsgId: MsgId
	});

export const api_account_DelMsg = MsgIds =>
	accountRequest.post("/DelMsg", { MsgIds: MsgIds });

export const api_account_GetWalletInfo = () =>
	accountRequest.post("/GetWalletInfo");

export const api_account_GetWithdrawalAvailableBalance = () =>
	accountRequest.post("/GetWithdrawalAvailableBalance");

export const api_account_SetFavoriteGame = (ProviderId, GameId, IsRemove) =>
	accountRequest.post(`/SetFavoriteGame`, { ProviderId, GameId, IsRemove });

export const api_account_GetFavoriteGame = () =>
	accountRequest.post("/GetFavoriteGame");

export const api_account_GetMsgCount = () =>
	accountRequest.post("/GetMsgCount");

export const api_account_ChangePassword = ({ OldPassword, NewPassword }) =>
	accountRequest.post("/ChangePassword", { OldPassword, NewPassword });

export const api_account_GetCustSpecificBonus = ({
	BonusCode,
	TpId,
	PromoCategoryId
}) =>
	accountRequest.post("/GetCustSpecificBonus", {
		BonusCode,
		TpId,
		PromoCategoryId
	});
