# AI-Powered Portfolio Chatbot with Voice Assistant

## 🚀 Overview

This project is an AI-powered interactive portfolio chatbot that allows users to ask questions about my skills, experience, and projects through both text and voice. 
It uses Retrieval-Augmented Generation (RAG) to fetch accurate answers from stored data and responds intelligently.

## ✨ Features

* Conversational chatbot using FastAPI + LangChain
* RAG pipeline with OpenAI Embeddings + FAISS Vector Store
* Voice input via SpeechRecognition
* Audio output using gTTS
* MySQL database for chat history and knowledge base
* React.js frontend with Tailwind and Framer Motion
* Email notifications using SMTP & MIME

## 🧠 Tech Stack

* **Backend:** Python, FastAPI, LangChain, OpenAI API, FAISS
* **Voice:** SpeechRecognition, gTTS
* **Frontend:** React.js, Tailwind CSS, Framer Motion
* **Database:** MySQL
* **Email:** SMTP & MIME

## 📁 Project Structure

```
root/
 ├── backend/
 │   ├── app/
 │        ├── data/ 
 |        ├── database/
 |        |       ├── database.py
 |        ├── services/
 |                ├── __init__.py
 |                ├── chat_services.py
 |                ├── email_service.py
 |   ├── __init__.py
 │   ├── main.py
 |   ├── test.py
 │   ├── faiss_index/
 │   
 │
 ├── frontend/
 │   ├── src/
 │        ├── components/
 |                 ├── Chatbot.jsx
 |                 ├── Portfolio.jsx
 |        ├── services
 │        ├── App.jsx
 |        ├── main.jsx
 |        ├── index.css
 │
 └── README.md
```

## 🔧 Setup Instructions

1. Clone the repository:

```bash
git clone <repo-url>
cd project-folder
```

2. Create Virtual Environment and Install Dependencies:

```bash
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate (Windows)
pip install -r requirements.txt
```

3. Setup MySQL Database and update `.env` file.

4. Run Backend:

```bash
uvicorn main:app --reload
```

5. Run Frontend:

```bash
cd frontend
npm install
npm start
```

## 🌟 Show Your Support

If you like this project, give a ⭐ on GitHub!
