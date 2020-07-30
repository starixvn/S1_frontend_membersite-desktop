import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import RecentHistory from "../components/deposit/deposit.recentHistory";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<RecentHistory />
				</main>
			</Layout>
		</Wrapper>
	);
};
