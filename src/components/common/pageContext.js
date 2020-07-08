import React from "react";
import { useTranslation } from "react-i18next";

const PageContext = React.createContext();

export const PageContextProvider = ({ pageContext, children }) => {
	const { i18n } = useTranslation();
	if (i18n.language !== pageContext.lang) {
		i18n.changeLanguage(pageContext.lang);
	}

	return (
		<PageContext.Provider pageContext={pageContext}>
			{children}
		</PageContext.Provider>
	);
};

export const usePageContext = () => React.useContext(PageContext);
