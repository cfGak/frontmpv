// src/components/Profile.js
import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import speakeasy from 'speakeasy';
import { Buffer } from 'buffer'; // Importar buffer
global.Buffer = Buffer; 

const Profile = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'No disponible';
  const password = localStorage.getItem('password') || 'No disponible';
    const otpCode = localStorage.getItem('otpCode') || '';
    
  const handleBack = () => {
    navigate('/');
  };

  const handleVerify = () => {
    const secretKey = localStorage.getItem('secretKey');
    console.log(secretKey)
    
      const isValid = speakeasy.totp.verify({
        secret: secretKey,
        encoding: 'hex', // Asegúrate de especificar el encoding correcto
        token: otpCode,
      });
  
      if (isValid) {
        alert('El código es correcto.');
      } else {
        alert('El código es incorrecto. Inténtalo de nuevo.');
      }
    
  };

  const generateSecretKey = () => {
    const secret = speakeasy.generateSecret({ length: 20 });
    localStorage.setItem('secretKey', secret.hex);
  };

  const handleDisplayQRCode = () => {
    console.log(localStorage.getItem('secretKey'));
    navigate('/display-qrcode');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Perfil de Usuario
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">Nombre de Usuario: <strong>{username}</strong></Typography>
          <Typography variant="body1">Contraseña: <strong>{password}</strong></Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
            Volver
          </Button>
          <Button variant="contained" onClick={generateSecretKey} sx={{ mt: 1 }}>
            Generar Clave Secreta
          </Button>
          <Button variant="contained" onClick={handleDisplayQRCode} sx={{ mt: 1 }}>
            Mostrar QR y Verificar TOTP
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
