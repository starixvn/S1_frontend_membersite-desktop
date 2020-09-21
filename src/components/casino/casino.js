import React, { useState, useRef, useEffect, useContext } from "react";
import Nav from "./casino.nav";
import SearchBox from "./casino.searchBox";
import GameList from "./casino.gamelist";

import { api_site_GetGamelist } from "../../service/api/site";
import {
	api_account_SetFavoriteGame,
	api_account_GetFavoriteGame
} from "../../service/api/account";
import { popBoxContext, userInfoContext } from "../common/context";
import { defPopBoxType } from "../common/popBox";
import { useTranslation } from "react-i18next";
import { defNav, defRowsPerPage, defSearchColumn } from "./casino.def";
import { getUrlParameter } from "../common/common";
import { Pagination } from "../common/pagination";

const matchKeyword = (name, _keyword) => {
	let keyword = _keyword.toLowerCase();
	return (
		Object.keys(name)?.filter(key => {
			return name[key].toLowerCase().indexOf(keyword) !== -1;
		}).length > 0
	);
};

export default () => {
	const { t } = useTranslation();
	const [selNav, setSelNav] = useState(defNav.ALLGAMES.key);
	const [favorite, setFavorite] = useState([]);
	const [tpList, setTpList] = useState({});
	const [gameDatas, setGameDatas] = useState([]);
	const [tpOptions, setTpOptions] = useState([]);
	const [displayGames, setDisplayGames] = useState([]);
	const [pageInfo, setPageInfo] = useState({ currentPage: 1, totalPages: 1 });

	const [searchInfo, setSearchInfo] = useState({
		[defSearchColumn.searchText]: "",
		[defSearchColumn.provider]: { idx: 0, value: null }
	});

	const isMountedRef = useRef(null);
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);

	const urlTpId = getUrlParameter("tpId");

	const clickClose = () => {
		setPopBox({ isOpen: false });
	};

	const clickPageNumber = page => {
		setPageInfo(prevS => ({
			...prevS,
			currentPage: page
		}));
	};

	const onSelectNav = navKey => {
		if (navKey !== selNav) {
			setSelNav(navKey);
			SetGames({
				_searchInfo: searchInfo,
				_selNav: navKey,
				_gameDatas: gameDatas,
				_tpList: tpList
			});
		}
	};

	const FilterGames = (
		_searchInfo,
		_nav,
		initGameDatas,
		initTpList,
		_favorite
	) => {
		let _gameDatas = initGameDatas ?? gameDatas;
		let _tpList = initTpList ?? tpList;
		let tpId = _searchInfo.provider.value;
		let searchText = _searchInfo.searchText;

		const matchFilter = (tpId, g) => {
			let matchNav =
				(_nav === defNav.PROMO.key && g.promotion === 1) ||
				(_nav === defNav.FEATURED.key && g.featured === true) ||
				(_nav === defNav.FAVOURITE.key &&
					_favorite.includes(`${tpId}_${g.gameId}`)) ||
				_nav === defNav.ALLGAMES.key;
			return (
				matchNav &&
				(searchText === "" || matchKeyword(g.name, searchText))
			);
		};

		return _gameDatas?.filter(g => {
			let tp = _tpList[g.tpId];
			return (
				(tpId === null || tp.value === tpId) && matchFilter(tp.value, g)
			);
		});
	};

	const SetGames = ({
		_searchInfo,
		_selNav,
		_gameDatas,
		_tpList,
		_favorite = favorite
	}) => {
		let _displayGames = FilterGames(
			_searchInfo,
			_selNav,
			_gameDatas,
			_tpList,
			_favorite
		);

		let _totalPages =
			_displayGames.length === 0
				? 1
				: Math.ceil(_displayGames.length / defRowsPerPage);

		let _currentPage =
			pageInfo.currentPage > _totalPages
				? _totalPages
				: pageInfo.currentPage;
		setDisplayGames(_displayGames);
		setPageInfo(prevS => ({
			...prevS,
			currentPage: _currentPage,
			totalPages: _totalPages
		}));
	};

	const onSetFavorite = (tpId, gameId) => {
		let key = `${tpId}_${gameId}`;
		let isRemove = favorite?.includes(key);
		let newFav = isRemove
			? favorite?.filter(f => f !== key)
			: [...favorite, key];
		setFavorite(newFav);
		SetGames({
			_searchInfo: searchInfo,
			_selNav: selNav,
			_gameDatas: gameDatas,
			_tpList: tpList,
			_favorite: newFav
		});
		if (userInfo.isLogin) {
			api_account_SetFavoriteGame(tpId, gameId, isRemove);
		}
	};

	const EditSearchField = (column, value, pressEnter) => {
		let _searchInfo = searchInfo;
		if (column === defSearchColumn.searchText) {
			setSearchInfo(prevS => {
				_searchInfo = { ...prevS, [column]: value };
				return _searchInfo;
			});
			if (pressEnter) {
				SubmitSearch(_searchInfo);
			}
		} else {
			setSearchInfo(prevS => {
				_searchInfo = {
					...prevS,
					[column]: { idx: value, value: tpOptions[value].id }
				};
				return _searchInfo;
			});

			SetGames({
				_searchInfo: _searchInfo,
				_selNav: selNav,
				_gameDatas: gameDatas,
				_tpList: tpList
			});
		}
	};

	const SubmitSearch = _searchInfo => {
		SetGames({
			_searchInfo: searchInfo,
			_selNav: selNav,
			_gameDatas: gameDatas,
			_tpList: tpList
		});
	};

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_site_GetGamelist().then(
			res => {
				const success = res.data.errorCode === 0;
				const { data } = res.data;
				if (success) {
					let _tpList = {};
					let _tpOptions = [{ displayText: "All", id: null }];
					let games = [];

					data.forEach(gameInfo => {
						_tpList[gameInfo.value] = { ...gameInfo };
						_tpOptions.push({
							displayText: gameInfo.displayText,
							id: gameInfo.value
						});

						if (gameInfo.gameList.data) {
							gameInfo.gameList.data.forEach(list => {
								games.push({
									tpId: gameInfo.value,
									...list
								});
							});
						}
					});

					if (games.length) {
						for (let index = 0; index < games.length; index++) {
							let idx = Math.floor(Math.random() * games.length);
							let tempEle1 = games[index];
							let tempEle2 = games[idx];

							games[index] = tempEle2;
							games[idx] = tempEle1;
						}
					}

					if (isMountedRef.current) {
						setTpList(_tpList);
						setGameDatas(games);
						setTpOptions(_tpOptions);

						let _searchInfo = searchInfo;

						if (urlTpId) {
							let idx = _tpOptions.findIndex(
								x => x.id === Number(urlTpId)
							);

							if (idx !== -1) {
								setSearchInfo(prevS => {
									_searchInfo = {
										...prevS,
										provider: {
											idx,
											value: _tpOptions[idx].id
										}
									};
									return _searchInfo;
								});
							}
						}

						SetGames({
							_searchInfo,
							_selNav: selNav,
							_gameDatas: games,
							_tpList
						});
					}

					if (userInfo.isLogin) {
						api_account_GetFavoriteGame().then(res => {
							if (res.data.errorCode === 0 && res.data.data) {
								let fav = res.data.data.map(f => {
									return `${f.providerId}_${f.gameId}`;
								});
								if (isMountedRef.current) {
									setFavorite(fav);
								}
							}
						});
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					setPopBox({
						isOpen: true,
						popBoxType: defPopBoxType.ErrorMsg,
						message: t("msg_ApiServerError"),
						btnBar: (
							<div className="btnGroup">
								<button
									className="btn-cancel"
									onClick={clickClose}>
									{t("lbl_Close")}
								</button>
							</div>
						)
					});
				}
			}
		);
	}, [userInfo.isLogin, urlTpId]);

	return (
		<div className="infoModule">
			<div className="inside-title icon icon-ow-casino">
				<span>{t("lbl_Slots")}</span>
			</div>
			<div className="casinoSelect">
				<Nav selNav={selNav} onSelectNav={onSelectNav} t={t} />
				<SearchBox
					t={t}
					tpOptions={tpOptions}
					EditSearchField={EditSearchField}
					searchInfo={searchInfo}
					submitSearch={SubmitSearch.bind(this, searchInfo)}
				/>
			</div>
			<GameList
				t={t}
				displayGames={displayGames}
				tpList={tpList}
				langId={userInfo.langId}
				isLogin={userInfo.isLogin}
				currentPage={pageInfo.currentPage}
				favorite={favorite}
				onSetFavorite={onSetFavorite}
			/>
			<Pagination
				totalPages={pageInfo.totalPages}
				currentPage={pageInfo.currentPage}
				clickPageNumber={clickPageNumber}
			/>
		</div>
	);
};
