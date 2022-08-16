import { TextField } from "@mui/material";
import { useLogin } from "Hooks";
import React, { useState } from "react";
import "./Login.scss";
import LoadingButton from "@mui/lab/LoadingButton";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { isLoading, mutate: login, error } = useLogin(email, password);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		login();
	};

	return (
		<div className="login-container">
			<form className="form-container" onSubmit={handleSubmit}>
				<h1>Login</h1>
				<TextField
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					id="email"
					label="Email"
					variant="filled"
					type="email"
					className="text-field"
				/>
				<TextField
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					id="password"
					label="Password"
					variant="filled"
					type="password"
					className="text-field"
				/>
				<LoadingButton
					type="submit"
					variant="contained"
					loading={isLoading}
					classes={{ disabled: "login-btn-disabled" }}
				>
					LOGIN
				</LoadingButton>
				{error && <div className="error">{error.toString()}</div>}
			</form>
		</div>
	);
};

export { Login };
