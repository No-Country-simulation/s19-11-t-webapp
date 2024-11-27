from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from connections.config import get_redis_client
from resources.logs.logger import logger
from services.authentication_service import AuthService
from services.authorization_service import role_required

auth = Blueprint('auth', __name__)
redis_client = get_redis_client()


@auth.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = AuthService.validate_user_credentials(username, password)
        if not user:
            logger.warning(f"Invalid credentials for username: {username}")
            return jsonify({'msg': 'Invalid credentials'}), 401

        access_token = create_access_token(identity=user['id'], additional_claims={"roles": user['roles']}) # TODO: roles en el token
        refresh_token = create_refresh_token(identity=user['id'])

        # Almacenar el token de acceso en Redis con un tiempo de expiración
        AuthService.store_session_token(user['id'], access_token)

        logger.info(f"Login successful for user_id: {user['id']}")

        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify({'msg': 'Internal server error'}), 500


@auth.route('/api/auth/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    try:
        current_user = get_jwt_identity()
        session_token = AuthService.get_session_token(current_user)
        if not session_token:
            logger.warning(f"Session token not found for user_id: {current_user}")
            return jsonify({"msg": "Session expired or invalid"}), 401

        logger.info(f"Token verified for user_id: {current_user}")
        return jsonify({"msg": "Token is valid", "user_id": current_user}), 200
    except Exception as e:
        logger.error(f"Error verifying token: {e}")
        return jsonify({"msg": "Failed to verify token", "error": str(e)}), 500


@auth.route('/api/auth/refresh-token', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user = get_jwt_identity()
        logger.info(f"Refreshing token for user_id: {current_user}")
        new_access_token = create_access_token(identity=current_user)
        return jsonify({'access_token': new_access_token}), 200
    except Exception as e:
        logger.error(f"Error refreshing token: {e}")
        return jsonify({"msg": "Failed to refresh token", "error": str(e)}), 500


@auth.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        current_user = get_jwt_identity()
        redis_client.delete(f"session:{current_user}")
        logger.info(f"User_id {current_user} successfully logged out")
        return jsonify({"msg": "Successfully logged out"}), 200
    except Exception as e:
        logger.error(f"Error during logout: {e}")
        return jsonify({"msg": "Failed to log out", "error": str(e)}), 500


@auth.route('/api/admin-resource', methods=['GET'])
@jwt_required()
@role_required('admin')
def admin_resource():
    return jsonify({"msg": "You have access to the admin resource"}), 200
