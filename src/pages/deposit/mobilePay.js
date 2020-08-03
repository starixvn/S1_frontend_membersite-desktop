import React from "react";
import Wrapper from "../../components/common/wrapper";
import Layout from "../../components/common/layout";
import LeftMenu from "../../components/common/leftMenu";
import RecentHistory from "../../components/deposit/deposit.recentHistory";
import MobilePaySet from "../../components/deposit/mobilePay.set";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<MobilePaySet />
							<RecentHistory />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
