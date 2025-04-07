import React, { useState } from 'react';
import Question from './Question';

const QuizForm = () => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { text: '', options: ['', '', '', ''], correctAnswer: 'A' }
    ]);
    const [message, setMessage] = useState({ text: '', isError: false });

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 'A' }]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
        }
    };

    const handleQuestionChange = (index, text) => {
        const newQuestions = [...questions];
        newQuestions[index].text = text;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (questionIndex, answer) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].correctAnswer = answer;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!title.trim()) {
            setMessage({ text: 'Please enter a quiz title', isError: true });
            return;
        }

        for (const q of questions) {
            if (!q.text.trim() || q.options.some(opt => !opt.trim())) {
                setMessage({ text: 'Please fill in all questions and options', isError: true });
                return;
            }
        }

        try {
            console.log("Submitting:", { title, questions });
            const response = await fetch('https://your-render-backend-url.onrender.com/api/save_quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    questions
                }),
            });

            console.log("Response status:", response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response data:", data);

            if (data.success) {
                setMessage({ text: 'Quiz saved successfully!', isError: false });
                // Reset form
                setTitle('');
                setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 'A' }]);
            } else {
                setMessage({ text: data.message || 'Failed to save quiz', isError: true });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage({ text: `Error connecting to server: ${error.message}`, isError: true });
        }
    };

    return (
        <div className="quiz-form-container">
            <h1>Quiz Creator</h1>
            {message.text && (
                <div className={`message ${message.isError ? 'error' : 'success'}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Quiz Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter quiz title"
                    />
                </div>

                {questions.map((question, index) => (
                    <Question
                        key={index}
                        index={index}
                        question={question}
                        onQuestionChange={handleQuestionChange}
                        onOptionChange={handleOptionChange}
                        onCorrectAnswerChange={handleCorrectAnswerChange}
                        onRemove={removeQuestion}
                    />
                ))}

                <div className="buttons">
                    <button type="button" onClick={addQuestion} className="add-btn">
                        Add Question
                    </button>
                    <button type="submit" className="submit-btn">
                        Save Quiz
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuizForm;