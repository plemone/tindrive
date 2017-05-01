'''
Author: Md. Tanvir Islam
'''

# dependencies imported
from flask import Flask, render_template, json, request

# creating an instance of the Flask object with the __name__ which in this case is __main__
app = Flask(__name__)

# decorator function just simply takes in the function through its parameters,
# does its own thing but also executes the function that it took it in as its parameter
@app.route("/", methods = ["GET"])
def index():
    return render_template("index.html"), 200

@app.errorhandler(404)
def page_not_found(err):
    return render_template("404.html"), 404

# calls the Flask object's run method when the script is executed
if __name__ == "__main__":
    app.run(host = "localhost", port = 3000, debug = True)
