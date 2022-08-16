import { api } from "API";
import { NewQuiz } from "Types";
import { useMutation } from "react-query";
import { API_ROUTE } from "Types";
import { QUERY } from "Constants";

const usePublishQuiz = () => {
	const query = useMutation(QUERY["publish-quiz"], async (quiz: NewQuiz) => {
		const result = await api(API_ROUTE["publish-quiz"], { quiz }).post();
		return result.data;
	});

	return query;
};

export { usePublishQuiz };
