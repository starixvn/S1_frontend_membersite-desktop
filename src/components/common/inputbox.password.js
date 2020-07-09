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
				<div className="iconModule">
					{props.showPsw || props.inputType === "password" ? (
						<i
							className={`icon ${
								!props.showPsw ? "icon-eye-blocked" : "icon-eye"
							}`}
							onClick={props.showPswHandler}></i>
					) : null}

					{props.warning ? (
						<i className="icon icon-warning"></i>
					) : null}
				</div>
			</div>
			{props.tip ? <div className="tip active">{props.tip}</div> : null}
		</>
	);
};
