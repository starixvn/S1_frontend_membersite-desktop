export const defActionType = {
	GET_BALANCE: "GET_BALANCE",
	GET_CUST_BANKINFO: "GET_CUST_BANKINFO",
	SELECT_ACCOUNT: "SELECT_ACCOUNT",
	EDIT_AMOUNT: "EDIT_AMOUNT",
	CHECK_AMOUNT: "CHECK_AMOUNT",
	TO_OTHER_PANEL: "TO_OTHER_PANEL",
	SET_INIT_STATE: "SET_INIT_STATE",
	GET_RECENT_HISTORY: "GET_RECENT_HISTORY",
	SET_KYC_STATUS: "SET_KYC_STATUS",
	SET_KYC_DATA: "SET_KYC_DATA",
	SET_LOADING: "SET_LOADING"
};

export const initState = {
	balanceData: {},
	step: 1,
	custBankInfo: [],
	selectedAccount: {},
	kycStatus: "normal",
	loading: true,
	redirectPath: null,
	panel: "amount"
};

export const defPanel = {
	amount: "amount",
	confirm: "confirm"
};

export function reducer(state, action) {
	let _step = 0;

	switch (action.type) {
		case defActionType.GET_BALANCE:
			return {
				...state,
				balanceData: action.balanceData
			};

		case defActionType.GET_CUST_BANKINFO:
			return {
				...state,
				custBankInfo: action.custBankInfo
			};

		case defActionType.SELECT_ACCOUNT:
			return {
				...state,
				selectedAccount: action.selectedAccount,
				step: action.step
			};

		case defActionType.EDIT_AMOUNT:
			_step = state.selectedAccount.accountNo ? 3 : 1;
			return {
				...state,
				amount: action.amount,
				step: _step
			};

		case defActionType.CHECK_AMOUNT:
			return {
				...state,
				checked: action.checked,
				tip: action.tip
			};

		case defActionType.TO_OTHER_PANEL:
			return {
				...state,
				panel: action.panel
			};

		case defActionType.SET_INIT_STATE:
			return {
				...initState
			};

		case defActionType.GET_RECENT_HISTORY:
			return {
				...state,
				recentHistory: action.recentHistory
			};

		case defActionType.SET_KYC_STATUS:
			return {
				...state,
				kycStatus: action.kycStatus
			};

		case defActionType.SET_KYC_DATA:
			return {
				...state,
				kycData: action.kycData
			};

		case defActionType.SET_LOADING:
			return {
				...state,
				loading: action.loading
			};

		default:
			console.log("action type not exists");
			return state;
	}
}
