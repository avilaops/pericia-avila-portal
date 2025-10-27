// admin.js - Dashboard Administrativo Premium
// Portal administrativo: cadastro de casos, depoimentos e processos

document.addEventListener('DOMContentLoaded', function() {
    // Configurações
    const ANIMATION_MAX_STEPS = 30; // Limite de steps para animação de contadores
    
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
        
        const toastIcon = document.createElement('span');
        toastIcon.className = 'toast-icon';
        toastIcon.textContent = icons[type];
        
        const toastContent = document.createElement('div');
        toastContent.className = 'toast-content';
        
        const toastTitle = document.createElement('div');
        toastTitle.className = 'toast-title';
        toastTitle.textContent = titles[type];
        
        const toastMessage = document.createElement('div');
        toastMessage.className = 'toast-message';
        toastMessage.textContent = message;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => toast.remove());
        
        toastContent.appendChild(toastTitle);
        toastContent.appendChild(toastMessage);
        toast.appendChild(toastIcon);
        toast.appendChild(toastContent);
        toast.appendChild(closeBtn);

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
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const modalTitle = document.createElement('h3');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = '⚠️ Confirmar Ação';
        
        const modalMessage = document.createElement('p');
        modalMessage.className = 'modal-message';
        modalMessage.textContent = message;
        
        const modalActions = document.createElement('div');
        modalActions.className = 'modal-actions';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'modal-btn modal-btn-cancel';
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.addEventListener('click', () => overlay.remove());
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'modal-btn modal-btn-confirm';
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.addEventListener('click', () => {
            onConfirm();
            overlay.remove();
        });
        
        modalActions.appendChild(cancelBtn);
        modalActions.appendChild(confirmBtn);
        modal.appendChild(modalTitle);
        modal.appendChild(modalMessage);
        modal.appendChild(modalActions);
        overlay.appendChild(modal);

        document.body.appendChild(overlay);

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
        
        if (current === target) {
            return;
        }
        
        const duration = 500;
        const steps = Math.min(Math.abs(target - current), ANIMATION_MAX_STEPS);
        const stepDuration = duration / steps;
        const increment = (target - current) / steps;

        let currentStep = 0;
        let displayValue = current;
        
        const timer = setInterval(() => {
            currentStep++;
            if (currentStep >= steps) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                displayValue += increment;
                element.textContent = Math.round(displayValue);
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
            
            const img = document.createElement('img');
            img.src = caso.foto;
            img.alt = caso.empresa;
            img.loading = 'lazy';
            
            const content = document.createElement('div');
            content.className = 'admin-case-content';
            
            const title = document.createElement('h3');
            title.textContent = `🏢 ${caso.empresa}`;
            
            const description = document.createElement('p');
            description.textContent = caso.descricao;
            
            const actions = document.createElement('div');
            actions.className = 'admin-case-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = '🗑️ Remover';
            deleteBtn.addEventListener('click', () => removeCase(idx));
            
            actions.appendChild(deleteBtn);
            content.appendChild(title);
            content.appendChild(description);
            content.appendChild(actions);
            card.appendChild(img);
            card.appendChild(content);
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
            
            const quote = document.createElement('p');
            quote.textContent = `"${dep}"`;
            
            const actions = document.createElement('div');
            actions.className = 'admin-case-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = '🗑️ Remover';
            deleteBtn.addEventListener('click', () => removeTestimonial(idx));
            
            actions.appendChild(deleteBtn);
            card.appendChild(quote);
            card.appendChild(actions);
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
            
            const header = document.createElement('div');
            header.className = 'process-header';
            
            const info = document.createElement('div');
            info.className = 'process-info';
            
            const name = document.createElement('h4');
            name.textContent = `👤 ${proc.trabalhador}`;
            
            const company = document.createElement('span');
            company.className = 'company-name';
            company.textContent = `🏢 ${proc.empresa}`;
            
            const description = document.createElement('p');
            description.className = 'process-description';
            description.textContent = proc.processo;
            
            const actions = document.createElement('div');
            actions.className = 'admin-case-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete';
            deleteBtn.textContent = '🗑️ Remover';
            deleteBtn.addEventListener('click', () => removeProcess(idx));
            
            info.appendChild(name);
            info.appendChild(company);
            header.appendChild(info);
            actions.appendChild(deleteBtn);
            card.appendChild(header);
            card.appendChild(description);
            card.appendChild(actions);
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
