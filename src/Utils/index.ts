import { getRoute } from "Constants";

export const displayPermaLink = (permalink: string) => {
	const domain = process.env.REACT_APP_DOMAIN;

	return `${domain}${getRoute.quiz(permalink)}`;
};
