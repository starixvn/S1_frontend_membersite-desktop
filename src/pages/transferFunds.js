import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import TransferFunds from "../components/transferFunds/transferFunds";
import SideBarQuickLink from "../components/home/sideBarQuickLink";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<TransferFunds />
						</div>
					</section>
					<SideBarQuickLink />
				</main>
			</Layout>
		</Wrapper>
	);
};
