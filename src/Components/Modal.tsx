import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import MaterialModal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "#037ffe",
	border: "2px solid #000",
	boxShadow: 24,
	p: 2
};

interface Props {
	children: JSX.Element;
	open: boolean;
	close: () => void;
}

const Modal = ({ children, open, close }: Props) => {
	return (
		<div>
			<MaterialModal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				onClose={close}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={open}>
					<Box sx={style}>{children}</Box>
				</Fade>
			</MaterialModal>
		</div>
	);
};

export { Modal };
