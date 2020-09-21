import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
// import LeftMenu from "../components/common/leftMenu";
import Message from "../components/message/message";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						{/* test only, remove later. start */}
						<div id="leftMenu">
							<div className="menuModule">
								<button className="menuHeader">Cashier</button>
								<a className="menuSelect active">
									<span>Deposit</span>
								</a>
								<a className="menuSelect">
									<span>Transfer Funds</span>
								</a>
								<a className="menuSelect">
									<span>Withdrawal</span>
								</a>
							</div>
							<div className="menuModule">
								<button className="menuHeader">History</button>
								<a className="menuSelect">
									<span>Deposit History</span>
								</a>
								<a className="menuSelect">
									<span>Transfer History</span>
								</a>
								<a className="menuSelect">
									<span>Withdrawal History</span>
								</a>
								<a className="menuSelect">
									<span>Statement</span>
								</a>
							</div>
							<div className="menuModule">
								<button className="menuHeader">
									My Account
								</button>
								<a className="menuSelect">
									<span>Change Password</span>
								</a>
								<a className="menuSelect">
									<span>Profile</span>
								</a>
								<a className="menuSelect">
									<span>Bank Info</span>
								</a>
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
						{/* test only, remove later. end */}
						<div className="rightModule">
							<Message />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
