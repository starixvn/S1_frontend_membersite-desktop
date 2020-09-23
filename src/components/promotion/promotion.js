import React, { useState, useRef, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api_promotion_GetPromotionListV2 } from "../../service/api/promotion";
import { api_account_GetCustSpecificBonus } from "../../service/api/account";
import PromotionNavBar, { defFilterType } from "./promotion.nav";
import PromotionList from "./promotion.list";
import { userInfoContext, popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { isExpiry, isArrayNotEmpty } from "./promotion.common";

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
			({ data: { data, errorCode } }) => {
				const success = errorCode === 0;
				if (isMountedRef.current && success) {
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
				}
			},
			err => {
				if (isMountedRef.current)
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={clickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
			}
		);
	};

	useEffect(() => {
		if (userInfo.isLogin === null) return;

		api_promotion_GetPromotionListV2({
			langId: userInfo.langId
		}).then(
			({ data: { data, errorCode } }) => {
				const success = errorCode === 0;

				if (success) {
					let result = data.sort((a, b) => {
						return a.periodFrom > b.periodFrom ? -1 : 1;
					});
					setInitPromoList(result);
					onSetPromotionList(result, filter);
				}
			},
			err => {
				if (isMountedRef.current)
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={clickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
			}
		);
	}, [userInfo.isLogin, userInfo.langId]);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
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
				isArrayNotEmpty(promoList) ? (
					<PromotionList
						promoList={promoList}
						t={t}
						langId={userInfo.langId}
						isLogin={userInfo.isLogin}
						currency={userInfo.currencyId}
						filter={filter}
						refreshProcessBar={refreshProcessBar}
					/>
				) : (
					<div className="nodata">{t("msg_NoData")}</div>
				)
			) : null}
		</div>
	);
};
