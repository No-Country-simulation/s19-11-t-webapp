import os
from dotenv import load_dotenv
import redis
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

#db = SQLAlchemy()


class Config:
    #SQLALCHEMY_DATABASE_URI = 'sqlite:///yourdatabase.db'
    #SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "defaultsecretkey")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600))
    USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8000")
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
    REDIS_DB = int(os.getenv("REDIS_DB", 0))
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "")


def get_redis_client():
    return redis.StrictRedis(
        host=Config.REDIS_HOST,
        port=Config.REDIS_PORT,
        db=Config.REDIS_DB,
        password=Config.REDIS_PASSWORD,
        decode_responses=True
    )
