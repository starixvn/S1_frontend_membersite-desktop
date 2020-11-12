import React, { useState, useRef, useContext, useEffect } from "react";
import {
	api_account_GetMsgContent,
	api_account_GetMsgCount
} from "../../service/api/account";
import { useTranslation } from "react-i18next";
import { popBoxContext, msgCountContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";

import moment from "moment";

export default props => {
	const { t } = useTranslation();
	const [showContent, setShowContent] = useState(false);
	const [msgContentData, setMsgContentData] = useState("");

	const isMountedRef = useRef(null);

	const { setPopBox } = useContext(popBoxContext);
	const { setMsgCount } = useContext(msgCountContext);

	let compareDay = moment().diff(
		moment(props.createTime, "YYYY-MM-DD"),
		"day"
	);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const dateTimeFormat = () => {
		if (showContent) {
			return moment(props.createTime).format("YYYY-MM-DD HH:MM:ss");
		} else {
			return compareDay < 1
				? moment(props.createTime).format("HH:MM:ss")
				: moment(props.createTime).format("YYYY-MM-DD");
		}
	};

	const updateMsgList = () => {
		props.getMsgList();
	};

	const updateMsgCount = () => {
		api_account_GetMsgCount().then(res => {
			if (isMountedRef.current) {
				if (res.data.errorCode === 0) {
					setMsgCount(res.data.data);
				}
			}
		});
	};

	const getMsgContent = getMsg => {
		if (getMsg) {
			api_account_GetMsgContent(props.id).then(
				res => {
					if (isMountedRef.current) {
						const success = res.data.errorCode === 0;
						if (success) {
							setShowContent(true);
							setMsgContentData(res.data.data.content);

							updateMsgList();
							updateMsgCount();
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
				}
			);
		} else {
			setShowContent(false);
		}
	};

	return (
		<div className={props.flag ? "haveRead" : ""}>
			<div className="listHeader">
				<div className="checkbox">
					<input
						type="checkbox"
						id={`msgList-checkBox-${props.id}`}
						onChange={props.onChangeCheck}
						checked={props.selectItems.includes(props.id)}
					/>
					<label
						aria-label="msgList-checkBox"
						htmlFor={`msgList-checkBox-${props.id}`}
						className="icon icon-checkbox-checked"></label>
				</div>
				<div onClick={() => getMsgContent(!showContent)}>
					{props.title}
				</div>
				<div
					className="txt-blue"
					onClick={() => getMsgContent(!showContent)}>
					{dateTimeFormat()}

					<button className="icon icon-keyboard_arrow_down"></button>
				</div>
			</div>
			<div className={`listBody ${showContent ? "active" : ""}`}>
				{msgContentData}
			</div>
		</div>
	);
};
