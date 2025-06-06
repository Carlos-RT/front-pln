// src/App.jsx
import './App.css';
import { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ChatAntonio from './components/ChatAntonio';

const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showLogin, setShowLogin] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowLogin(true);
  };

  return (
    <div>
      <h1 style={styles.title}>
        Antonio Motores, tu asistente, mecánico, asesor y conductor de confianza
      </h1>

      {!user ? (
        <>
          {showLogin ? (
            <>
              <LoginForm onLogin={setUser} />
              <p style={styles.toggleText}>
                ¿No tienes cuenta?{' '}
                <button onClick={() => setShowLogin(false)} style={styles.link}>
                  Regístrate aquí
                </button>
              </p>
            </>
          ) : (
            <>
              <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
              <p style={styles.toggleText}>
                ¿Ya tienes cuenta?{' '}
                <button onClick={() => setShowLogin(true)} style={styles.link}>
                  Inicia sesión
                </button>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <button onClick={handleLogout} style={{ margin: 20 }}>
            Cerrar sesión
          </button>
          <ChatAntonio user={user} />
        </>
      )}
    </div>
  );
};

const styles = {
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    margin: '30px 0',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.6)'
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '10px',
    color: 'white'
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#00f',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: 0
  }
};

export default App;
