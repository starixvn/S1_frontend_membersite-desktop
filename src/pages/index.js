import React from "react";
import { useTranslation } from "react-i18next";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import NpcSoccer from "../styles/img/npc-soccer.png";

import IndexBanner from "../styles/img/indexBanner.jpg";
import NpcBasketball from "../styles/img/npc-basketball.png";
import NpcBaseball from "../styles/img/npc-baseball.png";
import NpcBadminton from "../styles/img/npc-badminton.png";
import NpcTennis from "../styles/img/npc-tennis.png";
import NpcESport from "../styles/img/npc-esport.png";

import IndexBannerLiveCasino from "../styles/img/indexBannerLiveCasion.png";
import IndexBannerCasino from "../styles/img/indexBannerCasion.png";
import IndexBannerKeno from "../styles/img/indexBannerKeno.png";
import IndexCenterBanner from "../styles/img/indexCenterBanner.jpg";

const IndexPage = () => {
	const { t } = useTranslation();
	return (
		<Wrapper>
			<Layout>
				<main>
					<div className="swiper">
						<img src={IndexBanner} alt="banner" />
					</div>
					<section>
						<div className="gamelistsport">
							<a href="">
								<span className="icon icon-soccer">
									{t("lbl_Soccer")}
								</span>
								<img src={NpcSoccer} alt="Soccer" />
							</a>
							<a href="">
								<span className="icon icon-basketball">
									{t("lbl_Basketball")}
								</span>
								<img src={NpcBasketball} alt="NpcBasketball" />
							</a>
							<a href="">
								<span className="icon icon-baseball">
									{t("lbl_Baseball")}
								</span>
								<img src={NpcBaseball} alt="NpcBaseball" />
							</a>
							<a href="">
								<span className="icon icon-badminton">
									{t("lbl_badminton")}
								</span>
								<img src={NpcBadminton} alt="NpcBadminton" />
							</a>
							<a href="">
								<span className="icon icon-tennis">
									{t("lbl_Tennis")}
								</span>
								<img src={NpcTennis} alt="NpcTennis" />
							</a>
							<a href="">
								<span className="icon icon-esport">
									{t("lbl_eSports")}
								</span>
								<img src={NpcESport} alt="NpcEsport" />
							</a>
						</div>
						<div className="gamelistother">
							<a href="">
								<div>
									<i className="icon icon-livecasino"></i>
									<span>{t("lbl_LiveCasino")}</span>
									<span>Real Casino Experience</span>
								</div>
								<img
									src={IndexBannerLiveCasino}
									alt="IndexBannerLiveCasino"
								/>
							</a>
							<a href="">
								<div>
									<i className="icon icon-casino"></i>
									<span>{t("lbl_Casino")}</span>
									<span>
										Multiple Themes For Asian Market
									</span>
								</div>
								<img
									src={IndexBannerCasino}
									alt="IndexBannerCasino"
								/>
							</a>
							<a href="">
								<div>
									<i className="icon icon-keno"></i>
									<span>{t("lbl_Keno")}</span>
									<span>
										Many ways to play,more chances to win !
									</span>
								</div>
								<img
									src={IndexBannerKeno}
									alt="IndexBannerKeno"
								/>
							</a>
						</div>
					</section>
					<img src={IndexCenterBanner} alt="IndexCenterBanner" />
				</main>
			</Layout>
		</Wrapper>
	);
};

export default IndexPage;
