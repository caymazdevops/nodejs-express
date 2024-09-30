// authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.cookies.token; // JWT token cookie'den alınır

  if (!token) {
    return res.redirect('/auth/login'); // Token yoksa kullanıcı login sayfasına yönlendirilir
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token doğrulanır
    req.userId = decoded.userId; // Kullanıcı ID'si request'e eklenir
    next(); // Bir sonraki middleware'e geçilir
  } catch (err) {
    return res.redirect('/auth/login'); // Token doğrulanamazsa login sayfasına yönlendirilir
  }
}

module.exports = authMiddleware;
