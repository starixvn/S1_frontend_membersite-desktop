import React from "react";
import config from "../../config";
import { defActionType } from "./mobilePay.reducer";

export default ({ channelList, dispatch }) => {
	const OnSelect = channelIdx => {
		dispatch({ type: defActionType.SELECT_CHANNEL, channelIdx });
	};

	let rows = channelList.map((c, cIdx) => {
		return (
			<li key={`mobilePay-selChannel-${c.channelId}`}>
				<a onClick={OnSelect.bind(this, cIdx)}>
					<img
						src={`${config.imgUrl}/common/images/MobilePay/${c.groupName}.png`}
						alt={c.groupName}
					/>
				</a>
			</li>
		);
	});

	return (
		<div className="subModuleList">
			<div className="subModule">
				<div className="subModuleBody">
					<ul>{rows}</ul>
				</div>
			</div>
		</div>
	);
};
