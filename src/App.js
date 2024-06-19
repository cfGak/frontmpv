import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Profile from './components/Porfile';
import DisplayQRCode from './components/DisplayQrCode';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/display-qrcode" element={<DisplayQRCode />} />
      </Routes>
    </Router>
  );
}
// src/App.tsx


export default App;
