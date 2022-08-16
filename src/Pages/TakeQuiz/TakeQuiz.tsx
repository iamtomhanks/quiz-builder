import "./TakeQuiz.scss";
import { useParams } from "react-router-dom";
import { useGetQuiz } from "Hooks";
import { Loader, Modal } from "Components";
import { useState } from "react";
import { Button } from "@mui/material";
import { Question } from "Types";

const TakeQuiz = () => {
	const params = useParams();
	const permalink = params.permalink;
	const { data: quiz, isFetching, error } = useGetQuiz(permalink);

	// selectedAnswers will be a map of the question index and the selected answer indexes
	const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number[] }>({});
	const [numCorrect, setNumCorrect] = useState<number | null>(null);
	const [summaryModalOpen, setSummaryModalOpen] = useState(false);

	const isQuestionMultiAnswer = (q: Question) => {
		return q.answers.filter((a) => a.isCorrect).length > 1;
	};

	const handleAnswerSelect = (qI: number, aI: number) => {
		let questionAnswers = selectedAnswers[qI] ? [...selectedAnswers[qI]] : [];

		// deselect
		const answerIndex = questionAnswers.indexOf(aI);
		if (answerIndex !== -1) {
			questionAnswers.splice(answerIndex, 1);
		} else {
			// select
			const question = quiz?.questions[qI];
			if (question && isQuestionMultiAnswer(question)) {
				questionAnswers.push(aI);
			} else {
				questionAnswers = [aI];
			}
		}

		setSelectedAnswers({ ...selectedAnswers, [qI]: questionAnswers });
	};

	const handleSubmit = () => {
		if (!quiz) return;

		const correctAnswers = quiz.questions.filter((q, qI) =>
			q.answers.every(
				(a, aI) =>
					(a.isCorrect && selectedAnswers[qI]?.indexOf(aI) !== -1) ||
					(!a.isCorrect && selectedAnswers[qI]?.indexOf(aI) === -1)
			)
		);
		setNumCorrect(correctAnswers.length || 0);
		setSummaryModalOpen(true);
	};

	if (!permalink) {
		return <>Can&apos;t find that quiz.</>;
	}

	if (isFetching) return <Loader />;

	if (error) return <div>{error.statusText}</div>;

	return (
		<div className="take-quiz-container">
			<Modal close={() => setSummaryModalOpen(false)} open={summaryModalOpen}>
				<div className="">
					<h2>Thanks for taking {quiz?.title}</h2>
					<h3>
						You answered {numCorrect}/{quiz?.questions.length} questions correctly.
					</h3>
				</div>
			</Modal>
			<h1 className="title">{quiz?.title}</h1>
			{quiz?.questions.map((q, qI) => {
				const isMultiAnswer = isQuestionMultiAnswer(q);

				return (
					<div className="question-container" key={`${qI}-${q.text}`}>
						<div className="question-title">{q.text}</div>
						{isMultiAnswer && <div className="multi-answer-alert">*Select all correct answers</div>}
						{q.answers.map((a, aI) => {
							const isSelected = selectedAnswers[qI] && selectedAnswers[qI].indexOf(aI) !== -1;
							return (
								<div
									className={`answer-container${isSelected ? " selected" : ""}`}
									key={`${qI}-${q.text}-${aI}-${a.text}`}
									onClick={() => handleAnswerSelect(qI, aI)}
								>
									<span className="answer-text">{a.text}</span>
								</div>
							);
						})}
					</div>
				);
			})}
			<Button variant="contained" onClick={handleSubmit}>
				<h1>SUBMIT YOUR ANSWERS</h1>
			</Button>
		</div>
	);
};

export { TakeQuiz };
