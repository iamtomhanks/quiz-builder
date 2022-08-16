export enum ROUTE {
	"login" = "/login",
	"signup" = "/signup",
	"quiz" = "/quiz/:permalink",
	"createQuiz" = "/create-quiz",
	"myQuizes" = "/"
}

export const getRoute = {
	quiz: (permalink: string) => `/quiz/${permalink}`
};
