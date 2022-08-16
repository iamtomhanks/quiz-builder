const randomCharactersAvailable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const PERMALINK_LENGTH = 6;

export const generatePermalink = () => {
	let result = "";
	const charactersLength = randomCharactersAvailable.length;
	for (let i = 0; i < PERMALINK_LENGTH; i++) {
		result += randomCharactersAvailable.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
};