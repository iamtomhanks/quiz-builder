import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Quiz } from "Types";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import { displayPermaLink } from "Utils";
import { Link } from "react-router-dom";
import { getRoute } from "Constants";

interface QuizRowProps {
	quiz: Quiz;
	handleDelete: (id: string) => void;
}

const QuizRow = ({ quiz, handleDelete }: QuizRowProps) => {
	const { id, title, permalink } = quiz;

	return (
		<TableRow key={id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
			<StyledTableCell component="th" scope="row">
				{title}
			</StyledTableCell>
			<StyledTableCell component="th" scope="row">
				<Link to={getRoute.quiz(permalink)}>{displayPermaLink(permalink)}</Link>
			</StyledTableCell>
			<StyledTableCell align="right">
				<Button variant="contained" color="error" onClick={() => handleDelete(id)}>
					Delete Quiz
				</Button>
			</StyledTableCell>
		</TableRow>
	);
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#1976d2",
		color: theme.palette.common.white,
		fontWeight: "bold",
		fontSize: 16,
		textAlign: "center"
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
		textAlign: "center"
	}
}));

interface Props {
	quizes: Quiz[];
	handleDelete: (id: string) => void;
}

const MyQuizesTable = ({ quizes, handleDelete }: Props) => (
	<TableContainer component={Paper}>
		<Table sx={{ minWidth: 600 }}>
			<TableHead>
				<TableRow>
					<StyledTableCell>Title</StyledTableCell>
					<StyledTableCell align="right">Shareable Link</StyledTableCell>
					<StyledTableCell align="right"></StyledTableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{quizes.map((quiz) => (
					<QuizRow key={quiz.id} quiz={quiz} handleDelete={handleDelete} />
				))}
			</TableBody>
		</Table>
	</TableContainer>
);

export { MyQuizesTable };
