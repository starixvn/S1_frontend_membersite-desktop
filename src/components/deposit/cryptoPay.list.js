import React from "react";
import path from "../../path";
import { Link } from "gatsby";
import { useTranslation } from "react-i18next";
import config from "../../config";

const _path = path.deposit.sub.crypto.root;

export default ({ cryptoList }) => {
	const { t } = useTranslation();

	let rows = cryptoList?.map(p => {
		return (
			<li key={`deposit-crypto-${p.channelName}}`}>
				<Link to={`${_path}?name=${p.channelName}&gId=${p.groupId}`}>
					<img
						src={`${config.cloudImgUrl}/SiteSkin/img/Payment/${p.channelName}.png`}
						alt={p.channelName}
					/>
				</Link>

				<span>{p.groupName}</span>
			</li>
		);
	});

	return cryptoList !== null && cryptoList.length > 0 ? (
		<div className="subModule">
			<div className="subModuleTitle">
				<div>
					{/* <span>{t("lbl_MobileDeposit")}</span> */}
					<span>{t("lbl_CryptoPay")}</span>
					<span>
						{t("lbl_CreditTime")}: {t("lbl_Instant")}
					</span>
				</div>
			</div>
			<div className="subModuleBody">
				<ul>{rows}</ul>
			</div>
		</div>
	) : (
		<></>
	);
};
