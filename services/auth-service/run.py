from flask import Flask
from flask_jwt_extended import JWTManager
from connections.config import Config
from routes.auth import auth


def create_app():
    flask_app = Flask(__name__)
    flask_app.config.from_object(Config)
    jwt = JWTManager(flask_app)
    flask_app.register_blueprint(auth)
    return flask_app


app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
