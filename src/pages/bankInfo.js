import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import LeftMenu from "../components/common/leftMenu";
import BankInfo from "../components/bankInfo/bankInfo";

export default () => {
	return (
		<Wrapper afterLogin={true}>
			<Layout>
				<main>
					<section className="inside">
						<LeftMenu />
						<div className="rightModule">
							<BankInfo />
						</div>
					</section>
				</main>
			</Layout>
		</Wrapper>
	);
};
