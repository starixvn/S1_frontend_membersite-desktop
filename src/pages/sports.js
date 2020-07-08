import React from "react";
import { useTranslation } from "react-i18next";
import Wrapper from "../components/common/wrapper";
import Layout from "../components/common/layout";
import { getUrlParameter } from "../components/common/common";
import { GET_ENTER_PAGE_URL } from "../service/enterPage";

export default () => {
	const { i18n } = useTranslation();
	let tpId = getUrlParameter("tpId");
	let gameId = getUrlParameter("gameId");

	return (
		<Wrapper>
			<Layout>
				<iframe
					src={GET_ENTER_PAGE_URL(
						i18n.language,
						tpId,
						gameId
					)}></iframe>
			</Layout>
		</Wrapper>
	);
};
