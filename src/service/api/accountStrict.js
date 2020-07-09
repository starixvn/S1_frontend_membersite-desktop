import { accountStrictRequest } from "./base";

export const api_accountStrict_GetCustProfile = () =>
	accountStrictRequest.post("/GetCustProfile");

export const api_accountStrict_SetProfile = ({
	AccountName,
	Birth_d,
	Birth_m,
	Birth_y,
	CountryCode,
	AreaCode,
	PhoneNo
}) =>
	accountStrictRequest.post("/SetProfile", {
		AccountName,
		Birth_d,
		Birth_m,
		Birth_y,
		CountryCode,
		AreaCode,
		PhoneNo
	});

export const api_accountStrict_SetCustBankInfo = ({
	AccountName,
	AccountNo,
	SysId
}) =>
	accountStrictRequest.post("/SetCustBankInfo", {
		AccountName,
		AccountNo,
		SysId
	});

export const api_accountStrict_DelCustBankInfo = ({
	AccountName,
	AccountNo,
	SysId
}) =>
	accountStrictRequest.post("/DelCustBankInfo", {
		AccountName,
		AccountNo,
		SysId
	});

export const api_accountStrict_ResetPassword = ({ NewPassword }) =>
	accountStrictRequest.post("/ResetPassword", {
		NewPassword
	});

export const api_accountStrict_UploadCustPhotoId = formData =>
	accountStrictRequest.post("/UploadCustPhotoId", formData, {
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
