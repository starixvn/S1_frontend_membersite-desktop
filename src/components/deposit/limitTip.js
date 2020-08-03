import React from "react";
import { number_format } from "../common/common";

export default ({
	minAmount,
	maxAmount,
	displayTextLimit,
	displayTextUnLimit,
	_isConvert
}) => {
	return !minAmount && !maxAmount ? (
		<span className="txt-orange">
			{displayTextLimit} {displayTextUnLimit}
		</span>
	) : (
		<span className="txt-orange">
			{displayTextLimit}{" "}
			{`${number_format(minAmount, _isConvert)} ~ ${number_format(
				maxAmount,
				_isConvert
			)}`}
		</span>
	);
};
