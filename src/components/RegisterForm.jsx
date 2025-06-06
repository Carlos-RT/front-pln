// src/components/RegisterForm.jsx
import { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/chat/register', {
        username: formData.username,
        password: formData.password
      });

      alert('Registro exitoso. Ahora inicia sesión.');

      setFormData({
        username: '',
        password: '',
        confirmPassword: ''
      });

      // Cambiar a vista de inicio de sesión
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Error en el registro');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Registro</h2>
      <input
        type="text"
        name="username"
        placeholder="Nombre de usuario"
        value={formData.username}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirmar contraseña"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Registrarse</button>
      {error && <p style={styles.error}>{error}</p>}
    </form>
  );
};

const styles = {
  form: {
    maxWidth: '300px',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  error: {
    color: 'red'
  }
};

export default RegisterForm;
