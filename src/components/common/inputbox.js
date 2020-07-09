import React from "react";

export default props => {
	return (
		<>
			<div className="inputBox">
				<i className={`icon ${props.icon}`}></i>
				<input
					type={props.inputType ?? "text"}
					placeholder={props.placeholder}
					onFocus={props.onFocus}
					onBlur={props.onBlur}
					onChange={props.onChange}
					value={
						props.value === null || props.value === undefined
							? ""
							: props.value
					}
					max={props.max ? props.max : null}
				/>
				{props.warning ? (
					<div className="iconModule">
						<i className="icon icon-warning"></i>
					</div>
				) : null}
			</div>
			{props.tip ? <div className="tip active">{props.tip}</div> : null}
		</>
	);
};
