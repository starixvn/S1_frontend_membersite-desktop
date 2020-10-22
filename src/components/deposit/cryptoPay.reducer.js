export const defActionType = {
	SET_CHANNELLIST: "SET_CHANNELLIST",
	SELECT_CHANNEL: "SELECT_CHANNEL",
	EDIT_AMOUNT: "EDIT_AMOUNT",
	SUBMIT_AMOUNT: "SUBMIT_AMOUNT",
	CLICK_BACK: "CLICK_BACK",
	SET_CHECK_STATUS: "SET_CHECK_STATUS"
};

const defStepModule = {
	2: "AmountPanel",
	3: "ConfirmPanel"
};

export const defModule = {
	[defStepModule[2]]: "AmountPanel",
	[defStepModule[3]]: "ConfirmPanel"
};

export const initState = {
	displayMoudle: defModule.AmountPanel,
	channelItem: {},
	step: 2
};

export function reducer(state, action) {
	switch (action.type) {
		case defActionType.SET_CHANNELLIST:
			return {
				...state,
				channelItem: action.channelItem
			};

		case defActionType.SELECT_CHANNEL:
			var newStep = 2;
			return {
				...state,
				channelItem: action.channelItem,
				step: newStep,
				displayMoudle: defStepModule[newStep],
				amount: null,
				checked: null,
				tip: ""
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

		case defActionType.CLICK_BACK:
			var newStep = state.step - 1;
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
