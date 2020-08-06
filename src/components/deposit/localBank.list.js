import React, { useEffect, useRef, useState } from "react";
import path from "../../path";
import { Link } from "gatsby";
import { useTranslation } from "react-i18next";
import { api_payment_GetBankInfoOffList } from "../../service/api/payment";

const _path = path.deposit.sub.localBank.root;

export default () => {
	const { t } = useTranslation();
	const [localBankList, setLocalBankList] = useState([]);
	const isMountedRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_payment_GetBankInfoOffList().then(
			res => {
				if (isMountedRef.current) {
					if (res.data.errorCode === 0) {
						if (res.data.data.length > 0) {
							setLocalBankList(res.data.data);
						}
					} else {
						alert(res.data.message);
					}
				}
			},
			err => {
				if (isMountedRef.current) {
					alert(t("msg_ApiServerError"));
				}
			}
		);
	}, []);

	return localBankList !== null && localBankList.length > 0 ? (
		<div className="subModule">
			<div className="subModuleTitle icon icon-plus">
				<div>
					<span>{t("lbl_WireTransfers")}</span>
					<span>
						{t("lbl_CreditTime")}: {t("lbl_5mins")}
					</span>
				</div>
			</div>
			<div className="subModuleBody">
				<ul>
					<li>
						<Link to={_path} className="icon icon-library"></Link>
					</li>
				</ul>
			</div>
		</div>
	) : (
		<></>
	);
};
