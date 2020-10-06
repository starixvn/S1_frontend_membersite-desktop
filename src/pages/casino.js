import React from "react";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import Casino from "../components/casino/casino";
import SideBarQuickLink from "../components/home/sideBarQuickLink";
import SwipperBanner from "../components/common/swipperBanner";

export default () => {
	return (
		<Wrapper>
			<Layout>
				<main>
					<SwipperBanner
						ImgFolder="Casino"
						withBtn={false}
						openInBlank={true}
						className="swiper-casino"
					/>
					<section className="inside">
						<div className="rightModule">
							<Casino />
						</div>
					</section>
					<SideBarQuickLink />
				</main>
			</Layout>
		</Wrapper>
	);
};
