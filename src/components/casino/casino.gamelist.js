import React, { useContext } from "react";
import { popBoxContext } from "../common/context";
import config from "../../config";
import { SET_CASINO_ENTER_PAGE } from "../../service/enterPage";
import { defRowsPerPage } from "./casino.def";
import { defPopBoxType } from "../common/popBox";

export default ({
	displayGames,
	langId,
	isLogin,
	tpList,
	currentPage,
	favorite,
	onSetFavorite,
	t
}) => {
	const { setPopBox } = useContext(popBoxContext);
	let startIdx = (currentPage - 1) * defRowsPerPage;
	let endIdx = currentPage * defRowsPerPage;

	const onClickPlay = (tpId, gameId, isFree) => {
		if (isLogin) {
			SET_CASINO_ENTER_PAGE(tpId, gameId, isFree);
		} else {
			setPopBox({
				isOpen: true,
				popBoxType: defPopBoxType.Login
			});
		}
	};

	let rows = displayGames
		?.filter(g => tpList[g.tpId] !== undefined)
		.slice(startIdx, endIdx)
		.map(g => {
			let tpInfo = tpList[g.tpId];
			let imgName = g.imgName[langId] ? g.imgName[langId] : g.imgName.en;
			let gameDisplayName = g.name[langId] ? g.name[langId] : g.name.en;
			let isFavorite =
				favorite?.filter(f => {
					let fArr = f.split("_");
					return Number(fArr[0]) === g.tpId && fArr[1] === g.gameId;
				})?.length > 0;
			return (
				<div key={`casino-game-${g.tpId}-${g.gameId}`}>
					<div className="brand">
						<span>{tpInfo.displayText}</span>
					</div>
					<div
						onClick={onSetFavorite.bind(this, g.tpId, g.gameId)}
						className={`icon icon-star-full${
							isFavorite ? " active" : ""
						}`}></div>
					<img
						alt="Casino_tpInfo"
						src={`${config.imgUrl}/common/images/Casino/${tpInfo.name}/${imgName}`}
					/>
					<div className="txt-darkBlue">{gameDisplayName}</div>
					<div className="btnGroup">
						<button
							className="blue"
							onClick={onClickPlay.bind(
								this,
								g.tpId,
								g.gameId,
								false
							)}>
							Play Now
						</button>
						{tpInfo.playFree ? (
							<button
								className="blue"
								onClick={onClickPlay.bind(
									this,
									g.tpId,
									g.gameId,
									true
								)}>
								Free Play
							</button>
						) : null}
					</div>
				</div>
			);
		});

	return rows && rows.length > 0 ? (
		<div className="slotList">{rows}</div>
	) : (
		<div className="nodata">{t("msg_NoData")}</div>
	);
};
