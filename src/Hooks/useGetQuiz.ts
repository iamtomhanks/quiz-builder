import { api } from "API";
import { AxiosError } from "axios";
import { QUERY } from "Constants";
import { useQuery } from "react-query";
import { API_ROUTE, Quiz } from "Types";

const useGetQuiz = (permalink?: string) => {
	const query = useQuery<Quiz, AxiosError["response"]>(
		QUERY["get-quiz"],
		async () => {
			const result = await api<Quiz>(API_ROUTE["get-quiz"], { permalink }).get();
			return result.data;
		},
		{
			enabled: permalink !== undefined
		}
	);

	return query;
};

export { useGetQuiz };
