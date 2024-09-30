const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // cookie-parser'ı ekle
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const Blog = require('./models/Blog');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express();


dotenv.config();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // cookie-parser middleware'ini kullan
app.set('view engine', 'ejs');

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB'ye başarıyla bağlanıldı!");
}).catch((err) => {
  console.error("MongoDB bağlantı hatası: ", err);
});

// Ana Sayfa Rotası
app.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.render('home', { blogs }); // home.ejs dosyasını render et ve blogları gönder
});

// Tekil Blog Sayfası
app.get('/blog/:id', async (req, res) => {
  const blogId = req.params.id; // URL'den blog ID'sini al
  try {
      const blog = await Blog.findById(blogId); // ID ile blogu bul
      if (!blog) {
          return res.status(404).send('Blog bulunamadı.');
      }
      res.render('blog', { blog: blog }); // Blogu tekil sayfada göster
  } catch (err) {
      res.status(500).send('Bir hata oluştu.');
  }
});



// Dashboard rotası
app.get('/dashboard', authMiddleware, (req, res) => {
  res.render('dashboard'); // dashboard.ejs dosyasını render et
});

// Rotalar
app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);





// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
