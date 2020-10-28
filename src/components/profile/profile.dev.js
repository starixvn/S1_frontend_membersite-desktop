import path from "../../path";
import { getUrlParameter } from "../common/common";

export const defPrevPage = {
	[path.withdrawal.root]: {
		contentMsg: "lbl_GoWithdrawalPage",
		path: path.withdrawal.root,
		label: "lbl_WithdrawalNow"
	},
	[path.promotion.root]: {
		contentMsg: "lbl_GoPromotionPage",
		path: `${path.promotion.root}/${
			path.promotion.sub.promotionInfo.root
		}?BonusCode=${getUrlParameter("BonusCode")}`,
		label: "lbl_GoNow"
	},
	[path.deposit.root]: {
		contentMsg: "lbl_GoDepositPage",
		path: path.deposit.root,
		label: "lbl_DepositNow"
	}
};
