import csv

categories = []
names = []
bins = set()

file = open("backend\WasteData.csv", 'r')
data = csv.reader(file)

for n, rows in enumerate(data):
    if n == 0:
        continue
    categories.append(rows[0])
    temp = [rows[0]] * 2
    try:
        temp = [temp[0][temp.index('(') + 1:temp[0].index(')')], temp[0][:temp[0].index('(') - 1]]
    except ValueError:
        pass
    names.append(temp[0])
    bins.add(temp[1])

print(names)
print(bins)
# print(categories)

def read(object):
    file = open("backend\WasteData.csv", 'r')
    data = csv.reader(file)
    
    for n, rows in enumerate(data):
        if n == categories.index(object) + 1:
            print(rows[2])
            print(2)
            break
        continue

    object = object[:object.index('(') - 1]
    
    return object

print(read('Blue Bin (aluminum)'))