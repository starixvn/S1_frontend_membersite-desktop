import React, { useContext, useEffect, useRef } from "react";
import { userInfoContext, popBoxContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { readCookie, setCookie } from "../common/common";
import { defPopBoxType } from "../common/popBox";
import { api_account_GetWalletInfo } from "../../service/api/account";

import IndexBanner from "../../styles/img/indexBanner.jpg";
import NpcSoccer from "../../styles/img/npc-soccer.png";
import NpcSoccerBG from "../../styles/img/soccerBG.jpg";

import NpcBasketball from "../../styles/img/npc-basketball.png";
import NpcBasketballBG2 from "../../styles/img/basketballBG2.jpg";
import NpcBasketballBG1 from "../../styles/img/basketballBG1.jpg";

import NpcBaseball from "../../styles/img/npc-baseball.png";
import NpcBaseballBG from "../../styles/img/baseballBG.jpg";

import NpcBadminton from "../../styles/img/npc-badminton.png";
import NpcBadmintonBG from "../../styles/img/badmintonBG.jpg";

import NpcTennis from "../../styles/img/npc-tennis.png";
import NpcTennisBG from "../../styles/img/tennisBG.jpg";

import NpcESport from "../../styles/img/npc-esport.png";
import NpcESportBG from "../../styles/img/esportBG.jpg";

import IndexBannerLiveCasino from "../../styles/img/indexBannerLiveCasion.png";
import IndexBannerCasino from "../../styles/img/indexBannerCasion.png";
import IndexBannerKeno from "../../styles/img/indexBannerKeno.png";
import IndexCenterBanner from "../../styles/img/indexCenterBanner.jpg";

import Marquee from "./marquee";

const defGameListDatas = [
	{
		leftImg: [{ src: NpcSoccerBG, className: "soccer" }],
		displayKey: "lbl_Soccer",
		mainImg: NpcSoccer,
		icon: "icon icon-soccer"
	},
	{
		leftImg: [
			{ src: NpcBasketballBG2, className: "basketball" },
			{ src: NpcBasketballBG1, className: "basketball" }
		],
		displayKey: "lbl_Basketball",
		mainImg: NpcBasketball,
		icon: "icon icon-basketball"
	},
	{
		leftImg: [{ src: NpcBaseballBG, className: "baseball" }],
		displayKey: "lbl_Baseball",
		mainImg: NpcBaseball,
		icon: "icon icon-baseball"
	},
	{
		leftImg: [{ src: NpcBadmintonBG, className: "badminton" }],
		displayKey: "lbl_badminton",
		mainImg: NpcBadminton,
		icon: "icon icon-badminton"
	},
	{
		leftImg: [{ src: NpcTennisBG, className: "tennis" }],
		displayKey: "lbl_Tennis",
		mainImg: NpcTennis,
		icon: "icon icon-tennis"
	},
	{
		leftImg: [{ src: NpcESportBG, className: "esport" }],
		displayKey: "lbl_eSports",
		mainImg: NpcESport,
		icon: "icon icon-esport"
	}
];

const IndexPage = () => {
	const { t } = useTranslation();

	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);

	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		if (userInfo.isLogin && userInfo.userName) {
			let cookieName = `balanceHint${userInfo.userName}`;
			let showDepositHint = false;
			if (readCookie(cookieName) !== "1") {
				setCookie(cookieName, "1", 1);
				showDepositHint = true;
			}

			if (showDepositHint) {
				api_account_GetWalletInfo().then(res => {
					if (res.data.errorCode === 0 && isMountedRef.current) {
						let tpWallets = res.data.data.tpWallets?.map(t => {
							return {
								tpId: t.tpId,
								balance: t.balance
							};
						});

						let hasBalance =
							res.data.data?.balance ||
							tpWallets?.filter(t => {
								return t.balance > 0;
							}).length >= 1;

						if (!hasBalance && showDepositHint) {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.DepositHint
							});
						}
					}
				});
			}
		}
	}, [userInfo.isLogin, userInfo.userName, setPopBox]);

	const gameListRows = defGameListDatas.map(d => {
		let leftImgs = d.leftImg.map((img, imgIdx) => {
			return (
				<img
					key={`${d.displayKey}-leftImg-${imgIdx}`}
					src={img.src}
					className={img.className}
				/>
			);
		});
		return (
			<a href="" key={`Home-game-${d.displayKey}`}>
				<div className="container">
					<div className="card_right">{leftImgs}</div>
					<span className={d.icon}>{t(d.displayKey)}</span>
					<div className="npc">
						<img src={d.mainImg} />
					</div>
				</div>
			</a>
		);
	});
	return (
		<main>
			<div className="swiper-container">
				<div className="swiper-wrapper">
					<div className="swiper-slide">
						<img src={IndexBanner} alt="banner" />
					</div>
					<div className="swiper-slide">
						<img src={IndexBanner} alt="banner" />
					</div>
					<div className="swiper-slide">
						<img src={IndexBanner} alt="banner" />
					</div>
				</div>
				<div className="swiper-pagination"></div>
			</div>
			<Marquee />
			<section>
				<div className="gamelistsport">{gameListRows}</div>
				<div className="gamelistother">
					<a href="">
						<div>
							<i className="icon icon-livecasino"></i>
							<span>{t("lbl_LiveCasino")}</span>
							<span>Real Casino Experience</span>
						</div>
						<img
							src={IndexBannerLiveCasino}
							alt="IndexBannerLiveCasino"
						/>
					</a>
					<a href="">
						<div>
							<i className="icon icon-casino"></i>
							<span>{t("lbl_Casino")}</span>
							<span>Multiple Themes For Asian Market</span>
						</div>
						<img src={IndexBannerCasino} alt="IndexBannerCasino" />
					</a>
					<a href="">
						<div>
							<i className="icon icon-keno"></i>
							<span>{t("lbl_Keno")}</span>
							<span>Many ways to play,more chances to win !</span>
						</div>
						<img src={IndexBannerKeno} alt="IndexBannerKeno" />
					</a>
				</div>
			</section>
			<img src={IndexCenterBanner} alt="IndexCenterBanner" />
			{/* <div className="quickLink">
						<div>
							<i className="icon icon-arrow-left2">Contact Us</i>
						</div>
						<div>
							<ul>
								<li className="icon icon-chat">
									<a>Live Chat</a>
								</li>
								<li className="icon icon-instagram">
									<a>Instagram</a>
								</li>
								<li className="icon icon-facebook2">
									<a>Facebook</a>
								</li>
								<li className="icon icon-twitter">
									<a>Twitter</a>
								</li>
							</ul>
						</div>
					</div> */}
		</main>
	);
};

export default IndexPage;
