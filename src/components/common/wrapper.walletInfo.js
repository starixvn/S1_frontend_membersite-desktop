import { useEffect, useReducer } from "react";
import {
	api_account_GetTpWalletList,
	api_account_GetTpWalletBalance,
	api_account_GetCustBonusWallet,
	api_account_GetWalletBalance,
	api_account_SetHideBalance
} from "../../service/api/account";

export const defListType = {
	all: 0,
	transferred: 1
};

const defAction = {
	GET_BONUS_WALLETS: "GET_BONUS_WALLETS",
	GET_MAIN_WALLETS: "GET_MAIN_WALLETS",
	GET_TP_WALLETS: "GET_TP_WALLETS",
	HANDLE_HIDE_BALANCE: "HANDLE_HIDE_BALANCE",
	REFRESH_ALL_WALLETS: "REFRESH_ALL_WALLETS"
};

const initialState = {
	isHideBalance: true,
	bonusWallets: [],
	tpWallets: [],
	mainWallet: {}
};

function reducer(state, action) {
	switch (action.type) {
		case defAction.GET_TP_WALLETS:
			let allDatas = state.tpWallets;
			let newValue = { tpId: action.tpId, balance: action.balance };
			let idx = allDatas.findIndex(tp => tp.tpId === newValue.tpId);
			if (idx === -1) {
				allDatas = [...allDatas, newValue];
			} else {
				allDatas[idx] = newValue;
			}
			return { ...state, tpWallets: allDatas };

		case defAction.GET_MAIN_WALLETS:
			const { tpId, balance, isHideBalance } = action;
			return {
				...state,
				mainWallet: {
					tpId,
					balance
				},
				isHideBalance
			};

		case defAction.HANDLE_HIDE_BALANCE:
			return { ...state, isHideBalance: action.value };

		case defAction.GET_BONUS_WALLETS:
			return { ...state, bonusWallets: action.value };

		default:
			throw new Error();
	}
}

const GetTpWallets = ({ isLogin, ListType = defListType.all, dispatch }) => {
	if (!isLogin) return;
	api_account_GetTpWalletList(ListType).then(res => {
		if (res.data.errorCode === 0 && res.data.data) {
			res.data.data.forEach(tpInfo => {
				GetTpWalletBalance({ tpId: tpInfo.tpId, dispatch });
			});
		}
	});
};

const GetTpWalletBalance = ({ tpId, dispatch }) => {
	api_account_GetTpWalletBalance(tpId).then(res => {
		if (res.data.errorCode === 0 && res.data.data) {
			const { tpId, balance } = res.data.data;
			dispatch({
				type: defAction.GET_TP_WALLETS,
				tpId,
				balance
			});
		}
	});
};

const GetMainWalet = ({ isLogin, dispatch }) => {
	if (!isLogin) return;
	api_account_GetWalletBalance().then(res => {
		if (res.data.errorCode === 0) {
			dispatch({
				type: defAction.GET_MAIN_WALLETS,
				balance: res.data.data.balance,
				isHideBalance: res.data.data.isHideBalance
			});
		}
	});
};

export const handleIsHideBalance = ({ value, dispatch }) => {
	dispatch({ type: defAction.HANDLE_HIDE_BALANCE, value });
	api_account_SetHideBalance({ value });
};

const GetBonusWallets = ({ isLogin, dispatch }) => {
	if (!isLogin) return;
	api_account_GetCustBonusWallet().then(res => {
		if (res.data.errorCode === 0) {
			dispatch({
				type: defAction.GET_BONUS_WALLETS,
				value: res.data.data
			});
		}
	});
};

export const GetAllWallets = ({
	isLogin,
	dispatch,
	ListType = defListType.all
}) => {
	if (!isLogin) return;
	GetMainWalet({ isLogin, dispatch });
	GetBonusWallets({ isLogin, dispatch });
	GetTpWallets({ isLogin, ListType, dispatch });
};

const useGetWalletInfo = ({ isLogin }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		GetAllWallets({ isLogin, dispatch });
	}, [isLogin]);

	return { state, dispatch };
};

export default useGetWalletInfo;
