import { readCookie } from "../components/common/common";

export const GET_LANG_ID = userLangId => {
	let siteDefLangId = "en";
	let siteLangList = ["en", "cs", "th", "id"];

	let langId = userLangId ? userLangId : readCookie("LangId");
	let browserDefLang =
		typeof window !== `undefined` ? navigator.language.toLowerCase() : null;

	if (!langId && browserDefLang) {
		if (
			browserDefLang.startsWith("ms") ||
			browserDefLang.startsWith("zh-tw") ||
			browserDefLang.startsWith("zh-hk")
		) {
			langId = "cs";
		} else if (browserDefLang.startsWith("zh")) {
			langId = "cs";
		} else if (browserDefLang.startsWith("th")) {
			langId = "th";
		} else if (browserDefLang.startsWith("vi")) {
			langId = "vn";
		} else if (browserDefLang.startsWith("id")) {
			langId = "id";
		} else if (browserDefLang.startsWith("jp")) {
			langId = "jp";
		} else if (browserDefLang.startsWith("ko")) {
			langId = "ko";
		} else if (
			browserDefLang.startsWith("pa") ||
			browserDefLang.startsWith("ta")
		) {
			langId = "hi";
		} else if (browserDefLang.startsWith("en")) {
			langId = "en";
		} else {
			langId = siteDefLangId;
		}
	}

	if (!langId || !siteLangList.includes(langId)) {
		langId = siteDefLangId;
	}

	return langId;
};
