// src/components/LoginForm.js
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import speakeasy from "speakeasy";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // Guardar los datos del formulario en localStorage
        if (localStorage.getItem("is2FA") === '') {
            localStorage.setItem("is2FA", 'false');
        }
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        localStorage.setItem("Id", Math.floor(100000 + Math.random() * 900000).toString());
        console.log("Username:", username);
        console.log("Password:", password);

        // Verificar si el usuario tiene habilitado el 2FA
        const is2FAEnabled = localStorage.getItem("is2FA") === 'true';
        console.log("2FA habilitado:", is2FAEnabled);
        if (is2FAEnabled) {
            // Mostrar ventana para ingresar el código OTP
            const otp = prompt("Ingrese el código OTP generado por su aplicación de autenticación:");
            if (otp) {
                // Verificar el OTP ingresado con el secret almacenado en localStorage
                const secret = localStorage.getItem("secretKey");
                const verified = speakeasy.totp.verify({
                    secret: secret,
                    encoding: "hex",
                    token: otp,
                    window: 1 // Configurar la ventana de tiempo en la que el token seguirá siendo válido
                });

                if (verified) {
                    console.log("OTP verificado correctamente.");
                    // Navegar a la vista de perfil si el OTP es válido
                    navigate("/profile");
                } else {
                    alert("El código OTP ingresado no es válido. Por favor, inténtelo de nuevo.");
                }
            }
        } else {
            // Si no hay 2FA habilitado, simplemente navegar a la vista de perfil
            navigate("/profile");
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
                </Box>
            </Box>
        </Container>
    );
};

export default LoginForm;
