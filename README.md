\# RAG Chatbot



An AI-powered document Q\&A chatbot built with LangChain,

ChromaDB, Ollama (LLaMA 3.1), FastAPI, and React.



\## Features

\- Upload any PDF and ask questions about it

\- Fully local — no API keys or internet needed after setup

\- Shows source page numbers for every answer

\- Clean chat UI with message bubbles



\## Tech Stack

\- Backend: Python, FastAPI, LangChain, ChromaDB

\- Frontend: React.js, Axios

\- LLM: Ollama (LLaMA 3.1 8B) — runs locally



\## Run Locally



\### Backend

cd backend

pip install -r requirements.txt

uvicorn main:app --reload



\### Frontend

cd frontend

npm install

npm start



\### Ollama

ollama pull llama3.1

ollama serve



\## How it works

1\. Upload a PDF → it gets split into chunks and stored in ChromaDB

2\. Ask a question → it searches for relevant chunks

3\. LLaMA reads the chunks and generates an answer with sources

