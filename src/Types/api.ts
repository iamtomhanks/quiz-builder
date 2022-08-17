import { AxiosError } from "axios";

export enum API_ROUTE {
	"get-quiz" = "getQuiz",
	"get-my-quizes" = "getMyQuizes",
	"publish-quiz" = "publishQuiz",
	"delete-quiz" = "deleteQuiz",
	"login" = "login",
	"signup" = "signup",
	"load-user-from-token" = "loadUserFromToken",
	"logout" = "logout"
}

export type AxiosErrorType = AxiosError<string>['response'];
