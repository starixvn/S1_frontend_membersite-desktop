import React, { useState, useContext, useEffect, useRef } from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import { api_message_GetAnnouncement } from "../service/api/message";
import { userInfoContext, popBoxContext } from "../components/common/context";
import { defPopBoxType } from "../components/common/popBox";
import { useTranslation } from "react-i18next";
import moment from "moment";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						{/* test only, remove later. start */}
						<div id="leftMenu">
							<div className="menuModule">
								<button className="menuHeader">Cashier</button>
								<a className="menuSelect active">
									<span>Deposit</span>
								</a>
								<a className="menuSelect">
									<span>Transfer Funds</span>
								</a>
								<a className="menuSelect">
									<span>Withdrawal</span>
								</a>
							</div>
							<div className="menuModule">
								<button className="menuHeader">History</button>
								<a className="menuSelect">
									<span>Deposit History</span>
								</a>
								<a className="menuSelect">
									<span>Transfer History</span>
								</a>
								<a className="menuSelect">
									<span>Withdrawal History</span>
								</a>
								<a className="menuSelect">
									<span>Statement</span>
								</a>
							</div>
							<div className="menuModule">
								<button className="menuHeader">
									My Account
								</button>
								<a className="menuSelect">
									<span>Change Password</span>
								</a>
								<a className="menuSelect">
									<span>Profile</span>
								</a>
								<a className="menuSelect">
									<span>Bank Info</span>
								</a>
							</div>
							<div className="menuModule">
								<button className="menuHeader">Message</button>
								<button className="menuSelect">
									<span>Personal Message</span>
								</button>
								<button className="menuSelect">
									<span>Announcement</span>
								</button>
							</div>
						</div>
						{/* test only, remove later. end */}

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

	const isMountedRef = useRef(null);

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_message_GetAnnouncement(userInfo.langId).then(
			res => {
				if (isMountedRef.current) {
					const success = res.data.errorCode === 0;
					if (success) {
						setAnnouncementDatas(res.data.data);
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
	}, []);

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

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-icon32px_openmail">
				<span>Announcement</span>
			</div>
			<div className="announcement">
				<div className="list">{arr}</div>
			</div>
		</div>
	);
};
