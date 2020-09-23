import path from "../../path";

export const defLeftMenu = {
	Cashier: {
		displayKey: "lbl_Cashier",
		subMenu: {
			deposit: {
				path: path.deposit.root,
				displayKey: "lbl_Deposit"
			},
			transferFunds: {
				path: path.transferFunds.root,
				displayKey: "lbl_TransferFunds"
			},
			withdrawal: {
				path: path.withdrawal.root,
				displayKey: "lbl_Withdrawal"
			}
		}
	},
	History: {
		displayKey: "lbl_History",
		subMenu: {
			depositHistory: {
				path: path.depositHistory.root,
				displayKey: "lbl_DepositHistory"
			},
			transferHistory: {
				path: path.transferHistory.root,
				displayKey: "lbl_TransferHistory"
			},
			withdrawalHistory: {
				path: path.withdrawalHistory.root,
				displayKey: "lbl_WithdrawalHistory"
			},
			statement: {
				path: path.statement.root,
				displayKey: "lbl_Statement"
			}
		}
	},
	MyAccount: {
		displayKey: "lbl_MyAccount",
		subMenu: {
			changePassword: {
				path: path.changePassword.root,
				displayKey: "lbl_ChangePassword"
			},
			profile: {
				path: path.profile.root,
				displayKey: "lbl_Profile"
			},
			bankInfo: {
				path: path.bankInfo.root,
				displayKey: "lbl_BankInfo"
			}
		}
	},
	Message: {
		displayKey: "lbl_Message",
		subMenu: {
			message: {
				path: path.message.root,
				displayKey: "lbl_PersonalMsg"
			},
			announcement: {
				path: path.announcement.root,
				displayKey: "lbl_Announcement"
			}
		}
	}
};
