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

# Demo

https://github.com/user-attachments/assets/475ecc21-0e1b-4585-8674-65c0509d2210
<img width="1896" height="853" alt="Screenshot 2025-10-29 123605" src="https://github.com/user-attachments/assets/ff208ed8-9921-419d-bea4-9b3b1847041c" />
<img width="1900" height="828" alt="Screenshot 2025-10-29 123719" src="https://github.com/user-attachments/assets/a3e201f1-0213-4665-bb83-4779e2b4e2c6" />
<img width="1891" height="822" alt="Screenshot 2025-10-29 123735" src="https://github.com/user-attachments/assets/49af1f12-6149-467b-a16a-e25b416f872c" />
<img width="1893" height="828" alt="Screenshot 2025-10-29 123755" src="https://github.com/user-attachments/assets/bcb90160-b4cd-442b-8f35-aada36e2e304" />
<img width="1899" height="830" alt="Screenshot 2025-10-29 123809" src="https://github.com/user-attachments/assets/d619202e-d362-4b90-98ee-a4a451ca43d5" />
<img width="1897" height="826" alt="Screenshot 2025-10-29 123824" src="https://github.com/user-attachments/assets/cd1b321d-aee8-4ec0-969f-0f2ef5dd3aa7" />
<img width="1726" height="822" alt="Screenshot 2025-10-29 123843" src="https://github.com/user-attachments/assets/048c02b3-e871-48f4-b0e2-e973c95ea016" />
<img width="1880" height="827" alt="Screenshot 2025-10-29 123907" src="https://github.com/user-attachments/assets/0528b9a5-0880-4eb1-b2f6-b5bbe5c4f867" />
<img width="1864" height="834" alt="Screenshot 2025-10-29 123925" src="https://github.com/user-attachments/assets/46feea57-61b0-419a-8e39-4e2da280c26d" />

## 🌟 Show Your Support

If you like this project, give a ⭐ on GitHub!


