require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
const port = 3001;

// Serve static files
app.use(express.static(__dirname + '/../'));

app.use(helmet());

// Защита от XSS атак
app.use(xss());

// Защита от HTTP Parameter Pollution
app.use(hpp());

// Лимит размера тела запроса
app.use(express.json({ limit: '10kb' }));

// Более строгий лимит запросов (3 запроса в 15 минут)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// CORS с белым списком доменов
const whitelist = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'https://tim124v.github.io',
    'https://tim124v.github.io/Projektes-Portfolio'
];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true,
    maxAge: 3600
};

app.use(cors(corsOptions));
app.use('/send-email', limiter);

// Валидация входящих данных
const validateEmailData = (req, res, next) => {
    const { name, email, message } = req.body;

    // Проверка наличия всех полей
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (name.length < 2 || name.length > 50) {
        return res.status(400).json({ error: 'Name must be between 2 and 50 characters' });
    }

    if (message.length < 10 || message.length > 1000) {
        return res.status(400).json({ error: 'Message must be between 10 and 1000 characters' });
    }

    // Проверка формата email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Проверка на вредоносные символы
    const dangerousChars = /[<>{}$]/;
    if (dangerousChars.test(name) || dangerousChars.test(message)) {
        return res.status(400).json({ error: 'Invalid characters detected' });
    }

    next();
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Маршрут для отправки email
app.post('/send-email', validateEmailData, async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Message from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Message: ${message}
            `,
            html: `
                <h3>New contact form message</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });
        
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Server error:', err);
}); 