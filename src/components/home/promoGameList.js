import React, { useContext, useRef } from "react";
import { SET_ENTER_PAGE, SET_CASINO_ENTER_PAGE } from "../../service/enterPage";
import { defPopBoxType } from "../common/popBox";
import { popBoxContext } from "../common/context";
import game1 from "../../styles/img/game1.png";
import game2 from "../../styles/img/game2.png";
import game3 from "../../styles/img/game3.png";
import game4 from "../../styles/img/game4.png";
import game5 from "../../styles/img/game5.png";
import game6 from "../../styles/img/game6.png";
import game7 from "../../styles/img/game7.png";
import game8 from "../../styles/img/game8.png";
import game9 from "../../styles/img/game9.png";
import game10 from "../../styles/img/game10.png";
import game11 from "../../styles/img/game11.png";
import Swiper from "react-id-swiper";

const defLinkType = {
	default: "default",
	casino: "casino"
};

const defGameList = [
	{
		img: game1,
		displayKey: "lbl_wm",
		tpId: 20,
		gameId: 20
	},
	{
		img: game2,
		displayKey: "lbl_baccarat",
		tpId: 1,
		gameId: 208
	},
	{
		img: game3,
		displayKey: "lbl_dragon_tiger",
		tpId: 1,
		gameId: 208
	},
	{
		img: game4,
		displayKey: "lbl_belangkai",
		tpId: 9,
		gameId: "3uim5ppkiqwk1"
	},
	{
		img: game5,
		displayKey: "lbl_hulu",
		tpId: 9,
		gameId: "yr1zy9u9xt6zr"
	},
	{
		img: game6,
		displayKey: "lbl_multihand_blackjack",
		tpId: 5,
		gameId: "bjma"
	},
	{
		img: game7,
		displayKey: "lbl_888_dragon",
		tpId: 5,
		gameId: "vs1dragon8"
	},
	{
		img: game8,
		displayKey: "lbl_three_star_fortune",
		tpId: 5,
		gameId: "vs10threestar"
	},
	{
		img: game9,
		displayKey: "lbl_5_fortune_dragons",
		tpId: 10,
		gameId: "S-FD01",
		linkType: defLinkType.casino
	},
	{
		img: game10,
		displayKey: "lbl_god_of_fortune",
		tpId: 6,
		gameId: "godoffortune"
	},
	{
		img: game11,
		displayKey: "lbl_lucky_neko",
		tpId: 5,
		gameId: 7382
	}
];

export default ({ t, userInfo }) => {
	const { setPopBox } = useContext(popBoxContext);

	const ClickGame = (tpId, gameId, betType, linkType) => {
		const LoginPopBox = () => {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.Login
			});
		};

		if (linkType === defLinkType.casino) {
			if (userInfo.isLogin !== true) {
				LoginPopBox();
			} else {
				SET_CASINO_ENTER_PAGE(tpId, gameId, false, userInfo.langId);
			}
		} else {
			SET_ENTER_PAGE({
				langId: userInfo.langId,
				tpId: tpId,
				gameId: gameId,
				isLogin: userInfo.isLogin,
				// betType: betType,
				loginCallback: LoginPopBox
			});
		}
	};

	const defSwipperConfig = {
		spaceBetween: 20,
		slidesPerView: 8,
		centeredSlides: true,
		loopFillGroupWithBlank: true,
		loop: true,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false
		},
		// pagination: {
		// 	el: ".swiper-pagination",
		// 	clickable: true
		// },
		rebuildOnUpdate: true
	};

	const params = {
		...defSwipperConfig,
		// navigation: {
		// 	nextEl: ".swiper-button-next",
		// 	prevEl: ".swiper-button-prev"
		// },
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

	let Rows = defGameList.map(g => {
		let displayText = t(g.displayKey) ?? g.displayKey;
		return (
			<div
				className="swiper-slide"
				key={`promoGameList-${g.displayKey}`}
				onClick={ClickGame.bind(
					this,
					g.tpId,
					g.gameId,
					// g.betType,
					g.linkType
				)}>
				<img src={g.img} alt={displayText} />
				<span>{displayText}</span>
			</div>
		);
	});

	return Rows && Rows.length > 0 ? (
		<div className="gameMenu">
			<div className="swiper-container gameSwiper">
				<div className="swiper-wrapper">
					<Swiper {...params}>{Rows}</Swiper>
				</div>
			</div>
			<div className="swiper-button-next" onClick={goNext}></div>
			<div className="swiper-button-prev" onClick={goPrev}></div>
		</div>
	) : (
		<></>
	);
};
