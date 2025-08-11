import React, { useState } from 'react';
import Home from './pages/Home';
import Auth from './pages/Auth';
import '../index.css';
export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  return isAuth ? <Home /> : <Auth onAuthSuccess={() => setIsAuth(true)} />;
}
