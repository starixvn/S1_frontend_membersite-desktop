import React from "react";

export default () => {
	return (
		<div id="leftMenu">
			<div className="menuModule">
				<button className="menuHeader">Cashier</button>
				<button className="menuSelect active">
					<span>Deposit</span>
				</button>
				<button className="menuSelect">
					<span>Transfer Funds</span>
				</button>
				<button className="menuSelect">
					<span>Withdrawal</span>
				</button>
			</div>
			<div className="menuModule">
				<button className="menuHeader">History</button>
				<button className="menuSelect">
					<span>Deposit History</span>
				</button>
				<button className="menuSelect">
					<span>Transfer History</span>
				</button>
				<button className="menuSelect">
					<span>Withdrawal History</span>
				</button>
				<button className="menuSelect">
					<span>Statement</span>
				</button>
			</div>
			<div className="menuModule">
				<button className="menuHeader">My Account</button>
				<button className="menuSelect">
					<span>Change Password</span>
				</button>
				<button className="menuSelect">
					<span>Profile</span>
				</button>
				<button className="menuSelect">
					<span>Bank Info</span>
				</button>
			</div>
			<div className="menuModule">
				<button className="menuHeader">Message</button>
				<button className="menuSelect">
					<span>Personal Message</span>
				</button>
				<button className="menuSelect">
					<span>Announcement</span>
				</button>
			</div>
		</div>
	);
};
