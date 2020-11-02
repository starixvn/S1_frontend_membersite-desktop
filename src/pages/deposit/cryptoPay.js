import React from "react";
import Wrapper from "../../components/common/wrapper";
import Layout from "../../components/common/layout";
import LeftMenu from "../../components/common/leftMenu";
import RecentHistory from "../../components/deposit/deposit.recentHistory";
import CryptoPay from "../../components/deposit/cryptoPay.set";
import SideBarQuickLink from "../../components/home/sideBarQuickLink";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<CryptoPay />
							<RecentHistory />
						</div>
					</section>
					<SideBarQuickLink />
				</main>
			</Layout>
		</Wrapper>
	);
};
