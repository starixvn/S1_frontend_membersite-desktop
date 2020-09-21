import React from "react";
import PropTypes from "prop-types";

const defPage = {
	prevPage: "prevPage",
	nextPage: "nextPage"
};

export const Pagination = ({ currentPage, totalPages, clickPageNumber }) => {
	const _clickPageNumber = (p, e) => {
		e.preventDefault();
		let page = 1;

		if (!isNaN(p)) {
			page = p;
		} else if (p === defPage.prevPage) {
			page = currentPage === 1 ? 1 : currentPage - 1;
		} else if (p === defPage.nextPage) {
			page = currentPage === totalPages ? totalPages : currentPage + 1;
		}

		if (page !== currentPage && clickPageNumber) {
			clickPageNumber(page);
		}
	};

	let arr = pageNumbers(currentPage, totalPages);
	let _arr = arr?.map(i => {
		return (
			<a
				key={`pageNumber-${i}`}
				className={`${i === currentPage ? "active" : ""}`}
				onClick={_clickPageNumber.bind(this, i)}>
				{i}
			</a>
		);
	});

	return (
		<div className="pagination">
			<a onClick={_clickPageNumber.bind(this, defPage.prevPage)}>❮</a>
			{_arr}
			<a onClick={_clickPageNumber.bind(this, defPage.nextPage)}>❯</a>
		</div>
	);
};

const pageNumbers = (currentPage, totalPages) => {
	let pairs = 2,
		range = [1];

	if (totalPages <= 1) return range;

	let range_of_head = currentPage - pairs;
	let range_of_tail = currentPage + pairs;
	for (let i = range_of_head; i <= range_of_tail; i++) {
		if (i < totalPages && i > 1) range.push(i);
	}
	range.push(totalPages);

	let tmp,
		rangeWithDots = [];
	for (let i of range) {
		if (tmp) {
			if (i - tmp === 2) {
				rangeWithDots.push(tmp + 1);
			} else if (i - tmp !== 1) {
				rangeWithDots.push("...");
			}
		}
		rangeWithDots.push(i);
		tmp = i;
	}

	return rangeWithDots;
};

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	clickPageNumber: PropTypes.func.isRequired
};
