import React, { useContext, useEffect, useRef } from "react";
import { userInfoContext, popBoxContext } from "../common/context";
import { useTranslation } from "react-i18next";
import { readCookie, setCookie } from "../common/common";
import { defPopBoxType } from "../common/popBox";
import { api_account_GetWalletInfo } from "../../service/api/account";
import SwipperBanner from "../common/swipperBanner";

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

import indexBannerPromotions from "../../styles/img/indexBannerPromotions.png";
import IndexBannerCasino from "../../styles/img/indexBannerCasion.png";
import indexBannerAffiliate from "../../styles/img/indexBannerAffiliate.png";
import IndexCenterBanner from "../../styles/img/indexCenterBanner.jpg";

import Marquee from "./marquee";
import productList from "../../datas/productList";
import { Link } from "@reach/router";
import path from "../../path";
import SideBarQuickLink from "./sideBarQuickLink";

import {
	GET_OPEN_RULE,
	_ACTION_TYPE,
	OPEN_IN_BLANK
} from "../../service/enterPage";

import { getUrl } from "../../components/common/linkItems";
import { SiteInfo } from "../../config";

const defGameListDatas = [
	{
		productInfo: productList.sports,
		leftImg: [{ src: NpcSoccerBG, className: "soccer" }],
		displayKey: "lbl_Soccer",
		cardClassName: "card_right",
		mainImg: NpcSoccer,
		icon: "icon icon-soccer"
	},
	{
		productInfo: productList.basketball,
		leftImg: [
			{ src: NpcBasketballBG2, className: "basketball" },
			{ src: NpcBasketballBG1, className: "basketball" }
		],
		cardClassName: "card_left",
		displayKey: "lbl_Basketball",
		mainImg: NpcBasketball,
		icon: "icon icon-basketball"
	},
	{
		productInfo: productList.baseball,
		leftImg: [{ src: NpcBaseballBG, className: "baseball" }],
		displayKey: "lbl_Baseball",
		cardClassName: "card_right",
		mainImg: NpcBaseball,
		icon: "icon icon-baseball"
	},
	{
		productInfo: productList.badminton,
		leftImg: [{ src: NpcBadmintonBG, className: "badminton" }],
		displayKey: "lbl_badminton",
		cardClassName: "card_right",
		mainImg: NpcBadminton,
		icon: "icon icon-badminton"
	},
	{
		productInfo: productList.tennis,
		leftImg: [{ src: NpcTennisBG, className: "tennis" }],
		displayKey: "lbl_Tennis",
		cardClassName: "card_left",
		mainImg: NpcTennis,
		icon: "icon icon-tennis"
	},
	{
		productInfo: productList.eSport,
		leftImg: [{ src: NpcESportBG, className: "esport" }],
		displayKey: "lbl_eSports",
		cardClassName: "card_right",
		mainImg: NpcESport,
		icon: "icon icon-esport"
	}
];

const SportsSection = ({ t, langId, isLogin, showLogin }) => {
	const gameListRows = defGameListDatas.map(m => {
		let displayText = t(m.displayKey) ?? m.displayKey;
		let _path = m.path;
		let key = `home-SportsSection-${m.displayKey}`;

		let leftImgs = m.leftImg.map((img, imgIdx) => {
			return (
				<img
					key={`${m.displayKey}-leftImg-${imgIdx}`}
					src={img.src}
					className={img.className}
					alt=""
				/>
			);
		});

		const content = (
			<div className="container">
				<div className={m.cardClassName}>{leftImgs}</div>
				<span className={m.icon}>{displayText}</span>
				<div className="npc">
					<img src={m.mainImg} alt={`img of ${displayText}`} />
				</div>
			</div>
		);

		if (m.productInfo) {
			let rule = GET_OPEN_RULE(
				langId,
				m.productInfo.tpId,
				m.productInfo.gameId
			);

			if (
				m.productInfo.tpId === 1 &&
				rule.actionType === _ACTION_TYPE.redirect
			) {
				_path = path.sports.root;
			}

			if (rule.needLogin && isLogin === false) {
				return (
					<a onClick={showLogin} key={key}>
						{content}
					</a>
				);
			} else if (rule.actionType === _ACTION_TYPE.blank) {
				return (
					<a
						key={key}
						onClick={OPEN_IN_BLANK.bind(
							this,
							rule.entPageUrl,
							rule.windowKey
						)}>
						{content}
					</a>
				);
			} else {
				let _url = getUrl(`${langId}/${_path}`, m.productInfo);

				return (
					<Link key={key} to={_url}>
						{content}
					</Link>
				);
			}
		} else {
			return (
				<Link key={key} to={`/${langId}/${_path}`}>
					{content}
				</Link>
			);
		}
	});

	return <div className="gamelistsport">{gameListRows}</div>;
};

const defSideBarProducts = langId => [
	{
		path: path.promotion.root,
		icon: "icon icon-gift",
		displayKey: "lbl_Promotions",
		descriptionKey: "lbl_PromotionSlog",
		mainImg: indexBannerPromotions
	},
	{
		path: path.casino.root,
		icon: "icon icon-casino",
		displayKey: "lbl_Casino",
		descriptionKey: "lbl_CasinoSlog",
		mainImg: IndexBannerCasino
	},
	{
		href: `${SiteInfo.affiliateLink}/?lang=${langId}`,
		icon: "icon icon-affiliate",
		displayKey: "lbl_Affiliates",
		descriptionKey: "lbl_AffiliateSlog",
		mainImg: indexBannerAffiliate
	}
];

const SideBarProductSection = ({ t, langId, isLogin, showLogin }) => {
	const rows = defSideBarProducts(langId).map(m => {
		let displayText = t(m.displayKey) ?? m.displayKey;
		let _path = m.path;
		let key = `home-sideBarProduct-${m.displayKey}`;

		const content = (
			<>
				<div>
					<i className={m.icon}></i>
					<span>{displayText}</span>
					<span>{t(m.descriptionKey) ?? m.descriptionKey}</span>
				</div>
				<img src={m.mainImg} alt={`img of ${displayText}`} />
			</>
		);

		if (m.productInfo) {
			let rule = GET_OPEN_RULE(
				langId,
				m.productInfo.tpId,
				m.productInfo.gameId
			);

			if (
				m.productInfo.tpId === 1 &&
				rule.actionType === _ACTION_TYPE.redirect
			) {
				_path = path.sports.root;
			}

			if (rule.needLogin && isLogin === false) {
				return (
					<button onClick={showLogin} key={key}>
						{content}
					</button>
				);
			} else if (rule.actionType === _ACTION_TYPE.blank) {
				return (
					<a
						key={key}
						onClick={OPEN_IN_BLANK.bind(
							this,
							rule.entPageUrl,
							rule.windowKey
						)}>
						{content}
					</a>
				);
			} else {
				let _url = getUrl(`${langId}/${_path}`, m.productInfo);

				return (
					<Link key={key} to={_url}>
						{content}
					</Link>
				);
			}
		} else if (m.href) {
			return (
				<a key={key} target="_blank" href={m.href}>
					{content}
				</a>
			);
		} else {
			return (
				<Link key={key} to={`/${langId}/${_path}`}>
					{content}
				</Link>
			);
		}
	});

	return <div className="gamelistother">{rows}</div>;
};

const IndexPage = () => {
	const { t } = useTranslation();

	const { userInfo } = useContext(userInfoContext);
	const { setPopBox } = useContext(popBoxContext);

	const showLogin = () => {
		setPopBox({
			isOpen: true,
			popBoxType: defPopBoxType.Login
		});
	};

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

	return (
		<main>
			<SwipperBanner ImgFolder="Promotion" filterHideInHome={true} />
			<Marquee />
			<section>
				<SportsSection t={t} showLogin={showLogin} {...userInfo} />
				<SideBarProductSection
					t={t}
					showLogin={showLogin}
					{...userInfo}
				/>
			</section>
			<img src={IndexCenterBanner} alt="IndexCenterBanner" />
			<SideBarQuickLink />
		</main>
	);
};

export default IndexPage;
