/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
import React from "react";
import { PageContextProvider } from "./src/components/common/pageContext";
import i18n from "./src/i18n/config";
import { I18nextProvider } from "react-i18next";

export const wrapRootElement = ({ element }) => {
	return <I18nextProvider i18n={i18n}>{element}</I18nextProvider>;
};

export const wrapPageElement = ({ element, props }) => {
	return (
		<PageContextProvider pageContext={props.pageContext}>
			{element}
		</PageContextProvider>
	);
};
