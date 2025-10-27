// admin.js - Dashboard Administrativo Premium
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

    // Atualizar estatísticas do dashboard
    function updateStats() {
        const cases = getData(casesKey);
        const testimonials = getData(testimonialsKey);
        const processes = getData(processesKey);
        
        document.getElementById('total-cases').textContent = cases.length;
        document.getElementById('total-testimonials').textContent = testimonials.length;
        document.getElementById('total-processes').textContent = processes.length;
        document.getElementById('total-photos').textContent = cases.length;
    }

    // Preview de upload de imagem
    const fotoInput = document.getElementById('foto');
    const uploadPreview = document.getElementById('upload-preview');
    const previewImage = document.getElementById('preview-image');
    
    fotoInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewImage.src = event.target.result;
                uploadPreview.style.display = 'block';
                document.querySelector('.upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Casos/perícias
    const caseForm = document.getElementById('case-form');
    const adminCasesGallery = document.getElementById('admin-cases-gallery');
    
    function renderCases() {
        adminCasesGallery.innerHTML = '';
        const cases = getData(casesKey);
        
        if (cases.length === 0) {
            adminCasesGallery.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; grid-column: 1/-1;">Nenhum caso cadastrado ainda.</p>';
            return;
        }
        
        cases.forEach((caso, idx) => {
            const card = document.createElement('div');
            card.className = 'admin-case-card';
            card.innerHTML = `
                <img src="${caso.foto}" alt="${caso.empresa}">
                <div class="admin-case-content">
                    <h3>🏢 ${caso.empresa}</h3>
                    <p>${caso.descricao}</p>
                    <div class="admin-case-actions">
                        <button onclick="removeCase(${idx})" class="btn-delete">🗑️ Remover</button>
                    </div>
                </div>
            `;
            adminCasesGallery.appendChild(card);
        });
    }
    
    window.removeCase = function(idx) {
        if (!confirm('Deseja realmente remover este caso?')) return;
        const arr = getData(casesKey);
        arr.splice(idx, 1);
        setData(casesKey, arr);
        renderCases();
        updateStats();
    };
    
    caseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const empresa = document.getElementById('empresa').value;
        const descricao = document.getElementById('descricao').value;
        const fotoInput = document.getElementById('foto');
        
        if (!fotoInput.files[0]) {
            alert('Por favor, selecione uma foto.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(evt) {
            const foto = evt.target.result;
            const arr = getData(casesKey);
            arr.push({ empresa, descricao, foto });
            setData(casesKey, arr);
            renderCases();
            updateStats();
            caseForm.reset();
            
            // Reset preview
            uploadPreview.style.display = 'none';
            document.querySelector('.upload-placeholder').style.display = 'block';
        };
        reader.readAsDataURL(fotoInput.files[0]);
    });

    // Depoimentos
    const testimonialForm = document.getElementById('testimonial-form');
    const adminTestimonialsList = document.getElementById('admin-testimonials-list');
    
    function renderTestimonials() {
        adminTestimonialsList.innerHTML = '';
        const testimonials = getData(testimonialsKey);
        
        if (testimonials.length === 0) {
            adminTestimonialsList.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; grid-column: 1/-1;">Nenhum depoimento cadastrado ainda.</p>';
            return;
        }
        
        testimonials.forEach((dep, idx) => {
            const card = document.createElement('div');
            card.className = 'admin-testimonial-card';
            card.innerHTML = `
                <p>"${dep}"</p>
                <div class="admin-case-actions">
                    <button onclick="removeTestimonial(${idx})" class="btn-delete">🗑️ Remover</button>
                </div>
            `;
            adminTestimonialsList.appendChild(card);
        });
    }
    
    window.removeTestimonial = function(idx) {
        if (!confirm('Deseja realmente remover este depoimento?')) return;
        const arr = getData(testimonialsKey);
        arr.splice(idx, 1);
        setData(testimonialsKey, arr);
        renderTestimonials();
        updateStats();
    };
    
    testimonialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const depoimento = document.getElementById('depoimento').value;
        const arr = getData(testimonialsKey);
        arr.push(depoimento);
        setData(testimonialsKey, arr);
        renderTestimonials();
        updateStats();
        testimonialForm.reset();
    });

    // Processos
    const processForm = document.getElementById('process-form');
    const adminProcessList = document.getElementById('admin-process-list');
    
    function renderProcesses() {
        adminProcessList.innerHTML = '';
        const processes = getData(processesKey);
        
        if (processes.length === 0) {
            adminProcessList.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; grid-column: 1/-1;">Nenhum processo cadastrado ainda.</p>';
            return;
        }
        
        processes.forEach((proc, idx) => {
            const card = document.createElement('div');
            card.className = 'admin-process-card';
            card.innerHTML = `
                <div class="process-header">
                    <div class="process-info">
                        <h4>👤 ${proc.trabalhador}</h4>
                        <span class="company-name">🏢 ${proc.empresa}</span>
                    </div>
                </div>
                <p class="process-description">${proc.processo}</p>
                <div class="admin-case-actions">
                    <button onclick="removeProcess(${idx})" class="btn-delete">🗑️ Remover</button>
                </div>
            `;
            adminProcessList.appendChild(card);
        });
    }
    
    window.removeProcess = function(idx) {
        if (!confirm('Deseja realmente remover este processo?')) return;
        const arr = getData(processesKey);
        arr.splice(idx, 1);
        setData(processesKey, arr);
        renderProcesses();
        updateStats();
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
        updateStats();
        processForm.reset();
    });

    // Inicializar todas as visualizações
    renderCases();
    renderTestimonials();
    renderProcesses();
    updateStats();

    // Smooth scroll para navegação interna
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});
