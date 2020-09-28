import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import Deposit from "../components/deposit/deposit";
import LeftMenu from "../components/common/leftMenu";
import SideBarQuickLink from "../components/home/sideBarQuickLink";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<Deposit />
						</div>
					</section>
					<SideBarQuickLink />
				</main>
			</Layout>
		</Wrapper>
	);
};
