import React, { useContext } from "react";
import path from "../../path";
import productList from "../../datas/productList";
import { navigate } from "@reach/router";
import { popBoxContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { SET_ENTER_PAGE } from "../../service/enterPage";

const defPlatfrom = [
	{
		...productList.sports,
		path: path.sports.root,
		parameter: { ...productList.sports }
	},
	{
		...productList.liveCasino_Allbet
	},
	{
		...productList.fishing
	},
	{
		...productList.liveCasino_AG
	},
	{
		...productList.casino_JOKER,
		path: path.casino.root,
		parameter: { ...productList.casino_JOKER }
	},
	{
		...productList.casino_GPI,
		path: path.casino.root,
		parameter: { ...productList.casino_GPI }
	},
	{
		...productList.liveCasino_DG
	},
	{
		...productList.liveCasino_SA
	},
	{
		...productList.casino_YGG,
		path: path.casino.root,
		parameter: { ...productList.casino_YGG }
	},
	{
		...productList.casino_PP,
		path: path.casino.root,
		parameter: { ...productList.casino_PP }
	},
	{
		...productList.casino_SG,
		path: path.casino.root,
		parameter: { ...productList.casino_SG }
	},
	{
		...productList.casino_PG,
		path: path.casino.root,
		parameter: { ...productList.casino_PG }
	},
	{
		...productList.liveCasino_eBET
	}
];

export default ({ langId, isLogin }) => {
	const { setPopBox } = useContext(popBoxContext);
	const ClickItem = ({ path, urlParams, tpId, gameId }) => {
		const loginCallback = () => {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.Login
			});
		};

		if (path) {
			navigate(`/${langId}/${path}${urlParams}`);
		} else {
			SET_ENTER_PAGE({
				isLogin,
				langId,
				tpId,
				gameId,
				loginCallback: loginCallback
			});
		}
	};

	let rows = defPlatfrom.map(p => {
		let key = `footer-platform-${p.tpId}-${p.gameId}`;
		let params = null;
		if (p.parameter) {
			params = Object.keys(p.parameter).map(key => {
				return `${key}=${p.parameter[key]}`;
			});
		}

		let _urlParams = params !== null ? `?${params.join("&")}` : "";

		return (
			<button
				key={key}
				onClick={ClickItem.bind(this, { ...p, urlParams: _urlParams })}
			/>
		);
	});
	return <div className="platform">{rows}</div>;
};
