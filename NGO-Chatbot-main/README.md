<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F172A,25:1E293B,50:2563EB,75:0891B2,100:06B6D4&height=260&section=header&text=NGO%20Proposal%20Drafting%20Bot&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=GenAI-Powered%20RAG%20Platform%20for%20NGOs&descAlignY=58&descSize=18" width="100%" />

</div>

# 🌍 NGO Proposal Drafting Bot

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge\&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge\&logo=fastapi)
![Streamlit](https://img.shields.io/badge/Streamlit-Frontend-FF4B4B?style=for-the-badge\&logo=streamlit)
![LangChain](https://img.shields.io/badge/LangChain-AI_Framework-green?style=for-the-badge)
![FAISS](https://img.shields.io/badge/FAISS-VectorDB-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)

<h3>
🚀 GenAI-Powered Proposal Intelligence Platform for NGOs & Grant Organizations
</h3>

<p>
An enterprise-grade Retrieval-Augmented Generation (RAG) system that automates NGO proposal drafting, knowledge retrieval, donor documentation, and AI-assisted grant writing.
</p>

</div>

---

# ✨ Overview

The <b>NGO Proposal Drafting Bot</b> is a modern AI-powered platform designed to help NGOs, non-profits, social enterprises, and CSR teams streamline the process of creating professional grant proposals.

The platform leverages:

* 🧠 Large Language Models (LLMs)
* 📚 Retrieval-Augmented Generation (RAG)
* 🔎 Semantic Search
* 📄 Intelligent Document Processing
* ⚡ FastAPI Microservices
* 🎨 Streamlit Interactive Frontend

The system transforms scattered organizational documents into a centralized AI knowledge assistant capable of generating:

✅ Grant Proposals
✅ Impact Reports
✅ Funding Applications
✅ Donor Documentation
✅ Program Summaries
✅ Citation-backed Responses

---

# 🎯 Problem Statement

NGOs often struggle with:

* Repetitive proposal writing
* Searching historical project documents
* Maintaining donor-specific formatting
* Reusing institutional knowledge
* Tight funding deadlines
* Inconsistent writing quality
* Lack of centralized knowledge management

This project solves these challenges by creating an intelligent AI proposal drafting ecosystem.

---

# 🧠 Core Features

<table>
<tr>
<td width="50%">

## 🤖 AI Proposal Drafting

Generate professional proposal sections using organizational knowledge.

* Executive Summary
* Objectives
* Methodology
* Budget Justification
* Sustainability Plans
* Monitoring & Evaluation

</td>
<td width="50%">

## 📚 Knowledge Base Q&A

Chat with uploaded NGO documents.

* Semantic Retrieval
* Citation Generation
* Context-Aware Answers
* Multi-document Search

</td>
</tr>

<tr>
<td width="50%">

## 📂 Document Management

Upload and process:

* PDF
* DOCX
* TXT
* Past Proposals
* Impact Reports
* Donor Guidelines

</td>
<td width="50%">

## 🧩 Template Management

Create reusable proposal templates.

* Donor-specific structures
* Custom sections
* Dynamic outlines
* Standardized formats

</td>
</tr>

<tr>
<td width="50%">

## 📄 Export System

Export completed proposals.

* DOCX Export
* PDF Export
* Citation Preservation
* Professional Formatting

</td>
<td width="50%">

## 🔐 Role-Based Access

Secure multi-role architecture.

* Admin Dashboard
* User Workspace
* Document Permissions
* Prompt Management

</td>
</tr>
</table>

---

# 🏗️ System Architecture

<div align="center">

```mermaid
flowchart TB

%% ===== USER LAYER =====
subgraph USER_LAYER [👥 USER INTERACTION LAYER]
    U1[NGO Staff]
    U2[Administrators]
end

%% ===== FRONTEND =====
subgraph FRONTEND [🎨 STREAMLIT FRONTEND]
    F1[Dashboard]
    F2[AI Chat Interface]
    F3[Proposal Drafting Workspace]
    F4[Document Upload Center]
    F5[Template Manager]
    F6[Export Module]
end

%% ===== BACKEND =====
subgraph BACKEND [⚡ FASTAPI BACKEND API]
    B1[Authentication Service]
    B2[Proposal Generation API]
    B3[Knowledge Retrieval API]
    B4[Document Processing Service]
    B5[Export Service]
end

%% ===== AI ENGINE =====
subgraph AI_ENGINE [🧠 AI + RAG ENGINE]
    A1[LangChain Orchestration]
    A2[Prompt Engineering Layer]
    A3[Semantic Retriever]
    A4[Embedding Generator]
    A5[Citation Generator]
    A6[LLM Model 
 OpenAI / Gemini]
end

%% ===== STORAGE =====
subgraph STORAGE [💾 DATA STORAGE LAYER]
    S1[(FAISS Vector Database)]
    S2[(Templates Database)]
    S3[(Knowledge Base Documents)]
    S4[(Exported DOCX/PDF)]
end

%% ===== FLOW =====
U1 --> FRONTEND
U2 --> FRONTEND

FRONTEND --> BACKEND
BACKEND --> AI_ENGINE
AI_ENGINE --> STORAGE

B4 --> A4
A4 --> S1

B2 --> A1
A1 --> A3
A3 --> S1
A1 --> A2
A2 --> A6
A6 --> A5
A5 --> F3

B5 --> S4
F6 --> S4

%% ===== STYLING =====
style USER_LAYER fill:#0F172A,stroke:#38BDF8,color:#ffffff
style FRONTEND fill:#111827,stroke:#60A5FA,color:#ffffff
style BACKEND fill:#1E293B,stroke:#38BDF8,color:#ffffff
style AI_ENGINE fill:#0F172A,stroke:#22D3EE,color:#ffffff
style STORAGE fill:#111827,stroke:#06B6D4,color:#ffffff

```

</div>

---

# 🔄 RAG Workflow

## Retrieval-Augmented Generation Pipeline

<div align="center">

```mermaid
sequenceDiagram
    autonumber

    participant U as 👤 NGO User
    participant UI as 🎨 Streamlit UI
    participant API as ⚡ FastAPI Backend
    participant RET as 🔎 Retriever
    participant VDB as 💾 FAISS Vector DB
    participant LLM as 🧠 LLM Engine
    participant EXP as 📄 Export System

    U->>UI: Upload Documents / Ask Query
    UI->>API: Send Request

    API->>RET: Perform Semantic Search
    RET->>VDB: Retrieve Similar Chunks
    VDB-->>RET: Return Relevant Context

    RET-->>API: Retrieved NGO Knowledge

    API->>LLM: Prompt + Context Injection
    LLM-->>API: AI Generated Proposal

    API-->>UI: Return Final Response

    UI->>EXP: Export Proposal
    EXP-->>U: DOCX / PDF Output

```

</div>

---

# 🧠 Proposal Generation Flow

<div align="center">

```mermaid
flowchart LR

A[📂 Upload NGO Documents] --> B[📄 Extract Text]
B --> C[✂️ Chunk Documents]
C --> D[🧠 Generate Embeddings]
D --> E[(💾 FAISS Vector Store)]

F[👤 User Proposal Request] --> G[🔎 Semantic Search]
G --> E
E --> H[📚 Retrieve Relevant Context]
H --> I[🧩 Prompt Engineering]
I --> J[🤖 OpenAI / Gemini LLM]
J --> K[📝 Generate Proposal Section]
K --> L[📌 Add Citations]
L --> M[📄 Export Final Proposal]

style A fill:#0F172A,color:#fff,stroke:#38BDF8
style B fill:#1E293B,color:#fff,stroke:#60A5FA
style C fill:#1E293B,color:#fff,stroke:#60A5FA
style D fill:#0F172A,color:#fff,stroke:#22D3EE
style E fill:#111827,color:#fff,stroke:#06B6D4
style F fill:#0F172A,color:#fff,stroke:#38BDF8
style G fill:#1E293B,color:#fff,stroke:#60A5FA
style H fill:#111827,color:#fff,stroke:#22D3EE
style I fill:#0F172A,color:#fff,stroke:#38BDF8
style J fill:#1E293B,color:#fff,stroke:#06B6D4
style K fill:#111827,color:#fff,stroke:#22D3EE
style L fill:#0F172A,color:#fff,stroke:#38BDF8
style M fill:#1E293B,color:#fff,stroke:#60A5FA

```

</div>

---

# 🖥️ Tech Stack

<div align="center">

| Category         | Technologies                              |
| ---------------- | ----------------------------------------- |
| Frontend         | Streamlit                                 |
| Backend          | FastAPI                                   |
| AI Framework     | LangChain                                 |
| Vector Database  | FAISS / ChromaDB                          |
| LLM Providers    | OpenAI / Gemini                           |
| Embeddings       | OpenAI Embeddings / Sentence Transformers |
| Document Parsing | PyPDF, python-docx                        |
| Validation       | Pydantic                                  |
| Testing          | Pytest + Hypothesis                       |
| Exporting        | DOCX + PDF Generators                     |

</div>

---

# 📁 Project Structure

```bash
NGO-Proposal-Drafting-Bot/
│
├── app/
│   ├── api/                  # FastAPI routes
│   ├── services/             # Core business logic
│   ├── models/               # Pydantic schemas
│   ├── utils/                # Utility functions
│   └── main.py               # FastAPI entry point
│
├── frontend/
│   ├── pages/                # Streamlit pages
│   ├── components/           # UI components
│   └── app.py                # Streamlit entry point
│
├── data/
│   ├── documents/            # Uploaded files
│   ├── vectorstore/          # FAISS index
│   ├── templates/            # Proposal templates
│   └── exports/              # Generated outputs
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── property/
│
├── scripts/
│   ├── seed_data.py
│   └── create_admin.py
│
├── requirements.txt
├── pyproject.toml
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/ngo-proposal-drafting-bot.git

cd ngo-proposal-drafting-bot
```

---

## 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file.

```env
OPENAI_API_KEY=your_api_key
GOOGLE_API_KEY=your_gemini_key
VECTOR_DB=faiss
```

---

# ▶️ Running the Project

## Run Backend

```bash
uvicorn app.main:app --reload
```

Backend API:

```bash
http://localhost:8000
```

Swagger Docs:

```bash
http://localhost:8000/docs
```

---

## Run Frontend

```bash
streamlit run frontend/app.py
```

Frontend:

```bash
http://localhost:8501
```

---

# 📚 Document Processing Pipeline

```mermaid
flowchart LR

A[PDF/DOCX Upload] --> B[Text Extraction]
B --> C[Chunking]
C --> D[Embedding Generation]
D --> E[Vector Storage]
E --> F[Semantic Retrieval]
```

---

# 🧩 AI Components

## 🔎 Semantic Search

The system uses vector embeddings to retrieve semantically similar information.

Example:

```text
"women empowerment outcomes"
```

Can retrieve:

```text
"female community development impact metrics"
```

Even without exact keyword matches.

---

## 🧠 Prompt Engineering

The platform dynamically builds prompts using:

* User instructions
* Retrieved NGO context
* Proposal templates
* Donor formatting standards

---

## 📌 Citation Generation

Every generated response can include source references.

Example:

```text
(Source: education_impact_report.pdf, Page 12)
```

---

# 🎨 Frontend UI Design

The frontend is designed for:

✅ Simplicity
✅ Accessibility
✅ Fast Navigation
✅ Multi-page Workflow
✅ Interactive AI Chat Experience

## Major UI Sections

| Page              | Description                |
| ----------------- | -------------------------- |
| Dashboard         | Central workspace          |
| AI Chat           | Knowledge Base Q&A         |
| Proposal Drafting | Generate proposal sections |
| Templates         | Manage proposal structures |
| Admin Panel       | Upload documents & prompts |
| Export Center     | Download DOCX/PDF          |

---

# 🔐 Authentication & Security

The application supports role-based access control.

## User Roles

| Role  | Permissions                |
| ----- | -------------------------- |
| User  | Draft proposals & chat     |
| Admin | Manage templates/documents |

---

# 🧪 Testing Strategy

The project includes:

* ✅ Unit Testing
* ✅ Integration Testing
* ✅ Property-Based Testing

## Run Tests

```bash
pytest
```

---

# 🚀 Deployment Ready

The architecture supports deployment on:

* Docker
* Render
* Railway
* AWS
* Azure
* GCP
* Kubernetes

---

# 📈 Future Enhancements

## Planned Features

* 🌐 Multi-language proposal generation
* 👥 Collaborative editing
* 📊 NGO analytics dashboard
* 🧠 Fine-tuned NGO models
* ☁️ Cloud vector databases
* 🔔 Donor deadline reminders
* 📝 Real-time co-authoring
* 📱 Mobile-responsive UI

---

# 📸 Screenshots

```text
Add screenshots here:

assets/
├── dashboard.png
├── ai-chat.png
├── drafting-page.png
└── admin-panel.png
```

---

# 📊 Performance Advantages

| Traditional Workflow   | AI-Powered Workflow      |
| ---------------------- | ------------------------ |
| Weeks of drafting      | Minutes of drafting      |
| Manual document search | Semantic retrieval       |
| Repetitive writing     | Automated generation     |
| Scattered knowledge    | Centralized intelligence |

---

# 💡 Key Technical Highlights

## What Makes This Project Strong?

✔ Production-grade architecture
✔ End-to-end RAG implementation
✔ Real-world NGO use case
✔ Scalable modular design
✔ Semantic retrieval system
✔ AI-assisted proposal automation
✔ Full-stack integration
✔ Export-ready document generation
✔ Professional testing strategy

---

# 👨‍💻 Author

<div align="center">

## P R Matthew

🎓 AI & Software Engineering Enthusiast
🚀 Full Stack + Generative AI Developer
🌍 Building AI systems for social impact

</div>

---

# 🤝 Contributing

Contributions are welcome.

## Steps

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful:

🌟 Star the repository
🍴 Fork the project
📢 Share with the developer community

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=600&size=28&duration=3000&pause=1000&color=38BDF8&center=true&vCenter=true&width=900&lines=Empowering+NGOs+with+Generative+AI;Production-Grade+RAG+Architecture;AI-Powered+Proposal+Automation;FastAPI+%2B+Streamlit+%2B+LangChain+%2B+FAISS" />

<br><br>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:06B6D4,25:0891B2,50:2563EB,75:1E293B,100:0F172A&height=180&section=footer&text=Built%20for%20Social%20Impact&fontSize=34&fontColor=ffffff&animation=fadeIn" width="100%" />

</div>
