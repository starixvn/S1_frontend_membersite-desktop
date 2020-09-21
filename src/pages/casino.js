import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import Casino from "../components/casino/casino";

export default () => {
	return (
		<Wrapper>
			<Layout>
				<main>
					<section className="inside">
						<div className="rightModule">
							<Casino />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
