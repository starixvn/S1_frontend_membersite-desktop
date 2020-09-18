import React, {
	useContext,
	useEffect,
	useRef,
	useState,
	forwardRef,
	createRef,
	Component
} from "react";
import { useTranslation } from "react-i18next";
import path from "../../path";
import { Link } from "@reach/router";
import {
	GET_OPEN_RULE,
	_ACTION_TYPE,
	OPEN_IN_BLANK
} from "../../service/enterPage";
import productList from "../../datas/productList";
import { userInfoContext } from "../common/context";

const defMenuKey = {
	sports: "lbl_Sports",
	numberGame: "lbl_NumberGame",
	virtualSport: "lbl_VirtualSport",
	casino: "lbl_Casino",
	liveCasino: "lbl_LiveCasino",
	kenoAndLottery: "lbl_KenoAndLottery",
	fishing: "lbl_Fishing"
};

const defMenuLinks = [
	{
		productInfo: productList.sports,
		path: path.sports.root,
		displayKey: defMenuKey.sports
	},
	{
		productInfo: productList.numberGame,
		path: path.sports.root,
		displayKey: defMenuKey.numberGame
	},
	{
		productInfo: productList.virtualSports,
		path: path.sports.root,
		displayKey: defMenuKey.virtualSport
	},
	{
		path: path.casino.root,
		displayKey: defMenuKey.casino
	},
	{
		path: path.liveCasino.root,
		displayKey: defMenuKey.liveCasino
	},
	{
		productInfo: productList.lottery,
		path: path.sports.root,
		displayKey: defMenuKey.kenoAndLottery
	},
	{
		productInfo: productList.fishing,
		path: path.sports.root,
		displayKey: defMenuKey.fishing
	}
];

const defSubMenu = {
	[defMenuKey.casino]: {
		className: "casinoList",
		childs: [
			{
				className: "GPI",
				icon: "GPI",
				displayKey: "GPI"
			},
			{
				className: "YGG",
				icon: "YGG",
				displayKey: "YGG"
			},
			{
				className: "JOKER",
				icon: "JOKER",
				displayKey: "JOKER"
			},
			{
				className: "SG",
				icon: "SG",
				displayKey: "SG"
			},
			{
				className: "PP",
				icon: "PP",
				displayKey: "PP"
			},
			{
				className: "PG",
				icon: "PG",
				displayKey: "PG"
			},
			{
				className: "OW",
				icon: "OW",
				displayKey: "OW"
			}
		]
	},
	[defMenuKey.liveCasino]: {
		className: "livecasinoList",
		childs: [
			{
				className: "liveDG",
				icon: "DG",
				displayKey: "DG"
			},
			{
				className: "liveALL",
				icon: "ALL",
				displayKey: "ALL"
			},
			{
				className: "liveAG",
				icon: "AG",
				displayKey: "AG"
			},
			{
				className: "livePP",
				icon: "PP",
				displayKey: "PP"
			},
			{
				className: "liveSA",
				icon: "SA",
				displayKey: "SA"
			}
		]
	}
};

const getUrl = (preUrl, info) => {
	return `${preUrl}?tpId=${info.tpId}&gameId=${info.gameId}`;
};

// class Menu extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = { subMenu: null };
// 		this.refs = {
// 			[defMenuKey.casino]: createRef(),
// 			[defMenuKey.liveCasino]: createRef()
// 		};
// 	}
// 	componentDidMount() {
// 		const onMouseOver = (key, e) => {
// 			if (subMenuContent) {
// 				console.log(subMenuContent.current.contains(e.target));
// 			}
// 			setSubMenu(() => key);
// 		};

// 		Object.keys(refs).forEach(key => {
// 			let itemRef = refs[key];
// 			if (itemRef.current) {
// 				itemRef.current.addEventListener(
// 					"mouseover",
// 					onMouseOver.bind(this, key)
// 				);
// 			}
// 		});
// 	}
// 	componentWillUnmount() {
// 		Object.keys(refs).forEach(key => {
// 			let itemRef = refs[key];
// 			itemRef.current.removeEventListener(
// 				"mouseover",
// 				onMouseOver.bind(this, key)
// 			);
// 		});
// 	}
// 	render() {
// 		let rows = defMenuLinks.map(m => {
// 			let key = `${m.displayKey}`;
// 			if (m.productInfo) {
// 				let rule = GET_OPEN_RULE(
// 					this.props.userInfo.langId,
// 					m.productInfo.tpId,
// 					m.productInfo.gameId
// 				);

// 				let isBlank = rule.actionType === _ACTION_TYPE.blank;
// 				return isBlank ? (
// 					<a
// 						key={key}
// 						onClick={OPEN_IN_BLANK.bind(
// 							this,
// 							rule.entPageUrl,
// 							rule.windowKey
// 						)}>
// 						{t(m.displayKey)}
// 					</a>
// 				) : (
// 					<Link
// 						key={key}
// 						to={getUrl(
// 							`${this.props.userInfo.langId}/${m.path}`,
// 							m.productInfo
// 						)}>
// 						{this.props.t(m.displayKey)}
// 					</Link>
// 				);
// 			} else {
// 				return (
// 					<Link
// 						key={key}
// 						to={`${this.props.userInfo.langId}/${m.path}`}
// 						ref={refs[m.displayKey]}>
// 						{this.props.t(m.displayKey)}
// 					</Link>
// 				);
// 			}
// 		});
// 		return (
// 			<div className="menu">
// 				{rows}
// 				<SubMenu subMenu={subMenu} />
// 			</div>
// 		);
// 	}
// }

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);
	return <></>;
	// return <Menu userInfo={userInfo} t={t} />;
};

const SubMenu = forwardRef(({ subMenu }, ref) => {
	let rows = Object.keys(defSubMenu).map(key => {
		let item = defSubMenu[key];
		let mainKey = `header-submenu-${key}`;
		let childs = item.childs.map(c => {
			return (
				<a
					href=""
					className={c.className}
					key={`${mainKey}-${c.displayKey}`}>
					<span className={`icon icon-${c.icon}`}>
						{c.displayKey}
					</span>
				</a>
			);
		});
		return (
			<div
				className={`${item.className}${
					subMenu === key ? " active" : ""
				}`}
				key={mainKey}>
				{childs}
			</div>
		);
	});

	return (
		<div
			className={`subMenu-Wrapper${subMenu !== null ? " active" : ""}`}
			ref={ref}>
			{rows}
		</div>
	);
});
