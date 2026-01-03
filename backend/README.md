# Swasthya Saathi Backend

Medical Report Intelligence Platform - Backend API

## Quick Start

1. **Create virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Install Tesseract OCR (required for actual OCR):**
```bash
# macOS
brew install tesseract

# Ubuntu/Debian
sudo apt-get install tesseract-ocr

# Windows - Download installer from:
# https://github.com/UB-Mannheim/tesseract/wiki
```

4. **Configure environment (optional):**
```bash
cp .env.example .env
# Edit .env with your settings
```

5. **Run the server:**
```bash
python -m uvicorn main:app --reload --port 8000
```

6. **Access API documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reports/upload` | POST | Upload medical report (PDF/image) |
| `/reports/latest` | GET | Get most recent report |
| `/reports/history` | GET | Get all reports for session |
| `/reports/{report_id}` | GET | Get specific report |
| `/reports/trends/data` | GET | Get trend data |
| `/reports/explain` | POST | Get LLM explanation |
| `/reports/health/clarity-score` | GET | Get current health score |
| `/reports/timeline` | GET | Get action timeline |
| `/health` | GET | Health check |

## Features

- **OCR Processing**: Tesseract OCR with confidence checking
- **Rule-based Parsing**: Deterministic medical parameter extraction
- **Health Clarity Score**: Weighted 0-100 score calculation
- **Trend Analysis**: Longitudinal parameter tracking
- **Safe LLM Explanations**: Optional Ollama integration
- **Anonymous Sessions**: No user accounts required

## Demo Mode

If MongoDB or Tesseract is unavailable, the backend runs in demo mode with:
- In-memory storage
- Mock OCR data
- Sample medical parameters

## Architecture

```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── database/            # MongoDB connection
├── models/              # Pydantic data models
├── routers/             # API endpoints
├── services/            # Business logic
│   ├── ocr_service.py   # OCR processing
│   ├── parser_service.py # Parameter parsing
│   ├── analysis_service.py # Deterministic analysis
│   ├── score_service.py # Health clarity scoring
│   ├── trends_service.py # Trend calculations
│   ├── timeline_service.py # Action timeline
│   └── explain_service.py # LLM explanations
└── utils/               # Utilities
    ├── session.py       # Anonymous sessions
    └── reference_ranges.py # Medical reference data
```

## Safety Principles

- ✅ Deterministic analysis only
- ✅ No medical diagnosis
- ✅ No treatment recommendations
- ✅ AI for explanations only (optional)
- ✅ Anonymous session-based identity
- ✅ No PII storage
