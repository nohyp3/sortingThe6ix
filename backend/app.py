from flask import Flask, request, jsonify
import instructions

app = Flask(__name__)

@app.route('/data/', methods=['GET', 'POST'])
def getData():
    data = request.get_json()
    try: 
        return {'res': instructions.translate(instructions.find(" ".join(data['labels'])))}
    except:
        return {'res': "Error"}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)