import { api } from "API";
import { AxiosError } from "axios";
import { QUERY, ROUTE } from "Constants";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { API_ROUTE } from "Types";

const useLogin = (email: string, password: string) => {
	const navigate = useNavigate();

	const query = useMutation<unknown, AxiosError>([QUERY["login"], email, password], async () => {
		const result = await api<string>(API_ROUTE["login"], { email, password }).post();
		localStorage.setItem("uid", result.data);
		navigate(ROUTE["myQuizes"]);

		return;
	});

	return query;
};

export { useLogin };
