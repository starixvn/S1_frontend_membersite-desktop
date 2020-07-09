import React from "react";
import PropTypes from "prop-types";
import Header from "../layout/header";
import Footer from "../layout/footer";
import "../../styles/css/style.css";
import "../../styles/css/font.css";
import "../../styles/css/swiper.css";

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
