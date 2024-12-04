export function roleCheck(requiredRoles) {
  return function (req, res, next) {
    try {
      const { role } = req.user
      if (!requiredRoles.includes(role)) {
        return res.status(403).json({ message: 'Нет доступа' })
      }
      next()
    } catch (e) {
      return res.status(403).json({ message: 'Нет доступа' })
    }
  }
}
