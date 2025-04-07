import React from 'react';

const Question = ({ index, question, onQuestionChange, onOptionChange, onCorrectAnswerChange, onRemove }) => {
    return (
        <div className="question-card">
            <div className="question-header">
                <h3>Question {index + 1}</h3>
                <button onClick={() => onRemove(index)} className="remove-btn">Remove</button>
            </div>
            <textarea
                value={question.text}
                onChange={(e) => onQuestionChange(index, e.target.value)}
                placeholder="Enter your question here"
                required
            />
            <div className="options-grid">
                {['A', 'B', 'C', 'D'].map((option, i) => (
                    <div key={i} className="option">
                        <label>
                            <input
                                type="radio"
                                name={`correctAnswer-${index}`}
                                checked={question.correctAnswer === option}
                                onChange={() => onCorrectAnswerChange(index, option)}
                            />
                            {option})
                        </label>
                        <input
                            type="text"
                            value={question.options[i]}
                            onChange={(e) => onOptionChange(index, i, e.target.value)}
                            placeholder={`Option ${option}`}
                            required
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Question;