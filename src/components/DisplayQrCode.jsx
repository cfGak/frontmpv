import React, { useState } from 'react';
import { Box, Button, Typography, Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import speakeasy from 'speakeasy';


const DisplayQRCode = () => {
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState('');
  const secretKey = localStorage.getItem('secretKey') || '';

  const username = localStorage.getItem('username') || '';

  const handleVerify = () => {
    console.log(secretKey)
    
      const isValid = speakeasy.totp.verify({
        secret: secretKey,
        encoding: 'hex', // Asegúrate de especificar el encoding correcto
        token: otpCode,
      });
  
      if (isValid) {
        alert('El código es correcto.');
        localStorage.setItem('is2FA', true);
        navigate('/profile');
      } else {
        alert('El código es incorrecto. Inténtalo de nuevo.');
      }
    
  };

  if (!secretKey) {
    return <Typography>No se encontró una clave secreta guardada. Por favor, genera una primero.</Typography>;
  }

  const uri = speakeasy.otpauthURL({
    secret: secretKey,
    label: username,
    issuer: 'AustraTest', // Cambia según tus necesidades
    encoding: 'hex', // Asegúrate de especificar el encoding correcto
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Código QR
        </Typography>
        <QRCode value={uri} />
        <Box sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Código TOTP"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            onClick={handleVerify}
          >
            Verificar Código
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DisplayQRCode;
