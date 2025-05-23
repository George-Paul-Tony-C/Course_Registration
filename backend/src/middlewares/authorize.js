function authorize(allowedRoles = []) {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.userRole))
        return res.status(403).json({ message: 'Permission Denied' });
      next();
    };
  }
  
  module.exports = authorize;
  