from waitress import serve
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
# Configure CORS to allow requests from React app
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# Ensure the quizzes directory exists
os.makedirs('quizzes', exist_ok=True)

@app.route('/api/save_quiz', methods=['POST', 'OPTIONS'])
def save_quiz():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"quizzes/quiz_{timestamp}.txt"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"Quiz Title: {data.get('title', 'Untitled Quiz')}\n\n")
            for i, question in enumerate(data.get('questions', [])):
                f.write(f"Question {i+1}: {question.get('text', '')}\n")
                options = question.get('options', ['', '', '', ''])
                f.write(f"A) {options[0]}\n")
                f.write(f"B) {options[1]}\n")
                f.write(f"C) {options[2]}\n")
                f.write(f"D) {options[3]}\n")
                f.write(f"Correct Answer: {question.get('correctAnswer', 'A')}\n\n")
        
        return jsonify({"success": True, "message": "Quiz saved successfully!"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

def _build_cors_preflight_response():
    response = jsonify({"success": True})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

if __name__ == '__main__':
    if os.environ.get('ENV') == 'production':
        serve(app, host="0.0.0.0", port=5001)
    else:
        app.run(debug=True)
