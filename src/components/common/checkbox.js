import React from "react";

export default props => {
	return (
		<div className="agree">
			<input
				type="checkbox"
				id={props.id}
				checked={props.checked}
				onChange={props.onChange}
			/>
			<label htmlFor={props.id}>
				<div></div>
			</label>
			{props.children}
		</div>
	);
};
