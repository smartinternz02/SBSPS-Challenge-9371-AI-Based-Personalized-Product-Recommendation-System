from flask import Flask
from os import path
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    # The security groups will handle it
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # This SECRET_KEY will be used to encrypt the cookies, session data related to our site
    app.config["SECRET_KEY"] = "lsdjflajslkdjflsjfljsldfjlaksjrtwer"

    from .server import server

    app.register_blueprint(server, url_prefix='/api')

    return app