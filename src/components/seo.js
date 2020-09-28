/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

function SEO({ description, lang, meta, title }) {
	const { site } = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
						author
					}
				}
			}
		`
	);

	const metaDescription = description || site.siteMetadata.description;

	return (
		<>
			<Helmet
				htmlAttributes={{
					lang
				}}
				title={site.siteMetadata.title}
				link={[{ rel: "icon", type: "image/png", href: "favicon.ico" }]}
				meta={[
					{
						name: `description`,
						content: metaDescription
					},
					{
						property: `og:title`,
						content: title
					},
					{
						property: `og:description`,
						content: metaDescription
					},
					{
						property: `og:type`,
						content: `website`
					},
					{
						name: `twitter:card`,
						content: `summary`
					},
					{
						name: `twitter:creator`,
						content: site.siteMetadata.author
					},
					{
						name: `twitter:title`,
						content: title
					},
					{
						name: `twitter:description`,
						content: metaDescription
					}
				].concat(meta)}
			/>
			<LiveChat />
		</>
	);
}

SEO.defaultProps = {
	lang: `en`,
	meta: [],
	description: ``
};

SEO.propTypes = {
	description: PropTypes.string,
	lang: PropTypes.string,
	meta: PropTypes.arrayOf(PropTypes.object),
	title: PropTypes.string
};

const LiveChat = () => {
	return (
		<Helmet>
			<script>
				{`window.__lc = window.__lc || {};
        window.__lc.license = 11638088;
        window.__lc.chat_between_groups = false;
        ; (function (n, t, c) { function i(n) { return e._h ? e._h.apply(null, n) : e._q.push(n) } var e = { _q: [], _h: null, _v: "2.0", on: function () { i(["on", c.call(arguments)]) }, once: function () { i(["once", c.call(arguments)]) }, off: function () { i(["off", c.call(arguments)]) }, get: function () { if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load."); return i(["get", c.call(arguments)]) }, call: function () { i(["call", c.call(arguments)]) }, init: function () { var n = t.createElement("script"); n.async = !0, n.type = "text/javascript", n.src = "https://cdn.livechatinc.com/tracking.js", t.head.appendChild(n) } }; !n.__lc.asyncInit && e.init(), n.LiveChatWidget = n.LiveChatWidget || e }(window, document, [].slice))
        LiveChatWidget.call('hide');
        LiveChatWidget.call('hide_greeting')`}
			</script>
		</Helmet>
	);
};

export default SEO;
