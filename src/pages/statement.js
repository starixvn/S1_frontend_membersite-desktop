import React, { useEffect, useState, useRef, useContext } from "react";
import { api_payment_GetStatement } from "../service/api/payment";
import { number_format, isConvert } from "../components/common/common";
import { useTranslation } from "react-i18next";
import { userInfoContext, popBoxContext } from "../components/common/context";
import { Pagination } from "../components/common/pagination";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import Filter from "../components/common/historyFilter";
import moment from "moment";
import LeftMenu from "../components/common/leftMenu";
import { defPopBoxType } from "../components/common/popBox";
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
	const [processing, setProcessing] = useState(false);
	const [filterData, setFilterData] = useState(null);
	const [keepData, setKeepData] = useState(null);
	const [pagination, setPagination] = useState(initPagination);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const GetStatement = (transactionData, pageNumber) => {
		const ClickClose = () => {
			setPopBox({ isOpen: false });
		};

		api_payment_GetStatement({
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
			GetStatement(transactionData, 1);
		}
	};

	const clickPageNumber = page => {
		if (!processing) {
			setProcessing(true);
			let transactionData = filterData;
			setPagination(prev => ({ ...prev, currentPage: page }));

			GetStatement(transactionData, page);
		}
	};

	let arr = getHistory?.map((item, idx) => {
		return (
			<div key={`statement-${idx}`}>
				<div>{idx + 1}</div>
				<div>
					{moment(item.createTime).format("DD/MM/YYYY")}
					<span className="txt-blue2">
						{moment(item.createTime).format("HH:mm:ss")}
					</span>
				</div>
				<div>{item.refTransId}</div>
				<div>{item.typeName}</div>
				<div>{number_format(item.changeAmount, _isConvert)}</div>
				<div>{number_format(item.beforeAmount, _isConvert)}</div>
				<div>{number_format(item.afterAmount, _isConvert)}</div>
			</div>
		);
	});

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_History">
				<span>{t("lbl_Statement")}</span>
			</div>
			<Filter submitHandler={clickDateSubmit} keepData={keepData} />

			{getHistory ? (
				<div className="list history">
					<div className="listHeader">
						<div>{t("lbl_NO")}</div>
						<div>
							{t("lbl_Date")} ({moment().format("Z")})
						</div>
						<div>{t("lbl_RefTransId")}</div>
						<div>{t("lbl_TypeName")}</div>
						<div>{t("lbl_ChangeAmount")}</div>
						<div>{t("lbl_BeforeAmount")}</div>
						<div>{t("lbl_AfterAmount")}</div>
					</div>
					{getHistory?.length > 0 ? (
						<div className="listBody">{arr}</div>
					) : (
						<div className="nodata">{t("msg_NoData")}</div>
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
