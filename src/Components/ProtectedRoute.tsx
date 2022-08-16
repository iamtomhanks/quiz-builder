import { Loader } from "Components";
import { ROUTE } from "Constants";
import { useAuthRoute } from "Hooks";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
	const { data: uid, isSuccess, isError, isFetching } = useAuthRoute();

	if (isFetching) {
		return <Loader />;
	}

	if ((!uid && isSuccess) || isError) {
		return <Navigate to={ROUTE["login"]} />;
	}
	return children;
};

export { ProtectedRoute };
