import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import RecentHistory from "../components/deposit/deposit.recentHistory";
import BankSlip from "../components/deposit/deposit.bankSlip";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<BankSlip />
					<RecentHistory />
				</main>
			</Layout>
		</Wrapper>
	);
};
