import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import SideBarQuickLink from "../components/home/sideBarQuickLink";
import Kiss918 from "../components/918kiss/918kiss";

export default () => {
	return (
		<Wrapper>
			<Layout showFooter={true}>
				<main>
					<Kiss918 />
					<SideBarQuickLink />
				</main>
			</Layout>
		</Wrapper>
	);
};
