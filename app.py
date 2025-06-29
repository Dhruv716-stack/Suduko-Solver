from flask import Flask, render_template, jsonify, request
from sudoku import generate, solve

app = Flask(__name__)
solution = []

@app.route('/')
def index():
    puzzle, solved = generate()
    global solution
    solution = solved
    return render_template("index.html", puzzle=puzzle)

@app.route('/solution')
def get_solution():
    return jsonify(solution)

@app.route('/new')
def new_puzzle():
    puzzle, solved = generate()
    global solution
    solution = solved
    return jsonify(puzzle)

if __name__ == '__main__':
    app.run(debug=True)

