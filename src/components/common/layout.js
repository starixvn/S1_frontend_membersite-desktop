import React from "react";
import PropTypes from "prop-types";

import "../../styles/Nova88/css/style.css";
import "../../styles/Nova88/css/font.css";
import "../../styles/Nova88/css/swiper.css";

const Layout = ({ children }) => {
	return <>{children}</>;
};

Layout.propTypes = {
	children: PropTypes.node.isRequired
};

export default Layout;
