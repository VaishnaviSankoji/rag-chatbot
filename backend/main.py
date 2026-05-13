from fastapi import FastAPI, UploadFile, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ingest import ingest_pdf
from retriever import ask_question
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

os.makedirs("docs", exist_ok=True)

@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

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
    result = ask_question(question)
    response = JSONResponse(content=result)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response