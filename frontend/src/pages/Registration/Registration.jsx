import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    IconButton,
    Typography,
    Paper,
    Box,
    Divider,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import {Link, Navigate, useNavigate} from "react-router";
import useUserStore from "../../store/user.js";
import styles from "./Registration.module.scss";

const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const register = useUserStore((state) => state.register);
    const error = useUserStore((state) => state.error);
    const clearError = useUserStore((state) => state.clearLoginAndRegisterError);

    const navigate = useNavigate();

    // Очистка ошибок при уходе со страницы
    const handleBlur = () => clearError();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const success = await register(form);
        setLoading(false);

        if (success) {
            navigate("/", { replace: true });
        }
    };

    const token = localStorage.getItem('accessToken');
    if (token) return <Navigate to="/" replace />;

    return (
        <Box className={styles.registrationWrapper}>
            <Paper
                elevation={10}
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    p: { xs: 3, sm: 4 },
                    borderRadius: "1.5rem",
                    background: "#ffffffcc",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15), 0 0 10px rgba(255,255,255,0.3)",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <LockOutlined
                        sx={{
                            fontSize: 40,
                            color: "#2575fc",
                            background: "#e3f2fd",
                            p: 1,
                            borderRadius: "50%",
                        }}
                    />
                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 600, color: "#2c3e50" }}>
                        Создай аккаунт
                    </Typography>
                </Box>

                <Divider sx={{ my: 2, opacity: 0.3 }} />

                {error && (
                    <Typography sx={{ color: "red", mb: 2, textAlign: "center" }}>
                        {error}
                    </Typography>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Имя"
                        variant="outlined"
                        fullWidth
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        label="Пароль"
                        variant="outlined"
                        fullWidth
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.2,
                            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "1rem",
                            borderRadius: "10px",
                            textTransform: "none",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 15px rgba(37,117,252,0.4)",
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>
                </form>

                <Typography variant="body2" align="center" sx={{ color: "#555" }}>
                    Уже есть аккаунт?{" "}
                    <Link to="/login" style={{ color: "#2575fc", fontWeight: 500 }}>
                        Войти
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Registration;

