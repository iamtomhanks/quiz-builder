import { api } from "API";
import { QUERY } from "Constants";
import { useQuery } from "react-query";
import { API_ROUTE, Quiz } from "Types";

const useGetMyQuizes = () => {
	const query = useQuery(QUERY["get-my-quizes"], async () => {
		const result = await api<Quiz[]>(API_ROUTE["get-my-quizes"]).get();
		return result.data;
	});

	return query;
};

export { useGetMyQuizes };
