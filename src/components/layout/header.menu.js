import React, { useContext } from "react";
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

const defMenuLinks = [
	{
		productInfo: productList.sports,
		path: path.sports.root,
		displayKey: "lbl_Sports"
	},
	{
		productInfo: productList.numberGame,
		path: path.sports.root,
		displayKey: "lbl_NumberGame"
	},
	{
		productInfo: productList.virtualSports,
		path: path.sports.root,
		displayKey: "lbl_VirtualSport"
	},
	{
		path: path.casino.root,
		displayKey: "lbl_Casino",
		subMenu: [
			{
				icon: "icon icon-GPI",
				displayText: "GPI"
			}
		]
	},
	{
		path: path.liveCasino.root,
		displayKey: "lbl_LiveCasino"
	},
	{
		productInfo: productList.lottery,
		path: path.sports.root,
		displayKey: "lbl_KenoAndLottery"
	},
	{
		productInfo: productList.fishing,
		path: path.sports.root,
		displayKey: "lbl_Fishing"
	}
];

const getUrl = (preUrl, info) => {
	return `${preUrl}?tpId=${info.tpId}&gameId=${info.gameId}`;
};

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);

	let rows = defMenuLinks.map(m => {
		let key = `${m.displayKey}`;
		if (m.productInfo) {
			let rule = GET_OPEN_RULE(
				userInfo.langId,
				m.productInfo.tpId,
				m.productInfo.gameId
			);

			let isBlank = rule.actionType === _ACTION_TYPE.blank;
			return isBlank ? (
				<a
					key={key}
					onClick={OPEN_IN_BLANK.bind(
						this,
						rule.entPageUrl,
						rule.windowKey
					)}>
					{t(m.displayKey)}
				</a>
			) : (
				<Link
					key={key}
					to={getUrl(`${userInfo.langId}/${m.path}`, m.productInfo)}>
					{t(m.displayKey)}
				</Link>
			);
		} else {
			return (
				<Link key={key} to={`${userInfo.langId}/${m.path}`}>
					{t(m.displayKey)}
				</Link>
			);
		}
	});

	return <div className="menu">{rows}</div>;
};
