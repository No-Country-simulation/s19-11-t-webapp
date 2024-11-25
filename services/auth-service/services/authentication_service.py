import requests
from ..connections.config import Config, get_redis_client
from ..resources.logs.logger import logger

redis_client = get_redis_client()


class AuthService:
    @staticmethod
    def validate_user_credentials(username, password):
        try:
            logger.info(f"Attempting to validate credentials for username: {username}")
            response = requests.post(f"{Config.USER_SERVICE_URL}/api/users/validate",
                                     json={"username": username, "password": password})
            response.raise_for_status()
            logger.info(f"Credentials validated successfully for username: {username}")
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error validating user credentials for username {username}: {e}")
            return None

    @staticmethod
    def store_session_token(user_id, token, expiration=3600):
        try:
            logger.info(f"Storing session token for user_id: {user_id}")
            redis_client.setex(f"session:{user_id}", expiration, token)
            logger.info(f"Session token stored for user_id: {user_id}")
        except Exception as e:
            logger.error(f"Error storing session token for user_id {user_id}: {e}")
            raise

    @staticmethod
    def get_session_token(user_id):
        try:
            logger.info(f"Retrieving session token for user_id: {user_id}")
            return redis_client.get(f"session:{user_id}")
        except Exception as e:
            logger.error(f"Error retrieving session token for user_id {user_id}: {e}")
            raise
