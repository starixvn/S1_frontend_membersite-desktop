import React, { useContext } from "react";
import { userInfoContext } from "../common/context";
import moment from "moment";

export const initValue = {
	accountName: "",
	birth: "",
	phoneNo: ""
};

export const initStatus = {
	accountName: {
		checked: null,
		tip: ""
	},
	birth: {
		checked: null,
		tip: ""
	},
	phoneNo: {
		checked: null,
		tip: ""
	}
};

const CountryFormat = (value, dataList) => {
	return dataList.find(x => x.code === value)?.countryName || value;
};

export const InfoList = ({ countryList }) => {
	const { userInfo } = useContext(userInfoContext);

	const infoList = [
		{
			displayKey: "lbl_RealName",
			content: userInfo?.accountName,
			show: Boolean(userInfo.accountName)
		},
		{
			displayKey: "lbl_Birthday",
			content: `${userInfo?.birth_d}/${userInfo?.birth_m}/${userInfo?.birth_y}`,
			show:
				Boolean(userInfo.birth_d) &&
				Boolean(userInfo.birth_m) &&
				Boolean(userInfo.birth_y)
		},
		{
			displayKey: "lbl_Phone",
			content: userInfo?.phoneNo,
			show: Boolean(userInfo.phoneNo)
		},
		{
			displayKey: "lbl_Username",
			content: userInfo.userName,
			show: Boolean(userInfo.userName)
		},
		{
			displayKey: "lbl_Country",
			content: userInfo.perCountry,
			show: Boolean(userInfo.perCountry),
			format: CountryFormat,
			bindingData: countryList
		},
		{
			displayKey: "lbl_Email",
			content: userInfo?.email,
			show: Boolean(userInfo.email)
		},
		{
			displayKey: "lbl_RegisterTime",
			content: moment(userInfo.regTime).format("DD/MM/YYYY HH:mm:ss"),
			show: Boolean(userInfo.regTime)
		},
		{
			displayKey: "lbl_LastLogin",
			content: moment(userInfo.lastLogin).format("DD/MM/YYYY HH:mm:ss"),
			show: Boolean(userInfo.lastLogin)
		}
	];

	return infoList;
};

export const DisplayRow = ({ t, displayKey, content, areaCode }) => {
	return (
		<div>
			<div>{t(displayKey)}</div>
			<div>
				{displayKey === "lbl_Phone"
					? `(${areaCode})${content}`
					: content}
				{/* {displayKey === "lbl_Phone" ? (
					<>
						<span className="icon icon-checkmark"></span>
						<br />
						<button>
							<span className="icon icon-error otp"></span>
							<span>{t("lbl_MobileVerifiy")}</span>
						</button>
					</>
				) : (
					<></>
				)} */}
			</div>
		</div>
	);
};
