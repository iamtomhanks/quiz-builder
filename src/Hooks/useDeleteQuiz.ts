import { api } from "API";
import { QUERY } from "Constants";
import { useMutation, useQueryClient } from "react-query";
import { API_ROUTE } from "Types";

const useDeleteQuiz = () => {
	const queryClient = useQueryClient();

	const query = useMutation(QUERY["delete-quiz"], async (quizId: string) => {
		const result = await api<string>(API_ROUTE["delete-quiz"], { quizId }).delete();

		queryClient.invalidateQueries(QUERY["get-my-quizes"]);
		return result.statusText;
	});

	return query;
};

export { useDeleteQuiz };
