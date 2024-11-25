from flask_jwt_extended import get_jwt_identity
from functools import wraps
from flask import jsonify


def role_required(*required_roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_user = get_jwt_identity()
            roles = current_user.get('roles', [])

            if not any(role in roles for role in required_roles):
                return jsonify({"msg": "You do not have permission to access this resource"}), 403

            return func(*args, **kwargs)

        return wrapper
    return decorator
