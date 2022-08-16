import axios, { AxiosError } from "axios";
import { API_ROUTE } from "Types/api";

axios.defaults.withCredentials = true;

export const api = <RT>(route: API_ROUTE, data?: unknown) => {
	return {
		get: async () => {
			try {
				const result = await axios.get<RT>(`${process.env.REACT_APP_SERVER}/${route}`, {
					params: data
				});
				return result;
			} catch (err) {
				throw (err as AxiosError).response;
			}
		},
		post: async () => {
			try {
				const result = await axios.post<RT>(`${process.env.REACT_APP_SERVER}/${route}`, data, {});
				return result;
			} catch (err) {
				throw (err as AxiosError).response;
			}
		},
		delete: async () => {
			try {
				const result = await axios.delete<RT>(`${process.env.REACT_APP_SERVER}/${route}`, {
					data
				});
				return result;
			} catch (err) {
				throw (err as AxiosError).response;
			}
		}
	};
};
