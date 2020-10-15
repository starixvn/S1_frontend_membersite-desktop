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
				className: "GPI",
				icon: "icon icon-GPI",
				displayText: "GPI",
				menuType: defMenuType.Link,
				tpId: 6,
				parameter: { tpId: 6 }
			},
			{
				className: "YGG",
				icon: "icon icon-YGG",
				displayText: "YGG",
				menuType: defMenuType.Link,
				tpId: 8,
				parameter: { tpId: 8 }
			},
			{
				className: "JOKER",
				icon: "icon icon-JOKER",
				displayText: "JOKER",
				menuType: defMenuType.Link,
				tpId: 9,
				parameter: { tpId: 9 }
			},
			{
				className: "SG",
				icon: "icon icon-SG",
				displayText: "SG",
				menuType: defMenuType.Link,
				tpId: 10,
				parameter: { tpId: 10 }
			},
			{
				className: "PP",
				icon: "icon icon-PP",
				displayText: "PP",
				menuType: defMenuType.Link,
				tpId: 5,
				parameter: { tpId: 5 }
			},
			{
				className: "PG",
				icon: "icon icon-PG",
				displayText: "PG",
				menuType: defMenuType.Link,
				tpId: 14,
				parameter: { tpId: 14 }
			},
			{
				className: "OW",
				icon: "icon icon-OW",
				displayText: "OW",
				menuType: defMenuType.entPage,
				tpId: 1,
				gameId: 208
			}
		]
	},
	liveCasino: {
		displayKey: "lbl_LiveCasino",
		subMenu: [
			{
				gameId: 4,
				tpId: 4,
				className: "liveDG",
				icon: "icon icon-DG",
				displayText: "DG",
				menuType: defMenuType.entPage
			},
			{
				gameId: 12,
				tpId: 12,
				className: "liveALL",
				icon: "icon icon-AB",
				displayText: "Allbet",
				menuType: defMenuType.entPage
			},
			{
				gameId: 3,
				tpId: 3,
				className: "liveAG",
				icon: "icon icon-AG",
				displayText: "AG",
				menuType: defMenuType.entPage
			},
			{
				gameId: 101,
				tpId: 5,
				className: "livePP",
				icon: "icon icon-PP",
				displayText: "PP",
				menuType: defMenuType.entPage
			},
			{
				gameId: 2,
				tpId: 2,
				className: "liveSA",
				icon: "icon icon-SA",
				displayText: "SA",
				menuType: defMenuType.entPage
			},
			{
				gameId: 15,
				tpId: 15,
				className: "liveAE",
				icon: "icon icon-AE",
				displayText: "AE",
				menuType: defMenuType.entPage
			},
			{
				gameId: 18,
				tpId: 18,
				className: "liveEB",
				icon: "icon icon-EB",
				displayText: "eBET",
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
		path: path.sports.root,
		displayKey: "lbl_Fishing"
	},
	promotion: {
		path: path.promotion.root,
		displayKey: "lbl_Promotions"
	}
};

export const defSubListClassName = {
	casino: "casinoList",
	liveCasino: "livecasinoList",
	lottery: "gameList"
};
