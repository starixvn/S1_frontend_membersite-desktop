import productList from "../../datas/productList";
import path from "../../path";

export const defMenuType = {
	entPage: "entPage",
	Link: "Link",
	LinkOrBtn: "LinkOrBtn"
};

export const defMenuLinks = {
	home: {
		path: path.home.root,
		className: "icon icon-home"
	},
	sports: {
		productInfo: productList.sports,
		path: path.sports.root,
		displayKey: "lbl_Sports"
	},
	eSport: {
		productInfo: productList.eSport,
		path: path.sports.root,
		displayKey: "lbl_eSports"
	},
	casino: {
		path: path.casino.root,
		displayKey: "lbl_Casino",
		subMenu: [
			{
				className: "JOKER",
				icon: "icon icon-JOKER",
				displayText: "JOKER",
				menuType: defMenuType.Link,
				parameter: { ...productList.casino_JOKER },
				...productList.casino_JOKER
			},
			{
				className: "GPI",
				icon: "icon icon-GPI",
				displayText: "GPI",
				menuType: defMenuType.Link,
				parameter: { ...productList.casino_GPI },
				...productList.casino_GPI
			},
			{
				className: "YGG",
				icon: "icon icon-YGG",
				displayText: "YGG",
				menuType: defMenuType.Link,
				parameter: { ...productList.casino_YGG },
				...productList.casino_YGG
			},
			{
				className: "SG",
				icon: "icon icon-SG",
				displayText: "SG",
				menuType: defMenuType.Link,
				parameter: { ...productList.casino_SG },
				...productList.casino_SG
			},
			{
				className: "PP",
				icon: "icon icon-PP",
				displayText: "PP",
				menuType: defMenuType.Link,
				parameter: { ...productList.casino_PP },
				...productList.casino_PP
			},
			{
				className: "PG",
				icon: "icon icon-PG",
				displayText: "PG",
				menuType: defMenuType.Link,
				parameter: { ...productList.casino_PG },
				...productList.casino_PG
			},
			{
				className: "OW",
				icon: "icon icon-OW",
				displayText: "OW",
				menuType: defMenuType.entPage,
				...productList.casino_OW
			}
		]
	},
	liveCasino: {
		displayKey: "lbl_LiveCasino",
		subMenu: [
			{
				...productList.liveCasino_MW,
				className: "liveMW icon icon-new",
				icon: "icon icon-PP",
				displayText: "PP",
				menuType: defMenuType.entPage
			},
			{
				...productList.liveCasino_WM,
				className: "liveWM icon icon-new",
				icon: "icon icon-WM",
				displayText: "WM",
				menuType: defMenuType.entPage
			},
			{
				...productList.liveCasino_Allbet,
				className: "liveALL",
				icon: "icon icon-AB",
				displayText: "Allbet",
				menuType: defMenuType.entPage
			},
			{
				...productList.liveCasino_eBET,
				className: "liveEB",
				icon: "icon icon-EB",
				displayText: "eBET",
				menuType: defMenuType.entPage
			},
			{
				...productList.liveCasino_SA,
				className: "liveSA",
				icon: "icon icon-SA",
				displayText: "SA",
				menuType: defMenuType.entPage
			},
			{
				...productList.liveCasino_AE,
				className: "liveAE",
				icon: "icon icon-AE",
				displayText: "AE",
				menuType: defMenuType.entPage
			},
			{
				...productList.liveCasino_PP,
				className: "livePP",
				icon: "icon icon-PP",
				displayText: "PP",
				menuType: defMenuType.entPage
			},
			{
				...productList.liveCasino_DG,
				className: "liveDG",
				icon: "icon icon-DG",
				displayText: "DG",
				menuType: defMenuType.entPage
			},
			{
				...productList.liveCasino_AG,
				className: "liveAG",
				icon: "icon icon-AG",
				displayText: "AG",
				menuType: defMenuType.entPage
			}
		]
	},
	lottery: {
		productInfo: productList.lottery,
		displayKey: "lbl_Lottery",
		subMenu: [
			{
				...productList.keno,
				className: "keno",
				displayKey: "lbl_Keno",
				menuType: defMenuType.LinkOrBtn,
				parameter: { ...productList.keno }
			},
			{
				...productList.lottery,
				className: "lottery",
				displayKey: "lbl_Lottery",
				menuType: defMenuType.LinkOrBtn,
				parameter: { ...productList.lottery }
			},
			{
				...productList.numberGame,
				path: path.sports.root,
				className: "numberGame",
				displayKey: "lbl_NumberGame",
				menuType: defMenuType.Link,
				parameter: { ...productList.numberGame }
			},
			{
				...productList.indo4D,
				className: "indo",
				displayKey: "Indo 4D",
				menuType: defMenuType.LinkOrBtn,
				parameter: { ...productList.indo4D }
			}
		]
	},
	fishing: {
		productInfo: productList.fishing,
		displayKey: "lbl_Fishing",
		subMenu: [
			{
				...productList.fishing,
				className: "fgg",
				displayKey: "lbl_FishingGG",
				menuType: defMenuType.entPage,
				parameter: { ...productList.fishing }
			},
			{
				...productList.fishing_SG,
				className: "fsg",
				displayKey: "lbl_FishingSG1",
				menuType: defMenuType.entPage,
				parameter: { ...productList.fishing_SG }
			},
			{
				...productList.fishing_SGW,
				className: "fsgw",
				displayKey: "lbl_FishingSG2",
				menuType: defMenuType.entPage,
				parameter: { ...productList.fishing_SGW }
			}
		]
	},
	cockFighting: {
		productInfo: productList.cockFighting,
		displayKey: "lbl_CockFighting",
		className: "COCK icon icon-new"
	},
	promotion: {
		path: path.promotion.root,
		displayKey: "lbl_Promotions"
	}
};

export const defSubListClassName = {
	casino: "casinoList",
	liveCasino: "livecasinoList",
	lottery: "gameList",
	fishing: "fishList"
};
