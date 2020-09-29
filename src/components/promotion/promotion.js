import React, { useState, useRef, useContext, useEffect } from "react";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { api_promotion_GetPromotionListV2 } from "../../service/api/promotion";
import { api_account_GetCustSpecificBonus } from "../../service/api/account";
import PromotionNavBar, { defFilterType } from "./promotion.nav";
import PromotionList from "./promotion.list";
import { userInfoContext, popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { isExpiry, isArrayNotEmpty } from "./promotion.common";
import { getUrlParameter } from "../common/common";
import path from "../../path";
import StaticPromotionList from "../../datas/promotionList";

export default () => {
	const { t } = useTranslation();

	const isMountedRef = useRef(null);

	const [filter, setFilter] = useState(defFilterType.all);
	const [initPromoList, setInitPromoList] = useState(null);
	const [promoList, setPromoList] = useState([]);

	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const openErrorMessagePopBox = (
		message = t("msg_ApiServerError"),
		errorCode = null
	) => {
		setPopBox({
			message,
			errorCode,
			isOpen: true,
			popBoxType: defPopBoxType.ErrorMsg,
			icon: "icon-bell",
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={clickClose}>
						{t("lbl_Close")}
					</button>
				</div>
			)
		});
	};

	const onSetPromotionList = (_promoList, type) => {
		let afterFilterList = [];
		if (type === defFilterType.all) {
			afterFilterList = _promoList.filter(
				p => !isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		} else if (type === defFilterType.expiry) {
			afterFilterList = _promoList.filter(p =>
				isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		} else if (type === defFilterType.firstDeposit) {
			//put 'bonus wallet' type into first deposit category as short term solution.
			afterFilterList = _promoList.filter(
				p =>
					(p.promotionType === type || p.promotionType === 5) &&
					!isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		} else {
			afterFilterList = _promoList.filter(
				p =>
					p.promotionType === type &&
					!isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		}
		setPromoList(afterFilterList);
	};

	const onSetPromotionType = type => {
		if (initPromoList && isArrayNotEmpty(initPromoList)) {
			onSetPromotionList(initPromoList, type);
		}

		setFilter(type);
	};

	const refreshProcessBar = ({ bonusCode, tpId, categoryId }) => {
		api_account_GetCustSpecificBonus({
			BonusCode: bonusCode,
			TpId: tpId,
			PromoCategoryId: categoryId
		}).then(
			({ data: { data, message, errorCode } }) => {
				if (!isMountedRef.current) return;

				const success = errorCode === 0;
				if (success) {
					let idx = initPromoList.findIndex(
						x =>
							x.bonusCode === bonusCode &&
							x.tpId === tpId &&
							x.categoryId === categoryId
					);
					if (idx !== -1) {
						let newPromoList = [...initPromoList];
						newPromoList[idx].custRollOver = data.rollover;
						newPromoList[idx].custTurnOver = data.turnover;

						setInitPromoList(newPromoList);
						onSetPromotionList(newPromoList, filter);
					}
				} else {
					openErrorMessagePopBox(message || "error", errorCode);
				}
			},
			err => {
				if (isMountedRef.current) openErrorMessagePopBox();
			}
		);
	};

	useEffect(() => {
		if (userInfo.isLogin === null) return;

		api_promotion_GetPromotionListV2({
			langId: userInfo.langId
		}).then(
			({ data: { data, message, errorCode } }) => {
				if (!isMountedRef.current) return;

				const success = errorCode === 0;
				if (success) {
					let result = data.sort((a, b) => {
						return a.periodFrom > b.periodFrom ? -1 : 1;
					});
					setInitPromoList(result);
					onSetPromotionList(result, filter);
				} else openErrorMessagePopBox(message || "error", errorCode);
			},
			err => {
				if (isMountedRef.current) openErrorMessagePopBox();
			}
		);
	}, [userInfo.isLogin, userInfo.langId]);

	useEffect(() => {
		const { isLogin, accountName, phoneNo, email, currency } = userInfo;
		if (isLogin && currency && (!accountName || !phoneNo || !email)) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.UpdateProfile,
				title: t("lbl_ImportantNote"),
				content: t("lbl_UpdatePersonalInfoPromotion"),
				btnBar: (
					<div className="btnGroup">
						<Link
							className="btn-check"
							to={`/${userInfo.langId}/${
								path.profile.root
							}?from=${
								path.promotion.root
							}?BonusCode=${getUrlParameter("BonusCode")}`}>
							{t("lbl_UpdatePersonalDetail")}
						</Link>
					</div>
				)
			});
		}
	}, [userInfo]);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const OpenStaticPromotion = ({ url, bonusCode }) => {
		let windowKey = `static-promotion-${bonusCode}`;
		window.open(
			url,
			windowKey,
			"toolbar=no, menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no, top=0, left=0"
		);
	};

	let _staticRows = StaticPromotionList.map(p => {
		return (
			<div
				key={`static-promotion.list-${p.bonusCode}-${p.categoryId}-${p.tpId}`}
				className={""}>
				<div className=""></div>
				<img
					src={p.imgUrl?.[userInfo.langId]}
					alt={p.title?.[userInfo.langId]}
				/>
				<div className="txt-darkBlue">{p.title?.[userInfo.langId]}</div>
				<div className="txt-dark">{t("lbl_PromotionsDesc")}</div>
				<div className="txt-gray">
					{p.description?.[userInfo.langId]}
				</div>

				<div className="rollover">
					<div>
						<div className="icon icon-icon32px_">
							{t("lbl_RollOver")}
						</div>
					</div>
					<div className="txt-orange">
						<div>1X</div>
					</div>
				</div>
				<a
					href={p.bannerLink?.[userInfo.langId]}
					className="btnGroup"
					target="_blank">
					<button className="blue">{t("lbl_Details")}</button>
				</a>
			</div>
		);
	});

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-gift">
				<span>{t("lbl_Promotions")}</span>
			</div>
			<PromotionNavBar
				t={t}
				selected={filter}
				onClick={onSetPromotionType}
			/>

			{userInfo.isLogin !== null ? (
				isArrayNotEmpty(promoList) ||
				(filter === defFilterType.all &&
					isArrayNotEmpty(StaticPromotionList)) ? (
					<PromotionList
						promoList={promoList}
						t={t}
						langId={userInfo.langId}
						isLogin={userInfo.isLogin}
						currency={userInfo.currencyId}
						filter={filter}
						refreshProcessBar={refreshProcessBar}
						staticPromotions={_staticRows}
					/>
				) : (
					<div className="nodata">{t("msg_NoData")}</div>
				)
			) : null}
		</div>
	);
};
