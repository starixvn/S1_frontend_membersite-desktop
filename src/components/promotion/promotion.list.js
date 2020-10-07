import React, { useContext } from "react";
import { userInfoContext } from "../common/context";
import moment from "moment";
import { Link } from "@reach/router";
import path from "../../path";
import ProcessBar from "./promotion.processBar";
import { defFilterType } from "./promotion.nav";
import { promoStatus } from "./promotion.def";
import { isNew, isClaimed, isExpiry } from "./promotion.common";
import { isConvert, number_format } from "../common/common";

export default ({
	promoList,
	t,
	langId,
	isLogin,
	currency,
	filter,
	refreshProcessBar,
	staticPromotions
}) => {
	let rows = promoList?.map(p => {
		let _isClaimed = isClaimed(p);
		let _isNew = _isClaimed ? false : isNew(p);

		return (
			<div
				key={`promotion.list-${p.bonusCode}-${p.categoryId}-${p.tpId}`}
				className={_isClaimed ? "active" : ""}>
				{_isClaimed ? <div className="claimed"></div> : null}
				{filter === defFilterType.expiry ? (
					<div className="expiredIcon">EXPIRED</div>
				) : (
					<div className={_isNew ? "new" : ""}></div>
				)}
				<img src={p.banner} alt={p.title} />
				<div className="txt-darkBlue">{p.title}</div>
				<div className="txt-dark">{t("lbl_PromotionsDesc")}</div>
				<div className="txt-gray">{p.description}</div>
				<Rollover t={t} {...p} />
				<ProcessBar
					{...p}
					t={t}
					currency={currency}
					refreshProcessBar={() => refreshProcessBar(p)}
					hideReloadBtn={isExpiry({ ...p, isLogin })}
				/>
				<Link
					className="btnGroup"
					to={`/${langId}/${path.promotion.root}/${path.promotion.sub.promotionInfo.root}?BonusCode=${p.bonusCode}`}>
					<button className="blue">{t("lbl_Details")}</button>
				</Link>
			</div>
		);
	});

	return (
		<div
			className={`proList${
				filter === defFilterType.expiry ? " expired" : ""
			}`}>
			{rows}
			{filter === defFilterType.all ? staticPromotions : null}
		</div>
	);
};

const Rollover = ({
	isJoin,
	status,
	periodTo,
	custExpiryTime,
	rollOver,
	requiredAmount,
	t
}) => {
	const { userInfo } = useContext(userInfoContext);
	let expiryTime = moment.duration(
		moment
			.unix(
				isJoin && status === promoStatus.running && custExpiryTime
					? custExpiryTime
					: periodTo
			)
			.diff(new Date())
	);

	let displayExpiryTime =
		expiryTime.days() +
		" " +
		t("lbl_Days") +
		" " +
		expiryTime.hours() +
		" " +
		t("lbl_Hours");

	return (
		<div className="rollover">
			<div>
				{requiredAmount > 0 ? (
					<div className="icon icon-icon32px_money">
						{t("lbl_MinAmount")}
					</div>
				) : null}
				<div className="icon icon-icon32px_time">
					{t("lbl_RemainingTime")}
				</div>
				<div className="icon icon-icon32px_">{t("lbl_RollOver")}</div>
			</div>
			<div className="txt-orange">
				{requiredAmount ? (
					<div>
						{number_format(
							requiredAmount,
							isConvert(userInfo.currencyId)
						)}
						$
					</div>
				) : null}
				<div>{displayExpiryTime}</div>
				<div>{rollOver}X</div>
			</div>
		</div>
	);
};
