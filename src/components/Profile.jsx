import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import speakeasy from 'speakeasy';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

const Profile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('No disponible');
  const [password, setPassword] = useState('No disponible');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const userId = localStorage.getItem('Id');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://localhost:5001/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setPassword(data.password);
          setIs2FAEnabled(data.is2FAEnabled);
          setSecretKey(data.key);
          // Guardar en localStorage
          localStorage.setItem('username', data.username);
          localStorage.setItem('password', data.password);
          localStorage.setItem('is2FAEnabled', data.is2FAEnabled);
          localStorage.setItem('secretKey', data.key);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleBack = () => {
    navigate('/');
  };

  const generateSecretKey = async () => {
    const secret = speakeasy.generateSecret({ length: 20 });
    setSecretKey(secret.hex);

    try {
      const response = await fetch(`https://localhost:5001/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          username,
          password,
          is2FAEnabled: false,
          key: secret.hex,
          counter: 0,
        }),
      });

      if (response.ok) {
        setSecretKey(secret.hex);
        localStorage.setItem('secretKey', secret.hex);
        alert('Clave secreta generada y guardada en el backend.');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Error al generar clave secreta: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error generating secret key:', error);
    }
  };

  const handleDisplayQRCode = async () => {
    if (!secretKey) {
      alert("No se encontró una clave secreta guardada. Por favor, genera una primero.");
      return;
    }

    try {
      const response = await fetch(`https://localhost:5001/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          username,
          password,
          is2FAEnabled: true,
          key: secretKey,
          counter: 0,
        }),
      });

      if (response.ok) {
        setIs2FAEnabled(true);
        localStorage.setItem('is2FAEnabled', true);
        navigate('/display-qrcode');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Error al actualizar 2FA: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al actualizar 2FA:', error);
    }
  };

  const handleVerify = async () => {
    if (!secretKey) {
      alert("No se encontró una clave secreta guardada. Por favor, genera una primero.");
      return;
    }

    const otpCode = prompt("Ingrese el código OTP generado por su aplicación de autenticación:");

    if (otpCode) {
      const isValid = speakeasy.totp.verify({
        secret: secretKey,
        encoding: 'hex',
        token: otpCode,
        window: 1,
      });

      if (isValid) {
        try {
          const response = await fetch(`https://localhost:5001/api/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: userId,
              username,
              password,
              is2FAEnabled: true,
              key: secretKey,
              counter: 0,
            }),
          });

          if (response.ok) {
            setIs2FAEnabled(true);
            localStorage.setItem('is2FAEnabled', true);
            alert('El código es correcto y 2FA está habilitado.');
          } else {
            alert('Error al habilitar 2FA.');
          }
        } catch (error) {
          console.error('Error al habilitar 2FA:', error);
        }
      } else {
        alert('El código es incorrecto. Inténtalo de nuevo.');
      }
    }
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
          <Typography variant="body1">2FA Habilitado: <strong>{is2FAEnabled ? 'Sí' : 'No'}</strong></Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
            Volver
          </Button>
          <Button variant="contained" onClick={generateSecretKey} sx={{ mt: 1, mr: 1 }}>
            Generar Clave Secreta
          </Button>
          <Button variant="contained" onClick={handleDisplayQRCode} sx={{ mt: 1, mr: 1 }}>
            Mostrar QR
          </Button>
          <Button variant="contained" onClick={handleVerify} sx={{ mt: 1 }}>
            Verificar OTP
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
