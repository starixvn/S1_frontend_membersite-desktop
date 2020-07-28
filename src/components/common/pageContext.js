import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const PageContext = React.createContext();

export const PageContextProvider = ({ pageContext, children }) => {
	const { i18n } = useTranslation();
	useEffect(() => {
		let mounted = true;
		if (i18n.language !== pageContext.lang && mounted) {
			i18n.changeLanguage(pageContext.lang);
		}
		return () => {
			mounted = false;
		};
	}, [pageContext.lang]);

	return (
		<PageContext.Provider pageContext={pageContext}>
			{children}
		</PageContext.Provider>
	);
};

export const usePageContext = () => React.useContext(PageContext);
