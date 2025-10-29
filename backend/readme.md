# Meme App Backend (Flask)

Simple Flask proxy that forwards requests to the public meme API and returns a simplified JSON array of memes.

Requirements
- Python 3.8+
- Install dependencies: pip install -r requirements.txt

Run

1. Install deps:

   pip install -r requirements.txt

2. Start server:

   python app.py

Server listens on http://localhost:5000. Endpoint:

- GET /memes?n=5  -> returns JSON array of meme objects with fields {url, title, postLink, author}

This backend enables the frontend to avoid CORS issues and centralize external API calls.
