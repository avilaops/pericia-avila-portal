// main.js
// Galeria de casos e depoimentos dinâmicos

document.addEventListener('DOMContentLoaded', function() {
    // Exemplo de casos
    const cases = [
        {
            empresa: 'Empresa Alfa',
            foto: 'case1.jpg',
            descricao: 'Perícia em máquinas industriais, análise de riscos e laudo técnico.'
        },
        {
            empresa: 'Construtora Beta',
            foto: 'case2.jpg',
            descricao: 'Inspeção de obra, avaliação de EPIs e depoimento dos trabalhadores.'
        },
        {
            empresa: 'Logística Gama',
            foto: 'case3.jpg',
            descricao: 'Investigação de acidente, perícia documental e registro fotográfico.'
        }
    ];

    const casesGallery = document.getElementById('cases-gallery');
    cases.forEach(caso => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.innerHTML = `
            <img src="${caso.foto}" alt="${caso.empresa}">
            <h3>${caso.empresa}</h3>
            <p>${caso.descricao}</p>
        `;
        casesGallery.appendChild(card);
    });

    // Exemplo de depoimentos
    const testimonials = [
        '“Profissionalismo e atenção em cada detalhe. Recomendo!”',
        '“O laudo técnico foi decisivo para o processo judicial.”',
        '“Excelente trabalho na inspeção e registro fotográfico.”'
    ];
    const testimonialsList = document.getElementById('testimonials-list');
    testimonials.forEach(dep => {
        const div = document.createElement('div');
        div.className = 'testimonial';
        div.textContent = dep;
        testimonialsList.appendChild(div);
    });
});
