import React, { useRef, useState, useEffect } from "react";
import { number_format } from "../common/common";

export default ({
	onChangeAmount,
	amountValue,
	availableBalance = 1,
	_isConvert
}) => {
	const [mouseMoveActive, setMouseMoveActive] = useState(false);
	const [originalScreenX, setOriginalScreenX] = useState(null);
	const [originalPointWidth, setOriginalPointWidth] = useState(0);
	const [resultAmount, setResultAmount] = useState(amountValue);
	const [cashLineWidthPercentage, setCashLineWidthPercentage] = useState(0);

	const cashBarRef = useRef(null);

	const minMaxRange = (val, min, max) => {
		return Math.floor(Math.min(Math.max(val, min), max));
	};

	const widthPercentageCalculationHandlar = (currentVale, maxValue) => {
		let result = currentVale / maxValue;
		return isNaN(result) ? 0 : result;
	};

	const onMouseDownHandlar = e => {
		const cashBarElementWidth = cashBarRef.current.clientWidth;
		const originalPointWidth =
			Math.imul(cashBarElementWidth, cashLineWidthPercentage) * 0.01;

		setOriginalPointWidth(originalPointWidth);
		setOriginalScreenX(e.screenX);
		setMouseMoveActive(true);
	};

	const onMouseUpHandlar = () => {
		setMouseMoveActive(false);
	};

	const onMouseMoveHandlar = e => {
		if (!mouseMoveActive) return;
		const cashBarElementWidth = cashBarRef.current.clientWidth;
		const mouseMoveOffset = e.screenX - originalScreenX;
		const cashLinewidth = originalPointWidth + mouseMoveOffset;
		const cashLineWidthPercentage = widthPercentageCalculationHandlar(
			minMaxRange(cashLinewidth, 0, cashBarElementWidth),
			cashBarElementWidth
		);
		let resultAmount =
			(availableBalance * cashLineWidthPercentage) /
			(_isConvert ? 1000 : 1);
		onChangeAmount(Math.floor(resultAmount));
	};

	const handleClickOutside = e => {
		if (cashBarRef.current && !cashBarRef.current.contains(e.target)) {
			setMouseMoveActive(false);
		}
	};

	useEffect(() => {
		let convertAmount = _isConvert ? amountValue * 1000 : amountValue;
		setResultAmount(minMaxRange(amountValue, 0, availableBalance));
		setCashLineWidthPercentage(
			minMaxRange((convertAmount / availableBalance) * 100, 0, 100)
		);
	}, [amountValue]);

	useEffect(() => {
		if (typeof document !== `undefined`) {
			document.addEventListener("mouseup", handleClickOutside);
		}
		return () => {
			if (typeof document !== `undefined`) {
				document.removeEventListener("mouseup", handleClickOutside);
			}
		};
	}, []);

	const spanStyle = {
		// 禁止滑鼠反白選取此元件
		WebkitUserSelect: "none",
		MozUserSelect: "none",
		OUserSelect: "none",
		MsUserSelect: "none",
		// 不斷行
		whiteSpace: "nowrap"
	};

	return (
		<div
			ref={cashBarRef}
			onMouseMove={onMouseMoveHandlar}
			onMouseUp={onMouseUpHandlar}
			className="cashBar">
			<div
				className="cashLine"
				style={{ width: `${cashLineWidthPercentage}%` }}>
				<div
					onMouseDown={onMouseDownHandlar}
					style={{ cursor: "pointer" }}
					className="cashPoint">
					<span style={spanStyle}>{`$${number_format(resultAmount)} ${
						_isConvert ? "('000)" : ""
					}`}</span>
				</div>
			</div>
		</div>
	);
};
