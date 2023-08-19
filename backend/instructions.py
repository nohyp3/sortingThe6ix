import csv

categories = []
names = []
items = []

file = open("backend\WasteData.csv", 'r')
data = csv.reader(file)

for rows in data:
        items += list(rows[3].split(','))

print(items)
exit()
for n, rows in enumerate(data):
    if n == 0:
        continue
    categories.append(rows[0])
    temp = rows[0]
    
    try:
        temp = temp[temp.index('(') + 1:temp.index(')')]
    except ValueError:
        pass
    names.append(temp)

print(categories)

def find(name):
    file = open("backend\WasteData.csv", 'r')
    data = csv.reader(file)

    for n, rows in enumerate(data):

        garbage = list(rows[3].split(','))
        
        for i in garbage:
           
            if len(i) < len(name):
                continue

            if i[1:len(name) + 1] == name or i[:len(name)] == name or i[len(i) - len(name):] == name or i[len(i) - len(name) - 1:-2] == name:
                print(i)
                print("reached")
                return n
                
    return 97

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