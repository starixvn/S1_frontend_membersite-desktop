import React, { useState, useContext, useEffect, useRef } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import { api_message_GetAnnouncement } from "../service/api/message";
import {
	userInfoContext,
	popBoxContext,
	loadingContext
} from "../components/common/context";
import { defPopBoxType } from "../components/common/popBox";
import { useTranslation } from "react-i18next";
import moment from "moment";
import LeftMenu from "../components/common/leftMenu";

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
	const [announcementDatas, setAnnouncementDatas] = useState([]);

	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);
	const { loading, setLoading } = useContext(loadingContext);

	const isMountedRef = useRef(null);

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

	useEffect(() => {
		async function getData() {
			setLoading(true);
			await api_message_GetAnnouncement(userInfo.langId).then(
				({ data: { data, message, errorCode } }) => {
					if (!isMountedRef.current) return;

					const success = errorCode === 0;
					success
						? setAnnouncementDatas(data)
						: openErrorMessagePopBox(message || "error", errorCode);
				},
				err => {
					if (isMountedRef.current) openErrorMessagePopBox();
				}
			);
			setLoading(false);
		}

		getData();
	}, []);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	let arr = announcementDatas?.map(item => {
		let isToday =
			moment(item.startTime).format("YYYY-MM-DD") ===
			moment().format("YYYY-MM-DD");

		let displayTime = isToday
			? moment(item.startTime).format("hh:mm:ss A")
			: moment(item.startTime).format("MM/DD/YYYY");

		let textColor = isToday ? "txt-blue" : "";

		return (
			<div key={`announcement-${item.id}`}>
				<div className="listHeader">
					<div>{item.subject}</div>
					<div className={textColor}>{displayTime}</div>
				</div>
				<pre className="listBody">{item.content}</pre>
			</div>
		);
	});

	return loading ? null : (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_openmail">
				<span>{t("lbl_Announcement")}</span>
			</div>
			<div className="announcement">
				<div className="list">{arr}</div>
			</div>
		</div>
	);
};
