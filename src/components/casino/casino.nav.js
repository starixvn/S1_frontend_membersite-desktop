import React from "react";
import { defNav } from "./casino.def";

export default ({ t, onSelectNav, selNav }) => {
	let rows = Object.keys(defNav).map(k => {
		let _nav = defNav[k];
		return (
			<button
				key={`casino-nav-${k}`}
				className={selNav === k ? "btn-check" : "blueBorder"}
				onClick={() => onSelectNav(k)}>
				{t(_nav.displayKey)}
			</button>
		);
	});

	return <div className="btnGroup promoType">{rows}</div>;
};
