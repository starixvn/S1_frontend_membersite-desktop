import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<h2>announcement</h2>
				</main>
			</Layout>
		</Wrapper>
	);
};
