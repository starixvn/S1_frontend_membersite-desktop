import React, { useEffect, useState, useRef, useContext } from "react";
import { Link } from "gatsby";
import { api_payment_GetOnlinePaymentList } from "../../service/api/payment";
import LimitTip from "./limitTip";
import { isConvert } from "../common/common";
import { userInfoContext } from "../common/context";

const path = "onlineBank";
export default () => {
	const [onlineBankingList, setOnlineBankingList] = useState([]);
	const { userInfo } = useContext(userInfoContext);
	const isMountedRef = useRef(null);
	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	useEffect(() => {
		api_payment_GetOnlinePaymentList().then(res => {
			if (res.data.errorCode === 0 && isMountedRef.current) {
				setOnlineBankingList(res.data.data);
			}
		});
	}, []);

	const _isConvert = isConvert(userInfo.currencyId);
	let rows = onlineBankingList?.map(p => {
		return (
			<li key={`deposit-onlineBank-${p.payId}-${p.channelId}`}>
				<Link
					to={`${path}?pId=${p.payId}&cId=${p.channelId}`}
					className={`icon icon-${p.payName}`}></Link>
				<LimitTip
					minAmount={p.minAmount}
					maxAmount={p.maxAmount}
					displayTextLimit={"Limit"}
					displayTextUnLimit={"Unlimit"}
					_isConvert={_isConvert}
				/>
			</li>
		);
	});

	return (
		<div className="subModule">
			<div className="subModuleTitle icon icon-plus">
				<div>
					<span>Online Banking</span>
					<span>Credit Time: Instant</span>
				</div>
			</div>
			<div className="subModuleBody">
				<ul>{rows}</ul>
			</div>
		</div>
	);
};
