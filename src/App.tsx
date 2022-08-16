import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { initializeApp } from "firebase/app";
import { Signup, MyQuizes, Login, CreateQuiz, TakeQuiz } from "Pages";
import { QueryClient, QueryClientProvider } from "react-query";
import { Nav, ProtectedRoute } from "./Components";
import { ReactQueryDevtools } from "react-query/devtools";
import { ROUTE } from "Constants";
import { AxiosError } from "axios";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				const axiosError = error as AxiosError;
				return (
					axiosError.status !== undefined &&
					![400, 401, 403].includes(parseInt(axiosError.status)) &&
					failureCount < 3
				);
			}
		}
	}
});
const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

initializeApp(firebaseConfig);

const App = () => (
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<Nav />
			<div className="app-container">
				<Routes>
					<Route path={ROUTE["login"]} element={<Login />} />
					<Route path={ROUTE["signup"]} element={<Signup />} />
					<Route
						path={ROUTE["myQuizes"]}
						element={
							<ProtectedRoute>
								<MyQuizes />
							</ProtectedRoute>
						}
					/>
					<Route path={ROUTE["quiz"]} element={<TakeQuiz />} />
					<Route
						path={ROUTE["createQuiz"]}
						element={
							<ProtectedRoute>
								<CreateQuiz />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</div>
		</QueryClientProvider>
	</BrowserRouter>
);

export default App;
