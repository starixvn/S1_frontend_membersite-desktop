import React, { Component, useContext, createRef } from "react";
import { useTranslation } from "react-i18next";
import { api_message_GetAnnouncement } from "../../service/api/message";
import { userInfoContext } from "../common/context";
import { GET_LANG_ID } from "../../service/language";
import { Redirect } from "@reach/router";
import path from "../../path";

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	let langId = GET_LANG_ID(userInfo.langId);

	return <Marquee langId={langId} i18n={t} isLogin={userInfo.isLogin} />;
};

class Marquee extends Component {
	state = {
		datas: [],
		pos: null,
		initWidth: 0,
		redirectPath: null
	};
	isMountedRef = false;
	marquee = createRef();
	content = createRef();

	componentDidMount = () => {
		this.isMountedRef = true;
		this.GetAnnouncement(this.props.langId);
		this.intervalId = setInterval(
			this.GetAnnouncement.bind(this, this.props.langId),
			60000
		);
	};

	componentWillUnmount = () => {
		this.isMountedRef = false;
		clearInterval(this.intervalId_Pos);
	};

	componentDidUpdate = () => {
		if (this.state.pos === null && this.isMountedRef) {
			let style = window.getComputedStyle(this.marquee.current, null);
			let pos = parseFloat(style.width);

			this.setState({ pos: pos, initWidth: pos });
		}
	};

	SetPos = () => {
		if (this.isMountedRef && this.state.prev !== null) {
			let _style = window.getComputedStyle(this.content.current, null);
			let contentBox = parseFloat(_style.width);

			this.setState(prev => {
				if (prev.pos <= -contentBox) {
					let style = window.getComputedStyle(
						this.marquee.current,
						null
					);
					let outerBox = parseFloat(style.width);

					return { pos: outerBox };
				} else {
					return { pos: prev.pos - 1.5 };
				}
			});
		}
	};

	GetAnnouncement = langId => {
		api_message_GetAnnouncement(langId).then(
			res => {
				if (this.isMountedRef) {
					if (res.data.errorCode === 0) {
						let resData = res.data.data;
						let stateData = this.state.datas;
						let update = false;

						if (resData.length !== 0 && stateData.length !== 0) {
							for (let d in resData) {
								let find = stateData.find(
									x =>
										x.id === resData[d].id &&
										x.subject === resData[d].subject &&
										x.content === resData[d].content
								);

								if (!find) {
									update = true;
									break;
								}
							}
						} else {
							update = true;
						}

						if (update) {
							if (this.intervalId_Pos === undefined) {
								this.intervalId_Pos = setInterval(
									this.SetPos,
									25
								);
							}
						}

						this.setState({
							datas: res.data.data
						});
					} else {
						alert(res.data.message);
					}
				}
			},
			err => {
				if (this.isMountedRef) {
					alert(this.props.i18n("msg_ApiServerError"));
				}
			}
		);
	};

	MarqueeOnMouseOver = () => {
		clearInterval(this.intervalId_Pos);
	};

	MarqueeOnMouseOut = () => {
		clearInterval(this.intervalId_Pos);
		this.intervalId_Pos = setInterval(this.SetPos, 25);
	};

	ClickMarquee = () => {
		if (this.props.isLogin) {
			this.setState({
				redirectPath: `/${this.props.langId}/${path.announcement.root}`
			});
		} else {
			this.setState({ redirectPath: `/login` });
		}
	};

	render() {
		let arr = this.state.datas.map(item => {
			return (
				<button
					key={`announcement-${item.id}`}
					style={{ paddingLeft: "2rem" }}
					onClick={this.ClickMarquee}
					onMouseOver={this.MarqueeOnMouseOver}
					onMouseOut={this.MarqueeOnMouseOut}>
					{item.subject}
				</button>
			);
		});

		let style = this.state.pos === null ? {} : { left: this.state.pos };
		return this.state.redirectPath === null ? (
			<div id="Marquee">
				<div
					className="marquee-box icon icon-marquee"
					ref={this.marquee}>
					<div
						className="marquee-run"
						ref={this.content}
						style={style}>
						{arr}
					</div>
				</div>
			</div>
		) : (
			<Redirect to={this.state.redirectPath} noThrow />
		);
	}
}
