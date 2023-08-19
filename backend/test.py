import json
import requests

API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
api_key = "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"
headers = {"Authorization": f"Bearer {api_key}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

data = query(
    {
        "inputs": {
            "source_sentence": "plastic straw",
            "sentences":["plastic strawberry container", "paper straw", "plastic straws", "clear plastic wrap", "plastic strawberry container", "paper straw", "plastic straws", "clear plastic wrap", "plastic strawberry container", "paper straw", "plastic straws", "clear plastic wrap", "plastic strawberry container", "paper straw", "plastic straws", "clear plastic wrap"]
        }
    })

print(data)

## [0.605, 0.894]
