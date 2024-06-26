import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import speakeasy from "speakeasy";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const user = { username, password };

        try {
            const response = await fetch('https://localhost:5001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
                localStorage.setItem("Id", data.id);
                localStorage.setItem("is2FA", data.is2FAEnabled.toString());
                localStorage.setItem("secretKey", data.key);

                console.log("Username:", username);
                console.log("Password:", password);
                console.log("2FA habilitado:", data.is2FAEnabled);

                if (data.is2FAEnabled) {
                    const otp = prompt("Ingrese el código OTP generado por su aplicación de autenticación:");
                    if (otp) {
                        const verified = speakeasy.totp.verify({
                            secret: data.key,
                            encoding: "hex",
                            token: otp,
                            window: 1, // Configurar la ventana de tiempo en la que el token seguirá siendo válido
                        });

                        if (verified) {
                            console.log("OTP verificado correctamente.");
                            navigate("/profile");
                        } else {
                            alert("El código OTP ingresado no es válido. Por favor, inténtelo de nuevo.");
                        }
                    }
                } else {
                    navigate("/profile");
                }
            } else {
                alert('Credenciales inválidas. Por favor, inténtelo de nuevo.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Iniciar Sesión
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Nombre de Usuario"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Iniciar Sesión
                    </Button>
                    <Link href="/register" variant="body2">
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;
