from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/memes')
def memes():
    """Proxy endpoint that fetches memes from https://meme-api.com/gimme

    Query params:
      - n: number of memes to fetch (default 5, capped 1..10)
    """
    try:
        n = int(request.args.get('n', 5))
    except Exception:
        n = 5
    n = max(1, min(10, n))
    url = f'https://meme-api.com/gimme/{n}'
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    # Normalize response to a list of meme objects
    memes = []
    if isinstance(data, dict) and data.get('memes'):
        memes = data.get('memes')
    elif isinstance(data, dict) and data.get('url'):
        memes = [data]
    elif isinstance(data, list):
        memes = data
    else:
        memes = data.get('memes', []) if isinstance(data, dict) else []

    simplified = []
    for m in memes:
        simplified.append({
            'url': m.get('url'),
            'title': m.get('title'),
            'postLink': m.get('postLink'),
            'author': m.get('author')
        })

    return jsonify(simplified)


if __name__ == '__main__':
    # Default port 5000 for Flask backend
    app.run(host='0.0.0.0', port=5000, debug=True)
