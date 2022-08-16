import { api } from "API";
import { QUERY, ROUTE } from "Constants";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { API_ROUTE } from "Types";

const useLogout = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const query = useMutation<unknown, string>(QUERY["logout"], async () => {
		localStorage.removeItem("uid");
		await api<string>(API_ROUTE["logout"]).post();
		navigate(ROUTE["login"]);
		queryClient.clear();
		return;
	});

	return query;
};

export { useLogout };
