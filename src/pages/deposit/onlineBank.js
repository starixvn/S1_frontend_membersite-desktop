import React from "react";
import Wrapper from "../../components/common/wrapper";
import Layout from "../../components/common/layout";
import LeftMenu from "../../components/common/leftMenu";
import RecentHistory from "../../components/deposit/deposit.recentHistory";
import OnlineBankSelBank from "../../components/deposit/deposit.onlineBank.selBank";
import DepositWrapper from "../../components/deposit/deposit.wrapper";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<DepositWrapper step={2}>
								<OnlineBankSelBank />
							</DepositWrapper>
							<RecentHistory />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
