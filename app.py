# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from openai import OpenAI
import os

app = Flask(__name__)
CORS(app)
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)

@app.route('/generate-groups', methods=['GET'])
def generate_groups():
    prompt="Create four groups of four related words. Here are some examples:\n1. Seas: black, red, philippine, baltic.\n2. Terra firma: earth, ground, land, soil.\n3. Ship directions: bow, port, starboard, stern.\n4. Rappers minus numbers: cent, chainz, pac, savage.\n5. Fish: char, eel, perch, shark.\n6. Tom Hanks movies: big, philadelphia, splash, sully.\n Response format in JSON like this, 4 categories, 4 words each.: <Category>: <word1>, <word2>, <word3>, <word4>\n. Do this 4 times"
    response = client.chat.completions.create(
      model="gpt-4-turbo",
      messages=[{"role": "user", "content": prompt}]
    )

    # Parse the response into a dictionary
    categories = {}
    for line in response.choices[0].message['content'].strip().split('\n'):
        category, words_str = line.split(':')
        categories[category.strip()] = [word.strip() for word in words_str.split(',')]

    return jsonify(categories), 200

if __name__ == '__main__':
    app.run(debug=True)
