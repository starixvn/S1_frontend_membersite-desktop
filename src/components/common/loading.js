import React, { useContext } from "react";
import { loadingContext } from "./context";

export default () => {
	const { loading } = useContext(loadingContext);
	return loading ? (
		<div id="Loading" className="active">
			<div className="container">
				<div className="cube">
					<div className="sides">
						<div className="top"></div>
						<div className="right"></div>
						<div className="bottom"></div>
						<div className="left"></div>
						<div className="front"></div>
						<div className="back"></div>
					</div>
				</div>
				<h1></h1>
				<div className="text">Loading...</div>
			</div>
		</div>
	) : null;
};
