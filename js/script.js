document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
});

// Обновляем логику для canvas
const canvas = document.querySelector('.matrix-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const header = document.querySelector('.header-section');
    width = canvas.width = header.offsetWidth;
    height = canvas.height = header.offsetHeight;
}

// Инициализация при загрузке
resizeCanvas();

// Обновление при изменении размера окна
window.addEventListener('resize', resizeCanvas);

const columns = Math.floor(width / 20);
const drops = new Array(columns).fill(1);

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0F0';
    ctx.font = '15px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(Math.random() * 128);
        ctx.fillText(text, i * 20, drops[i] * 20);
        
        if (drops[i] * 20 > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(draw, 33);