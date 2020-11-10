import React from "react";

export const defFilterType = {
	all: 0,
	expiry: 999,
	firstDeposit: 1,
	redeposit: 2,
	freeBet: 3,
	Rebate_and_cashback: "6_7"
};

const defPromoNavs = [
	{
		displayKey: "lbl_All",
		value: defFilterType.all,
		className: "blueBorder icon icon-icon32px_ALL",
		selectedClassName: "blue icon icon-icon32px_ALL"
	},
	{
		displayKey: "lbl_PromotionCategory1",
		value: defFilterType.firstDeposit,
		className: "blueBorder",
		selectedClassName: "blue"
	},
	{
		displayKey: "lbl_FreeBet",
		value: defFilterType.freeBet,
		className: "blueBorder",
		selectedClassName: "blue"
	},
	{
		displayKey: "lbl_PromotionRebateAndCashback",
		value: defFilterType.Rebate_and_cashback,
		className: "blueBorder",
		selectedClassName: "blue"
	},
	{
		displayKey: "lbl_Redeposit_Promo",
		value: defFilterType.redeposit,
		className: "blueBorder",
		selectedClassName: "blue"
	},
	{
		displayKey: "lbl_Expired_Promo",
		value: defFilterType.expiry,
		className: "red",
		selectedClassName: "red"
	}
];

export default ({ t, selected, onClick }) => {
	return (
		<div className="quickSelect">
			<div className="btnGroup promoType">
				{defPromoNavs.map(item => (
					<button
						key={`promo-nav-${item.displayKey}`}
						className={
							item.value === selected
								? item.selectedClassName
								: item.className
						}
						onClick={() => onClick(item.value)}>
						{t(item.displayKey)}
					</button>
				))}
			</div>
		</div>
	);
};
