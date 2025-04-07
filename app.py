from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow requests from React frontend

@app.route('/save_question', methods=['POST'])
def save_question():
    data = request.get_json()
    question = data.get('question')
    options = data.get('options')

    if not question or not options or len(options) != 4:
        return "Invalid data", 400

    entry = f"Q: {question}\n"
    for i, opt in enumerate(options):
        entry += f"Option {i + 1}: {opt}\n"
    entry += "-----\n"

    with open("quiz_questions.txt", "a") as f:
        f.write(entry)

    return "Question saved successfully!", 200

if __name__ == '__main__':
    app.run(debug=True)
