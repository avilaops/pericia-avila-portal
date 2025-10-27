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

    // ============================================
    // SISTEMA DE NOTIFICAÇÕES TOAST
    // ============================================
    function createToastContainer() {
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    function showToast(message, type = 'success', title = '') {
        createToastContainer();
        const container = document.querySelector('.toast-container');
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const titles = {
            success: title || 'Sucesso!',
            error: title || 'Erro!',
            warning: title || 'Atenção!',
            info: title || 'Informação'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // ============================================
    // MODAL DE CONFIRMAÇÃO
    // ============================================
    function showConfirmModal(message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <h3 class="modal-title">⚠️ Confirmar Ação</h3>
                <p class="modal-message">${message}</p>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-cancel">Cancelar</button>
                    <button class="modal-btn modal-btn-confirm">Confirmar</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector('.modal-btn-cancel').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.querySelector('.modal-btn-confirm').addEventListener('click', () => {
            onConfirm();
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // ============================================
    // MENU MOBILE
    // ============================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // ============================================
    // NAVEGAÇÃO ATIVA
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksItems = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinksItems.forEach(link => {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ============================================
    // VALIDAÇÃO DE FORMULÁRIOS
    // ============================================
    function validateInput(input) {
        const value = input.value.trim();
        const isEmpty = value === '';
        
        if (isEmpty && input.hasAttribute('required')) {
            input.classList.add('invalid');
            input.classList.remove('valid');
            return false;
        } else if (!isEmpty) {
            input.classList.add('valid');
            input.classList.remove('invalid');
            return true;
        }
        
        input.classList.remove('invalid', 'valid');
        return true;
    }

    // Adicionar validação em tempo real
    document.querySelectorAll('input[required], textarea[required]').forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateInput(input);
            }
        });
    });

    // ============================================
    // ATUALIZAR ESTATÍSTICAS
    // ============================================
    function updateStats() {
        const cases = getData(casesKey);
        const testimonials = getData(testimonialsKey);
        const processes = getData(processesKey);
        
        animateCounter('total-cases', cases.length);
        animateCounter('total-testimonials', testimonials.length);
        animateCounter('total-processes', processes.length);
        animateCounter('total-photos', cases.length);
    }

    function animateCounter(id, target) {
        const element = document.getElementById(id);
        const current = parseInt(element.textContent) || 0;
        const increment = target > current ? 1 : -1;
        const duration = 500;
        const steps = Math.abs(target - current);
        const stepDuration = steps > 0 ? duration / steps : 0;

        let count = current;
        const timer = setInterval(() => {
            count += increment;
            element.textContent = count;
            if (count === target) {
                clearInterval(timer);
            }
        }, stepDuration);
    }

    // ============================================
    // PREVIEW DE UPLOAD DE IMAGEM
    // ============================================
    const fotoInput = document.getElementById('foto');
    const uploadPreview = document.getElementById('upload-preview');
    const previewImage = document.getElementById('preview-image');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    
    fotoInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Validar tamanho (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('Arquivo muito grande! Máximo 5MB.', 'error');
                fotoInput.value = '';
                return;
            }

            // Validar tipo
            if (!file.type.startsWith('image/')) {
                showToast('Por favor, selecione uma imagem válida.', 'error');
                fotoInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                previewImage.src = event.target.result;
                uploadPreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // ============================================
    // CASOS/PERÍCIAS
    // ============================================
    const caseForm = document.getElementById('case-form');
    const adminCasesGallery = document.getElementById('admin-cases-gallery');
    
    function renderCases() {
        const cases = getData(casesKey);
        
        if (cases.length === 0) {
            adminCasesGallery.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📁</div>
                    <div class="empty-state-text">Nenhum caso cadastrado ainda.<br>Adicione seu primeiro caso acima!</div>
                </div>
            `;
            return;
        }
        
        adminCasesGallery.innerHTML = '';
        cases.forEach((caso, idx) => {
            const card = document.createElement('div');
            card.className = 'admin-case-card';
            card.style.animationDelay = `${idx * 0.1}s`;
            card.innerHTML = `
                <img src="${caso.foto}" alt="${caso.empresa}" loading="lazy">
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
        const cases = getData(casesKey);
        const caseData = cases[idx];
        
        showConfirmModal(
            `Deseja realmente remover o caso da empresa "${caseData.empresa}"? Esta ação não pode ser desfeita.`,
            () => {
                cases.splice(idx, 1);
                setData(casesKey, cases);
                renderCases();
                updateStats();
                showToast('Caso removido com sucesso!', 'success');
            }
        );
    };
    
    caseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const empresa = document.getElementById('empresa').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const fotoInput = document.getElementById('foto');
        
        // Validação
        if (!empresa || !descricao) {
            showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (!fotoInput.files[0]) {
            showToast('Por favor, selecione uma foto.', 'error');
            return;
        }

        // Loading state
        const submitBtn = caseForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
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
            uploadPlaceholder.style.display = 'block';
            
            // Remove validation classes
            caseForm.querySelectorAll('.valid, .invalid').forEach(el => {
                el.classList.remove('valid', 'invalid');
            });

            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            showToast(`Caso da empresa "${empresa}" adicionado com sucesso!`, 'success');
        };
        reader.readAsDataURL(fotoInput.files[0]);
    });

    // ============================================
    // DEPOIMENTOS
    // ============================================
    const testimonialForm = document.getElementById('testimonial-form');
    const adminTestimonialsList = document.getElementById('admin-testimonials-list');
    
    function renderTestimonials() {
        const testimonials = getData(testimonialsKey);
        
        if (testimonials.length === 0) {
            adminTestimonialsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <div class="empty-state-text">Nenhum depoimento cadastrado ainda.<br>Adicione o primeiro depoimento acima!</div>
                </div>
            `;
            return;
        }
        
        adminTestimonialsList.innerHTML = '';
        testimonials.forEach((dep, idx) => {
            const card = document.createElement('div');
            card.className = 'admin-testimonial-card';
            card.style.animationDelay = `${idx * 0.1}s`;
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
        const testimonials = getData(testimonialsKey);
        const testimonialText = testimonials[idx].substring(0, 50) + '...';
        
        showConfirmModal(
            `Deseja realmente remover este depoimento? "${testimonialText}"`,
            () => {
                testimonials.splice(idx, 1);
                setData(testimonialsKey, testimonials);
                renderTestimonials();
                updateStats();
                showToast('Depoimento removido com sucesso!', 'success');
            }
        );
    };
    
    testimonialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const depoimento = document.getElementById('depoimento').value.trim();
        
        if (!depoimento) {
            showToast('Por favor, digite o depoimento.', 'error');
            return;
        }

        // Loading state
        const submitBtn = testimonialForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            const arr = getData(testimonialsKey);
            arr.push(depoimento);
            setData(testimonialsKey, arr);
            
            renderTestimonials();
            updateStats();
            testimonialForm.reset();

            // Remove validation classes
            testimonialForm.querySelectorAll('.valid, .invalid').forEach(el => {
                el.classList.remove('valid', 'invalid');
            });

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            showToast('Depoimento adicionado com sucesso!', 'success');
        }, 500);
    });

    // ============================================
    // PROCESSOS
    // ============================================
    const processForm = document.getElementById('process-form');
    const adminProcessList = document.getElementById('admin-process-list');
    
    function renderProcesses() {
        const processes = getData(processesKey);
        
        if (processes.length === 0) {
            adminProcessList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚖️</div>
                    <div class="empty-state-text">Nenhum processo cadastrado ainda.<br>Adicione o primeiro processo acima!</div>
                </div>
            `;
            return;
        }
        
        adminProcessList.innerHTML = '';
        processes.forEach((proc, idx) => {
            const card = document.createElement('div');
            card.className = 'admin-process-card';
            card.style.animationDelay = `${idx * 0.1}s`;
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
        const processes = getData(processesKey);
        const processData = processes[idx];
        
        showConfirmModal(
            `Deseja realmente remover o processo de "${processData.trabalhador}" vs "${processData.empresa}"?`,
            () => {
                processes.splice(idx, 1);
                setData(processesKey, processes);
                renderProcesses();
                updateStats();
                showToast('Processo removido com sucesso!', 'success');
            }
        );
    };
    
    processForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const trabalhador = document.getElementById('trabalhador').value.trim();
        const empresa = document.getElementById('empresa-processo').value.trim();
        const processo = document.getElementById('processo').value.trim();
        
        if (!trabalhador || !empresa || !processo) {
            showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Loading state
        const submitBtn = processForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            const arr = getData(processesKey);
            arr.push({ trabalhador, empresa, processo });
            setData(processesKey, arr);
            
            renderProcesses();
            updateStats();
            processForm.reset();

            // Remove validation classes
            processForm.querySelectorAll('.valid, .invalid').forEach(el => {
                el.classList.remove('valid', 'invalid');
            });

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            showToast(`Processo de "${trabalhador}" adicionado com sucesso!`, 'success');
        }, 500);
    });

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
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

    // ============================================
    // INICIALIZAR
    // ============================================
    renderCases();
    renderTestimonials();
    renderProcesses();
    updateStats();

    // Welcome toast
    setTimeout(() => {
        showToast('Bem-vindo ao Dashboard Administrativo Premium! 🎉', 'info', 'Olá!');
    }, 1000);
});
