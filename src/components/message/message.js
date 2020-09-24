import React, { useRef, useContext, useEffect, useState } from "react";
import {
	api_account_GetMsgList,
	api_account_DelMsg,
	api_account_GetMsgCount
} from "../../service/api/account";
import MessageList from "./messageList";
import { Pagination } from "../common/pagination";
import { useTranslation } from "react-i18next";
import { popBoxContext, msgCountContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import ReloadSpin from "../common/reloadSpin";

export default () => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);

	const [msgListData, setMsgListData] = useState([]);
	const [selectItems, setSelectItems] = useState([]);
	const [isCheckAll, setIsCheckAll] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		totalPages: 0,
		currentPage: 1
	});

	const { setPopBox } = useContext(popBoxContext);
	const { setMsgCount } = useContext(msgCountContext);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		getMsgList(pagination.currentPage);
	}, []);

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const clickPageNumber = page => {
		setPagination(prev => ({ ...prev, currentPage: page }));
		getMsgList(page);
	};

	const onClickCheckAll = () => {
		setIsCheckAll(!isCheckAll);
		setSelectItems(!isCheckAll ? msgListData.map(item => item.id) : []);
	};

	const onChildChanged = checkId => {
		const result = selectItems.includes(checkId)
			? selectItems.filter(item => item !== checkId)
			: [...selectItems, checkId];
		setIsCheckAll(result.length === msgListData.length);
		setSelectItems(result);
	};

	const getMsgList = pageNumber => {
		setLoading(true);
		api_account_GetMsgList({ PageNumber: pageNumber }).then(
			res => {
				if (isMountedRef.current) {
					const success = res.data.errorCode === 0;
					if (success) {
						setMsgListData(res.data.data);
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
										onClick={clickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
					}
				}
				setLoading(false);
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
									onClick={clickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
				setLoading(false);
			}
		);
	};

	const popDelete = () => {
		const clickCancel = () => {
			setPopBox({ isOpen: false });
		};
		const deleteMessage = () => {
			setPopBox({ isOpen: false });

			api_account_DelMsg(selectItems).then(
				res => {
					if (isMountedRef.current) {
						const success = res.data.errorCode === 0;
						if (success) {
							getMsgList(pagination.currentPage);
							setSelectItems([]);
							setIsCheckAll(false);

							api_account_GetMsgCount().then(res => {
								if (isMountedRef.current) {
									if (res.data.errorCode === 0) {
										setMsgCount(res.data.data);
									}
								}
							});
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: res.data.message,
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
										onClick={clickClose}>
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
		if (selectItems.length > 0) {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.ConfirmDelete,
				message: t("lbl_AreYouSureDelete"),
				message2: t("lbl_CantBeRestore"),
				btnBar: (
					<div className="btnGroup">
						<button className="btn-cancel" onClick={deleteMessage}>
							{t("lbl_Yes")}
						</button>
						<button className="btn-check" onClick={clickCancel}>
							{t("lbl_No")}
						</button>
					</div>
				)
			});
		}
	};

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_openmail">
				<span>{t("lbl_PersonalMsg")}</span>
			</div>

			<div className="personal">
				<div className="list">
					<div className="functionMenu">
						<div className="checkbox">
							<input
								type="checkbox"
								id={`message-selectAll`}
								onChange={onClickCheckAll}
								checked={isCheckAll}
							/>
							<label
								htmlFor={`message-selectAll`}
								className="icon icon-checkbox-checked"></label>
						</div>
						<div>
							<button
								className="icon icon-bin"
								onClick={popDelete}></button>
						</div>
						<div>
							<ReloadSpin
								btnActive={loading}
								func={() => getMsgList(pagination.currentPage)}
							/>
						</div>
					</div>

					{msgListData.map(item => (
						<MessageList
							{...item}
							key={`msgList-${item.id}`}
							selectItems={selectItems}
							onChangeCheck={() => onChildChanged(item.id)}
							getMsgList={() =>
								getMsgList(pagination.currentPage)
							}
						/>
					))}
				</div>
			</div>
			{/* <!--pagination--> */}
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
