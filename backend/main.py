from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ingest import ingest_pdf
from retriever import ask_question
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False
)
os.makedirs("docs", exist_ok=True)

@app.get("/")
def root():
    return {"message": "RAG Chatbot API is running!"}

@app.post("/upload")
async def upload(file: UploadFile):
    path = f"docs/{file.filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    count = ingest_pdf(path)
    return {"message": "PDF uploaded and indexed!", "chunks": count}

@app.post("/ask")
async def ask(data: dict):
    question = data.get("question", "")
    return ask_question(question)
