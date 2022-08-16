import "./CreateQuiz.scss";
import { useParams, useNavigate } from "react-router-dom";
import { usePublishQuiz } from "Hooks";
import { Button, FormLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { Answer, Question, NewQuiz } from "Types";
import { Modal } from "Components";
import { ROUTE } from "Constants";

const defaultNewQuiz: NewQuiz = {
	title: "",
	questions: []
};

const defaultQuestion: Question = {
	answers: [],
	text: ""
};

const defaultEditedAnswer: Answer = {
	text: "",
	isCorrect: false
};

const MIN_QUESTION_COUNT = 1;
const MAX_QUESTION_COUNT = 10;
const MIN_ANSWER_COUNT = 1;
const MAX_ANSWER_COUNT = 5;
const MAX_TEXT_LENGTH = 50;

const CreateQuiz = () => {
	const [instructionsModalOpen, setInstructionsModalOpen] = useState(true);
	const [editedQuiz, setNewQuiz] = useState(Object.assign({}, defaultNewQuiz));
	const navigate = useNavigate();
	const params = useParams();
	const {
		mutate: publishQuiz,
		isLoading: isPublishLoading,
		status: publishStatus
	} = usePublishQuiz();
	const isNewQuiz = params.quizId === undefined;

	useEffect(() => {
		if (publishStatus === "success") {
			navigate(ROUTE["myQuizes"]);
		}
	}, [publishStatus]);

	const getAnswer = (questionIndex: number, answerIndex: number): Answer | undefined => {
		const question = editedQuiz.questions.find((_, qI) => qI === questionIndex);
		return question?.answers.find((_, aI) => aI === answerIndex);
	};

	const setAnswer = (questionIndex: number, answerIndex: number, answer: Answer) => {
		const questions = [...editedQuiz.questions];
		const question = { ...questions[questionIndex] };
		const questionAnswers = [...(question.answers || [])];

		questionAnswers[answerIndex] = answer;
		question.answers = questionAnswers;
		questions[questionIndex] = question;

		setNewQuiz({ ...editedQuiz, questions });
	};

	const handleAddQuestion = () => {
		setNewQuiz({
			...editedQuiz,
			questions: [...editedQuiz.questions, Object.assign({}, defaultQuestion)]
		});
	};

	const handleEditQuestionTitle = (value: string, questionIndex: number) => {
		const questions = [...editedQuiz.questions];
		const question = { ...questions[questionIndex] };
		question.text = value;
		questions[questionIndex] = question;

		setNewQuiz({ ...editedQuiz, questions });
	};

	const handleEditAnswerTitle = (value: string, questionIndex: number, answerIndex: number) => {
		const answer = getAnswer(questionIndex, answerIndex);
		if (!answer) return;
		answer.text = value;

		setAnswer(questionIndex, answerIndex, { ...answer });
	};

	const handleAddAnswer = (questionIndex: number) => {
		const questions = [...editedQuiz.questions];
		const question = { ...questions[questionIndex] };
		question.answers = [...(question.answers || []), Object.assign({}, defaultEditedAnswer)];

		questions[questionIndex] = question;
		setNewQuiz({ ...editedQuiz, questions });
	};

	const handleDeleteAnwser = (questionIndex: number, answerIndex: number) => {
		const questions = [...editedQuiz.questions];
		const question = { ...questions[questionIndex] };
		const questionAnswers = [...(question.answers || [])];
		questionAnswers.splice(answerIndex, 1);

		question.answers = questionAnswers;
		questions[questionIndex] = question;

		setNewQuiz({ ...editedQuiz, questions });
	};

	const handleCorrectAnswerUpdate = (
		questionIndex: number,
		answerIndex: number,
		isCorrect: boolean
	) => {
		const answer = getAnswer(questionIndex, answerIndex);
		if (!answer) return;
		answer.isCorrect = isCorrect;

		setAnswer(questionIndex, answerIndex, { ...answer });
	};

	const handleDeleteQuestion = (questionIndex: number) => {
		const questions = [...editedQuiz.questions];
		questions.splice(questionIndex, 1);

		setNewQuiz({ ...editedQuiz, questions });
	};

	const handleDeleteQuiz = () => {
		if (isNewQuiz) {
			navigate(ROUTE["myQuizes"]);
		}
	};

	const isQuizValid = () => {
		return (
			editedQuiz.title.length > 0 &&
			editedQuiz.questions.length <= MAX_QUESTION_COUNT &&
			editedQuiz.questions.length >= MIN_QUESTION_COUNT &&
			!editedQuiz.questions.some(
				(q) =>
					q.text?.length === 0 ||
					q.answers.length > MAX_ANSWER_COUNT ||
					q.answers.length < MIN_ANSWER_COUNT ||
					!q.answers.some((a) => a.isCorrect && a.text.length > 0)
			)
		);
	};

	const handlePublishQuiz = () => {
		if (!isQuizValid()) {
			setInstructionsModalOpen(true);
		} else {
			publishQuiz(editedQuiz);
		}
	};

	return (
		<div className="create-quiz-container">
			<Modal close={() => setInstructionsModalOpen(false)} open={instructionsModalOpen}>
				<div className="instructions-container">
					<h2>Creating a Quiz</h2>
					<h3>Before you publish your quiz, the following criteria must be met.</h3>
					<p>The quiz must have a title.</p>
					<p>
						The quiz must contain between {MIN_QUESTION_COUNT} and {MAX_QUESTION_COUNT} questions.
					</p>
					<p>
						Each question must contain between {MIN_ANSWER_COUNT} and {MAX_ANSWER_COUNT} answers.
					</p>
					<p>Each question must contain at least one answer marked as correct.</p>
					<p>Each question must have text.</p>
					<p>Each answer must have text.</p>
				</div>
			</Modal>
			<div className="title-and-actions">
				<input
					maxLength={MAX_TEXT_LENGTH}
					className="quiz-title-text-field text-field"
					placeholder={"Enter a title for your quiz"}
					value={editedQuiz.title}
					onChange={(e) => setNewQuiz({ ...editedQuiz, title: e.target.value })}
				/>
				<div className="quiz-actions-container">
					<Button variant="contained" onClick={() => setInstructionsModalOpen(true)}>
						View Instructions
					</Button>
					{isNewQuiz && (
						<Button
							disabled={isPublishLoading}
							variant="contained"
							color="success"
							onClick={handlePublishQuiz}
						>
							Publish Quiz
						</Button>
					)}
					<Button
						disabled={isPublishLoading}
						variant="contained"
						color="error"
						onClick={handleDeleteQuiz}
					>
						Delete Quiz
					</Button>
				</div>
			</div>
			<div className="questions-container">
				{editedQuiz.questions.map((q, qI) => {
					const questionAnswers = editedQuiz.questions[qI].answers;

					return (
						<div className="question-container" key={`${qI}-${q.text}`}>
							<input
								maxLength={MAX_TEXT_LENGTH}
								type="text"
								className="question-title-text-field text-field"
								placeholder={"Enter your question text"}
								value={q.text}
								onChange={(e) => handleEditQuestionTitle(e.target.value, qI)}
							/>
							{questionAnswers?.map((a, aI) => (
								<div className="answer-container" key={`${qI}-${q.text}-${aI}`}>
									<input
										maxLength={MAX_TEXT_LENGTH}
										type="text"
										className="answer-text-field text-field"
										placeholder={"Enter your answer text"}
										value={a.text}
										onChange={(e) => handleEditAnswerTitle(e.target.value, qI, aI)}
									/>
									<div className="answer-actions-container">
										<div>
											<FormLabel style={{ color: "#FFF", fontWeight: "700" }}>Is correct?</FormLabel>
											<input
												type="checkbox"
												checked={a.isCorrect}
												style={{ border: "2px solid green" }}
												onChange={(e) => handleCorrectAnswerUpdate(qI, aI, e.target.checked)}
											/>
										</div>
										<Button variant="contained" color="error" onClick={() => handleDeleteAnwser(qI, aI)}>
											Delete Answer
										</Button>
									</div>
								</div>
							))}
							{((questionAnswers && questionAnswers?.length < MAX_ANSWER_COUNT) || !questionAnswers) && (
								<Button
									style={{ background: "#132F4C" }}
									className="add-answer-btn"
									variant="contained"
									onClick={() => handleAddAnswer(qI)}
								>
									Add Answer
								</Button>
							)}
							<Button
								className="delete-question-btn"
								variant="contained"
								color="error"
								onClick={() => handleDeleteQuestion(qI)}
							>
								Delete Question
							</Button>
						</div>
					);
				})}
			</div>
			{editedQuiz.questions.length < MAX_QUESTION_COUNT && (
				<Button className="add-question-btn" variant="contained" onClick={handleAddQuestion}>
					Add Question
				</Button>
			)}
		</div>
	);
};

export { CreateQuiz };
