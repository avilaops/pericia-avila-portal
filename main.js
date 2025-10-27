// main.js - Ávila.Inc Premium
// Galeria de casos, carrossel de depoimentos e interações visuais

document.addEventListener('DOMContentLoaded', function() {
    // Exemplo de casos
    const cases = [
        {
            empresa: 'Empresa Alfa',
            foto: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
            descricao: 'Perícia em máquinas industriais, análise de riscos e laudo técnico.'
        },
        {
            empresa: 'Construtora Beta',
            foto: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop',
            descricao: 'Inspeção de obra, avaliação de EPIs e depoimento dos trabalhadores.'
        },
        {
            empresa: 'Logística Gama',
            foto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
            descricao: 'Investigação de acidente, perícia documental e registro fotográfico.'
        },
        {
            empresa: 'Indústria Delta',
            foto: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&h=300&fit=crop',
            descricao: 'Laudo de periculosidade e análise de condições ambientais de trabalho.'
        }
    ];

    const casesGallery = document.getElementById('cases-gallery');
    cases.forEach((caso, index) => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img src="${caso.foto}" alt="${caso.empresa}" loading="lazy">
            <h3>${caso.empresa}</h3>
            <p>${caso.descricao}</p>
        `;
        
        // Adicionar efeito de zoom ao clicar na imagem
        const img = card.querySelector('img');
        img.addEventListener('click', function() {
            openLightbox(caso.foto, caso.empresa);
        });
        
        casesGallery.appendChild(card);
    });

    // Carrossel de depoimentos
    const testimonials = [
        '"Profissionalismo e atenção em cada detalhe. Laudo técnico impecável que foi decisivo no processo judicial. Recomendo!"',
        '"O trabalho pericial realizado foi excepcional. Análise técnica precisa e completa, com registro fotográfico detalhado."',
        '"Excelente atendimento e conhecimento técnico. A perícia foi realizada com atenção aos mínimos detalhes, garantindo total precisão."',
        '"Profissional competente e dedicado. O laudo técnico foi fundamental para resolver o processo trabalhista com sucesso."'
    ];
    
    let currentTestimonial = 0;
    const testimonialCarousel = document.getElementById('testimonials-carousel');
    
    function renderTestimonial() {
        testimonialCarousel.innerHTML = `
            <div class="testimonial" style="opacity: 0; animation: fadeIn 0.6s forwards;">
                ${testimonials[currentTestimonial]}
            </div>
        `;
    }
    
    renderTestimonial();
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        renderTestimonial();
    }, 5000);
    
    // Lightbox para zoom de imagens
    function openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${src}" alt="${alt}">
            </div>
        `;
        document.body.appendChild(lightbox);
        
        setTimeout(() => lightbox.style.opacity = '1', 10);
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.className === 'lightbox-close') {
                lightbox.style.opacity = '0';
                setTimeout(() => lightbox.remove(), 300);
            }
        });
    }
    
    // Adicionar estilos do lightbox
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
        .lightbox {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(10,37,64,0.95);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
            backdrop-filter: blur(8px);
        }
        .lightbox-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
        }
        .lightbox-content img {
            max-width: 100%;
            max-height: 90vh;
            border-radius: 12px;
            box-shadow: 0 8px 32px #00c6a2cc;
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            font-size: 3rem;
            color: #fff;
            cursor: pointer;
            transition: color 0.2s;
        }
        .lightbox-close:hover {
            color: #00c6a2;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(lightboxStyles);
    
    // Smooth scroll para navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
