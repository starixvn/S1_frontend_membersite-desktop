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
