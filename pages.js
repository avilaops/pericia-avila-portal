// pages.js - Interações das páginas internas

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // SISTEMA DE ABAS (TABS)
    // ============================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active de todos os botões e painéis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Adiciona active ao botão clicado e ao painel correspondente
            this.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });

    // ============================================
    // FILTROS DE SERVIÇOS
    // ============================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Remove active de todos os filtros
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtra os cards
            serviceCards.forEach(card => {
                if (filterValue === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (categories.includes(filterValue)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

    // ============================================
    // EXPANSÃO DE SERVIÇOS
    // ============================================
    window.toggleService = function(button) {
        const details = button.nextElementSibling;
        const expandText = button.querySelector('.expand-text');
        
        button.classList.toggle('active');
        details.classList.toggle('active');
        
        if (details.classList.contains('active')) {
            expandText.textContent = 'Ocultar detalhes';
        } else {
            expandText.textContent = 'Ver detalhes';
        }
    };

    // ============================================
    // FAQ ACCORDION
    // ============================================
    window.toggleFAQ = function(button) {
        const answer = button.nextElementSibling;
        const isActive = button.classList.contains('active');
        
        // Fecha todas as outras FAQs
        document.querySelectorAll('.faq-question').forEach(q => {
            if (q !== button) {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
            }
        });
        
        // Toggle da FAQ clicada
        button.classList.toggle('active');
        answer.classList.toggle('active');
    };

    // ============================================
    // FORMULÁRIO DE CONTATO
    // ============================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                empresa: document.getElementById('empresa').value,
                servico: document.getElementById('servico').value,
                mensagem: document.getElementById('mensagem').value
            };
            
            // Aqui você pode integrar com um backend ou serviço de e-mail
            console.log('Dados do formulário:', formData);
            
            // Feedback visual
            alert('✅ Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
            
            // Alternativa: Enviar por email (exemplo com mailto)
            // const mailtoLink = `mailto:contato@pericia.avila.inc?subject=Contato via Site - ${formData.servico}&body=Nome: ${formData.nome}%0D%0AEmail: ${formData.email}%0D%0ATelefone: ${formData.telefone}%0D%0AEmpresa: ${formData.empresa}%0D%0AServiço: ${formData.servico}%0D%0A%0D%0AMensagem:%0D%0A${formData.mensagem}`;
            // window.location.href = mailtoLink;
        });
    }

    // ============================================
    // SMOOTH SCROLL PARA ÂNCORAS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ============================================
    // ANIMAÇÕES DE ENTRADA
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa cards e elementos animáveis
    document.querySelectorAll('.feature-card, .service-card, .qualification-item, .faq-item, .contact-info-card').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // MÁSCARA DE TELEFONE (OPCIONAL)
    // ============================================
    const telefoneInput = document.getElementById('telefone');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length > 6) {
                value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
            } else if (value.length > 2) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            } else if (value.length > 0) {
                value = `(${value}`;
            }
            
            e.target.value = value;
        });
    }

    // ============================================
    // DESTAQUE DO LINK ATIVO NA NAVBAR
    // ============================================
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('#')[0];
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Adiciona CSS para animação fadeInUp se não existir
if (!document.querySelector('style[data-pages-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-pages-animations', 'true');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}
