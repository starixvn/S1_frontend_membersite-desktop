import React, { useEffect, useState, useContext, useRef } from "react";
import Swiper from "react-id-swiper";
import config from "../../config";
import { api_site_GetBanner } from "../../service/api/site";
import {
	userInfoContext,
	navContext,
	defNavPanel
} from "../../components/common/context";
import { SET_ENTER_PAGE } from "../../service/enterPage";
import path from "../../path";
import { Link } from "@reach/router";

export const defBannerFolder = {
	Sports: "Sports"
};

export const defSpecialActionLink = {
	SportsIndex: "Sports/Index"
};

export const ClickLink = (
	tpId,
	gameId,
	lang,
	href,
	isOuterLink,
	urlWithLang,
	isLogin,
	setNav,
	matchid,
	openInBlank
) => {
	if (href === "Casino/Lobby") {
		window.location.href = `/${lang}/${path.casino.root}${
			tpId ? `/${tpId}` : ""
		}`;
	} else if (tpId === null) {
		if (href === "Promotion/Index") {
			window.location.href = `/${lang}/${path.promotion.root}`;
		} else if (href === "Home/Register") {
		} else {
			window.open(
				isOuterLink
					? href
					: `${config.t_and_cURL}${
							urlWithLang ? `/${lang}` : ""
					  }/${href}`,
				"_blank"
			);
		}
	} else {
		SET_ENTER_PAGE({
			langId: lang,
			tpId,
			gameId,
			matchid,
			isLogin: isLogin === true,
			loginCallback: () => {
				setNav(defNavPanel.login);
			},
			openInBlank: openInBlank
		});
	}
};

const Panel = ({
	ImgFolder,
	withBtn,
	openInBlank,
	filterHideInHome = false
}) => {
	const [banner, setBanner] = useState([]);
	const { userInfo } = useContext(userInfoContext);
	const { setNav } = useContext(navContext);

	useEffect(() => {
		let mounted = true;
		if (userInfo.isLogin === null) {
			if (mounted) {
				setBanner([]);
			}
		} else {
			api_site_GetBanner(
				ImgFolder,
				"",
				userInfo.langId,
				filterHideInHome
			).then(res => {
				if (res.data.errorCode === 0 && mounted) {
					setBanner(res.data.data);
				}
			});
		}

		return () => (mounted = false);
	}, [userInfo.langId, userInfo.isLogin, ImgFolder, filterHideInHome]);

	let rows = banner?.map((b, idx) => {
		let _imgFolder = b.imgFolder ?? ImgFolder;
		let lang =
			b.fromDB || b.lang?.includes(userInfo.langId)
				? userInfo.langId
				: "en";

		let actionLinkByLang = b.fromDB
			? null
			: b.actionLinkByLang?.find(a => a.lang === userInfo.langId);
		let actionLink = actionLinkByLang
			? actionLinkByLang.link
			: b.actionLink;
		let imgSRC = b.imgURL
			? b.imgURL
			: `${config.imgUrl}/CMS/${config.siteName}/${_imgFolder}/${lang}/${b.img}`;

		let key = `${lang}-${b.img}-${idx}`;

		if (actionLink === defSpecialActionLink.SportsIndex) {
			return (
				<Link
					key={key}
					to={`${userInfo.langId}/${path.sports.root}?tpId=${b.tpId}&gameId=${b.gameId}&matchid=${b.matchid}`}>
					<img src={imgSRC} className="banner" alt={b.img ?? ""} />
				</Link>
			);
		} else if (
			b.fromDB &&
			b.actionLink.startsWith("promotion/promotionInfo?BonusCode=")
		) {
			return (
				<Link key={key} to={`${userInfo.langId}/${b.actionLink}`}>
					<img src={imgSRC} className="banner" alt={b.img ?? ""} />
				</Link>
			);
		} else {
			return (
				<button
					onClick={ClickLink.bind(
						this,
						b.tpId,
						b.gameId,
						lang,
						actionLink,
						b.outerLink === true,
						b.urlWithLang,
						userInfo.isLogin,
						setNav,
						b.matchid,
						openInBlank
					)}
					key={key}>
					<img src={imgSRC} className="banner" alt={b.img ?? ""} />
				</button>
			);
		}
	});

	return withBtn ? <AutoPlayWithBtn Rows={rows} /> : <Autoplay Rows={rows} />;
};

const defSwipperConfig = {
	spaceBetween: 30,
	centeredSlides: true,
	loop: true,
	autoplay: {
		delay: 2500,
		disableOnInteraction: false
	},
	pagination: {
		el: ".swiper-pagination",
		clickable: true
	},
	rebuildOnUpdate: true
};

const Autoplay = props => {
	const params = defSwipperConfig;
	return <Swiper {...params}>{props.Rows}</Swiper>;
};

const AutoPlayWithBtn = ({ Rows }) => {
	const params = {
		...defSwipperConfig,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev"
		},
		getSwiper: obj => {
			ref.current = obj;
		},
		renderPrevButton: () => (
			<div className="swiper-button-prev" onClick={goPrev}></div>
		),
		renderNextButton: () => (
			<div className="swiper-button-next" onClick={goNext}></div>
		)
	};
	const ref = useRef(null);

	const goNext = () => {
		if (ref.current !== null) {
			ref.current.slideNext();
		}
	};

	const goPrev = () => {
		if (ref.current !== null) {
			ref.current.slidePrev();
		}
	};

	return Rows && Rows.length > 0 ? (
		<>
			<div className="swiper-container">
				<div className="swiper-wrapper">
					<Swiper {...params}>{Rows}</Swiper>
				</div>
			</div>
		</>
	) : (
		<></>
	);
};

export default Panel;
