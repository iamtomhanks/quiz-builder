import { TextField } from "@mui/material";
import { useSignup } from "Hooks";
import React, { useState } from "react";
import "./Signup.scss";
import LoadingButton from "@mui/lab/LoadingButton";

const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { isLoading, mutate: signup, error } = useSignup(email, password);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		signup();
	};

	return (
		<div className="signup-container">
			<form className="form-container" onSubmit={handleSubmit}>
				<h1>Signup</h1>
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
					SIGNUP
				</LoadingButton>
				{error && <div className="error">{error.data}</div>}
			</form>
		</div>
	);
};

export { Signup };
