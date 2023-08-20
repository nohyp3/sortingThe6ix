import json
import requests

items = []

file = open("./WasteData.json", 'r')
data = json.load(file)

API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
api_key = "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"
headers = {"Authorization": f"Bearer {api_key}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

for rows in data:
    items += list(rows["keywords"].split(','))

def find(name):
    global items

    querydata = query(
    {
        "inputs": {
            "source_sentence": name,
            "sentences":items
        }
    })
    
    ind = querydata.index(max(querydata))
    
    if max(querydata) < 0.4:
        return 97 + 97
    
    print(items[ind])

    for n in range(len(data)):
        garbage = list(data[n]["keywords"].split(','))

        if items[ind] in garbage:
            return n
                
    return 97 + 97

def translate(row):
    
    return [data[row]["category"], data[row]["body"]]
    
    print(data[row]["category"])
    print(data[row]["body"])
    