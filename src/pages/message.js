import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";

export default () => {
	const { t } = useTranslation();
	const [getMsgList, setGetMsgList] = useState([]);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});
	// let arr =
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<div className="functionList">
						<label className="checkbox">
							<input type="checkbox" />
							<i className="icon icon-checkbox"></i>Select All
						</label>
						<div className="smallBtn-group">
							<button className="icon icon-bin clickBtn"></button>
							<button className="icon icon-spinner11 clickBtn"></button>
						</div>
					</div>
					<div className="account read">
						<div className="info">
							<label className="checkbox">
								<input type="checkbox" />
								<i className="icon icon-checkbox"></i>
							</label>
							<div className="introduction">
								<span className="title">
									Your Deposit DD521 has been Approved
								</span>
								<span>2/4/2020 10:31:00 PM</span>
							</div>
							<button className="icon icon-circle-right"></button>
						</div>
						<div className="content">
							<pre>
								Your deposit request DD521 has been Approved.
								<br />
								Please check with CSD if you have any concern.
							</pre>
						</div>
					</div>
					<div className="account read">
						<div className="info">
							<label className="checkbox">
								<input type="checkbox" />
								<i className="icon icon-checkbox"></i>
							</label>
							<div className="introduction">
								<span className="title">
									Your Deposit DD521 has been Approved
								</span>
								<span>2/4/2020 10:31:00 PM</span>
							</div>
							<button className="icon icon-circle-right"></button>
						</div>
						<div className="content">
							Your deposit request DD521 has been Approved. Please
							check with CSD if you have any concern.
						</div>
					</div>
					<div className="account">
						<div className="info">
							<label className="checkbox">
								<input type="checkbox" />
								<i className="icon icon-checkbox"></i>
							</label>
							<div className="introduction">
								<span className="title">
									Your Deposit DD521 has been Approved
								</span>
								<span>2/4/2020 10:31:00 PM</span>
							</div>
							<button className="icon icon-circle-right"></button>
						</div>
						<div className="content">
							Your deposit request DD521 has been Approved. Please
							check with CSD if you have any concern.
						</div>
					</div>
					<div className="account">
						<div className="info">
							<label className="checkbox">
								<input type="checkbox" />
								<i className="icon icon-checkbox"></i>
							</label>
							<div className="introduction">
								<span className="title">
									Your Deposit DD521 has been Approved
								</span>
								<span>2/4/2020 10:31:00 PM</span>
							</div>
							<button className="icon icon-circle-right"></button>
						</div>
						<div className="content">
							Your deposit request DD521 has been Approved. Please
							check with CSD if you have any concern.
						</div>
					</div>
					<div className="account">
						<div className="info">
							<label className="checkbox">
								<input type="checkbox" />
								<i className="icon icon-checkbox"></i>
							</label>
							<div className="introduction">
								<span className="title">
									Your Deposit DD521 has been Approved
								</span>
								<span>2/4/2020 10:31:00 PM</span>
							</div>
							<button className="icon icon-circle-right"></button>
						</div>
						<div className="content">
							Your deposit request DD521 has been Approved. Please
							check with CSD if you have any concern.
						</div>
					</div>
					<div className="account">
						<div className="info">
							<label className="checkbox">
								<input type="checkbox" />
								<i className="icon icon-checkbox"></i>
							</label>
							<div className="introduction">
								<span className="title">
									Your Deposit DD521 has been Approved
								</span>
								<span>2/4/2020 10:31:00 PM</span>
							</div>
							<button className="icon icon-circle-right"></button>
						</div>
						<div className="content">
							Your deposit request DD521 has been Approved. Please
							check with CSD if you have any concern.
						</div>
					</div>
				</main>
			</Layout>
		</Wrapper>
	);
};

const Item = props => {
	return (
		<>
			<div className="account">
				<div className="info">
					<label className="checkbox">
						<input type="checkbox" />
						<i className="icon icon-checkbox"></i>
					</label>
					<div className="introduction">
						<span className="title">
							Your Deposit DD521 has been Approved
						</span>
						<span>2/4/2020 10:31:00 PM</span>
					</div>
					<button className="icon icon-circle-right"></button>
				</div>
				<div className="content">
					Your deposit request DD521 has been Approved. Please check
					with CSD if you have any concern.
				</div>
			</div>
		</>
	);
};
