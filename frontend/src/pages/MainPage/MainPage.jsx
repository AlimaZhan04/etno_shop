import useUserStore from "../../store/user.js";
import { useNavigate, Navigate } from "react-router";
import { Box, Typography, Button, Paper } from "@mui/material";
import styles from "./MainPage.module.scss";

const MainPage = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();

    if (!user) return <Navigate to="/login" replace />;

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        navigate("/login");
    };

    return (
        <Box className={styles.mainWrapper} sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Paper
                elevation={8}
                sx={{
                    p: 4,
                    maxWidth: 500,
                    width: "100%",
                    textAlign: "center",
                    borderRadius: "1.5rem",
                    background: "#ffffffcc",
                    backdropFilter: "blur(8px)",
                }}
            >
                <Typography variant="h4" sx={{ mb: 2, color: "#2575fc" }}>
                    Добро пожаловать!
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Вы авторизованы как:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: "#555" }}>
                    {user.email}
                </Typography>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                    sx={{
                        mt: 2,
                        px: 4,
                        py: 1.2,
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 15px rgba(255,0,0,0.4)" },
                    }}
                >
                    Выйти
                </Button>
            </Paper>
        </Box>
    );
};

export default MainPage;
