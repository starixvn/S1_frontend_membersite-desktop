import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
	api_payment_GetWithdrawalInfoHistory,
	api_payment_SetWithdrawalCancel
} from "../service/api/payment";
import { userInfoContext, popBoxContext } from "../components/common/context";
import { TransactionHistory } from "../components/withdrawal/historyResult";
import { defPopBoxType } from "../components/common/popBox";
import { Pagination } from "../components/common/pagination";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import moment from "moment";
import Filter from "../components/common/historyFilter";
import LeftMenu from "../components/common/leftMenu";
import { isConvert } from "../components/common/common.js";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<Content />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};

const Content = () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const [getHistory, setGetHistory] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [filterData, setFilterData] = useState(null);
	const [keepData, setKeepData] = useState(null);
	const [pagination, setPagination] = useState(initPagination);
	const isMountedRef = useRef(null);
	const _isConvert = isConvert(userInfo.currencyId);

	const initPagination = {
		totalPages: 0,
		currentPage: 1
	};

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const ClickClose = () => {
		setPopBox({ isOpen: false });
	};

	const getWithdrawalInfoHistory = (transactionData, pageNumber) => {
		api_payment_GetWithdrawalInfoHistory({
			...transactionData,
			PageNumber: pageNumber
		}).then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						setGetHistory(res.data.data);
						setPagination(prev => ({
							...prev,
							totalPages: res.data.totalPages
						}));
					} else {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: res.data.message,
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
					setProcessing(false);
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
									className="btn-cancel"
									onClick={ClickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
					setProcessing(false);
				}
			}
		);
	};

	const clickDateSubmit = (startDate, endDate, isUnix, quickPick) => {
		if (!processing) {
			setProcessing(true);
			let transactionData = filterData;

			if (!isUnix) {
				transactionData = {
					StartDate: moment(startDate).unix(),
					EndDate: moment(endDate).endOf("day").unix()
				};
				setFilterData(transactionData);

				setKeepData({
					startDate: startDate,
					endDate: endDate,
					quickPick: quickPick
				});
			}

			setPagination(prev => ({ ...prev, currentPage: 1 }));
			getWithdrawalInfoHistory(transactionData, 1);
		}
	};

	const ClickCancel = transId => {
		const ClosePopBox = () => {
			setPopBox({ isOpen: false });
		};

		const ClickConfirm = () => {
			setPopBox({ isOpen: false });
			api_payment_SetWithdrawalCancel(transId).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							getWithdrawalInfoHistory(
								filterData,
								pagination.currentPage
							);
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: res.data.message,
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-cancel"
											onClick={ClickClose}>
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
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
			);
		};

		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Cancel,
			btnBar: (
				<div className="btnGroup">
					<button className="btn-cancel" onClick={ClickConfirm}>
						{t("lbl_Yes")}
					</button>
					<button className="btn-check" onClick={ClosePopBox}>
						{t("lbl_No")}
					</button>
				</div>
			)
		});
	};

	const clickPageNumber = page => {
		if (!processing) {
			setProcessing(true);
			let transactionData = filterData;
			setPagination(prev => ({ ...prev, currentPage: page }));
			getWithdrawalInfoHistory(transactionData, page);
		}
	};

	let arr = getHistory?.map((item, i) => {
		return (
			<TransactionHistory
				key={`withdrawaal-${item.transId}`}
				idx={i + 1}
				transId={item.transId}
				createTime={item.createTime}
				amount={item.amount}
				status={item.status}
				ClickCancel={ClickCancel.bind(this, item.transId)}
				_isConvert={_isConvert}
			/>
		);
	});

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_History">
				<span>{t("lbl_WithdrawalHistory")}</span>
			</div>
			<Filter submitHandler={clickDateSubmit} keepData={keepData} />
			{getHistory ? (
				<div className="list history">
					<div className="listHeader">
						<div>{t("lbl_NO")}</div>
						<div>
							{t("lbl_Date")} ({moment().format("Z")})
						</div>
						<div>{t("lbl_ID")}</div>
						<div>{t("lbl_Amount")}</div>
						<div>{t("lbl_Status")}</div>
						<div>{t("lbl_Action")}</div>
					</div>
					{getHistory?.length > 0 ? (
						<div className="listBody">{arr}</div>
					) : (
						<div className="nodata">{t("msg_NoData")}</div>
					)}{" "}
				</div>
			) : null}

			{getHistory?.length > 0 && pagination.totalPages !== 0 ? (
				<Pagination
					totalPages={pagination.totalPages}
					currentPage={pagination.currentPage}
					clickPageNumber={clickPageNumber}
				/>
			) : null}
		</div>
	);
};
