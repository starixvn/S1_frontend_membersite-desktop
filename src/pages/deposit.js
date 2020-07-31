import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import RecentHistory from "../components/deposit/deposit.recentHistory";
import Deposit from "../components/deposit/deposit";
import LeftMenu from "../components/common/leftMenu";
import DepositWrapper from "../components/deposit/wrapper";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<DepositWrapper step={1}>
								<Deposit />
							</DepositWrapper>
							<RecentHistory />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
