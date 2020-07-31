import React from "react";
import Wrapper from "../../components/common/wrapper";
import Layout from "../../components/common/layout";
import LeftMenu from "../../components/common/leftMenu";
import RecentHistory from "../../components/deposit/deposit.recentHistory";
import OnlineBankSet from "../../components/deposit/onlineBank.set";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<OnlineBankSet />
							<RecentHistory />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
