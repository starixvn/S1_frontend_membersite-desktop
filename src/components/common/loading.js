import React from "react";

export default () => {
	return (
		<div id="Loading" class="active">
			<div class="container">
				<div class="cube">
					<div class="sides">
						<div class="top"></div>
						<div class="right"></div>
						<div class="bottom"></div>
						<div class="left"></div>
						<div class="front"></div>
						<div class="back"></div>
					</div>
				</div>
				<h1></h1>
				<div class="text">Loading...</div>
			</div>
		</div>
	);
};
