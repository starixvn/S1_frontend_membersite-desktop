import React, { useContext } from "react";
import { popBoxContext } from "./context";
import Cancel from "./popBox.cancel";
import UploadBankSlip from "./popBox.uploadBankSlip";
import Success from "./popBox.success";
import ErrorMsg from "./popBox.errorMsg";
import Login from "./popBox.login";
import Join from "./popBox.join";
import AddBankAccount from "./popBox.addBankAccount";
import AddBankSuccess from "./popBox.addBankSuccess";
import ConfirmDelete from "./popBox.ConfirmDelete";
import ProfileConfirmCheck from "./popBox.profileConfirmCheck";
import ProfileCompelete from "./popBox.profileCompelete";
import ChangePsw from "./popBox.changePsw";
import LogoutHint from "./popBox.logoutHint";
// import Loading from "./loading";
import DepositHint from "./popBox.depositHint";
import WithdrawalSuccess from "./popBox.withdrawalSuccess";
import OTPHint from "./popBox.otpHint";
import VerifyPhoneForm from "./popBox.verifyPhoneForm";
import UpdateProfile from "./popBox.updateProfile";
import TurnoverAccumulated from "./popBox.turnoverAccumulated";
import RegisterSuccess from "./popBox.registerSuccess";

export const defPopBoxType = {
	Cancel: "Cancel",
	UploadBankSlip: "UploadBankSlip",
	Success: "Success",
	ErrorMsg: "ErrorMsg",
	Login: "Login",
	Join: "Join",
	AddBankAccount: "AddBankAccount",
	AddBankSuccess: "AddBankSuccess",
	ConfirmDelete: "ConfirmDelete",
	ProfileConfirmCheck: "ProfileConfirmCheck",
	ProfileCompelete: "ProfileCompelete",
	ChangePsw: "ChangePsw",
	LogoutHint: "LogoutHint",
	DepositHint: "DepositHint",
	OTPHint: "OTPHint",
	VerifyPhoneForm: "verifyPhoneForm",
	WithdrawalSuccess: "WithdrawalSuccess",
	UpdateProfile: "UpdateProfile",
	TurnoverAccumulated: "TurnoverAccumulated",
	RegisterSuccess: "RegisterSuccess"
};

export default () => {
	const { popBox } = useContext(popBoxContext);

	let content = null;
	switch (popBox.popBoxType) {
		case defPopBoxType.Cancel:
			content = <Cancel btnBar={popBox.btnBar} />;
			break;

		case defPopBoxType.UploadBankSlip:
			const { isOpen, ...restProps } = popBox;
			content = <UploadBankSlip {...restProps} />;
			break;

		case defPopBoxType.Success:
			content = <Success btnBar={popBox.btnBar} />;
			break;
		case defPopBoxType.ErrorMsg:
			content = (
				<ErrorMsg
					btnBar={popBox.btnBar}
					message={popBox.message}
					errorCode={popBox.errorCode}
					icon={popBox.icon}
				/>
			);
			break;

		case defPopBoxType.ErrorMsg:
			content = (
				<ErrorMsg
					btnBar={popBox.btnBar}
					message={popBox.message}
					errorCode={popBox.errorCode}
					icon={popBox.icon}
				/>
			);
			break;

		case defPopBoxType.Login:
			content = <Login />;
			break;

		case defPopBoxType.Join:
			content = <Join />;
			break;

		case defPopBoxType.AddBankAccount:
			content = (
				<AddBankAccount
					bankInfoSysList={popBox.bankInfoSysList}
					GetCustBankInfo={popBox.GetCustBankInfo}
				/>
			);
			break;

		case defPopBoxType.AddBankSuccess:
			content = <AddBankSuccess btnBar={popBox.btnBar} />;
			break;

		case defPopBoxType.ConfirmDelete:
			content = (
				<ConfirmDelete
					btnBar={popBox.btnBar}
					message={popBox.message}
					message2={popBox.message2}
				/>
			);
			break;

		case defPopBoxType.ProfileConfirmCheck:
			content = (
				<ProfileConfirmCheck
					btnBar={popBox.btnBar}
					accountName={popBox.accountName}
				/>
			);
			break;

		case defPopBoxType.ProfileCompelete:
			content = <ProfileCompelete {...popBox} />;
			break;

		case defPopBoxType.ChangePsw:
			content = (
				<ChangePsw
					btnBar={popBox.btnBar}
					title={popBox.title}
					message={popBox.message}
					ClickClose={popBox.ClickClose}
				/>
			);
			break;

		case defPopBoxType.LogoutHint:
			content = (
				<LogoutHint btnBar={popBox.btnBar} content={popBox.content} />
			);
			break;

		case defPopBoxType.DepositHint:
			content = <DepositHint />;
			break;

		case defPopBoxType.WithdrawalSuccess:
			content = <WithdrawalSuccess btnBar={popBox.btnBar} />;
			break;

		case defPopBoxType.OTPHint:
			content = <OTPHint btnBar={popBox.btnBar} />;
			break;

		case defPopBoxType.VerifyPhoneForm:
			content = <VerifyPhoneForm startUnixTime={popBox.startUnixTime} />;
			break;

		case defPopBoxType.UpdateProfile:
			content = (
				<UpdateProfile
					title={popBox.title}
					content={popBox.content}
					btnBar={popBox.btnBar}
				/>
			);
			break;
		case defPopBoxType.TurnoverAccumulated:
			content = <TurnoverAccumulated {...popBox} />;
			break;

		case defPopBoxType.RegisterSuccess:
			content = (
				<RegisterSuccess
					btnBar={popBox.btnBar}
					closeBtn={popBox.closeBtn}
				/>
			);
			break;

		case defPopBoxType.default:
			break;

		default:
			break;
	}

	return popBox.isOpen ? (
		<div id="popup" className="active">
			<div className="pop">{content}</div>
		</div>
	) : (
		<></>
	);

	// return popBox.isOpen ? (
	// 	popBox.loading ? (
	// 		<Loading />
	// 	) : (
	// 		<div id="popup" className="active">
	// 			<div className="pop">{content}</div>
	// 		</div>
	// 	)
	// ) : (
	// 	<></>
	// );
};
