// admin.js
// Portal administrativo: cadastro de casos, depoimentos e processos

document.addEventListener('DOMContentLoaded', function() {
    // LocalStorage para persistência simples
    const casesKey = 'peritoCases';
    const testimonialsKey = 'peritoTestimonials';
    const processesKey = 'peritoProcesses';

    // Funções utilitárias
    function getData(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }
    function setData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Casos/perícias
    const caseForm = document.getElementById('case-form');
    const adminCasesGallery = document.getElementById('admin-cases-gallery');
    function renderCases() {
        adminCasesGallery.innerHTML = '';
        getData(casesKey).forEach((caso, idx) => {
            const card = document.createElement('div');
            card.className = 'case-card';
            card.innerHTML = `
                <img src="${caso.foto}" alt="${caso.empresa}">
                <h3>${caso.empresa}</h3>
                <p>${caso.descricao}</p>
                <button onclick="removeCase(${idx})" class="btn" style="background:#e74c3c;">Remover</button>
            `;
            adminCasesGallery.appendChild(card);
        });
    }
    window.removeCase = function(idx) {
        const arr = getData(casesKey);
        arr.splice(idx, 1);
        setData(casesKey, arr);
        renderCases();
    };
    caseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const empresa = document.getElementById('empresa').value;
        const descricao = document.getElementById('descricao').value;
        const fotoInput = document.getElementById('foto');
        const reader = new FileReader();
        reader.onload = function(evt) {
            const foto = evt.target.result;
            const arr = getData(casesKey);
            arr.push({ empresa, descricao, foto });
            setData(casesKey, arr);
            renderCases();
            caseForm.reset();
        };
        if (fotoInput.files[0]) reader.readAsDataURL(fotoInput.files[0]);
    });
    renderCases();

    // Depoimentos
    const testimonialForm = document.getElementById('testimonial-form');
    const adminTestimonialsList = document.getElementById('admin-testimonials-list');
    function renderTestimonials() {
        adminTestimonialsList.innerHTML = '';
        getData(testimonialsKey).forEach((dep, idx) => {
            const div = document.createElement('div');
            div.className = 'testimonial';
            div.textContent = dep;
            div.innerHTML += ` <button onclick="removeTestimonial(${idx})" class="btn" style="background:#e74c3c;float:right;">Remover</button>`;
            adminTestimonialsList.appendChild(div);
        });
    }
    window.removeTestimonial = function(idx) {
        const arr = getData(testimonialsKey);
        arr.splice(idx, 1);
        setData(testimonialsKey, arr);
        renderTestimonials();
    };
    testimonialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const depoimento = document.getElementById('depoimento').value;
        const arr = getData(testimonialsKey);
        arr.push(depoimento);
        setData(testimonialsKey, arr);
        renderTestimonials();
        testimonialForm.reset();
    });
    renderTestimonials();

    // Processos
    const processForm = document.getElementById('process-form');
    const adminProcessList = document.getElementById('admin-process-list');
    function renderProcesses() {
        adminProcessList.innerHTML = '';
        getData(processesKey).forEach((proc, idx) => {
            const div = document.createElement('div');
            div.className = 'testimonial';
            div.innerHTML = `<strong>${proc.trabalhador}</strong> - ${proc.empresa}: ${proc.processo} <button onclick="removeProcess(${idx})" class="btn" style="background:#e74c3c;float:right;">Remover</button>`;
            adminProcessList.appendChild(div);
        });
    }
    window.removeProcess = function(idx) {
        const arr = getData(processesKey);
        arr.splice(idx, 1);
        setData(processesKey, arr);
        renderProcesses();
    };
    processForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const trabalhador = document.getElementById('trabalhador').value;
        const empresa = document.getElementById('empresa-processo').value;
        const processo = document.getElementById('processo').value;
        const arr = getData(processesKey);
        arr.push({ trabalhador, empresa, processo });
        setData(processesKey, arr);
        renderProcesses();
        processForm.reset();
    });
    renderProcesses();
});
