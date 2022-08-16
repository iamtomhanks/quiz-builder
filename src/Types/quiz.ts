import { Question } from "./question";

export interface Quiz {
	id: string;
	userId: string;
	title: string;
	permalink: string;
	questions: Question[];
}

export interface NewQuiz {
	title: Quiz["title"];
	questions: Question[];
}
