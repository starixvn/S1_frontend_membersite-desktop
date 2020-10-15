export const defActionType = {
	SET_BANKLIST: "SET_BANKLIST",
	SELECT_BANK: "SELECT_BANK",
	CLICK_BACK: "CLICK_BACK",
	EDIT_AMOUNT: "EDIT_AMOUNT",
	SUBMIT_AMOUNT: "SUBMIT_AMOUNT",
	SET_CHECK_STATUS: "SET_CHECK_STATUS",
	JUNP_TO_ENTER_AMOUNT: "JUNP_TO_ENTER_AMOUNT"
};

const defStepModule = {
	2: "BankPanel",
	3: "AmountPanel",
	4: "ConfirmPanel"
};

export const defModule = {
	[defStepModule[2]]: "BankPanel",
	[defStepModule[3]]: "AmountPanel",
	[defStepModule[4]]: "ConfirmPanel"
};

export const initState = {
	displayMoudle: defModule.BankPanel,
	bankList: [],
	step: 2,
	bankIdx: null
};

export function reducer(state, action) {
	let newStep = null;
	switch (action.type) {
		case defActionType.JUNP_TO_ENTER_AMOUNT:
			newStep = 3;
			return {
				...state,
				step: newStep,
				displayMoudle: defStepModule[newStep]
			};

		case defActionType.SET_BANKLIST:
			return {
				...state,
				bankList: action.bankList
			};

		case defActionType.SELECT_BANK:
			newStep = 3;
			return {
				...state,
				bankIdx: action.bankIdx,
				step: newStep,
				displayMoudle: defStepModule[newStep],
				amount: null,
				checked: null,
				tip: ""
			};

		case defActionType.CLICK_BACK:
			newStep = state.step - 1;
			return {
				...state,
				step: newStep,
				displayMoudle: defStepModule[newStep]
			};

		case defActionType.EDIT_AMOUNT:
			return {
				...state,
				amount: action.amount
			};

		case defActionType.SUBMIT_AMOUNT:
			newStep = state.step + 1;
			return {
				...state,
				step: newStep,
				displayMoudle: defStepModule[newStep]
			};

		case defActionType.SET_CHECK_STATUS:
			return {
				...state,
				checked: action.checked,
				tip: action.tip
			};

		default:
			console.log("action type not exists");
			return state;
	}
}
