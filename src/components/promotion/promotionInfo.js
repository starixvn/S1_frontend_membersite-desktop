import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../common/context";
import { getUrlParameter } from "../common/common";
import {
	api_promotion_GetPromotionDetail,
	api_promotion_SetClaimPromotion
} from "../../service/api/promotion";
import { api_account_GetCustSpecificBonus } from "../../service/api/account";
import { defPopBoxType } from "../common/popBox";
import { isExpiry, isClaimed } from "./promotion.common";
import ProcessBar from "./promotion.processBar";

export default () => {
	const { t } = useTranslation();

	const isMountedRef = useRef(null);

	const [promotionInfo, setPromotionInfo] = useState(null);

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

	const getPromotionDetail = (langId, bonusCode) => {
		api_promotion_GetPromotionDetail({
			langId,
			BonusCode: bonusCode
		}).then(
			({ data: { data, message, errorCode } }) => {
				if (!isMountedRef.current) return;

				const success = errorCode === 0;
				if (success) return setPromotionInfo(data);

				openErrorMessagePopBox(message || "error", errorCode);
			},
			err => {
				if (isMountedRef.current) {
					openErrorMessagePopBox();
				}
			}
		);
	};

	const onJoinPromotion = (langId, bonusCode) => {
		if (userInfo.isLogin === false)
			return setPopBox({ isOpen: true, popBoxType: defPopBoxType.Login });

		api_promotion_SetClaimPromotion({
			langId,
			BonusCode: bonusCode
		}).then(
			({ data: { message, errorCode } }) => {
				if (!isMountedRef.current) return;

				const success = errorCode === 0;
				if (success) {
					getPromotionDetail(langId, bonusCode);
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.Success,
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={clickClose}>
									OK
								</button>
							</div>
						)
					});
				} else openErrorMessagePopBox(message || "error", errorCode);
			},
			err => {
				if (isMountedRef.current) {
					openErrorMessagePopBox();
				}
			}
		);
	};

	const refreshProcessBar = ({ bonusCode, tpId, categoryId }) => {
		api_account_GetCustSpecificBonus({ bonusCode, tpId, categoryId }).then(
			({ data: { data, message, errorCode } }) => {
				if (!isMountedRef.current) return;

				const success = errorCode === 0;
				if (success)
					return setPromotionInfo(prev => ({
						...prev,
						custRollOver: data.rollover,
						custTurnOver: data.turnover
					}));

				openErrorMessagePopBox(message || "error", errorCode);
			},
			err => {
				if (isMountedRef.current) openErrorMessagePopBox();
			}
		);
	};

	useEffect(() => {
		const bonusCode = getUrlParameter("BonusCode");
		getPromotionDetail(userInfo.langId, bonusCode);
	}, [userInfo.isLogin, userInfo.langId]);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	let _isClaimed = false;
	let _isExpiry = false;

	if (promotionInfo !== null) {
		_isClaimed = isClaimed(promotionInfo);
		_isExpiry = isExpiry({
			...promotionInfo,
			isLogin: userInfoContext.isLogin
		});
	}

	let wrapperClass = _isClaimed
		? _isExpiry
			? " expiredClaimedInfo"
			: " claimedInfo"
		: _isExpiry
		? " expiredClaimedInfo"
		: "";

	return promotionInfo === null ? (
		<></>
	) : (
		<div className="infoModule">
			<div className={`promotionsInfo${wrapperClass}`}>
				{_isClaimed ? <div className="claimed"></div> : null}
				<img
					src={promotionInfo.banner}
					alt="promotionDetailData_banner"
				/>
				<div className="proData">
					<div className="proDataTitle">
						<div className="txt-darkBlue">
							{promotionInfo.title}
							<div>{promotionInfo.description}</div>
						</div>
						{(promotionInfo.canJoin &&
							promotionInfo.status === 0) ||
						(userInfo.isLogin === false && !_isExpiry) ? (
							<div className="btnGroup">
								<button
									className="btn-check"
									onClick={() =>
										onJoinPromotion(
											userInfo.langId,
											promotionInfo.bonusCode
										)
									}>
									{t("lbl_PromoJoinNow")}
								</button>
							</div>
						) : null}
					</div>
					<ProcessBar
						t={t}
						{...promotionInfo}
						refreshProcessBar={() =>
							refreshProcessBar(promotionInfo)
						}
						hideReloadBtn={isExpiry({
							...promotionInfo,
							isLogin: userInfo.isLogin
						})}
					/>
					<div
						className="proDataBody"
						dangerouslySetInnerHTML={{
							__html: promotionInfo.details
						}}></div>
				</div>
			</div>
		</div>
	);
};
