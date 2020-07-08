import i18n from "i18next";

export const langList = ["cs", "en"];
export const defaultLang = "en";

const setResources = () => {
	let result = {};
	langList.forEach(l => {
		result[l] = {
			translations: require(`./${l}.json`)
		};
	});
	return result;
};

i18n.init({
	fallbackLng: defaultLang,
	resources: setResources(),
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

i18n.languages = langList;

export default i18n;
