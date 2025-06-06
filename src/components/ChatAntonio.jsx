import { useState, useEffect } from 'react';
import axios from 'axios';

const ChatAntonio = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');

  // Cargar conversaciones previas del usuario
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('https://back-pln.vercel.app/api/chat/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const previousMessages = res.data.map((conv) => ([
          { role: 'user', content: conv.prompt },
          { role: 'assistant', content: conv.response }
        ])).flat();
        setMessages(previousMessages);
      } catch (err) {
        console.error('❌ Error al cargar historial:', err);
      }
    };

    fetchConversations();
  }, [token]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setPrompt('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/chat',
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const assistantMessage = { role: 'assistant', content: res.data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('❌ Error al enviar mensaje:', err);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '❌ Error al responder.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      background: '#2c2c2c',
      border: '1px solid #444',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      color: '#f0f0f0'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '20px'
    },
    chatBox: {
      maxHeight: '400px',
      overflowY: 'auto',
      marginBottom: '20px',
      padding: '10px',
      backgroundColor: '#1e1e1e',
      borderRadius: '5px'
    },
    message: (role) => ({
      backgroundColor: role === 'user' ? '#007bff' : '#444',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '10px',
      alignSelf: role === 'user' ? 'flex-end' : 'flex-start',
      maxWidth: '80%'
    }),
    inputArea: {
      display: 'flex',
      gap: '10px'
    },
    input: {
      flex: 1,
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #666',
      background: '#1a1a1a',
      color: '#fff'
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💬 Chat con Antonio (Experto en Automóviles)</h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={styles.chatBox}>
          {messages.map((msg, index) => (
            <div key={index} style={styles.message(msg.role)}>
              <strong>{msg.role === 'user' ? 'Tú' : 'Antonio'}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div style={styles.inputArea}>
          <input
            style={styles.input}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregúntale algo a Antonio..."
          />
          <button style={styles.button} onClick={handleSend} disabled={isLoading}>
            {isLoading ? 'Esperando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAntonio;
