import productList from "../../datas/productList";
import path from "../../path";

export const defSportsBetting_Section1 = {
	soccer: {
		productInfo: productList.soccer,
		path: path.sports.root,
		displayKey: "lbl_SoccerBetting"
	},
	basketball: {
		productInfo: productList.basketball,
		path: path.sports.root,
		displayKey: "lbl_BasketballBetting"
	},
	baseball: {
		productInfo: productList.baseball,
		path: path.sports.root,
		displayKey: "lbl_BaseballBetting"
	},
	badmintion: {
		productInfo: productList.badmintion,
		path: path.sports.root,
		displayKey: "lbl_badminton"
	}
};

export const defSportsBetting_Section2 = {
	football: {
		productInfo: productList.football,
		path: path.sports.root,
		displayKey: "lbl_FootballBetting"
	},
	tennis: {
		productInfo: productList.tennis,
		path: path.sports.root,
		displayKey: "lbl_TennisBetting"
	},
	hockey: {
		productInfo: productList.hockey,
		path: path.sports.root,
		displayKey: "lbl_HockeyBetting"
	},
	eSport: {
		productInfo: productList.eSport,
		path: path.sports.root,
		displayKey: "lbl_eSportsBetting"
	}
};
