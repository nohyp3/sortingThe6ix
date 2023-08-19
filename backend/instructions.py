import csv
import json

categories = []
names = []
items = []

file = open("backend\WasteData.json", 'r')
data = json.load(file)


import json
import requests

API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
api_key = "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"
headers = {"Authorization": f"Bearer {api_key}"}


def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


for rows in data:
    items += list(map(lambda x : x.strip(), rows["keywords"].split(',')))

# print(items)
for n, rows in enumerate(data):
    if n == 0:
        continue
    categories.append(rows["category"])
    temp = rows["category"]
    
    try:
        temp = temp[temp.index('(') + 1:temp.index(')')]
    except ValueError:
        pass
    names.append(temp)

# print(categories)

# exit()

# def find(name):
#     file = open("backend\WasteData.csv", 'r')
#     data = csv.reader(file)

#     for n, rows in enumerate(data):

#         garbage = list(rows[3].split(','))
        
#         for i in garbage:
           
#             if len(i) < len(name):
#                 continue

#             if i[1:len(name) + 1] == name or i[:len(name)] == name or i[len(i) - len(name):] == name or i[len(i) - len(name) - 1:-2] == name:
#                 print(i)
#                 print("reached")
#                 return n
                
#     return 97

def find(name):
    data = query(
    {
        "inputs": {
            "source_sentence": name,
            "sentences":items
        }
    })
    print(items[data.index(max(data))])
    print(max(data))

find("Cigarette (Cigarette) Cigarette Butts")

def translate(row):
    file = open("backend\WasteData.csv", 'r')
    data = csv.reader(file)
    
    for i in range(1, 196):
        
        if i < row:
            next(data)
            continue
        
        row = next(data)
        print(row[0])
        print(row[2])
        
        break

def filter(arr):
    test = arr
    for i in arr:
        find(i)