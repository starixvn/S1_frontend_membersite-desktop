import React, { useEffect, useRef, useState, useContext } from "react";
import { popBoxContext, userInfoContext } from "../common/context";
import { HistoryResult } from "./withdrawal.historyResult";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
	api_payment_GetWithdrawalInfoRecent,
	api_payment_SetWithdrawalCancel
} from "../../service/api/payment";
import { defPopBoxType } from "../common/popBox";
import ReloadSpin from "../common/reloadSpin";
import path from "../../path";
import { Link } from "@reach/router";
import { isConvert } from "../common/common";
// import Loading from "../common/loading";

export default () => {
	const { t } = useTranslation();
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);
	const [recentHistory, setRecentHistory] = useState(null);
	const _isConvert = isConvert(userInfo.currencyId);
	// const [loading, setLoading] = useState(false);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		GetWithdrawalInfoRecent();
	}, []);

	const ClosePopBox = () => {
		setPopBox({ isOpen: false });
	};

	const GetWithdrawalInfoRecent = () => {
		api_payment_GetWithdrawalInfoRecent().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setRecentHistory(res.data.data);
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="gray"
										onClick={ClosePopBox}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button className="gray" onClick={ClosePopBox}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	};

	const ClickCancel = transId => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Cancel,
			btnBar: (
				<div className="btnGroup">
					<button className="gray" onClick={ClickConfirm}>
						{t("lbl_Yes")}
					</button>
					<button className="btn-check" onClick={ClosePopBox}>
						{t("lbl_No")}
					</button>
				</div>
			)
		});

		const ClickConfirm = () => {
			// setLoading(true)

			setPopBox({ isOpen: false });
			api_payment_SetWithdrawalCancel(transId).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							setRecentHistory(prev => {
								let newData = [...prev];
								let idx = newData.findIndex(
									_i => _i.transId === transId
								);
								newData[idx].status = 5;
								return newData;
							});
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: res.data.message,
								btnBar: (
									<div className="btnGroup">
										<button
											className="gray"
											onClick={ClosePopBox}>
											{t("lbl_Close")}
										</button>
									</div>
								)
							});
						}
						// setLoading(false)
					}
				},
				err => {
					if (isMountedRef.current) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: t("msg_ApiServerError"),
							btnBar: (
								<div className="btnGroup">
									<button
										className="gray"
										onClick={ClosePopBox}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
						// setLoading(false)
					}
				}
			);
		};
	};

	let arr = recentHistory?.map((item, idx) => {
		return (
			<HistoryResult
				key={`withdrawal-recent-${item.transId}`}
				idx={idx + 1}
				i18n={t}
				_isConvert={_isConvert}
				{...item}
				ClickCancel={ClickCancel.bind(this, item.transId)}
			/>
		);
	});

	return recentHistory ? (
		<>
			<div className="list">
				<div className="listHeader">
					<div>{t("lbl_NO")}</div>
					<div>
						{t("lbl_Date")} ({moment().format("Z")})
					</div>
					<div>{t("lbl_ID")}</div>
					<div>{t("lbl_Amount")}</div>
					<div>{t("lbl_Status")}</div>
					<div>
						{t("lbl_Action")}
						<ReloadSpin func={GetWithdrawalInfoRecent} />
					</div>
				</div>
				{recentHistory?.length > 0 ? (
					<div className="listBody">{arr}</div>
				) : (
					<div className="nodata">{t("msg_NoData")}</div>
				)}
			</div>
			<Link
				to={`/${userInfo.langId}/${path.withdrawalHistory.root}`}
				className="icon icon-books"></Link>{" "}
		</>
	) : (
		<></>
	);
};
