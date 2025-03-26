document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form');
    const submitButton = form.querySelector('.submit-button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: form.querySelector('input[name="name"]').value,
            email: form.querySelector('input[name="email"]').value,
            message: form.querySelector('textarea[name="message"]').value
        };

        form.reset();
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

        const SERVER_URL = 'https://your-backend-url.onrender.com';

        try {
            const response = await fetch(`${SERVER_URL}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
            } else {
                throw new Error(data.error || 'Error sending message');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error sending message. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send <i class="fas fa-paper-plane"></i>';
        }
    });
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 