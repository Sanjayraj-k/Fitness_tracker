from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_groq import ChatGroq
import os
import logging
from langgraph.graph import StateGraph, END
from typing import Dict, Any

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

# Define the State for LangGraph
class AgentState(Dict[str, Any]):
    question: str
    answer: str
    summary: str

# Agent 1: Fitness Expert
def fitness_agent(state: AgentState) -> AgentState:
    question = state["question"]
    answer = llm.invoke(f"As a fitness expert, answer this: {question}").content
    state["answer"] = answer
    return state

# Agent 2: Summarizer
def summarizer_agent(state: AgentState) -> AgentState:
    answer = state["answer"]
    summary = llm.invoke(f"As a fitness expert, answer this: {answer}").content
    state["summary"] = summary
    return state

# Define the Workflow with LangGraph
workflow = StateGraph(AgentState)

# Add nodes for each agent
workflow.add_node("fitness_agent", fitness_agent)
workflow.add_node("summarizer_agent", summarizer_agent)

# Define the flow: Fitness Agent -> Summarizer Agent -> End
workflow.set_entry_point("fitness_agent")
workflow.add_edge("fitness_agent", "summarizer_agent")
workflow.add_edge("summarizer_agent", END)

# Compile the graph
graph = workflow.compile()

# Route: Home
@app.route('/')
def home():
    return "Welcome to the Fitness Chatbot with Multi-Agent Workflow!"

# Route: Ask Fitness Questions (Return only summary)
@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        if not data or "question" not in data:
            return jsonify({"error": "Missing 'question' parameter"}), 400

        question = data["question"].strip()
        if not question:
            return jsonify({"error": "Question cannot be empty"}), 400

        # Run the multi-agent workflow
        initial_state = AgentState(question=question, answer="", summary="")
        result = graph.invoke(initial_state)

        # Return only the summary
        return jsonify({"answer": result["summary"]})

    except Exception as e:
        logger.error(f"Error in /ask endpoint: {e}")
        return jsonify({"error": "An internal error occurred. Please try again later."}), 500

# Run Flask App
if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")  
