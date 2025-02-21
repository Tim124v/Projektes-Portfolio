require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3001;

// Настройка лимита запросов (не более 5 сообщений в час с одного IP)
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 час
    max: 5 // максимум 5 запросов
});

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Используем переменную окружения
    methods: ['POST'], // Разрешаем только POST запросы
    credentials: true
}));
app.use(express.json());
app.use('/send-email', limiter);

// Добавляем логирование для отладки
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Создаем тестовый транспорт и проверяем подключение
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true // Включаем отладку
});

// Проверяем подключение при запуске
transporter.verify(function(error, success) {
    if (error) {
        console.log('Ошибка подключения к почте:', error);
    } else {
        console.log('Сервер готов к отправке писем');
    }
});

// Маршрут для отправки email
app.post('/send-email', async (req, res) => {
    console.log('Получены данные:', req.body);
    
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        console.log('Отсутствуют обязательные поля');
        return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
        console.log('Попытка отправки письма...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Сообщение от ${name}`,
            text: `
                Имя: ${name}
                Email: ${email}
                Сообщение: ${message}
            `,
            html: `
                <h3>Новое сообщение с формы контактов</h3>
                <p><strong>Имя:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Сообщение:</strong></p>
                <p>${message}</p>
            `
        });
        
        console.log('Письмо отправлено:', info);
        res.json({ message: 'Письмо успешно отправлено' });
    } catch (error) {
        console.error('Ошибка при отправке:', error);
        res.status(500).json({ 
            error: 'Ошибка при отправке письма',
            details: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
}); 