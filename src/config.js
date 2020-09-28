const siteName = "Nova88";

export const SiteInfo = {
	affiliateLink: "https://aff.nova88.net",
	langCookie: "nova88LangId",
	socialMedia: {
		fb: {
			link: "https://www.facebook.com/nova88official/",
			displayKey: "lbl_Facebook"
		},
		twitter: {
			link: "https://twitter.com/nova88official",
			displayKey: "lbl_Twitter"
		},
		ig: {
			link: "https://www.instagram.com/nova88.net_official",
			displayKey: "lbl_Instagram"
		}
	}
};

export default process.env.NODE_ENV === "production"
	? {
			siteName,
			apiURL: "",
			openURL: "",
			imgUrl: "",
			t_and_cURL: ""
	  }
	: {
			siteName,
			appURL: "http://localhost:8000",
			// apiURL: "http://localhost:60930",
			// imgUrl: "http://localhost:60930",
			// t_and_cURL: "http://localhost:60930",
			apiURL: "http://www.n88dev.com",
			imgUrl: "http://www.n88dev.com",
			t_and_cURL: "http://www.n88dev.com",
			openURL: "http://www.n88dev.com"
	  };
