import React, { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { api_tp_GetTransferHistory } from "../service/api/tp";
import { userInfoContext, popBoxContext } from "../components/common/context";
import { TransactionHistory } from "../components/transferFunds/historyResult";
import { Pagination } from "../components/common/pagination";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import moment from "moment";
import Filter from "../components/common/historyFilter";
import LeftMenu from "../components/common/leftMenu";
import { defPopBoxType } from "../components/common/popBox";
import ReloadSpin from "../components/common/reloadSpin";
import { isConvert } from "../components/common/common";
import Loading from "../components/common/loading";
import SideBarQuickLink from "../components/home/sideBarQuickLink";

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
					<SideBarQuickLink />
				</main>
			</Layout>
		</Wrapper>
	);
};

const transferDirection = (direction, displayMainWallet, displaySabaWallet) => {
	let startWallet = "";
	let endWallet = "";

	if (direction === 1) {
		startWallet = displayMainWallet;
		endWallet = displaySabaWallet;
	} else {
		startWallet = displaySabaWallet;
		endWallet = displayMainWallet;
	}
	return { startWallet, endWallet };
};

const initPagination = {
	totalPages: 0,
	currentPage: 1
};

const Content = () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	const _isConvert = isConvert(userInfo.currencyId);
	const { setPopBox } = useContext(popBoxContext);
	const [getHistory, setGetHistory] = useState(null);
	const [filterData, setFilterData] = useState(null);
	const [keepData, setKeepData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState(initPagination);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const getTransferHistory = (transactionData, pageNumber) => {
		const ClickClose = () => {
			setPopBox({ isOpen: false });
		};

		api_tp_GetTransferHistory({
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
					setLoading(false);
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
					setLoading(false);
				}
			}
		);
	};

	const clickDateSubmit = (startDate, endDate, isUnix, quickPick) => {
		if (!loading) {
			// setLoading(true);
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
			getTransferHistory(transactionData, 1);
		}
	};

	const clickPageNumber = page => {
		if (!loading) {
			setLoading(true);
			let transactionData = filterData;
			setPagination(prev => ({ ...prev, currentPage: page }));
			getTransferHistory(transactionData, page);
		}
	};

	let arr = getHistory?.map((item, i) => {
		const _transferDirection = transferDirection(
			item.direction,
			t("lbl_MainWallet"),
			t("lbl_Wallet_Saba")
		);
		const _status = item.status === 0 ? t("lbl_Success") : t("lbl_Fail");
		const _statusColor = item.status === 0 ? "approved" : "cancel";

		return (
			<TransactionHistory
				key={`transfer-${item.transId}`}
				idx={i + 1}
				createTime={item.createTime}
				transId={item.transId}
				amount={item.amount}
				startWallet={_transferDirection.startWallet}
				endWallet={_transferDirection.endWallet}
				status={_status}
				statusColor={_statusColor}
				_isConvert={_isConvert}
			/>
		);
	});

	return loading ? (
		<Loading />
	) : (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_History">
				<span>{t("lbl_TransferHistory")}</span>
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
						<div>{t("lbl_Direction")}</div>
						<div>{t("lbl_Amount")}</div>
						<div>
							{t("lbl_Status")}
							<ReloadSpin
								func={clickDateSubmit.bind(
									this,
									filterData?.StartDate,
									filterData?.EndDate
								)}
							/>
						</div>
					</div>

					{getHistory?.length > 0 ? (
						<div className="listBody">{arr}</div>
					) : (
						<div className="nodata icon icon-nodata2">
							<div>{t("lbl_NoData")}</div>
						</div>
					)}
				</div>
			) : null}

			{pagination.totalPages !== 0 ? (
				<Pagination
					totalPages={pagination.totalPages}
					currentPage={pagination.currentPage}
					clickPageNumber={clickPageNumber}
				/>
			) : null}
		</div>
	);
};
