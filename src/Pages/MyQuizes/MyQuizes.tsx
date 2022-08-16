import "./MyQuizes.scss";
import { useNavigate } from "react-router-dom";
import { useDeleteQuiz, useGetMyQuizes } from "Hooks";
import { Button } from "@mui/material";
import { Loader, MyQuizesTable } from "Components";
import { ROUTE } from "Constants";

const MyQuizes = () => {
	const navigate = useNavigate();
	const { data: myQuizes, isLoading } = useGetMyQuizes();
	const { mutate: deleteQuiz } = useDeleteQuiz();

	if (isLoading) return <Loader />;

	return (
		<div className="my-quizes-container">
			<h1>My Quizes</h1>
			{myQuizes?.length !== 0 && <MyQuizesTable quizes={myQuizes || []} handleDelete={deleteQuiz} />}
			{myQuizes?.length === 0 && !isLoading && <div>You have no quizes.</div>}
			<Button
				className="create-quiz-btn"
				variant="contained"
				onClick={() => navigate(ROUTE["createQuiz"])}
			>
				Create New Quiz
			</Button>
		</div>
	);
};

export { MyQuizes };
