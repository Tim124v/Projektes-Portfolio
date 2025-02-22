'use strict';

// Конфигурация приложения
const CONFIG = {
    MATRIX: {
        FONT_SIZE: 15,
        COLUMN_WIDTH: 20,
        FRAME_RATE: 33,
        COLOR: '#0F0',
        FADE_SPEED: 0.05
    },
    ANIMATIONS: {
        SCALE: 1.05,
        DURATION: 2000
    }
};

// Объявляем переменные в глобальной области видимости
let width, height;

// Улучшенная Matrix анимация
class MatrixAnimation {
    constructor() {
        this.canvas = document.querySelector('.matrix-canvas');
        if (!this.canvas) {
            console.warn('Matrix canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.drops = [];
        this.animationFrame = null;
        this.isRunning = false;
        this.init();
    }

    init() {
        try {
            this.resizeCanvas();
            this.setupEventListeners();
            this.initDrops();
            this.startAnimation();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    setupEventListeners() {
        const debounced = this.debounce(() => this.resizeCanvas(), 250);
        window.addEventListener('resize', debounced);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    resizeCanvas() {
        const header = document.querySelector('.header-section');
        if (!header) return;

        this.canvas.width = header.offsetWidth;
        this.canvas.height = header.offsetHeight;
        this.initDrops();
    }

    initDrops() {
        const columns = Math.floor(this.canvas.width / CONFIG.MATRIX.COLUMN_WIDTH);
        this.drops = new Array(columns).fill(1);
    }

    draw() {
        this.ctx.fillStyle = `rgba(0, 0, 0, ${CONFIG.MATRIX.FADE_SPEED})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = CONFIG.MATRIX.COLOR;
        this.ctx.font = `${CONFIG.MATRIX.FONT_SIZE}px monospace`;

        this.drops.forEach((drop, i) => {
            const text = String.fromCharCode(33 + Math.random() * 94);
            const x = i * CONFIG.MATRIX.COLUMN_WIDTH;
            const y = drop * CONFIG.MATRIX.COLUMN_WIDTH;

            this.ctx.fillText(text, x, y);
            
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        });

        this.animationFrame = requestAnimationFrame(() => this.draw());
    }

    startAnimation() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.draw();
        }
    }

    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.isRunning = false;
        }
    }

    cleanup() {
        this.stopAnimation();
        window.removeEventListener('resize', this.debounced);
    }
}

// Улучшенная обработка карточек проектов
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => this.setupCardListeners(card));
    }

    setupCardListeners(card) {
        card.addEventListener('mouseenter', () => this.scaleCard(card, CONFIG.ANIMATIONS.SCALE));
        card.addEventListener('mouseleave', () => this.scaleCard(card, 1));
        this.setupLazyLoading(card);
    }

    scaleCard(card, scale) {
        requestAnimationFrame(() => {
            card.style.transform = `scale(${scale})`;
        });
    }

    setupLazyLoading(card) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        card.classList.add('visible');
                        observer.unobserve(card);
                    }
                });
            },
            { threshold: 0.1 }
        );
        observer.observe(card);
    }
}

// Улучшенная анимация статистики
class StatsAnimation {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateNumbers();
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.stats.forEach(stat => observer.observe(stat));
    }

    animateNumbers() {
        this.stats.forEach(num => {
            const target = parseInt(num.getAttribute('data-count'));
            this.animateValue(num, 0, target, CONFIG.ANIMATIONS.DURATION);
        });
    }

    animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
}

// Улучшаем инициализацию
document.addEventListener('DOMContentLoaded', () => {
    try {
        const matrixAnimation = new MatrixAnimation();
        const projectCards = new ProjectCards();
        const statsAnimation = new StatsAnimation();

        // Добавляем очистку при уничтожении
        window.addEventListener('unload', () => {
            matrixAnimation.cleanup();
        });
    } catch (error) {
        console.error('Initialization error:', error);
    }
});



