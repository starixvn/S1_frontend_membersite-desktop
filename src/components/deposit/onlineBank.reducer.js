export const defActionType = {
	SET_BANKLIST: "SET_BANKLIST",
	SELECT_BANK: "SELECT_BANK",
	CLICK_BACK: "CLICK_BACK",
	EDIT_AMOUNT: "EDIT_AMOUNT",
	SUBMIT_AMOUNT: "SUBMIT_AMOUNT"
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
	switch (action.type) {
		case defActionType.SET_BANKLIST:
			return {
				...state,
				bankList: action.bankList
			};

		case defActionType.SELECT_BANK:
			var newStep = 3;
			return {
				...state,
				bankIdx: action.bankIdx,
				step: newStep,
				displayMoudle: defStepModule[newStep]
			};

		case defActionType.CLICK_BACK:
			var newStep = state.step - 1;
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
			var newStep = state.step + 1;
			return {
				...state,
				step: newStep,
				displayMoudle: defStepModule[newStep]
			};
		default:
			console.log("action type not exists");
			return state;
	}
}
