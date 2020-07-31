import React from "react";
import PropTypes from "prop-types";
import Header from "../layout/header";
import Footer from "../layout/footer";
import SEO from "../seo";
import PopBox from "./popBox";
import "../../styles/css/swiper.css";
import "../../styles/css/style.css";
import "../../styles/css/font.css";

const Layout = ({ children }) => {
	return (
		<>
			<SEO />
			<Header />
			{children}
			<Footer />
			<PopBox />
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired
};

export default Layout;
