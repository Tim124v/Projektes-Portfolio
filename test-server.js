const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Тест успешен' });
});

app.listen(3001, () => {
  console.log('Тестовый сервер запущен на порту 3001');
}); 