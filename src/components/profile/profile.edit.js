import React from "react";
import moment from "moment";
import DateTime from "react-datetime";
import Inputbox from "../common/inputbox";
import areaCode from "../../datas/areaCode";

export default ({
	t,
	userInfo,
	userValue,
	status,
	arr,
	editField,
	valueCheck,
	phoneCheck,
	clickInfo,
	clickSubmit
}) => {
	const legalDate = moment().subtract(21, "year");
	const vaildDate = current => {
		return current.isBefore(legalDate);
	};

	let _areaCode = areaCode[userInfo.perCountry]?.AreaCode;
	return (
		<div className="profileEdit">
			<div className="profile">{arr}</div>
			<form className="editModule" onSubmit={clickSubmit}>
				{!userInfo?.accountName ? (
					<Inputbox
						className="inputBox-white"
						title={t("lbl_RealName")}
						onChange={editField.bind(this, "accountName")}
						onBlur={e => valueCheck(e.target.value, "accountName")}
						value={userValue.accountName}
						checked={status.accountName.checked}
						clickInfo={clickInfo.bind(this, "accountName")}
						tip={status.accountName.tip}
						tooltip={t("lbl_RemindForName")}
					/>
				) : null}

				{!userInfo?.birth_d ||
				!userInfo?.birth_m ||
				!userInfo?.birth_y ? (
					<>
						<div className="inputBox-white">
							<i className="txt-blue">{t("lbl_Birthday")}</i>
							<DateTime
								onChange={editField.bind(this, "birth")}
								onBlur={e => valueCheck(e, "birth")}
								value={userValue.birth}
								timeFormat={false}
								dateFormat="YYYY-MM-DD"
								isValidDate={vaildDate}
								viewDate={moment(legalDate).format(
									"YYYY-MM-DD"
								)}
							/>
							<div className="iconModule">
								<i className="icon icon-calendar"></i>
							</div>
						</div>
						<div
							className={`tip${
								status.birth.tip ? " active" : ""
							}`}>
							{status.birth.tip}
						</div>
					</>
				) : null}

				{!userInfo?.phoneNo ? (
					<Inputbox
						className="inputBox-white"
						title={t("lbl_Phone")}
						onChange={editField.bind(this, "phoneNo")}
						onBlur={e => phoneCheck(e.target.value)}
						value={userValue.phoneNo}
						checked={status.phoneNo.checked}
						clickInfo={clickInfo.bind(this, "phoneNo")}
						tip={status.phoneNo.tip}
						areaCode={_areaCode}
					/>
				) : null}

				{!userInfo?.accountName ||
				!userInfo?.birth_d ||
				!userInfo?.phoneNo ? (
					<div className="btnGroup">
						<button className="btn-check" type="submit">
							{t("lbl_Submit")}
						</button>
					</div>
				) : null}
			</form>
		</div>
	);
};
