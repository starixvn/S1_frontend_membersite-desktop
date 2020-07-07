import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "../components/common/layout";
import NpcSoccer from "../styles/Nova88/img/npc-soccer.png";
import Logo from "../styles/Nova88/img/logo.svg";
import IndexBanner from "../styles/Nova88/img/indexBanner.jpg";
import NpcBasketball from "../styles/Nova88/img/npc-basketball.png";
import NpcBaseball from "../styles/Nova88/img/npc-baseball.png";
import NpcBadminton from "../styles/Nova88/img/npc-badminton.png";
import NpcTennis from "../styles/Nova88/img/npc-tennis.png";
import NpcEsport from "../styles/Nova88/img/npc-esport.png";

import IndexBannerLiveCasion from "../styles/Nova88/img/indexBannerLiveCasion.png";
import IndexBannerCasion from "../styles/Nova88/img/indexBannerCasion.png";
import IndexBannerKeno from "../styles/Nova88/img/indexBannerKeno.png";
import IndexCenterBanner from "../styles/Nova88/img/indexCenterBanner.jpg";
import path from "../path";
import { Link } from "@reach/router";
import Wrapper from "../components/common/wrapper";

const IndexPage = () => {
	const { t } = useTranslation();
	return (
		<Wrapper>
			<Layout>
				<header>
					<div className="header">
						<div className="logo">
							<img src={Logo} alt="Nova88" />
						</div>
						<div className="menu">
							<a href="">{t("lbl_Sports")}</a>
							<a href="">{t("lbl_eSports")}</a>
							<a href="">{t("lbl_NumberGame")}</a>
							<a href="">{t("lbl_VirtualSport")}</a>
							<a href="">{t("lbl_Casino")}</a>
							<a href="">{t("lbl_LiveCasino")}</a>
							<a href="">{t("lbl_KenoAndLottery")}</a>
							<a href="">{t("lbl_Fishing")}</a>
						</div>
						<div className="function">
							<div className="country">
								<button className="flag ch"></button>
							</div>
							<Link to={path.join.root} className="join">
								{t("lbl_JoinNow")}
							</Link>
							<a href="" className="login">
								{t("lbl_Login")}
							</a>
						</div>
					</div>
				</header>
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
								<img src={NpcEsport} alt="NpcEsport" />
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
									src={IndexBannerLiveCasion}
									alt="IndexBannerLiveCasion"
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
									src={IndexBannerCasion}
									alt="IndexBannerCasion"
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
				<footer>
					<div className="webmap"></div>
					<div className="sponsor"></div>
					<div className="copyright"></div>
				</footer>
			</Layout>
		</Wrapper>
	);
};

export default IndexPage;
