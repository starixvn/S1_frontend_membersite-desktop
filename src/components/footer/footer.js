import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import TandC from "../../service/t_and_c";
import Responsibility1 from "../../styles/img/responsibility1.png";
import Responsibility2 from "../../styles/img/responsibility2.png";
import Licenses from "../../styles/img/licenses.png";
import Security from "../../styles/img/security.png";
import {
	defSportsBetting_Section1,
	defSportsBetting_Section2
} from "./footer.def";
import LinkItems from "../common/linkItems";
import { userInfoContext } from "../common/context";
import config, { SiteInfo } from "../../config";
import saba from "../../styles/img/saba.png";
import eb from "../../styles/img/eb.png";

const SportsBettingSection = ({ t, isLogin, langId }) => (
	<div>
		<span className="title">{t("lbl_SportsBetting")}</span>
		<div>
			<LinkItems
				defMenuLinks={defSportsBetting_Section1}
				t={t}
				langId={langId}
				isLogin={isLogin}
				checkMatchPage={false}
			/>
		</div>
		<div>
			<LinkItems
				defMenuLinks={defSportsBetting_Section2}
				t={t}
				langId={langId}
				isLogin={isLogin}
				checkMatchPage={false}
			/>
		</div>
	</div>
);

const PoliciesSection = ({ t, langId }) => (
	<div>
		<span className="title">{t("lbl_OurPolicies")}</span>
		<div>
			<a
				href={TandC(langId).ResposibleGaming}
				target="_blank"
				rel="noreferrer">
				{t("lbl_ResposibleGaming")}
			</a>
			<a href={TandC(langId).terms} target="_blank" rel="noreferrer">
				{t("lbl_TermsConditions")}
			</a>
			<a
				href={TandC(langId).PrivacyPolicy}
				target="_blank"
				rel="noreferrer">
				{t("lbl_PrivacyPolicy")}
			</a>
			<a
				href={TandC(langId).CookiePolicy}
				target="_blank"
				rel="noreferrer">
				{t("lbl_CookiePolicy")}
			</a>
		</div>
	</div>
);

const HelpAndSupportSection = ({ t, langId }) => (
	<div>
		<span className="title">{t("lbl_HelpSupport")}</span>
		<div>
			<a
				href={TandC(langId).RuleRegulations}
				target="_blank"
				rel="noreferrer">
				{t("lbl_RuleRegulations")}
			</a>
			<a
				href={TandC(langId).AccountTerms}
				target="_blank"
				rel="noreferrer">
				{t("lbl_AccountTerms")}
			</a>
			<a href={TandC(langId).FAQ} target="_blank" rel="noreferrer">
				{t("lbl_FAQ")}
			</a>
		</div>
	</div>
);

const AboutUsSection = ({ t, langId }) => (
	<div>
		<span className="title">Nova88</span>
		<div>
			<a href={TandC(langId).AboutUs} target="_blank" rel="noreferrer">
				{t("lbl_AboutUs")}
			</a>
			<a href={TandC(langId).Terms} target="_blank" rel="noreferrer">
				{t("lbl_Terms")}
			</a>
			<a href={TandC(langId).ContactUs} target="_blank" rel="noreferrer">
				{t("lbl_ContactUs")}
			</a>
			<a
				href={`${SiteInfo.affiliateLink}/?lang=${langId}`}
				target="_blank"
				rel="noreferrer">
				{t("lbl_Affiliates")}
			</a>
		</div>
	</div>
);

const PlatformSection = () => (
	<div className="platform">
		<button>
			<img src={saba} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/ab.png`} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/yl.png`} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/ag.png`} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/jk.png`} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/gp.png`} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/dg.png`} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/sa.png`} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/yg.png`} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/pp.png`} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/sg.png`} />
		</button>
		<button>
			<img src={`${config.imgUrl}/common/images/logo/pg.png`} />
		</button>
		<button>
			<img src={eb} />
		</button>
	</div>
);

const SocialMediaSection = ({ t }) => (
	<div>
		<span className="title">{t("lbl_SocialMedia")}</span>
		<div>
			<a
				href={SiteInfo.socialMedia.ig.link}
				target="_blank"
				className="icon icon-instagram">
				{t(SiteInfo.socialMedia.ig.displayKey)}
			</a>
			<a
				href={SiteInfo.socialMedia.fb.link}
				target="_blank"
				className="icon icon-facebook">
				{t(SiteInfo.socialMedia.fb.displayKey)}
			</a>
			<a
				href={SiteInfo.socialMedia.twitter.link}
				target="_blank"
				className="icon icon-twitter">
				{t(SiteInfo.socialMedia.twitter.displayKey)}
			</a>
		</div>
	</div>
);

const ResponsibilitySection = ({ t }) => (
	<div>
		<span className="title">{t("lbl_Responsibility")}</span>
		<div>
			<button>
				<img src={Responsibility1} />
			</button>
			<button>
				<img src={Responsibility2} />
			</button>
		</div>
	</div>
);

const LicensesSection = ({ t }) => (
	<div>
		<span className="title">{t("lbl_Licenses")}</span>
		<div>
			<button>
				<img src={Licenses} />
			</button>
		</div>
	</div>
);

const SecuritySection = ({ t }) => (
	<div>
		<span className="title">{t("lbl_Security")}</span>
		<div>
			<button>
				<img src={Security} />
			</button>
		</div>
	</div>
);

const PaymentSection = ({ t }) => (
	<div>
		<span className="title">{t("lbl_Payment")}</span>
		<div>
			<button>
				<img src={`${config.imgUrl}/common/images/logo/h2p.png`} />
			</button>
			<button>
				<img src={`${config.imgUrl}/common/images/logo/ep.png`} />
			</button>
		</div>
	</div>
);

export default () => {
	const { t } = useTranslation();
	const { userInfo } = useContext(userInfoContext);

	return (
		<footer>
			<div className="webmap">
				<SportsBettingSection
					t={t}
					isLogin={userInfo.isLogin}
					langId={userInfo.langId}
				/>
				<PoliciesSection t={t} langId={userInfo.langId} />
				<HelpAndSupportSection t={t} langId={userInfo.langId} />
				<AboutUsSection t={t} langId={userInfo.langId} />
				<ResponsibilitySection t={t} />
				<LicensesSection t={t} />
				<SecuritySection t={t} />
				<PaymentSection t={t} />
				<SocialMediaSection t={t} />
			</div>
			<PlatformSection />
			<div className="copyright">
				© Copyright 2020. Nova88. All Rights Reserved.
			</div>
		</footer>
	);
};
