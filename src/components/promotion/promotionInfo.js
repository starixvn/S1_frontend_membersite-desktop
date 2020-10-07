import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../common/context";
import { getUrlParameter, isConvert, number_format } from "../common/common";
import {
	api_promotion_GetPromotionDetail,
	api_promotion_SetClaimPromotion
} from "../../service/api/promotion";
import { api_account_GetCustSpecificBonus } from "../../service/api/account";
import { defPopBoxType } from "../common/popBox";
import { isExpiry, isClaimed } from "./promotion.common";
import ProcessBar from "./promotion.processBar";
import moment from "moment";
import { promoStatus } from "./promotion.def";
import path from "../../path";

export default () => {
	const { t } = useTranslation();

	const isMountedRef = useRef(null);

	const [promotionInfo, setPromotionInfo] = useState(null);

	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);

	let _currency = t(`Currency_${userInfo.currencyId}`);

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
		const {
			canJoin,
			isJoin,
			result,
			requiredAmount,
			depositAmount
		} = promotionInfo;

		if (userInfo.isLogin === false) {
			return setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.Login
			});
		}

		if (canJoin && !isJoin && result === 1) {
			let lessAmount = number_format(
				requiredAmount - depositAmount,
				isConvert(userInfo.currencyId)
			);

			let hint = `${_currency} ${lessAmount}$`;
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.PromotionDepositConfirm,
				hint,
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={clickClose}>
							{t("lbl_Later")}
						</button>
						<Link
							to={`/${userInfo.langId}/${path.deposit.root}`}
							type="button"
							className="btn-check">
							{t("lbl_DepositNow")}
						</Link>
					</div>
				)
			});
		}

		return api_promotion_SetClaimPromotion({
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
						{!promotionInfo.isJoin && !_isExpiry ? (
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

					<DepositMenu
						cash={number_format(
							promotionInfo.depositAmount,
							isConvert(userInfo.currencyId)
						)}
						_currency={_currency}
						promotionInfo={promotionInfo}
						t={t}
					/>
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
						currency={userInfo.currencyId}
					/>
					<Rollover promotionInfo={promotionInfo} t={t} />
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

const Rollover = ({ promotionInfo, t }) => {
	const {
		isJoin,
		status,
		custExpiryTime,
		periodTo,
		requiredAmount,
		rollOver
	} = promotionInfo;

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
				{requiredAmount > 0 ? <div>{requiredAmount}</div> : null}
				<div>{displayExpiryTime}</div>
				<div>{rollOver}X</div>
			</div>
		</div>
	);
};

const DepositMenu = ({
	cash,
	_currency,
	promotionInfo: { promotionType, canJoin, isJoin, depositId },
	t
}) => {
	if (
		depositId &&
		canJoin &&
		!isJoin &&
		(promotionType === 1 || promotionType === 2)
	)
		return (
			<div className="minAmount">
				<div>
					<div>{t("lbl_ID")}</div>
					<div>{depositId}</div>
				</div>
				<div>
					<div>{t("lbl_DepositAmount")}</div>
					<div>{`${_currency} ${cash}`}</div>
				</div>
			</div>
		);

	return null;
};
