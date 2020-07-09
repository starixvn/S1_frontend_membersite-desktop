import React from "react";
import PropTypes from "prop-types";
import Header from "../layout/header";
import Footer from "../layout/footer";
import "../../styles/Nova88/css/style.css";
import "../../styles/Nova88/css/font.css";
import "../../styles/Nova88/css/swiper.css";

const Layout = ({ children }) => {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired
};

export default Layout;
