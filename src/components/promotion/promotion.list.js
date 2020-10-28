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
import PromotionJoinButton from "./promotion.joinButton";

export default ({
	promoList,
	t,
	userInfo,
	filter,
	refreshProcessBar,
	staticPromotions,
	getPromotionListV2
}) => {
	const { langId, isLogin, currencyId } = userInfo;

	let rows = promoList?.map(p => {
		let _isClaimed = isClaimed(p);
		let _isNew = _isClaimed ? false : isNew(p);
		let _isExpiry = isExpiry({ ...p, isLogin });

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
					currencyId={currencyId}
					refreshProcessBar={() => refreshProcessBar(p)}
					hideReloadBtn={_isExpiry}
				/>

				<div className="btnGroup">
					<Link
						type="button"
						className="blue"
						to={`/${langId}/${path.promotion.root}/${path.promotion.sub.promotionInfo.root}?BonusCode=${p.bonusCode}`}>
						{t("lbl_Details")}
					</Link>

					<PromotionJoinButton
						promotionInfo={p}
						userInfo={userInfo}
						_isExpiry={_isExpiry}
						callBack={getPromotionListV2}
					/>
				</div>
			</div>
		);
	});

	if (isLogin === null) return null;

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
					? moment(custExpiryTime).unix()
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
					</div>
				) : null}
				<div>{displayExpiryTime}</div>
				<div>{rollOver ? rollOver : 1}X</div>
			</div>
		</div>
	);
};
