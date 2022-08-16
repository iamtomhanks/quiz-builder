import { api } from "API";
import { QUERY } from "Constants";
import { useQuery } from "react-query";
import { API_ROUTE } from "Types";

const useAuthRoute = () => {
	const query = useQuery<string | null>(QUERY["use-auth-route"], async () => {
		try {
			const result = await api<string>(API_ROUTE["load-user-from-token"]).get();
			return result.data;
		} catch (error) {
			return null;
		}
	});

	return query;
};

export { useAuthRoute };
