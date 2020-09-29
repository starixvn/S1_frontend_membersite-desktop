import React from "react";

export default props => {
	const showCheckIcon = () => {
		if (props.checked === null) {
			return (
				<i
					className={`icon icon-information-solid`}
					onClick={props.clickInfo}></i>
			);
		} else {
			if (props.checked === true) {
				return <i className={`icon icon-checkmark`}></i>;
			} else if (props.checked === false) {
				return <i className={`icon icon-cross`}></i>;
			} else if (props.checked === "loading") {
				return <i className={`icon icon-spinner11`}></i>;
			}
		}
	};

	return (
		<>
			<div className={props.className ?? "inputBox"}>
				{props.icon ? <i className={`icon ${props.icon}`}></i> : null}
				{props.title ? <i className="txt-blue">{props.title}</i> : null}
				<input
					type={props.inputType ?? "text"}
					className={props.isAmount ? "text-right" : ""}
					placeholder={props.placeholder}
					onBlur={props.onBlur}
					onChange={props.onChange}
					value={
						props.value === null || props.value === undefined
							? ""
							: props.value
					}
					max={props.max ? props.max : null}
					readOnly={props.readOnly}
				/>
				{props.tooltip ? (
					<div class="description">{props.tooltip}</div>
				) : null}

				{props.checked !== undefined ? (
					<div className="iconModule">
						{props._isConvert ? <i>('000)</i> : null}
						{showCheckIcon()}
					</div>
				) : null}
				{props.checkIcon ? (
					<div className="iconModule">
						<i className={`icon ${props.checkIcon}`}></i>
					</div>
				) : null}
			</div>
			{props.inputType !== "date" ? (
				<div className={`tip${props.tip ? " active" : ""}`}>
					{props.tip}
				</div>
			) : null}
		</>
	);
};
