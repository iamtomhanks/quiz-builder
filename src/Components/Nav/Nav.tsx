import MaterialAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";
import { useAuthRoute, useLogout } from "Hooks";
import { ROUTE } from "Constants";

const Nav = () => {
	const navigate = useNavigate();
	const { data: user } = useAuthRoute();
	const { mutate: logout } = useLogout();

	return (
		<MaterialAppBar position="static">
			<div className="nav-inner">
				<Link
					to="/"
					style={{
						display: "flex",
						alignItems: "center",
						color: "#fff",
						textDecoration: "none"
					}}
				>
					<PsychologyIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
					<Typography
						variant="h6"
						noWrap
						component="span"
						sx={{
							mr: 2,
							display: { xs: "none", md: "flex" },
							fontFamily: "monospace",
							fontWeight: 700,
							letterSpacing: ".3rem",
							color: "inherit",
							textDecoration: "none"
						}}
					>
						QUIZ-ME
					</Typography>
				</Link>
				{user ? (
					<>
						<MenuItem
							onClick={() => {
								navigate(ROUTE["myQuizes"]);
							}}
						>
							My Quizes
						</MenuItem>
						<MenuItem onClick={() => logout()}>Logout</MenuItem>
					</>
				) : (
					<>
						<MenuItem
							onClick={() => {
								navigate(ROUTE["signup"]);
							}}
						>
							Signup
						</MenuItem>
						<MenuItem
							onClick={() => {
								navigate(ROUTE["login"]);
							}}
						>
							Login
						</MenuItem>
					</>
				)}
			</div>
		</MaterialAppBar>
	);
};

export { Nav };
