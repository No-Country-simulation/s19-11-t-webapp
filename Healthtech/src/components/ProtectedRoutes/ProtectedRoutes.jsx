import { Navigate } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" />;
  }

  return React.Children.map(children, child => {
    return React.cloneElement(child, { user });
  });
}

ProtectedRoute.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    user_type: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
