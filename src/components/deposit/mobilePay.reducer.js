export const defActionType = {
	SET_CHANNELLIST: "SET_CHANNELLIST",
	SELECT_CHANNEL: "SELECT_CHANNEL",
	EDIT_AMOUNT: "EDIT_AMOUNT",
	SUBMIT_AMOUNT: "SUBMIT_AMOUNT",
	CLICK_BACK: "CLICK_BACK",
	SET_CHECK_STATUS: "SET_CHECK_STATUS"
};

const defStepModule = {
	2: "ChannelPanel",
	3: "AmountPanel",
	4: "ConfirmPanel"
};

export const defModule = {
	[defStepModule[2]]: "ChannelPanel",
	[defStepModule[3]]: "AmountPanel",
	[defStepModule[4]]: "ConfirmPanel"
};

export const initState = {
	displayMoudle: defModule.ChannelPanel,
	channelList: [],
	step: 2
};

export function reducer(state, action) {
	switch (action.type) {
		case defActionType.SET_CHANNELLIST:
			return {
				...state,
				channelList: action.channelList
			};

		case defActionType.SELECT_CHANNEL:
			var newStep = 3;
			return {
				...state,
				channelIdx: action.channelIdx,
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
