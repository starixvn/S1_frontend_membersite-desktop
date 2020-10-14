export const Iov_GetBlackBox = async () => {
	let blackBox = "";
	if (
		typeof window !== undefined &&
		typeof window.IGLOO.getBlackbox === "function"
	) {
		try {
			let result = await window.IGLOO.getBlackbox();
			blackBox = result?.blackbox || "";
		} catch (e) {}
	}

	return blackBox;
};
