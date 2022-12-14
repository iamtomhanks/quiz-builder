import { api } from "API";
import { QUERY, ROUTE } from "Constants";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { API_ROUTE, AxiosErrorType } from "Types";

const useSignup = (email: string, password: string) => {
	const navigate = useNavigate();

	const query = useMutation<unknown, AxiosErrorType>([QUERY["signup"], email, password], async () => {
		const result = await api<string>(API_ROUTE["signup"], { email, password }).post();
		localStorage.setItem("uid", result.data);

		navigate(ROUTE["myQuizes"]);
	});

	return query;
};

export { useSignup };
