from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_groq import ChatGroq
import os
import logging

# Flask App Initialization
app = Flask(__name__)
app.secret_key = "fitness_bot_secret_key"  # Use a secure key in production
CORS(app, resources={r"/*": {"origins": "*"}})  # Adjust for production

# Logging Configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API Key (Load from environment or replace with your actual key)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")
os.environ["GROQ_API_KEY"] = GROQ_API_KEY

# Language Model Initialization
try:
    llm = ChatGroq(model="llama3-8b-8192") 
except Exception as e:
    logger.error(f"Failed to initialize LLM: {e}")
    raise

# Route: Home
@app.route('/')
def home():
    return "Welcome to the Fitness Chatbot!"

# Route: Ask Fitness Questions
@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        if not data or "question" not in data:
            return jsonify({"error": "Missing 'question' parameter"}), 400

        question = data["question"].strip()
        if not question:
            return jsonify({"error": "Question cannot be empty"}), 400

        # Direct LLM response (no RAG since no content is provided)
        answer = llm.invoke(f"As a fitness expert, answer this: {question}").content
        return jsonify({"answer": answer})

    except Exception as e:
        logger.error(f"Error in /ask endpoint: {e}")
        return jsonify({"error": "An internal error occurred. Please try again later."}), 500

# Run Flask App
if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")  # Accessible on local network