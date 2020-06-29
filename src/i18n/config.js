import i18n from "i18next";

i18n.init({
	fallbackLng: "en",
	resources: {
		cs: {
			translations: require("./cs.json")
		},
		en: {
			translations: require("./en.json")
		}
	},
	ns: ["translations"],
	defaultNS: "translations",
	returnObjects: true,
	debug: process.env.NODE_ENV === "development",
	interpolation: {
		escapeValue: false
	},
	react: {
		wait: true
	}
});

i18n.languages = ["cs", "en"];

export default i18n;
