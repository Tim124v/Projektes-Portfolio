const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  try {
    // Ваша логика отправки email
    res.json({ message: 'Email отправлен успешно' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Сервер запущен на порту 3001');
}); 