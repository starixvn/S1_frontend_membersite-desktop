import { tpRequest } from "./base";

export const api_tp_GetTransferHistory = ({ StartDate, EndDate, PageNumber }) =>
	tpRequest.post("/GetTransferHistory", {
		StartDate,
		EndDate,
		PageNumber
	});

export const api_tp_GetTransferRecent = () =>
	tpRequest.post("/GetTransferRecent");

export const api_tp_Transfer = ({ TpId, amount, direction }) =>
	tpRequest.post("/Transfer", {
		TpId,
		amount,
		direction
	});

const defGotoGame_AppType = {
	Desktop: 1,
	Mobile: 2,
	NativeAPP: 3
};

export const api_tp_GotoGame = ({ GameId = null, TpId, LangId }) =>
	tpRequest.post("/GotoGame", {
		GameId,
		TpId,
		LangId,
		AppType: defGotoGame_AppType.Desktop
	});
