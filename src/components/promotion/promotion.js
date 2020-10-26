import React, { useState, useRef, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api_promotion_GetPromotionListV2 } from "../../service/api/promotion";
import { api_account_GetCustSpecificBonus } from "../../service/api/account";
import PromotionNavBar, { defFilterType } from "./promotion.nav";
import PromotionList from "./promotion.list";
import {
	userInfoContext,
	popBoxContext,
	loadingContext
} from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { isExpiry, isArrayNotEmpty } from "./promotion.common";
import { defPromotionType } from "./promotion.def";
import { SiteInfo } from "../../config";
import staticList from "../../datas/promotionList";

export default () => {
	const { t } = useTranslation();

	const isMountedRef = useRef(null);

	const [filter, setFilter] = useState(defFilterType.all);
	const [initPromoList, setInitPromoList] = useState(null);
	const [promoList, setPromoList] = useState([]);

	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const { loading, setLoading } = useContext(loadingContext);
	// const [staticList, setStaticList] = useState([]);

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
					(p.promotionType === type ||
						p.promotionType === defPromotionType.walletBonus) &&
					!isExpiry({ ...p, isLogin: userInfo.isLogin })
			);
		} else if (type === defFilterType.Rebate_and_cashback) {
			afterFilterList = _promoList.filter(
				p =>
					(p.promotionType === defPromotionType.rebate ||
						p.promotionType === defPromotionType.cashback) &&
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

	const getPromotionListV2 = async () => {
		await api_promotion_GetPromotionListV2({
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
	};

	useEffect(() => {
		if (userInfo.isLogin === null) return;

		async function getData() {
			setLoading(true);
			await getPromotionListV2();
			setLoading(false);
		}
		getData();

		// fetch(SiteInfo.staticPromotions)
		// 	.then(res => {
		// 		return res.json();
		// 	})
		// 	.then(data => {
		// 		setStaticList(data);
		// 	});
	}, [userInfo.isLogin, userInfo.langId]);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	let _staticRows = staticList.map(p => {
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
				<div
					onClick={OpenStaticPromotion.bind(this, {
						url: p.bannerLink?.[userInfo.langId],
						bonusCode: p.bonusCode
					})}
					className="btnGroup">
					<button className="blue">{t("lbl_Details")}</button>
				</div>
			</div>
		);
	});

	return loading ? (
		<></>
	) : (
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
					isArrayNotEmpty(_staticRows)) ? (
					<PromotionList
						promoList={promoList}
						t={t}
						langId={userInfo.langId}
						isLogin={userInfo.isLogin}
						currencyId={userInfo.currencyId}
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

const OpenStaticPromotion = ({ url, bonusCode }) => {
	let windowKey = `static-promotion-${bonusCode}`;
	window.open(
		url,
		windowKey,
		"toolbar=no, menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no, top=0, left=0"
	);
};
