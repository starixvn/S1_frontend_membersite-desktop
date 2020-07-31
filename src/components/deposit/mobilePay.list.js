import React from "react";

export default () => {
	return (
		<div className="subModule">
			<div className="subModuleTitle icon icon-plus">
				<div>
					<span>Mobile Deposit</span>
					<span>Credit Time: Instant</span>
				</div>
			</div>
			<div className="subModuleBody">
				<ul>
					<li>
						<a className="icon icon-MOMO"></a>
						<span>Limit 20~5000</span>
					</li>
					<li>
						<a className="icon icon-ZALO"></a>
						<span>Limit 20~20.000</span>
					</li>
					<li>
						<a className="icon icon-VIETTELPAY"></a>
						<span>Limit 50~50.000</span>
					</li>
				</ul>
			</div>
		</div>
	);
};
