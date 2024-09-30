const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Kayıt Sayfasını Göster
router.get('/register', (req, res) => {
  res.render('register'); // register.ejs dosyasını render et
});

// Giriş Sayfasını Göster
router.get('/login', (req, res) => {
  res.render('login'); // login.ejs dosyasını render et
});

// Kayıt İşlemi
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Kullanıcıyı veritabanına kaydet
    const user = new User({ username, email, password });
    await user.save();
    res.redirect('/auth/login'); // Kayıttan sonra giriş sayfasına yönlendir
  } catch (err) {
    res.status(400).send('Kayıt işlemi sırasında bir hata oluştu.');
  }
});

// Giriş İşlemi
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı e-posta ile bul
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Kullanıcı bulunamadı.');
      return res.status(400).send('Bu e-posta ile bir kullanıcı bulunamadı.');
    }

    // Şifreyi doğrula
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Şifre yanlış.');
      return res.status(400).send('Şifre yanlış.');
    }

    // JWT oluştur ve kullanıcının tarayıcısına gönder
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Token'ı cookie'ye ayarla
    res.cookie('token', token, { httpOnly: true }); // Burada token'ı cookie'ye yerleştiriyoruz
    res.redirect('/dashboard'); // Başarılı girişte dashboard'a yönlendir
  } catch (err) {
    console.error('Giriş işlemi sırasında bir hata oluştu:', err);
    res.status(500).send('Giriş işlemi sırasında bir hata oluştu.');
  }
});

// Çıkış İşlemi
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login'); // Çıkış yaptıktan sonra giriş sayfasına yönlendir
});

module.exports = router;
