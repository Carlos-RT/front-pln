import { useState } from 'react';
import axios from 'axios';

const ChatPrompt = () => {
  const [stage, setStage] = useState('select');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const topics = ['Historia', 'Ciencia', 'Matemáticas', 'Tecnología'];

  const fetchQuiz = async (topic) => {
    setIsLoading(true);
    setSelectedTopic(topic);
    try {
      const res = await axios.post('http://localhost:5000/api/quiz', { topic });
      if (res.data?.questions) {
        setQuestions(res.data.questions);
        setStage('quiz');
      } else {
        throw new Error('No se recibieron preguntas.');
      }
    } catch (err) {
      console.error('Error al obtener el quiz:', err);
      alert('❌ Error al generar preguntas. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionIndex, selectedOption) => {
    setAnswers(prev => {
      if (prev[questionIndex] === selectedOption) return prev;
      return { ...prev, [questionIndex]: selectedOption };
    });
  };

  const submitQuiz = async () => {
    const total = questions.length;
    let correct = 0;
    const detailedResults = questions.map((q, index) => {
      const isCorrect = answers[index] === q.correct;
      if (isCorrect) correct++;
      return {
        question: q.question,
        selected: answers[index],
        correct: q.correct,
        options: q.options,
        isCorrect,
      };
    });

    const score = Math.round((correct / total) * 100);
    const resultData = { topic: selectedTopic, score, total, correct, answers: detailedResults };
    setResult(resultData);
    setStage('result');

    try {
      await axios.post('http://localhost:5000/api/quiz/results', resultData);
    } catch (err) {
      console.error('Error al guardar resultado:', err);
    }
  };

  const restart = () => {
    setStage('select');
    setSelectedTopic('');
    setQuestions([]);
    setAnswers({});
    setResult(null);
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
      marginBottom: '20px',
      color: '#ffffff'
    },
    button: {
      padding: '10px 15px',
      margin: '5px 0',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    disabledButton: {
      backgroundColor: '#555',
      cursor: 'not-allowed'
    },
    questionBox: {
      marginBottom: '20px',
      padding: '10px',
      backgroundColor: '#3b3b3b',
      border: '1px solid #555',
      borderRadius: '5px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold'
    },
    radioGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    input: {
      marginRight: '8px'
    },
    resultBox: (isCorrect) => ({
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid',
      borderColor: isCorrect ? '#4CAF50' : '#f44336',
      backgroundColor: isCorrect ? '#2e4d2f' : '#4d2e2e',
      borderRadius: '5px'
    })
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Formulario de Quiz IA 🎓</h1>

      {stage === 'select' && (
        <div>
          <p style={{ textAlign: 'center', marginBottom: '10px' }}>Selecciona un tema:</p>
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => fetchQuiz(topic)}
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading && selectedTopic === topic ? styles.disabledButton : {})
              }}
            >
              {isLoading && selectedTopic === topic ? 'Cargando...' : topic}
            </button>
          ))}
        </div>
      )}

      {stage === 'quiz' && (
        <div>
          <h2 style={{ marginBottom: '15px' }}>Tema: {selectedTopic}</h2>
          {questions.map((q, index) => (
            <div key={index} style={styles.questionBox}>
              <label style={styles.label}>{index + 1}. {q.question}</label>
              <div style={styles.radioGroup}>
                {q.options.map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={opt}
                      checked={answers[index] === opt}
                      onChange={() => handleAnswer(index, opt)}
                      style={styles.input}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={submitQuiz}
            style={{ ...styles.button, backgroundColor: '#28a745' }}
          >
            Enviar respuestas
          </button>
        </div>
      )}

      {stage === 'result' && result && (
        <div>
          <h2 style={{ ...styles.title, color: '#28a745' }}>🎉 Resultado del Quiz</h2>
          <p style={{ fontSize: '18px', marginBottom: '15px' }}>
            Puntaje: <strong>{result.score}%</strong> ({result.correct}/{result.total} correctas)
          </p>
          {result.answers.map((res, index) => (
            <div key={index} style={styles.resultBox(res.isCorrect)}>
              <p><strong>{index + 1}. {res.question}</strong></p>
              <p>Tu respuesta: <strong>{res.selected || 'No respondida'}</strong></p>
              {!res.isCorrect && (
                <p>Respuesta correcta: <strong>{res.correct}</strong></p>
              )}
            </div>
          ))}
          <button
            onClick={restart}
            style={{ ...styles.button, backgroundColor: '#6c757d', marginTop: '20px' }}
          >
            Volver a empezar
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPrompt;