import React, { useContext } from "react";
import { Link } from "gatsby";
import LimitTip from "./limitTip";
import { isConvert } from "../common/common";
import { userInfoContext } from "../common/context";
import path from "../../path";
import { useTranslation } from "react-i18next";
import config from "../../config";

const _path = path.deposit.sub.onlineBank.root;

export default ({ onlineBankingList }) => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);

	const _isConvert = isConvert(userInfo.currencyId);

	let rows = onlineBankingList?.map(p => {
		return (
			<li key={`deposit-onlineBank-${p.payId}-${p.channelId}`}>
				<Link
					to={`${_path}?name=${p.payName}&pId=${p.payId}&cId=${p.channelId}&max=${p.maxAmount}&min=${p.minAmount}`}
					state={{ selBank: p.selBank }}>
					<img
						src={`${config.cloudImgUrl}/SiteSkin/img/Payment/${p.payName}.png`}
						alt={p.payName}
					/>
				</Link>
				<LimitTip
					minAmount={p.minAmount}
					maxAmount={p.maxAmount}
					displayTextLimit={t("lbl_Limit")}
					displayTextUnLimit={t("lbl_Unlimited")}
					_isConvert={_isConvert}
				/>
			</li>
		);
	});

	return onlineBankingList !== null && onlineBankingList.length > 0 ? (
		<div className="subModule">
			<div className="subModuleTitle">
				<div>
					<span>{t("lbl_DepositType1")}</span>
					<span>
						{t("lbl_CreditTime")}: {t("lbl_Instant")}
					</span>
				</div>
			</div>
			<div className="subModuleBody">
				<ul>{rows}</ul>
			</div>
		</div>
	) : (
		<></>
	);
};
