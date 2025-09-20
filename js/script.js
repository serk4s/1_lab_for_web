// Анимация появления элементов при скролле
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });

    // Инициализация хедера
    initHeader();

    // Инициализация формы
    initForm();
});

// Header functionality
function initHeader() {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const headerProgress = document.querySelector('.header-progress');
    const themeToggle = document.querySelector('.theme-toggle');

    // Scroll effect for header
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update progress bar
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / scrollHeight) * 100;
        if (headerProgress) {
            headerProgress.style.width = `${scrollProgress}%`;
        }
    }

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            if (navList) {
                navList.classList.toggle('active');
            }

            // Prevent body scroll when menu is open
            document.body.style.overflow = this.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on links
    if (navList) {
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', function() {
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                }
                if (navList) {
                    navList.classList.remove('active');
                }
                document.body.style.overflow = '';
            });
        });
    }

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const isLightTheme = document.body.classList.contains('light-theme');

            // Update icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = isLightTheme ? 'fas fa-sun' : 'fas fa-moon';
            }

            // Save theme preference
            localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-sun';
            }
        }
    }

    // Initialize header on scroll
    window.addEventListener('scroll', updateHeader);
    window.addEventListener('load', updateHeader);
}

// Валидация и обработка формы
function initForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (!contactForm) return;

    // Валидация в реальном времени
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });

    function validateField(e) {
        const field = e.target;
        const errorElement = document.getElementById(field.id + 'Error');

        if (field.hasAttribute('required') && !field.value.trim()) {
            showError(errorElement, 'Это поле обязательно для заполнения');
            return false;
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showError(errorElement, 'Введите корректный email');
                return false;
            }
        }

        if (field.hasAttribute('minlength')) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (field.value.length < minLength) {
                showError(errorElement, `Минимальная длина: ${minLength} символов`);
                return false;
            }
        }

        clearError(errorElement);
        return true;
    }

    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }

    function clearError(element) {
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    }

    function showStatus(message, type) {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = `form-status ${type}`;
        }
    }

    function hideStatus() {
        if (formStatus) {
            formStatus.style.display = 'none';
        }
    }

    // Отправка формы
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Валидация всех полей
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Показываем статус отправки
        const originalText = submitBtn ? submitBtn.textContent : '';
        showStatus('Отправка сообщения...', 'loading');
        if (submitBtn) {
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
        }

        try {
            // Здесь можно добавить реальную отправку через Formspree, EmailJS или fetch
            // Для демонстрации используем setTimeout
            await new Promise(resolve => setTimeout(resolve, 2000));

            showStatus('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success');
            contactForm.reset();

            // Автоматически скрываем успешное сообщение через 5 секунд
            setTimeout(hideStatus, 5000);

        } catch (error) {
            showStatus('Ошибка при отправке сообщения. Попробуйте еще раз.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}

// Плавная прокрутка для anchor-ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Закрытие мобильного меню после клика
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navList = document.querySelector('.nav-list');

            if (mobileMenuBtn && navList && navList.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navList.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});