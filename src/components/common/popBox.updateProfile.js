import React from "react";
import { useTranslation } from "react-i18next";

export default ({ title, content, btnBar }) => {
	const { t } = useTranslation();

	return (
		<div className="Cancel active">
			<div className="icon icon-icon32px_Profile"></div>
			<div className="title">{title}</div>
			<div>{content}</div>
			{btnBar}
		</div>
	);
};
