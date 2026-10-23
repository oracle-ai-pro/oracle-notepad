document.addEventListener('DOMContentLoaded', () => {
    const APP_VERSION = '2.6.1';
    const whatsNewModal = document.getElementById('whatsNewModal');
    const btnCloseWhatsNew = document.getElementById('btn-close-whats-new');
    const savedVersion = localStorage.getItem('oracle_notepad_version');

    if (whatsNewModal && savedVersion !== APP_VERSION) {
        whatsNewModal.style.display = 'flex';
    }

    if (btnCloseWhatsNew && whatsNewModal) {
        btnCloseWhatsNew.addEventListener('click', () => {
            whatsNewModal.style.display = 'none';
            localStorage.setItem('oracle_notepad_version', APP_VERSION);
        });
    }

    // ЭЛЕМЕНТЫ
    const btnSettings = document.getElementById('btn-settings');
    const exportMenu = document.getElementById('export-menu');

    const gridLayout = document.querySelector('.grid-layout');
    const panelInfo = document.getElementById('panel-info');
    const btnDockLeft = document.getElementById('btn-dock-left');
    const dockLeftIcon = document.getElementById('dock-left-icon');

    const codeEditor = document.getElementById('code-editor');
    const toggleKeyboard = document.getElementById('toggle-keyboard');
    const codingKeyboard = document.getElementById('coding-keyboard');

    const btnToggleNotes = document.getElementById('btn-toggle-notes');
    const notesIcon = document.getElementById('notes-icon');
    const viewAi = document.getElementById('view-ai');
    const viewNotes = document.getElementById('view-notes');
    const notesEditor = document.getElementById('notes-editor');
    
    const oracleInput = document.getElementById('oracle-input');
    const sendBtn = document.getElementById('send-btn');
    const chatFlow = document.getElementById('chat-flow');
    const welcomeBlock = document.getElementById('welcome-block');

    const metaName = document.getElementById('meta-name');
    const toast = document.getElementById('toast-notification');
    const autoSaveToggle = document.getElementById('auto-save-toggle');
    const btnSaveLocal = document.getElementById('btn-save-local');

    // КНОПКИ ПРИКРЕПЛЕНИЯ ФАЙЛА И МИКРОФОНА В ЧАТЕ
    const btnAttach = document.getElementById('btn-attach');
    const attachFileInput = document.getElementById('attach-file-input');
    const voiceBtn = document.getElementById('voice-btn');

    // МОБИЛЬНЫЕ ВКЛАДКИ
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const panels = [document.getElementById('panel-info'), document.getElementById('panel-coding'), document.getElementById('panel-oracle')];

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            mobileNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            panels.forEach(p => {
                if (p) {
                    if (p.id === targetId) {
                        p.classList.add('mobile-active');
                    } else {
                        p.classList.remove('mobile-active');
                    }
                }
            });
        });
    });

    // TOAST
    function showToast(text = 'Сохранено в Данных') {
        if (!toast) return;
        toast.querySelector('span:last-child').textContent = text;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    // 1. СВОРАЧИВАНИЕ ЛЕВОЙ ПАНЕЛИ
    if (btnDockLeft) {
        btnDockLeft.addEventListener('click', () => {
            if (window.innerWidth >= 1024) {
                const isDocked = gridLayout.classList.toggle('left-docked');
                panelInfo.classList.toggle('docked');
                if (dockLeftIcon) {
                    dockLeftIcon.textContent = isDocked ? 'dock_to_right' : 'dock_to_left';
                }
            }
        });
    }

    // 2. ИМПОРТ ИЗОБРАЖЕНИЯ И КОНТЕКСТНОЕ МЕНЮ
    const btnAddProjectIcon = document.getElementById('btn-add-project-icon');
    const projectIconInput = document.getElementById('project-icon-input');
    const projectIconPreviewWrapper = document.getElementById('project-icon-preview-wrapper');
    const projectIconImg = document.getElementById('project-icon-img');
    const btnIconMenu = document.getElementById('btn-icon-menu');
    const iconContextMenu = document.getElementById('icon-context-menu');
    const btnChangeIcon = document.getElementById('btn-change-icon');
    const btnRemoveIcon = document.getElementById('btn-remove-icon');

    let currentProjectIconBase64 = '';

    if (btnAddProjectIcon && projectIconInput) {
        btnAddProjectIcon.addEventListener('click', () => projectIconInput.click());
    }

    if (btnChangeIcon && projectIconInput) {
        btnChangeIcon.addEventListener('click', () => {
            if (iconContextMenu) iconContextMenu.classList.remove('active');
            projectIconInput.click();
        });
    }

    if (btnIconMenu && iconContextMenu) {
        btnIconMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            iconContextMenu.classList.toggle('active');
        });
        document.addEventListener('click', () => iconContextMenu.classList.remove('active'));
    }

    if (projectIconInput) {
        projectIconInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentProjectIconBase64 = event.target.result;
                    renderProjectIcon();
                    handleAutoSaveInput();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnRemoveIcon) {
        btnRemoveIcon.addEventListener('click', () => {
            if (iconContextMenu) iconContextMenu.classList.remove('active');
            currentProjectIconBase64 = '';
            renderProjectIcon();
            handleAutoSaveInput();
        });
    }

    function renderProjectIcon() {
        if (currentProjectIconBase64) {
            if (projectIconImg) projectIconImg.src = currentProjectIconBase64;
            if (projectIconPreviewWrapper) projectIconPreviewWrapper.classList.remove('hidden');
            if (btnAddProjectIcon) btnAddProjectIcon.classList.add('hidden');
        } else {
            if (projectIconImg) projectIconImg.src = '';
            if (projectIconPreviewWrapper) projectIconPreviewWrapper.classList.add('hidden');
            if (btnAddProjectIcon) btnAddProjectIcon.classList.remove('hidden');
        }
    }

    // МОДАЛЬНЫЕ ОКНА
    const alertModal = document.getElementById('alertModal');
    const alertTitle = document.getElementById('alertModalTitle');
    const alertMsg = document.getElementById('alertModalMessage');
    const btnCloseAlert = document.getElementById('btn-close-alert');

    const confirmModal = document.getElementById('confirmModal');
    const confirmTitle = document.getElementById('confirmModalTitle');
    const confirmMsg = document.getElementById('confirmModalMessage');
    const btnCancelConfirm = document.getElementById('btn-cancel-confirm');
    const btnAcceptConfirm = document.getElementById('btn-accept-confirm');
    let onConfirmCallback = null;

    const inputModal = document.getElementById('inputModal');
    const inputTitle = document.getElementById('inputModalTitle');
    const inputLabel = document.getElementById('inputModalLabel');
    const customInputValue = document.getElementById('customInputValue');
    const btnCancelInput = document.getElementById('btn-cancel-input');
    const btnConfirmInput = document.getElementById('btn-confirm-input');
    let onInputCallback = null;

    window.showAlert = function(message, title = 'Уведомление') {
        if (!alertModal) return;
        alertTitle.textContent = title;
        alertMsg.textContent = message;
        alertModal.style.display = 'flex';
    };
    if (btnCloseAlert) btnCloseAlert.addEventListener('click', () => alertModal.style.display = 'none');

    window.showConfirm = function(message, onConfirm, title = 'Подтверждение') {
        if (!confirmModal) return;
        confirmTitle.textContent = title;
        confirmMsg.textContent = message;
        onConfirmCallback = onConfirm;
        confirmModal.style.display = 'flex';
    };
    if (btnCancelConfirm) btnCancelConfirm.addEventListener('click', () => confirmModal.style.display = 'none');
    if (btnAcceptConfirm) {
        btnAcceptConfirm.addEventListener('click', () => {
            confirmModal.style.display = 'none';
            if (typeof onConfirmCallback === 'function') onConfirmCallback();
        });
    }

    window.showInput = function(title, label, defaultValue, onConfirm) {
        if (!inputModal) return;
        inputTitle.textContent = title;
        inputLabel.textContent = label;
        customInputValue.value = defaultValue || '';
        onInputCallback = onConfirm;
        inputModal.style.display = 'flex';
        setTimeout(() => customInputValue.focus(), 100);
    };
    if (btnCancelInput) btnCancelInput.addEventListener('click', () => inputModal.style.display = 'none');
    if (btnConfirmInput) {
        btnConfirmInput.addEventListener('click', () => {
            const val = customInputValue.value.trim();
            inputModal.style.display = 'none';
            if (typeof onInputCallback === 'function') onInputCallback(val);
        });
    }

    // 3. WORLDS & ROOMS
    let worlds = [
        { id: 'world_1', name: 'World 1', rooms: [{ id: 'room_1', name: 'Room 1' }] }
    ];

    const btnCreateWorld = document.getElementById('btn-create-world');
    const btnCreateRoom = document.getElementById('btn-create-room');
    const explorerContainer = document.getElementById('explorer');

    const roomModal = document.getElementById('roomModal');
    const roomModalTitle = document.getElementById('roomModalTitle');
    const roomWorldSelect = document.getElementById('roomWorldSelect');
    const roomNameInput = document.getElementById('roomNameInput');
    const btnCancelRoom = document.getElementById('btn-cancel-room');
    const btnConfirmRoom = document.getElementById('btn-confirm-room');

    let editingRoomContext = null;

    if (btnCreateWorld) {
        btnCreateWorld.addEventListener('click', () => {
            showInput('Новый Мир', 'Введите имя Мира:', `World ${worlds.length + 1}`, (worldName) => {
                if (worldName) {
                    worlds.push({
                        id: 'world_' + Date.now(),
                        name: worldName,
                        rooms: []
                    });
                    renderExplorer();
                    handleAutoSaveInput();
                }
            });
        });
    }

    function populateWorldSelect(selectedWorldId = null) {
        if (!roomWorldSelect) return;
        roomWorldSelect.innerHTML = '';
        worlds.forEach(w => {
            const opt = document.createElement('option');
            opt.value = w.id;
            opt.textContent = w.name;
            if (selectedWorldId && w.id === selectedWorldId) opt.selected = true;
            roomWorldSelect.appendChild(opt);
        });
    }

    if (btnCreateRoom) {
        btnCreateRoom.addEventListener('click', () => {
            if (worlds.length === 0) {
                showAlert('Сначала создайте хотя бы один Мир!');
                return;
            }
            editingRoomContext = null;
            if (roomModalTitle) roomModalTitle.textContent = 'Создание комнаты';
            populateWorldSelect();
            if (roomNameInput) roomNameInput.value = '';
            if (roomModal) roomModal.style.display = 'flex';
        });
    }

    if (btnCancelRoom && roomModal) {
        btnCancelRoom.addEventListener('click', () => roomModal.style.display = 'none');
    }

    if (btnConfirmRoom) {
        btnConfirmRoom.addEventListener('click', () => {
            const targetWorldId = roomWorldSelect.value;
            const targetWorld = worlds.find(w => w.id === targetWorldId);
            if (!targetWorld) return;

            let finalName = roomNameInput ? roomNameInput.value.trim() : '';

            if (editingRoomContext) {
                const { worldId, roomId } = editingRoomContext;
                const sourceWorld = worlds.find(w => w.id === worldId);
                const roomIndex = sourceWorld ? sourceWorld.rooms.findIndex(r => r.id === roomId) : -1;

                if (sourceWorld && roomIndex !== -1) {
                    const roomObj = sourceWorld.rooms[roomIndex];
                    if (!finalName) {
                        const count = targetWorld.rooms.length + 1;
                        finalName = `Room #${count}`;
                    }
                    roomObj.name = finalName;

                    if (worldId !== targetWorldId) {
                        sourceWorld.rooms.splice(roomIndex, 1);
                        targetWorld.rooms.push(roomObj);
                    }
                }
            } else {
                if (!finalName) {
                    const count = targetWorld.rooms.length + 1;
                    finalName = `Room #${count}`;
                }
                targetWorld.rooms.push({
                    id: 'room_' + Date.now(),
                    name: finalName
                });
            }

            if (roomModal) roomModal.style.display = 'none';
            renderExplorer();
            handleAutoSaveInput();
        });
    }

    function renderExplorer() {
        if (!explorerContainer) return;
        explorerContainer.innerHTML = '';

        worlds.forEach(world => {
            const group = document.createElement('div');
            group.className = 'world-group';

            const worldDiv = document.createElement('div');
            worldDiv.className = 'explorer-item world-item';
            worldDiv.innerHTML = `
                <div class="item-title">
                    <span class="material-symbols-rounded">language</span> ${escapeHtml(world.name)}
                </div>
                <div class="item-actions">
                    <span class="material-symbols-rounded" onclick="editWorldName('${world.id}')" title="Переименовать Мир">edit</span>
                    <span class="material-symbols-rounded" style="color: var(--accent-red);" onclick="deleteWorldPrompt('${world.id}')" title="Удалить Мир">close</span>
                </div>
            `;
            group.appendChild(worldDiv);

            world.rooms.forEach(room => {
                const roomDiv = document.createElement('div');
                roomDiv.className = 'explorer-item room-item';
                roomDiv.innerHTML = `
                    <div class="item-title">
                        <span class="material-symbols-rounded">meeting_room</span> ${escapeHtml(room.name)}
                    </div>
                    <div class="item-actions">
                        <span class="material-symbols-rounded" onclick="openEditRoomModal('${world.id}', '${room.id}')" title="Редактировать / Переместить">edit</span>
                        <span class="material-symbols-rounded" style="color: var(--accent-red);" onclick="deleteRoomPrompt('${world.id}', '${room.id}')" title="Удалить">close</span>
                    </div>
                `;
                group.appendChild(roomDiv);
            });

            explorerContainer.appendChild(group);
        });
    }

    window.editWorldName = function(worldId) {
        const world = worlds.find(w => w.id === worldId);
        if (!world) return;
        showInput('Редактировать Мир', 'Имя мира:', world.name, (newName) => {
            if (newName) {
                world.name = newName;
                renderExplorer();
                handleAutoSaveInput();
            }
        });
    };

    window.deleteWorldPrompt = function(worldId) {
        const world = worlds.find(w => w.id === worldId);
        if (!world) return;
        showConfirm(`Вы уверены, что хотите удалить Мир "${world.name}" и все его комнаты?\nДействие нельзя будет отменить или восстановить!`, () => {
            worlds = worlds.filter(w => w.id !== worldId);
            renderExplorer();
            handleAutoSaveInput();
        }, 'Удаление Мира');
    };

    window.openEditRoomModal = function(worldId, roomId) {
        const world = worlds.find(w => w.id === worldId);
        if (!world) return;
        const room = world.rooms.find(r => r.id === roomId);
        if (!room) return;

        editingRoomContext = { worldId, roomId };
        if (roomModalTitle) roomModalTitle.textContent = 'Редактирование комнаты';
        populateWorldSelect(worldId);
        if (roomNameInput) roomNameInput.value = room.name;
        if (roomModal) roomModal.style.display = 'flex';
    };

    window.deleteRoomPrompt = function(worldId, roomId) {
        const world = worlds.find(w => w.id === worldId);
        if (!world) return;
        const room = world.rooms.find(r => r.id === roomId);
        if (!room) return;

        showConfirm(`Удалить комнату "${room.name}"?\nВосстановить её будет невозможно!`, () => {
            world.rooms = world.rooms.filter(r => r.id !== roomId);
            renderExplorer();
            handleAutoSaveInput();
        }, 'Удаление комнаты');
    };

    // ПРОЕКТЫ
    let projects = JSON.parse(localStorage.getItem('oracle_projects_list')) || [
        { id: 'name_01', name: 'Name_01' },
        { id: 'project_alpha', name: 'Проект Альфа' }
    ];

    let activeProjectId = localStorage.getItem('oracle_active_project_id') || 'name_01';

    const projectsModal = document.getElementById('projectsModal');
    const btnOpenProjects = document.getElementById('btn-open-projects');
    const btnCloseProjects = document.getElementById('btn-close-projects-modal');
    const btnCreateProject = document.getElementById('btn-create-project');
    const projectsListContainer = document.getElementById('projects-list');
    const currentProjectDisplay = document.getElementById('current-project-name-display');

    if (btnOpenProjects && projectsModal) {
        btnOpenProjects.addEventListener('click', () => {
            renderProjectsList();
            projectsModal.style.display = 'flex';
        });
    }

    if (btnCloseProjects && projectsModal) {
        btnCloseProjects.addEventListener('click', () => projectsModal.style.display = 'none');
    }

    function renderProjectsList() {
        if (!projectsListContainer) return;
        projectsListContainer.innerHTML = '';
        const activeProj = projects.find(p => p.id === activeProjectId) || projects[0];
        if (currentProjectDisplay) currentProjectDisplay.textContent = activeProj.name;

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = `project-card-item ${project.id === activeProjectId ? 'active-project' : ''}`;
            card.innerHTML = `
                <div class="project-info-click" onclick="switchProject('${project.id}')">
                    <span class="material-symbols-rounded">folder</span>
                    <span class="project-card-title">${escapeHtml(project.name)}</span>
                    ${project.id === activeProjectId ? '<span class="project-card-badge">Активный</span>' : ''}
                </div>
                <div class="project-card-actions">
                    <button class="icon-btn" title="Изменить" onclick="editProjectInfo('${project.id}')">
                        <span class="material-symbols-rounded" style="font-size: 18px;">edit</span>
                    </button>
                    <button class="icon-btn" title="Удалить" onclick="deleteProject('${project.id}')">
                        <span class="material-symbols-rounded" style="font-size: 18px; color: var(--accent-red);">delete</span>
                    </button>
                </div>
            `;
            projectsListContainer.appendChild(card);
        });
    }

    window.switchProject = function(id) {
        activeProjectId = id;
        localStorage.setItem('oracle_active_project_id', activeProjectId);
        renderProjectsList();
        loadState();
        projectsModal.style.display = 'none';
    };

    if (btnCreateProject) {
        btnCreateProject.addEventListener('click', () => {
            showInput('Новый проект', 'Введите название нового проекта:', '', (newName) => {
                if (newName) {
                    const newId = 'proj_' + Date.now();
                    projects.push({ id: newId, name: newName });
                    saveProjectsToStorage();
                    switchProject(newId);
                }
            });
        });
    }

    window.editProjectInfo = function(id) {
        const project = projects.find(p => p.id === id);
        if (!project) return;
        showInput('Редактировать проект', 'Новое название:', project.name, (updatedName) => {
            if (updatedName) {
                project.name = updatedName;
                saveProjectsToStorage();
                renderProjectsList();
                if (id === activeProjectId && currentProjectDisplay) currentProjectDisplay.textContent = updatedName;
            }
        });
    };

    window.deleteProject = function(id) {
        if (projects.length <= 1) {
            showAlert('Нельзя удалить единственный проект!');
            return;
        }
        const project = projects.find(p => p.id === id);
        showConfirm(`Удалить проект "${project.name}"?\nВсе данные этого проекта будут потеряны.`, () => {
            projects = projects.filter(p => p.id !== id);
            if (activeProjectId === id) {
                activeProjectId = projects[0].id;
                localStorage.setItem('oracle_active_project_id', activeProjectId);
                loadState();
            }
            localStorage.removeItem(`oracle_notepad_storage_${id}`);
            saveProjectsToStorage();
            renderProjectsList();
        }, 'Удаление проекта');
    };

    function saveProjectsToStorage() {
        localStorage.setItem('oracle_projects_list', JSON.stringify(projects));
    }

    // СОХРАНЕНИЕ / АВТОСОХРАНЕНИЕ В LOCALSTORAGE
    let autoSaveTimer = null;

    function saveState(triggerToast = false) {
        const activeProj = projects.find(p => p.id === activeProjectId) || projects[0];
        const state = { 
            projectName: activeProj.name, 
            metaName: metaName ? metaName.value : '', 
            code: codeEditor ? codeEditor.value : '', 
            notes: notesEditor ? notesEditor.innerHTML : '',
            projectIcon: currentProjectIconBase64,
            worlds: worlds
        };
        localStorage.setItem(`oracle_notepad_storage_${activeProjectId}`, JSON.stringify(state));
        if (triggerToast) showToast();
    }

    function handleAutoSaveInput() {
        if (autoSaveToggle && autoSaveToggle.checked) {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                saveState(true);
            }, 800);
        }
    }

    if (btnSaveLocal) {
        btnSaveLocal.addEventListener('click', () => {
            saveState(true);
            if (exportMenu) exportMenu.classList.remove('active');
        });
    }

    function loadState() {
        const saved = localStorage.getItem(`oracle_notepad_storage_${activeProjectId}`);
        const activeProj = projects.find(p => p.id === activeProjectId) || projects[0];
        if (currentProjectDisplay) currentProjectDisplay.textContent = activeProj.name;

        if (!saved) {
            if (metaName) metaName.value = 'Ламирк';
            if (codeEditor) codeEditor.value = '';
            if (notesEditor) notesEditor.innerHTML = '';
            currentProjectIconBase64 = '';
            worlds = [{ id: 'world_1', name: 'World 1', rooms: [{ id: 'room_1', name: 'Room 1' }] }];
            renderProjectIcon();
            renderExplorer();
            return;
        }

        try {
            const state = JSON.parse(saved);
            if (metaName) metaName.value = state.metaName || 'Ламирк';
            if (codeEditor) codeEditor.value = state.code || '';
            if (notesEditor) notesEditor.innerHTML = state.notes || '';
            currentProjectIconBase64 = state.projectIcon || '';
            worlds = state.worlds || [{ id: 'world_1', name: 'World 1', rooms: [{ id: 'room_1', name: 'Room 1' }] }];

            renderProjectIcon();
            renderExplorer();
        } catch(e) {
            console.error("Ошибка загрузки состояния", e);
        }
    }

    // БУРГЕР-МЕНЮ ЧАТОВ
    const btnChatMenu = document.getElementById('btn-chat-menu');
    const chatDrawer = document.getElementById('chatDrawer');
    const chatDrawerOverlay = document.getElementById('chatDrawerOverlay');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');

    if (btnChatMenu) btnChatMenu.addEventListener('click', () => {
        if (chatDrawerOverlay && chatDrawer) {
            chatDrawerOverlay.style.display = 'block';
            setTimeout(() => {
                chatDrawerOverlay.classList.add('active');
                chatDrawer.classList.add('active');
            }, 10);
        }
    });

    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => {
        if (chatDrawerOverlay && chatDrawer) {
            chatDrawerOverlay.classList.remove('active');
            chatDrawer.classList.remove('active');
            setTimeout(() => chatDrawerOverlay.style.display = 'none', 300);
        }
    });

    // ПЕРЕКЛЮЧЕНИЕ ИИ / KEEPS
    let activeRightView = 'ai';
    if (btnToggleNotes && viewAi && viewNotes) {
        btnToggleNotes.addEventListener('click', () => {
            if (activeRightView === 'ai') {
                activeRightView = 'notes';
                viewAi.classList.remove('active');
                viewNotes.classList.add('active');
                if (notesIcon) notesIcon.textContent = 'smart_toy';
            } else {
                activeRightView = 'ai';
                viewNotes.classList.remove('active');
                viewAi.classList.add('active');
                if (notesIcon) notesIcon.textContent = 'sticky_note_2';
            }
        });
    }

    // ПРОФИЛЬ
    const profileBtn = document.getElementById('btn-profile-menu');
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = document.getElementById('btn-close-profile');
    if (profileBtn && profileModal) profileBtn.addEventListener('click', () => profileModal.style.display = 'flex');
    if (closeProfileBtn && profileModal) closeProfileBtn.addEventListener('click', () => profileModal.style.display = 'none');

    // КЛАВИАТУРА И КОД + закрепление символов
    const ALL_CODING_SYMBOLS = [
        '{', '}', '[', ']', '(', ')', '<', '>',
        ';', ':', ',', '.', '?', '!',
        '"', "'", '`', '\\', '/', '|',
        '=', '+', '-', '*', '%', '_', '$', '#', '@', '&', '^', '~',
        'Tab', '=>', '===', '!==', '&&', '||', '??', '...',
        '/*', '*/', '//', '${', '[]', '{}', '()'
    ];
    const PINNED_KEY = 'oracle_notepad_pinned_symbols';
    const MAX_PINNED = 10;

    function getPinnedSymbols() {
        try {
            const arr = JSON.parse(localStorage.getItem(PINNED_KEY) || '[]');
            return Array.isArray(arr) ? arr.filter(s => typeof s === 'string').slice(0, MAX_PINNED) : [];
        } catch (e) { return []; }
    }
    function savePinnedSymbols(arr) {
        localStorage.setItem(PINNED_KEY, JSON.stringify(arr.slice(0, MAX_PINNED)));
    }
    function pinSymbol(sym) {
        let arr = getPinnedSymbols().filter(s => s !== sym);
        arr.push(sym);
        if (arr.length > MAX_PINNED) arr = arr.slice(arr.length - MAX_PINNED);
        savePinnedSymbols(arr);
        renderCodingKeyboard();
        renderSymbolsModal();
        showToast('Закреплено: ' + sym + ' (' + arr.length + '/' + MAX_PINNED + ')');
    }
    function unpinSymbol(sym) {
        const arr = getPinnedSymbols().filter(s => s !== sym);
        savePinnedSymbols(arr);
        renderCodingKeyboard();
        renderSymbolsModal();
        showToast('Откреплено: ' + sym);
    }
    function insertCodingSymbol(key) {
        if (!codeEditor) return;
        insertAtCursor(codeEditor, key === 'Tab' ? '    ' : key);
    }

    let _symCtxTarget = null;
    function hideSymbolsCtx() {
        const m = document.getElementById('symbols-ctx-menu');
        if (m) m.style.display = 'none';
        _symCtxTarget = null;
    }
    function showSymbolsCtx(e, sym, isPinned) {
        e.preventDefault();
        e.stopPropagation();
        _symCtxTarget = sym;
        const m = document.getElementById('symbols-ctx-menu');
        if (!m) return;
        const pinBtn = document.getElementById('symbols-ctx-pin');
        const unpinBtn = document.getElementById('symbols-ctx-unpin');
        if (pinBtn) pinBtn.style.display = isPinned ? 'none' : 'block';
        if (unpinBtn) unpinBtn.style.display = isPinned ? 'block' : 'none';
        m.style.display = 'flex';
        const x = Math.min(e.clientX || (e.touches && e.touches[0]?.clientX) || 0, window.innerWidth - 160);
        const y = Math.min(e.clientY || (e.touches && e.touches[0]?.clientY) || 0, window.innerHeight - 100);
        m.style.left = x + 'px';
        m.style.top = y + 'px';
    }

    function bindSymLongPress(el, sym, isPinned) {
        let timer = null;
        el.addEventListener('contextmenu', (e) => showSymbolsCtx(e, sym, isPinned));
        el.addEventListener('touchstart', (e) => {
            timer = setTimeout(() => {
                const t = e.touches[0];
                showSymbolsCtx({ preventDefault(){}, stopPropagation(){}, clientX: t.clientX, clientY: t.clientY }, sym, isPinned);
            }, 500);
        }, { passive: true });
        el.addEventListener('touchend', () => clearTimeout(timer));
        el.addEventListener('touchmove', () => clearTimeout(timer));
    }

    function renderCodingKeyboard() {
        if (!codingKeyboard) return;
        codingKeyboard.innerHTML = '';
        const pinned = getPinnedSymbols();
        const base = pinned.length ? pinned : ['{', '}', '[', ']', '(', ')', ';', '"', '=', '<', '>', '/', '$', '_', 'Tab'];
        base.forEach(key => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'key-btn';
            btn.textContent = key;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                insertCodingSymbol(key);
            });
            bindSymLongPress(btn, key, pinned.includes(key));
            codingKeyboard.appendChild(btn);
        });
        const more = document.createElement('button');
        more.type = 'button';
        more.className = 'key-btn more-symbols-btn';
        more.textContent = '⋯';
        more.title = 'Все символы';
        more.addEventListener('click', (e) => {
            e.preventDefault();
            openSymbolsModal();
        });
        codingKeyboard.appendChild(more);
    }

    function renderSymbolsModal() {
        const allGrid = document.getElementById('symbols-all-grid');
        const pinGrid = document.getElementById('symbols-pinned-grid');
        const countEl = document.getElementById('symbols-pinned-count');
        if (!allGrid || !pinGrid) return;
        const pinned = getPinnedSymbols();
        if (countEl) countEl.textContent = String(pinned.length);
        allGrid.innerHTML = '';
        ALL_CODING_SYMBOLS.forEach(sym => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'sym-btn' + (pinned.includes(sym) ? ' pinned-mark' : '');
            b.textContent = sym;
            b.addEventListener('click', () => {
                insertCodingSymbol(sym);
                hideSymbolsCtx();
            });
            bindSymLongPress(b, sym, pinned.includes(sym));
            allGrid.appendChild(b);
        });
        pinGrid.innerHTML = '';
        if (!pinned.length) {
            pinGrid.innerHTML = '<div style="grid-column:1/-1;font-size:12px;color:var(--on-surface-variant);padding:8px;">Нет закреплённых — ПКМ по символу → Закрепить</div>';
        } else {
            pinned.forEach(sym => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'sym-btn pinned-mark';
                b.textContent = sym;
                b.addEventListener('click', () => {
                    insertCodingSymbol(sym);
                    hideSymbolsCtx();
                });
                bindSymLongPress(b, sym, true);
                pinGrid.appendChild(b);
            });
        }
    }

    function openSymbolsModal() {
        renderSymbolsModal();
        const m = document.getElementById('symbols-picker-modal');
        if (m) m.style.display = 'flex';
    }
    function closeSymbolsModal() {
        hideSymbolsCtx();
        const m = document.getElementById('symbols-picker-modal');
        if (m) m.style.display = 'none';
    }

    document.getElementById('btn-close-symbols-modal')?.addEventListener('click', closeSymbolsModal);
    document.getElementById('symbols-picker-modal')?.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'symbols-picker-modal') closeSymbolsModal();
    });
    document.getElementById('symbols-ctx-pin')?.addEventListener('click', () => {
        if (_symCtxTarget) pinSymbol(_symCtxTarget);
        hideSymbolsCtx();
    });
    document.getElementById('symbols-ctx-unpin')?.addEventListener('click', () => {
        if (_symCtxTarget) unpinSymbol(_symCtxTarget);
        hideSymbolsCtx();
    });
    document.addEventListener('click', () => hideSymbolsCtx());

    renderCodingKeyboard();

    if (toggleKeyboard && codingKeyboard) {
        toggleKeyboard.addEventListener('click', () => {
            codingKeyboard.classList.toggle('active');
            toggleKeyboard.classList.toggle('active');
        });
    }

    function insertAtCursor(textarea, text) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentVal = textarea.value;
        textarea.value = currentVal.substring(0, start) + text + currentVal.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
        handleAutoSaveInput();
    }

    if (codeEditor) {
        codeEditor.addEventListener('input', handleAutoSaveInput);
    }
    if (metaName) {
        metaName.addEventListener('input', handleAutoSaveInput);
    }
    if (notesEditor) {
        notesEditor.addEventListener('input', handleAutoSaveInput);
    }

    // ОБРАБОТЧИКИ: ПРИКРЕПЛЕНИЕ ФАЙЛА (только input change; + открывает меню)
    if (attachFileInput) {
        attachFileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 0) {
                const names = files.map(f => f.name).join(', ');
                if (oracleInput) {
                    oracleInput.value += ` [Прикреплено: ${names}]`;
                    oracleInput.dispatchEvent(new Event('input'));
                }
                if (typeof showToast === 'function') showToast('Файл: ' + names);
            }
            e.target.value = '';
        });
    }

    // ОБРАБОТЧИКИ: ГОЛОСОВОЙ ВВОД (МИКРОФОН)
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                if (window.showAlert) showAlert('Ваш браузер не поддерживает распознавание речи');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = 'ru-RU';
            recognition.interimResults = false;

            voiceBtn.style.color = 'var(--accent-red, #ff5555)';

            recognition.onstart = () => {
                showToast('Идет запись...');
            };

            recognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                if (oracleInput) {
                    oracleInput.value += (oracleInput.value ? ' ' : '') + transcript;
                    oracleInput.dispatchEvent(new Event('input'));
                }
            };

            recognition.onerror = () => {
                voiceBtn.style.color = '';
            };

            recognition.onend = () => {
                voiceBtn.style.color = '';
            };

            recognition.start();
        });
    }

    // ИИ ОРАКУЛ & ДИНАМИЧЕСКАЯ КНОПКА ОТПРАВКИ
    if (oracleInput && sendBtn) {
        oracleInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            
            if (this.value.trim().length > 0) {
                sendBtn.classList.add('active');
            } else {
                sendBtn.classList.remove('active');
            }
        });

        const sendToOracle = () => {
            const text = oracleInput.value.trim();
            if (!text) return;
            if (welcomeBlock) welcomeBlock.classList.add('hidden');
            appendBubble(escapeHtml(text), 'user');
            oracleInput.value = '';
            oracleInput.style.height = 'auto';
            sendBtn.classList.remove('active');
            dismissSmartTip(true);

            const model = window.__notepadModel || 'intify-2.5.3-flash';
            const mode = window.__notepadAiMode || 'dialog';
            const think = document.createElement('div');
            think.className = 'chat-bubble ai-bubble thinking';
            think.innerHTML = '<div class="ai-thinking-dots"><span></span><span></span><span></span></div>';
            if (chatFlow) {
                chatFlow.appendChild(think);
                chatFlow.scrollTop = chatFlow.scrollHeight;
            }
            setTimeout(() => {
                try { think.remove(); } catch (e) {}
                let reply;
                if (model === 'intify-2.5.3-flash') {
                    if (mode === 'code' || /код|function|const |let |class |html|css|js/i.test(text)) {
                        reply = `<strong>Intify 2.5.3 Flash</strong> · coding<br><pre style="margin:8px 0 0;padding:10px;background:rgba(0,0,0,0.35);border-radius:10px;font-size:12px;overflow:auto;">// draft
// ${escapeHtml(text.slice(0, 80))}
console.log('Intify ready');</pre><span style="font-size:12px;opacity:0.75;">Можно доработать в редакторе или сохранить в AI Studio.</span>`;
                        maybeOfferStudioSave(text);
                    } else {
                        reply = `<strong>Intify 2.5.3 Flash</strong><br>Принято: «${escapeHtml(text.slice(0, 120))}». Уточните задачу по коду — сгенерирую фрагмент.`;
                    }
                } else if (model === 'worldpack') {
                    reply = `<strong>Worldpack AI</strong><br>Могу предложить структуру World / Room под ваш запрос.`;
                } else {
                    reply = `<strong>Oracle Main</strong><br>Диалог принят. Core Node 2.6 Notepad на связи.`;
                }
                if (mode === 'note') {
                    reply = `<strong>Заметка</strong><br>Можно дописать детали в Keeps или здесь: «${escapeHtml(text.slice(0, 100))}».`;
                }
                appendBubble(reply, 'ai');
            }, 500);
        };

        sendBtn.addEventListener('click', sendToOracle);
        oracleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault(); 
                sendToOracle(); 
            }
        });
    }

    function appendBubble(htmlContent, sender) {
        if (!chatFlow) return;
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'ai-bubble'}`;
        bubble.innerHTML = htmlContent;
        chatFlow.appendChild(bubble);
        chatFlow.scrollTop = chatFlow.scrollHeight;
    }

    if (btnSettings && exportMenu) {
        btnSettings.addEventListener('click', (e) => {
            e.stopPropagation();
            exportMenu.classList.toggle('active');
        });
        document.addEventListener('click', () => exportMenu.classList.remove('active'));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    window.exportData = function(format) {
        const activeProj = projects.find(p => p.id === activeProjectId) || projects[0];
        const data = {
            projectName: activeProj.name,
            metaName: metaName ? metaName.value : '',
            code: codeEditor ? codeEditor.value : '',
            notes: notesEditor ? notesEditor.innerText : '',
            worlds: worlds
        };

        let content = '';
        let mimeType = 'text/plain';
        let extension = 'txt';

        if (format === 'json' || format === 'worldpack') {
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            extension = format === 'worldpack' ? 'worldpack' : 'json';
        } else {
            content = `Проект: ${data.projectName}\nАвтор: ${data.metaName}\n\n--- КОД ---\n${data.code}\n\n--- ЗАМЕТКИ ---\n${data.notes}`;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeProj.name.toLowerCase().replace(/\s+/g, '_')}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    loadState();

    // ===== CORE NODE BRIDGE =====

    function showCoreChatsErrorCard(reason) {
        const list = document.getElementById('chatHistoryList');
        if (!list) return;
        list.innerHTML = `
            <div class="core-chats-error-card" role="alert">
                <span class="material-symbols-rounded core-chats-error-icon">error</span>
                <div class="core-chats-error-title">Чаты не удалось отобразить</div>
                <div class="core-chats-error-text">Попробуйте перезагрузить страницу!</div>
                ${reason ? `<div class="core-chats-error-detail">${escapeHtml(String(reason))}</div>` : ''}
                <button type="button" class="action-btn outline core-chats-reload-btn" onclick="location.reload()">
                    <span class="material-symbols-rounded">refresh</span> Перезагрузить
                </button>
            </div>`;
        const el = document.getElementById('bridge-status');
        if (el) {
            el.className = 'bridge-status err';
            el.textContent = 'Ошибка загрузки чатов';
        }
    }

    /** Консоль: __testCoreChatsError() — показать карточку ошибки загрузки чатов */
    window.__testCoreChatsError = function(msg) {
        showCoreChatsErrorCard(msg || 'Тест: симуляция сбоя чтения oracle_chat_sessions');
        console.info('[Notepad] Карточка ошибки чатов. Сброс: location.reload()');
        return true;
    };

    const CORE_CHATS_KEY = 'oracle_chat_sessions';
    const CORE_CURRENT_KEY = 'oracle_current_session';
    const NP_SETTINGS_KEY = 'oracle_notepad_settings';

    function loadNpSettings() {
        try {
            return JSON.parse(localStorage.getItem(NP_SETTINGS_KEY) || '{}') || {};
        } catch (e) { return {}; }
    }
    function saveNpSettings(partial) {
        const s = Object.assign(loadNpSettings(), partial);
        localStorage.setItem(NP_SETTINGS_KEY, JSON.stringify(s));
        applyNpSettings(s);
        return s;
    }
    function applyNpSettings(s) {
        s = s || loadNpSettings();
        if (autoSaveToggle) autoSaveToggle.checked = s.autoSave !== false;
        const as = document.getElementById('settings-auto-save');
        if (as) as.checked = s.autoSave !== false;
        const sy = document.getElementById('settings-auto-sync');
        if (sy) sy.checked = s.autoSync !== false;
        const cc = document.getElementById('settings-compact-chat');
        if (cc) cc.checked = !!s.compactChat;
        document.body.classList.toggle('compact-chat', !!s.compactChat);
        const link = document.getElementById('core-node-open-link');
        if (link) link.setAttribute('href', 'https://oracle-ai-pro.github.io/oracle');
    }

    function readCoreNodeChats() {
        try {
            const raw = localStorage.getItem(CORE_CHATS_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || typeof data !== 'object' || Array.isArray(data)) {
                throw new Error('Неверный формат oracle_chat_sessions');
            }
            return data;
        } catch (e) {
            console.error('[Notepad] Core chats read failed', e);
            window.__lastCoreChatsError = e;
            return { __error: true, message: e && e.message ? e.message : 'Ошибка чтения' };
        }
    }

    function updateBridgeStatus() {
        const el = document.getElementById('bridge-status');
        const keyEl = document.getElementById('core-bridge-key');
        if (keyEl) keyEl.textContent = CORE_CHATS_KEY;
        if (!el) return;
        const chats = readCoreNodeChats();
        if (chats && chats.__error) {
            el.className = 'bridge-status err';
            el.textContent = 'Ошибка загрузки чатов';
            return;
        }
        if (!chats) {
            el.className = 'bridge-status warn';
            el.textContent = 'Чаты Core Node не найдены в этом браузере';
            return;
        }
        const n = Object.keys(chats).filter(k => k !== '__error' && k !== 'message').length;
        el.className = 'bridge-status ok';
        el.textContent = 'Связь OK · чатов: ' + n;
    }

    function stripHtmlToText(html) {
        const d = document.createElement('div');
        d.innerHTML = html || '';
        return d.textContent || d.innerText || '';
    }

    function renderCoreChatHistory(activeId) {
        const list = document.getElementById('chatHistoryList');
        if (!list) return;
        const chats = readCoreNodeChats();
        list.innerHTML = '';
        if (chats && chats.__error) {
            showCoreChatsErrorCard(chats.message || 'Не удалось прочитать чаты');
            return;
        }
        if (!chats || !Object.keys(chats).length) {
            list.innerHTML = '<div class="chat-item muted"><span class="material-symbols-rounded">info</span><span>Нет чатов — откройте Core Node и создайте диалог</span></div>';
            updateBridgeStatus();
            return;
        }
        const cur = activeId || localStorage.getItem(CORE_CURRENT_KEY);
        Object.keys(chats).forEach(id => {
            if (id === '__error' || id === 'message') return;
            const item = document.createElement('div');
            item.className = 'chat-item' + (id === cur ? ' active' : '');
            item.dataset.sessionId = id;
            const title = (chats[id] && chats[id].title) || 'Без названия';
            item.innerHTML = `<span class="material-symbols-rounded">chat_bubble</span><span class="chat-item-title">${escapeHtml(title)}</span>`;
            item.addEventListener('click', () => openCoreChatInNotepad(id));
            list.appendChild(item);
        });
        updateBridgeStatus();
    }

    function openCoreChatInNotepad(sessionId) {
        const chats = readCoreNodeChats();
        if (!chats || chats.__error || !chats[sessionId]) {
            if (chats && chats.__error) showCoreChatsErrorCard(chats.message);
            else showToast('Чат не найден');
            return;
        }
        const session = chats[sessionId];
        // switch to oracle panel on mobile
        document.querySelectorAll('.mobile-nav-item').forEach(i => {
            i.classList.toggle('active', i.getAttribute('data-target') === 'panel-oracle');
        });
        panels.forEach(p => {
            if (!p) return;
            p.classList.toggle('mobile-active', p.id === 'panel-oracle');
        });
        if (viewNotes) viewNotes.classList.remove('active');
        if (viewAi) viewAi.classList.add('active');
        if (notesIcon) notesIcon.textContent = 'sticky_note_2';
        activeRightView = 'ai';

        if (welcomeBlock) welcomeBlock.classList.add('hidden');
        if (chatFlow) {
            chatFlow.innerHTML = '';
            // session.html is Core Node markup — preserve Markdown/code windows for AI
            const tmp = document.createElement('div');
            tmp.innerHTML = session.html || '';
            const msgs = tmp.querySelectorAll('.msg, .user-msg, .ai-msg, .chat-bubble');
            if (msgs.length) {
                msgs.forEach(m => {
                    if (m.classList.contains('ai-api-error')) return; // skip error cards or adapt later
                    const isUser = m.classList.contains('user-msg') || m.classList.contains('user-bubble');
                    if (isUser) {
                        const text = (m.querySelector('.bubble-text')?.textContent) || m.textContent || '';
                        if (text.trim()) appendBubble(escapeHtml(text.trim()), 'user');
                        return;
                    }
                    // AI: prefer rich .ai-md-body HTML
                    const md = m.querySelector('.ai-md-body');
                    if (md) {
                        appendBubble(sanitizeCoreAiHtml(md.innerHTML), 'ai');
                        return;
                    }
                    // fallback: structured text without icon ligatures
                    const clone = m.cloneNode(true);
                    clone.querySelectorAll('.material-symbols-rounded, .ai-code-copy, .ai-actions, .bubble-actions').forEach(el => el.remove());
                    const text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
                    if (text) appendBubble(escapeHtml(text), 'ai');
                });
            } else if (session.html) {
                appendBubble(escapeHtml(stripHtmlToText(session.html).slice(0, 4000)), 'ai');
            } else {
                appendBubble('Пустой чат из Core Node', 'ai');
            }
        }
        // highlight
        document.querySelectorAll('#chatHistoryList .chat-item').forEach(el => {
            el.classList.toggle('active', el.dataset.sessionId === sessionId);
        });
        // close drawer
        if (chatDrawerOverlay && chatDrawer) {
            chatDrawerOverlay.classList.remove('active');
            chatDrawer.classList.remove('active');
            setTimeout(() => { chatDrawerOverlay.style.display = 'none'; }, 300);
        }
        showToast('Чат: ' + (session.title || 'Core Node'));
    }

    function syncFromCoreNode(showMsg = true) {
        updateBridgeStatus();
        renderCoreChatHistory();
        if (showMsg) {
            const chats = readCoreNodeChats();
            const n = chats ? Object.keys(chats).length : 0;
            showToast(n ? ('Синхронизировано: ' + n + ' чат(ов)') : 'Чаты Core Node не найдены');
        }
    }

    const btnSync = document.getElementById('btn-sync-core-node');
    if (btnSync) btnSync.addEventListener('click', () => syncFromCoreNode(true));

    // Settings modal
    const settingsModal = document.getElementById('settingsModal');
    const btnOpenSettings = document.getElementById('btn-open-settings-panel');
    const btnCloseSettings = document.getElementById('btn-close-settings-modal');
    const btnSettingsSave = document.getElementById('btn-settings-save');
    if (btnOpenSettings && settingsModal) {
        btnOpenSettings.addEventListener('click', () => {
            applyNpSettings();
            settingsModal.style.display = 'flex';
        });
    }
    if (btnCloseSettings && settingsModal) {
        btnCloseSettings.addEventListener('click', () => settingsModal.style.display = 'none');
    }
    if (btnSettingsSave) {
        btnSettingsSave.addEventListener('click', () => {
            const autoSave = document.getElementById('settings-auto-save')?.checked !== false;
            const autoSync = document.getElementById('settings-auto-sync')?.checked !== false;
            const compactChat = !!document.getElementById('settings-compact-chat')?.checked;
            saveNpSettings({ autoSave, autoSync, compactChat });
            if (autoSaveToggle) autoSaveToggle.checked = autoSave;
            settingsModal.style.display = 'none';
            showToast('Настройки сохранены');
        });
    }
    // mirror auto-save toggle from export menu
    if (autoSaveToggle) {
        autoSaveToggle.addEventListener('change', () => {
            saveNpSettings({ autoSave: autoSaveToggle.checked });
        });
    }

    applyNpSettings();

    // ===== THEME SWITCHER =====
    const THEME_KEY = 'oracle_notepad_theme';
    function getNotepadTheme() {
        const t = localStorage.getItem(THEME_KEY) || 'dark';
        return ['dark', 'light', 'true-black'].includes(t) ? t : 'dark';
    }
    function applyNotepadTheme(theme) {
        const t = ['dark', 'light', 'true-black'].includes(theme) ? theme : 'dark';
        document.body.classList.remove('dark-theme', 'light-theme', 'true-black-theme');
        if (t === 'light') document.body.classList.add('light-theme');
        else if (t === 'true-black') document.body.classList.add('true-black-theme');
        else document.body.classList.add('dark-theme');
        localStorage.setItem(THEME_KEY, t);
        // re-tint accent after theme class change
        setTimeout(() => {
          if (typeof window.npApplyAccentFull === 'function') {
            try { window.npApplyAccentFull(localStorage.getItem('oracle_np_accent') || 'blue'); } catch (e) {}
          }
        }, 30);
        document.querySelectorAll('.theme-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === t);
        });
        const icon = document.getElementById('theme-quick-icon');
        if (icon) {
            icon.textContent = t === 'light' ? 'light_mode' : (t === 'true-black' ? 'contrast' : 'dark_mode');
        }
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', t === 'light' ? '#f4f5fa' : '#0a0b10');
        }
    }
    function cycleNotepadTheme() {
        const order = ['dark', 'light', 'true-black'];
        const cur = getNotepadTheme();
        const next = order[(order.indexOf(cur) + 1) % order.length];
        applyNotepadTheme(next);
        const labels = { dark: 'Тёмная', light: 'Светлая', 'true-black': 'True Black' };
        showToast('Тема: ' + (labels[next] || next));
    }
    document.querySelectorAll('.theme-opt').forEach(btn => {
        btn.addEventListener('click', () => applyNotepadTheme(btn.dataset.theme));
    });
    document.getElementById('btn-theme-quick')?.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleNotepadTheme();
    });
    applyNotepadTheme(getNotepadTheme());

    updateBridgeStatus();
    if (loadNpSettings().autoSync !== false) {
        syncFromCoreNode(false);
    }

    // ===== SMART TIP + MODEL + AI STUDIO =====
    const TIP_KEY = 'oracle_notepad_tip_dismissed_2_6_1';
    const MODEL_KEY = 'oracle_notepad_model';
    const STUDIO_KEY = 'oracle_notepad_ai_studio';
    const TIP_VARIANTS = [
        'Core Node 2.6 стал умнее — хотите что-то сгенерировать? Просто напишите',
        'Core Node 2.6 стал умнее — хотите добавить заметку о будущих деталях? Просто напишите',
        'Intify 2.5.3 Flash готов к коду — опишите задачу над полем ввода'
    ];

    function dismissSmartTip(persist) {
        const tip = document.getElementById('oracle-smart-tip');
        if (tip) tip.classList.add('hidden');
        if (persist) localStorage.setItem(TIP_KEY, '1');
    }
    function showSmartTip() {
        const tip = document.getElementById('oracle-smart-tip');
        const text = document.getElementById('oracle-smart-tip-text');
        if (!tip || localStorage.getItem(TIP_KEY) === '1') {
            tip?.classList.add('hidden');
            return;
        }
        if (text) text.textContent = TIP_VARIANTS[Math.floor(Math.random() * TIP_VARIANTS.length)];
        tip.classList.remove('hidden');
    }
    document.getElementById('oracle-smart-tip-close')?.addEventListener('click', () => dismissSmartTip(true));
    showSmartTip();

    // Model picker
    window.__notepadModel = localStorage.getItem(MODEL_KEY) || 'intify-2.5.3-flash';
    window.__notepadAiMode = 'dialog';
    const modelLabels = {
        'intify-2.5.3-flash': 'Intify 2.5.3 Flash',
        'oracle-main': 'Oracle Main',
        'worldpack': 'Worldpack AI'
    };
    function refreshModelChip() {
        const lab = document.getElementById('model-chip-label');
        if (lab) lab.textContent = modelLabels[window.__notepadModel] || 'Intify 2.5.3 Flash';
        document.querySelectorAll('.model-option').forEach(o => {
            o.classList.toggle('active', o.dataset.model === window.__notepadModel);
        });
        if (oracleInput) {
            oracleInput.placeholder = 'Спросить...';
        }
    }
    document.getElementById('model-chip')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = document.getElementById('model-picker');
        if (p) p.style.display = p.style.display === 'none' ? 'flex' : 'none';
    });
    document.querySelectorAll('.model-option').forEach(o => {
        o.addEventListener('click', (e) => {
            e.stopPropagation();
            window.__notepadModel = o.dataset.model;
            localStorage.setItem(MODEL_KEY, window.__notepadModel);
            refreshModelChip();
            document.getElementById('model-picker').style.display = 'none';
            showToast('Модель: ' + (modelLabels[window.__notepadModel] || ''));
        });
    });
    document.addEventListener('click', () => {
        const p = document.getElementById('model-picker');
        if (p) p.style.display = 'none';
    });
    refreshModelChip();

    // Mode toggle cycles dialog / code / note — updates tip text flavor
    const modeToggle = document.getElementById('mode-toggle');
    const modeLabel = document.getElementById('mode-label');
    const modes = [
        { id: 'dialog', label: 'Диалог' },
        { id: 'code', label: 'Код' },
        { id: 'note', label: 'Заметка' }
    ];
    let modeIdx = 0;
    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            modeIdx = (modeIdx + 1) % modes.length;
            window.__notepadAiMode = modes[modeIdx].id;
            if (modeLabel) modeLabel.textContent = modes[modeIdx].label;
            modeToggle.classList.toggle('agent-active', modes[modeIdx].id !== 'dialog');
            const tipText = document.getElementById('oracle-smart-tip-text');
            if (tipText && localStorage.getItem(TIP_KEY) !== '1') {
                if (modes[modeIdx].id === 'note') {
                    tipText.textContent = 'Core Node 2.6 стал умнее — хотите добавить заметку о будущих деталях? Просто напишите';
                } else if (modes[modeIdx].id === 'code') {
                    tipText.textContent = 'Intify 2.5.3 Flash · режим кода — опишите, что сгенерировать';
                } else {
                    tipText.textContent = TIP_VARIANTS[0];
                }
                document.getElementById('oracle-smart-tip')?.classList.remove('hidden');
            }
        });
    }

    // AI Studio
    function loadStudioProjects() {
        try { return JSON.parse(localStorage.getItem(STUDIO_KEY) || '[]') || []; }
        catch (e) { return []; }
    }
    function saveStudioProjects(list) {
        localStorage.setItem(STUDIO_KEY, JSON.stringify(list));
    }
    function renderAiStudio() {
        const list = document.getElementById('ai-studio-list');
        const hint = document.getElementById('studio-empty-hint');
        if (!list) return;
        const projects = loadStudioProjects();
        list.innerHTML = '';
        if (hint) hint.style.display = projects.length ? 'none' : 'block';
        projects.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'studio-card';
            card.innerHTML = `
                <div class="studio-card-title">${escapeHtml(p.title || 'AI Project')}</div>
                <div class="studio-card-meta">${escapeHtml(p.model || 'Intify 2.5.3 Flash')} · ${new Date(p.ts || Date.now()).toLocaleString('ru-RU')}</div>
                <div class="studio-card-actions">
                    <button type="button" class="primary" data-act="open" data-i="${i}">В редактор</button>
                    <button type="button" data-act="chat" data-i="${i}">В чат</button>
                    <button type="button" data-act="del" data-i="${i}">Удалить</button>
                </div>`;
            list.appendChild(card);
        });
        list.querySelectorAll('button[data-act]').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = Number(btn.dataset.i);
                const act = btn.dataset.act;
                const projects = loadStudioProjects();
                const p = projects[i];
                if (!p) return;
                if (act === 'del') {
                    projects.splice(i, 1);
                    saveStudioProjects(projects);
                    renderAiStudio();
                    showToast('Удалено из AI Studio');
                } else if (act === 'open') {
                    if (codeEditor) {
                        codeEditor.value = p.code || '';
                        handleAutoSaveInput();
                    }
                    document.getElementById('aiStudioModal').style.display = 'none';
                    document.querySelectorAll('.mobile-nav-item').forEach(el => {
                        el.classList.toggle('active', el.getAttribute('data-target') === 'panel-coding');
                    });
                    panels.forEach(panel => {
                        if (panel) panel.classList.toggle('mobile-active', panel.id === 'panel-coding');
                    });
                    showToast('Открыто в кодинге');
                } else if (act === 'chat') {
                    if (welcomeBlock) welcomeBlock.classList.add('hidden');
                    appendBubble(escapeHtml((p.title || '') + '\n' + (p.prompt || '')), 'user');
                    appendBubble(`<strong>AI Studio</strong><br>Проект «${escapeHtml(p.title || '')}» загружен в контекст.`, 'ai');
                    document.getElementById('aiStudioModal').style.display = 'none';
                }
            });
        });
    }
    function maybeOfferStudioSave(promptText) {
        // soft: auto-add draft to studio once per session after coding reply
        if (window.__studioAutoAdded) return;
        window.__studioAutoAdded = true;
        const list = loadStudioProjects();
        list.unshift({
            id: 'ai_' + Date.now(),
            title: 'Draft: ' + (promptText || 'code').slice(0, 40),
            prompt: promptText,
            code: '// generated draft\nconsole.log("Intify 2.5.3 Flash");\n',
            model: 'Intify 2.5.3 Flash',
            ts: Date.now()
        });
        saveStudioProjects(list.slice(0, 40));
    }
    document.getElementById('btn-open-ai-studio')?.addEventListener('click', () => {
        renderAiStudio();
        document.getElementById('aiStudioModal').style.display = 'flex';
    });
    document.getElementById('btn-close-ai-studio')?.addEventListener('click', () => {
        document.getElementById('aiStudioModal').style.display = 'none';
    });
    document.getElementById('btn-studio-new')?.addEventListener('click', () => {
        showInput('Новый AI-проект', 'Название:', 'Intify draft', (name) => {
            if (!name) return;
            const list = loadStudioProjects();
            list.unshift({
                id: 'ai_' + Date.now(),
                title: name,
                prompt: '',
                code: codeEditor ? codeEditor.value : '',
                model: modelLabels[window.__notepadModel] || 'Intify 2.5.3 Flash',
                ts: Date.now()
            });
            saveStudioProjects(list);
            renderAiStudio();
            showToast('Проект в AI Studio');
        });
    });


    // Live sync when Core Node updates localStorage (same origin)
    window.addEventListener('storage', (e) => {
        if (e.key === CORE_CHATS_KEY || e.key === CORE_CURRENT_KEY) {
            updateBridgeStatus();
            renderCoreChatHistory();
        }
    });
    // Also re-sync when drawer opens
    if (btnChatMenu) {
        btnChatMenu.addEventListener('click', () => {
            setTimeout(() => syncFromCoreNode(false), 50);
        });
    }


});


// ===== Shared pack with Core Node (same localStorage keys) =====
window.exportNotepadProjectsPack = function() {
    let projects = [];
    try { projects = JSON.parse(localStorage.getItem('oracle_projects_list') || '[]') || []; } catch(e) {}
    const pack = {
        version: 1,
        app: 'oracle-notepad',
        site: 'https://oracle-ai-pro.github.io/oracle-notepad',
        exportedAt: Date.now(),
        activeId: localStorage.getItem('oracle_active_project_id'),
        projects: projects.map(p => {
            let state = {};
            try { state = JSON.parse(localStorage.getItem('oracle_notepad_storage_' + p.id) || '{}') || {}; } catch(e) {}
            return { id: p.id, name: p.name || p.id, updatedAt: p.updatedAt || null, state };
        }),
        draft: localStorage.getItem('oracle_notepad_code') || ''
    };
    return pack;
};
window.downloadNotepadProjectsPack = function() {
    const pack = window.exportNotepadProjectsPack();
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'oracle-notepad-projects.json';
    a.click();
};
console.info('[Notepad] Shared keys with Core Node: oracle_projects_list, oracle_notepad_storage_*, oracle_active_project_id');


/* ===== Notepad: limits reform, JSON helper, right dock, chat menu ===== */
(function notepadProFeatures() {
    const TPL = {
        worldpack: `{
  "name": "MyWorld",
  "version": "1.0.0",
  "rooms": [
    { "id": "room_1", "name": "Room 1", "objects": [] }
  ],
  "meta": { "author": "", "created": "" }
}`,
        config: `{
  "theme": "dark",
  "autoSave": true,
  "locale": "ru-RU",
  "features": {
    "bridge": true,
    "aiStudio": true
  }
}`,
        package: `{
  "name": "my-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {}
}`,
        tsconfig: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "moduleResolution": "bundler"
  },
  "include": ["src"]
}`,
        manifest: `{
  "manifest_version": 3,
  "name": "Side Core Node",
  "version": "1.0.0",
  "description": "",
  "action": { "default_title": "Core Node" },
  "permissions": ["storage", "sidePanel"]
}`,
        html: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`
    };

    function openJsonHelper() {
        const m = document.getElementById('jsonHelperModal');
        if (m) m.style.display = 'flex';
    }
    function closeJsonHelper() {
        const m = document.getElementById('jsonHelperModal');
        if (m) m.style.display = 'none';
    }
    document.getElementById('btn-open-json-helper')?.addEventListener('click', openJsonHelper);
    document.getElementById('btn-close-json-helper')?.addEventListener('click', closeJsonHelper);
    document.getElementById('jsonHelperModal')?.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'jsonHelperModal') closeJsonHelper();
    });
    document.querySelectorAll('#jsonHelperModal .json-tpl-btn[data-tpl]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.tpl;
            const ed = document.getElementById('code-editor');
            if (!ed) return;
            if (id === 'format') {
                const raw = ed.value.trim();
                if (!raw) {
                    if (typeof showToast === 'function') showToast('Редактор пуст');
                    return;
                }
                try {
                    const obj = JSON.parse(raw);
                    ed.value = JSON.stringify(obj, null, 2);
                    if (typeof handleAutoSaveInput === 'function') handleAutoSaveInput();
                    if (typeof showToast === 'function') showToast('JSON валиден · отформатирован');
                } catch (err) {
                    if (typeof showAlert === 'function') {
                        showAlert(String(err.message || err), 'Ошибка JSON');
                    } else if (typeof showToast === 'function') {
                        showToast('JSON ошибка: ' + (err.message || err));
                    }
                }
                return;
            }
            const text = TPL[id];
            if (!text) return;
            if (ed.value.trim()) {
                if (typeof showConfirm === 'function') {
                    showConfirm('Заменить содержимое редактора шаблоном?', () => {
                        ed.value = text;
                        if (typeof handleAutoSaveInput === 'function') handleAutoSaveInput();
                        closeJsonHelper();
                        if (typeof showToast === 'function') showToast('Шаблон вставлен');
                    }, 'Шаблон');
                    return;
                }
            }
            ed.value = text;
            if (typeof handleAutoSaveInput === 'function') handleAutoSaveInput();
            closeJsonHelper();
            if (typeof showToast === 'function') showToast('Шаблон вставлен');
        });
    });

    // Limits reform
    function maybeShowLimitsReform() {
        if (localStorage.getItem('oracle_np_limits_reform_nov1') === '1') return;
        setTimeout(() => {
            if (localStorage.getItem('oracle_np_limits_reform_nov1') === '1') return;
            const m = document.getElementById('limits-reform-modal');
            if (m) m.style.display = 'flex';
        }, 2800);
    }
    document.getElementById('limits-reform-more-btn')?.addEventListener('click', () => {
        const more = document.getElementById('limits-reform-more');
        const btn = document.getElementById('limits-reform-more-btn');
        if (!more) return;
        if (more.hasAttribute('hidden')) {
            more.removeAttribute('hidden');
            if (btn) btn.textContent = 'Скрыть';
        } else {
            more.setAttribute('hidden', '');
            if (btn) btn.textContent = 'Подробнее';
        }
    });
    document.getElementById('limits-reform-accept')?.addEventListener('click', () => {
        localStorage.setItem('oracle_np_limits_reform_nov1', '1');
        const m = document.getElementById('limits-reform-modal');
        if (m) m.style.display = 'none';
        if (typeof showToast === 'function') showToast('Принято. Новые лимиты — с 1 ноября');
    });
    document.addEventListener('DOMContentLoaded', maybeShowLimitsReform);
    if (document.readyState !== 'loading') maybeShowLimitsReform();

    // Right panel dock
    const grid = document.querySelector('.grid-layout');
    const panelRight = document.getElementById('panel-oracle');
    const btnDockRight = document.getElementById('btn-dock-right');
    const dockRightIcon = document.getElementById('dock-right-icon');
    if (btnDockRight && grid && panelRight) {
        btnDockRight.addEventListener('click', () => {
            if (window.innerWidth < 1024) return;
            const on = grid.classList.toggle('right-docked');
            panelRight.classList.toggle('docked', on);
            if (dockRightIcon) dockRightIcon.textContent = on ? 'dock_to_left' : 'dock_to_right';
        });
    }

    // New Chat in drawer
    document.getElementById('btn-drawer-new-chat')?.addEventListener('click', () => {
        const welcome = document.getElementById('welcome-block');
        const flow = document.getElementById('chat-flow');
        if (flow) flow.innerHTML = '';
        if (welcome) welcome.classList.remove('hidden');
        document.getElementById('chatDrawer')?.classList.remove('active');
        document.getElementById('chatDrawerOverlay')?.classList.remove('active');
        setTimeout(() => {
            const o = document.getElementById('chatDrawerOverlay');
            if (o) o.style.display = 'none';
        }, 280);
        if (typeof showToast === 'function') showToast('Новый чат');
    });

    // Patch renderCoreChatHistory items with more menu — hook after definition via override
    const _origRender = window.renderCoreChatHistory;
})();

// Enhance AI send with thinking animation (patch after DOM ready)
document.addEventListener('DOMContentLoaded', () => {
    // chat item context via event delegation
    let _ctxSessionId = null;
    const ctxMenu = document.getElementById('chatCtxMenu');
    document.getElementById('chatHistoryList')?.addEventListener('click', (e) => {
        const more = e.target.closest('.chat-item-more');
        if (!more) return;
        e.stopPropagation();
        const item = more.closest('.chat-item');
        if (!item || !item.dataset.sessionId) return;
        _ctxSessionId = item.dataset.sessionId;
        if (!ctxMenu) return;
        const r = more.getBoundingClientRect();
        ctxMenu.style.left = Math.min(r.left, window.innerWidth - 180) + 'px';
        ctxMenu.style.top = (r.bottom + 4) + 'px';
        ctxMenu.classList.add('active');
    });
    document.addEventListener('click', () => ctxMenu?.classList.remove('active'));
    document.getElementById('chat-ctx-rename')?.addEventListener('click', () => {
        ctxMenu?.classList.remove('active');
        if (!_ctxSessionId) return;
        try {
            const raw = localStorage.getItem('oracle_chat_sessions');
            const chats = JSON.parse(raw || '{}');
            const s = chats[_ctxSessionId];
            if (!s) return;
            if (typeof showInput === 'function') {
                showInput('Переименовать чат', 'Название:', s.title || '', (name) => {
                    if (!name) return;
                    s.title = name;
                    localStorage.setItem('oracle_chat_sessions', JSON.stringify(chats));
                    if (typeof syncFromCoreNode === 'function') syncFromCoreNode(false);
                    else if (typeof renderCoreChatHistory === 'function') renderCoreChatHistory();
                    if (typeof showToast === 'function') showToast('Переименовано');
                });
            }
        } catch (e) {}
    });
    document.getElementById('chat-ctx-delete')?.addEventListener('click', () => {
        ctxMenu?.classList.remove('active');
        if (!_ctxSessionId) return;
        if (typeof showConfirm !== 'function') return;
        showConfirm('Удалить этот чат из Core Node history?', () => {
            try {
                const chats = JSON.parse(localStorage.getItem('oracle_chat_sessions') || '{}');
                delete chats[_ctxSessionId];
                localStorage.setItem('oracle_chat_sessions', JSON.stringify(chats));
                if (typeof syncFromCoreNode === 'function') syncFromCoreNode(false);
                if (typeof showToast === 'function') showToast('Чат удалён');
            } catch (e) {}
        }, 'Удаление чата');
    });
});

// Monkey-patch: add ⋮ to chat items when list is rendered
(function patchChatListRender() {
    const tryPatch = () => {
        const list = document.getElementById('chatHistoryList');
        if (!list) return;
        const obs = new MutationObserver(() => {
            list.querySelectorAll('.chat-item:not(.muted):not([data-ctx])').forEach(item => {
                if (!item.dataset.sessionId) return;
                item.dataset.ctx = '1';
                if (item.querySelector('.chat-item-more')) return;
                const btn = document.createElement('span');
                btn.className = 'material-symbols-rounded chat-item-more';
                btn.textContent = 'more_vert';
                btn.title = 'Действия';
                item.appendChild(btn);
            });
        });
        obs.observe(list, { childList: true, subtree: true });
    };
    document.addEventListener('DOMContentLoaded', tryPatch);
    if (document.readyState !== 'loading') tryPatch();
})();


/* ===== Notepad: rounded panels modal queue, limits gauges, accents ===== */
(function notepadLimitsAndRounded() {
  const ROUNDED_KEY = 'oracle_np_rounded_panels';
  const ROUNDED_SEEN = 'oracle_np_rounded_modal_seen';
  const ACCENT_KEY = 'oracle_np_accent';
  const LIMITS_KEY = 'oracle_np_limits_v1';
  const WINDOW_5H = 5 * 60 * 60 * 1000;
  const WINDOW_7D = 7 * 24 * 60 * 60 * 1000;

  const ACCENTS = {
    blue:   { primary: '#adc6ff', container: '#254487', secondary: '#e8bbf1' },
    purple: { primary: '#e8bbf1', container: '#5a3a6e', secondary: '#adc6ff' },
    cyan:   { primary: '#7dd3fc', container: '#0e4a6e', secondary: '#adc6ff' },
    green:  { primary: '#7dd3a8', container: '#1e4d3a', secondary: '#a8e6c3' },
    orange: { primary: '#ffb74d', container: '#6b3f12', secondary: '#ffcc80' },
    rose:   { primary: '#ff8a80', container: '#6b2220', secondary: '#ffb4ae' }
  };

  function isRoundedOn() {
    const v = localStorage.getItem(ROUNDED_KEY);
    return v === null || v === '1' || v === 'true';
  }
  function applyRoundedClass() {
    document.body.classList.toggle('np-flat-panels', !isRoundedOn());
    const t = document.getElementById('settings-rounded-panels');
    if (t) t.checked = isRoundedOn();
  }

  function applyAccent(name) {
    const a = ACCENTS[name] || ACCENTS.blue;
    localStorage.setItem(ACCENT_KEY, name);
    const root = document.documentElement;
    // dark / true-black keep custom; light uses darker primary
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
      // map light primary darker for contrast
      const lightMap = {
        blue: '#2b56c6', purple: '#7b3f8c', cyan: '#0277a8',
        green: '#1b7a4a', orange: '#c77700', rose: '#c62828'
      };
      root.style.setProperty('--primary', lightMap[name] || '#2b56c6');
      root.style.setProperty('--primary-container', a.primary + '55');
      root.style.setProperty('--secondary', a.secondary);
    } else {
      root.style.setProperty('--primary', a.primary);
      root.style.setProperty('--primary-container', a.container);
      root.style.setProperty('--secondary', a.secondary);
    }
    document.querySelectorAll('.accent-sw').forEach(b => {
      b.classList.toggle('active', b.dataset.accent === name);
    });
  }

  function loadLimits() {
    try { return JSON.parse(localStorage.getItem(LIMITS_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function saveLimits(s) {
    localStorage.setItem(LIMITS_KEY, JSON.stringify(s));
  }
  function pruneEvents(events, windowMs, now) {
    return (events || []).filter(e => now - e.t < windowMs);
  }
  function sumPct(events) {
    return (events || []).reduce((s, e) => s + (Number(e.p) || 0), 0);
  }
  function estimateCost(text) {
    const len = (text || '').trim().length;
    if (len <= 50) return 0.5;
    if (len <= 150) return 1;
    if (len <= 500) return 2;
    if (len <= 1500) return 5;
    if (len <= 4000) return 12;
    return 20;
  }
  function getLimitState() {
    const now = Date.now();
    let s = loadLimits();
    s.events5h = pruneEvents(s.events5h, WINDOW_5H, now);
    // weekly: if period started and expired, reset
    if (s.weekStart && now - s.weekStart >= WINDOW_7D) {
      s.events7d = [];
      s.weekStart = null;
    }
    s.events7d = pruneEvents(s.events7d, WINDOW_7D, now);
    const p5 = Math.min(100, sumPct(s.events5h));
    const p7 = Math.min(100, sumPct(s.events7d));
    saveLimits(s);
    return { s, p5, p7, now };
  }
  function formatRemain(ms) {
    if (ms <= 0) return 'сейчас';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h >= 24) return Math.floor(h / 24) + ' д ' + (h % 24) + ' ч';
    if (h > 0) return h + ' ч ' + m + ' мин';
    return m + ' мин';
  }
  function refreshLimitUI() {
    const { s, p5, p7, now } = getLimitState();
    const fill5 = document.getElementById('limit-5h-fill');
    const fill7 = document.getElementById('limit-7d-fill');
    const lab5 = document.getElementById('limit-5h-pct-label');
    const lab7 = document.getElementById('limit-7d-pct-label');
    const meta5 = document.getElementById('limit-5h-meta');
    const meta7 = document.getElementById('limit-7d-meta');
    if (fill5) {
      fill5.style.width = p5 + '%';
      fill5.classList.toggle('danger', p5 >= 90);
    }
    if (fill7) {
      fill7.style.width = p7 + '%';
      fill7.classList.toggle('danger', p7 >= 90);
    }
    if (lab5) lab5.textContent = Math.round(p5 * 10) / 10 + '%';
    if (lab7) lab7.textContent = Math.round(p7 * 10) / 10 + '%';
    if (meta5) {
      const oldest = (s.events5h || []).sort((a,b)=>a.t-b.t)[0];
      meta5.textContent = oldest
        ? ('Сброс части: через ' + formatRemain(WINDOW_5H - (now - oldest.t)))
        : 'Окно 5 часов свободно';
    }
    if (meta7) {
      if (s.weekStart) {
        meta7.textContent = 'Неделя до: через ' + formatRemain(WINDOW_7D - (now - s.weekStart));
      } else {
        meta7.textContent = 'Недельный период ещё не начат';
      }
    }
    const blocked = p5 >= 100 || p7 >= 100;
    const send = document.getElementById('send-btn');
    const input = document.getElementById('oracle-input');
    if (send) send.classList.toggle('limit-blocked', blocked);
    if (input) input.classList.toggle('limit-blocked', blocked);
    let banner = document.getElementById('limit-banner');
    if (!banner) {
      const wrap = document.querySelector('.glass-input-box-wrapper');
      if (wrap) {
        banner = document.createElement('div');
        banner.id = 'limit-banner';
        banner.className = 'limit-banner';
        wrap.insertBefore(banner, wrap.firstChild);
      }
    }
    if (banner) {
      if (p7 >= 100) {
        banner.textContent = 'Недельный лимит 100%. Core Node недоступен до следующего периода.';
        banner.classList.add('show');
      } else if (p5 >= 100) {
        banner.textContent = 'Лимит 5 часов исчерпан. Отправка недоступна до сброса.';
        banner.classList.add('show');
      } else {
        banner.classList.remove('show');
      }
    }
    return { blocked, p5, p7 };
  }
  window.npConsumeLimit = function(text, extraPct) {
    const cost = (typeof extraPct === 'number' ? extraPct : estimateCost(text));
    const now = Date.now();
    let s = loadLimits();
    s.events5h = pruneEvents(s.events5h, WINDOW_5H, now);
    s.events7d = s.events7d || [];
    if (!s.weekStart && cost >= 1) s.weekStart = now;
    if (s.weekStart && now - s.weekStart >= WINDOW_7D) {
      s.events7d = [];
      s.weekStart = cost >= 1 ? now : null;
    }
    s.events5h.push({ t: now, p: cost });
    s.events7d.push({ t: now, p: cost });
    saveLimits(s);
    return refreshLimitUI();
  };
  window.npCanSend = function() {
    const { p5, p7 } = getLimitState();
    return p5 < 100 && p7 < 100;
  };

  // Queue modals: whatsNew → limits reform (first) → rounded
  function anyModalOpen() {
    return Array.from(document.querySelectorAll('.migration-overlay')).some(el => {
      const d = el.style.display;
      return d && d !== 'none';
    });
  }
  function showRoundedModalIfNeeded() {
    if (localStorage.getItem(ROUNDED_SEEN) === '1') return;
    // auto-enable rounded by default and mark preference
    if (localStorage.getItem(ROUNDED_KEY) === null) {
      localStorage.setItem(ROUNDED_KEY, '1');
    }
    applyRoundedClass();
    const m = document.getElementById('rounded-panels-modal');
    if (!m) return;
    m.style.display = 'flex';
    localStorage.setItem(ROUNDED_SEEN, '1');
  }
  function tryShowRoundedWhenFree() {
    if (localStorage.getItem(ROUNDED_SEEN) === '1') return;
    if (anyModalOpen()) {
      setTimeout(tryShowRoundedWhenFree, 600);
      return;
    }
    showRoundedModalIfNeeded();
  }

  document.getElementById('rounded-panels-restart')?.addEventListener('click', () => {
    location.reload();
  });

  document.getElementById('btn-open-limits')?.addEventListener('click', () => {
    refreshLimitUI();
    const m = document.getElementById('limits-reform-modal');
    if (m) m.style.display = 'flex';
  });
  // Accept / close already exists — also refresh gauges when opening reform
  const _acc = document.getElementById('limits-reform-accept');
  if (_acc) {
    _acc.addEventListener('click', () => {
      localStorage.setItem('oracle_np_limits_reform_nov1', '1');
    });
  }

  // Settings toggle rounded — save + offer restart modal
  document.getElementById('settings-rounded-panels')?.addEventListener('change', (e) => {
    const on = !!e.target.checked;
    localStorage.setItem(ROUNDED_KEY, on ? '1' : '0');
    applyRoundedClass();
    // show restart-only modal
    const m = document.getElementById('rounded-panels-modal');
    if (m) {
      const p = m.querySelector('p');
      m.style.display = 'flex';
    }
    if (typeof showToast === 'function') {
      showToast(on ? 'Скругления вкл · нужен F5' : 'Скругления выкл · нужен F5');
    }
  });

  document.querySelectorAll('.accent-sw').forEach(btn => {
    btn.addEventListener('click', () => applyAccent(btn.dataset.accent));
  });

  // Patch send path
  function guardSend() {
    if (!window.npCanSend()) {
      refreshLimitUI();
      if (typeof showToast === 'function') showToast('Лимит исчерпан');
      return false;
    }
    return true;
  }
  // Wrap existing send if present after load
  const patchSend = () => {
    const btn = document.getElementById('send-btn');
    if (!btn || btn._npLimitPatched) return;
    btn._npLimitPatched = true;
    btn.addEventListener('click', function(e) {
      if (!guardSend()) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, true);
  };
  // Also consume on successful user messages via MutationObserver on chat flow? Better hook input Enter
  const input = document.getElementById('oracle-input');
  if (input && !input._npLimitKey) {
    input._npLimitKey = true;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (!guardSend()) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }, true);
  }
  // Consume when user bubble appears after send
  const flow = document.getElementById('chat-flow');
  if (flow) {
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1 && n.classList && n.classList.contains('user-bubble')) {
            const text = n.textContent || '';
            if (window.__npLastConsumed === text.slice(0, 80)) return;
            window.__npLastConsumed = text.slice(0, 80);
            window.npConsumeLimit(text);
          }
        });
      }
    });
    obs.observe(flow, { childList: true });
  }

  function boot() {
    applyRoundedClass();
    applyAccent(localStorage.getItem(ACCENT_KEY) || 'blue');
    refreshLimitUI();
    setTimeout(tryShowRoundedWhenFree, 3200);
    setInterval(refreshLimitUI, 30000);
    patchSend();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(patchSend, 800);

  /* accent re-apply handled by accentEngine */
})();



/* ===== Notepad UX pack: accents, plus menu, Intify-only, selection bar ===== */
(function notepadUxPack() {
  const MODEL_KEY = 'oracle_notepad_model';
  const PRIO_KEY = 'oracle_np_priority';
  const CONN_KEY = 'oracle_np_connector';
  const CODE_THEME_KEY = 'oracle_np_code_hacker';
  const modelLabels = {
    'intify-auto': 'Intify Auto',
    'intify-2.5.3-coding': 'Intify 2.5.3 Coding',
    'intify-2.5.3-flash': 'Intify 2.5.3 Flash'
  };
  const prioLabels = { low: 'Низкий', medium: 'Средний', high: 'Высокий' };
  const connLabels = { plan: '@plan', keep: '@keep', code: '@code' };

  // Migrate old models
  let model = localStorage.getItem(MODEL_KEY) || 'intify-auto';
  if (model === 'oracle-main' || model === 'worldpack' || model === 'intify-2.5.3-flash' && false) {}
  if (model === 'oracle-main' || model === 'worldpack') {
    model = 'intify-auto';
    localStorage.setItem(MODEL_KEY, model);
  }
  window.__notepadModel = model;
  window.__notepadPriority = localStorage.getItem(PRIO_KEY) || 'medium';
  window.__notepadConnector = localStorage.getItem(CONN_KEY) || '';

  function refreshTags() {
    const tm = document.getElementById('tag-model');
    const tp = document.getElementById('tag-priority');
    const tc = document.getElementById('tag-connector');
    if (tm) tm.textContent = modelLabels[window.__notepadModel] || 'Intify Auto';
    if (tp) tp.textContent = prioLabels[window.__notepadPriority] || 'Средний';
    if (tc) {
      if (window.__notepadConnector) {
        tc.style.display = '';
        tc.textContent = connLabels[window.__notepadConnector] || window.__notepadConnector;
      } else tc.style.display = 'none';
    }
    const input = document.getElementById('oracle-input');
    if (input) input.placeholder = 'Спросить...';
  }

  // Enhanced accent: also tint bg / buttons
  const ACCENTS = {
    bw:     { primary: '#e8e8e8', container: '#2a2a2a', secondary: '#b0b0b0', bgDark: '#050505', bgLight: '#f5f5f5' },
    blue:   { primary: '#adc6ff', container: '#254487', secondary: '#e8bbf1', bgDark: '#05070f', bgLight: '#f0f3ff' },
    purple: { primary: '#e8bbf1', container: '#5a3a6e', secondary: '#adc6ff', bgDark: '#0a0610', bgLight: '#faf0ff' },
    cyan:   { primary: '#7dd3fc', container: '#0e4a6e', secondary: '#adc6ff', bgDark: '#041016', bgLight: '#eef9ff' },
    green:  { primary: '#7dd3a8', container: '#1e4d3a', secondary: '#a8e6c3', bgDark: '#050f0a', bgLight: '#eefaf3' },
    orange: { primary: '#ffb74d', container: '#6b3f12', secondary: '#ffcc80', bgDark: '#120c05', bgLight: '#fff6eb' },
    rose:   { primary: '#ff8a80', container: '#6b2220', secondary: '#ffb4ae', bgDark: '#120608', bgLight: '#fff0f0' }
  };
  /* UX pack accent stub — real engine is accentEngine below */
  // handlers via event delegation in accentEngine

  // Rounded: DIFFERENT restart-only modal
  const roundedToggle = document.getElementById('settings-rounded-panels');
  if (roundedToggle && !roundedToggle.dataset.wired) {
    roundedToggle.dataset.wired = '1';
    roundedToggle.addEventListener('change', (e) => {
      const on = !!e.target.checked;
      localStorage.setItem('oracle_np_rounded_panels', on ? '1' : '0');
      document.body.classList.toggle('np-flat-panels', !on);
      const m = document.getElementById('rounded-restart-modal');
      if (m) m.style.display = 'flex';
    });
  }
  document.getElementById('rounded-restart-only-btn')?.addEventListener('click', () => location.reload());
  // also wire old restart btn if present
  document.getElementById('rounded-panels-restart')?.addEventListener('click', () => location.reload());

  // Plus menu
  const plusMenu = document.getElementById('np-plus-menu');
  const btnAttach = document.getElementById('btn-attach');
  function closePlus() { if (plusMenu) plusMenu.style.display = 'none'; }
  if (btnAttach) {
    btnAttach.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!plusMenu) return;
      plusMenu.style.display = plusMenu.style.display === 'none' ? 'flex' : 'none';
    });
  }
  document.addEventListener('click', (e) => {
    if (!plusMenu) return;
    if (!e.target.closest('.plus-wrap')) closePlus();
  });
  plusMenu?.addEventListener('click', (e) => {
    const item = e.target.closest('.plus-item');
    if (!item) return;
    e.stopPropagation();
    if (item.dataset.act === 'attach-file') {
      document.getElementById('attach-file-input')?.click();
    } else if (item.dataset.act === 'select-code') {
      enterSelectCodeMode();
    } else if (item.dataset.act === 'from-notes') {
      const notes = document.getElementById('notes-editor');
      const text = (notes && notes.innerText) ? notes.innerText.trim() : '';
      const input = document.getElementById('oracle-input');
      if (!text) {
        if (typeof showToast === 'function') showToast('Заметки пусты');
      } else if (input) {
        input.value = (input.value ? input.value + '\n' : '') + text.slice(0, 8000);
        input.dispatchEvent(new Event('input'));
        if (typeof showToast === 'function') showToast('Текст из Заметок');
      }
    } else if (item.dataset.model) {
      window.__notepadModel = item.dataset.model;
      localStorage.setItem(MODEL_KEY, window.__notepadModel);
      refreshTags();
      if (typeof showToast === 'function') showToast('Модель: ' + (modelLabels[window.__notepadModel] || ''));
    } else if (item.dataset.priority) {
      window.__notepadPriority = item.dataset.priority;
      localStorage.setItem(PRIO_KEY, window.__notepadPriority);
      refreshTags();
      if (typeof showToast === 'function') showToast('Приоритет: ' + prioLabels[window.__notepadPriority]);
    } else if (item.dataset.conn) {
      window.__notepadConnector = item.dataset.conn;
      localStorage.setItem(CONN_KEY, window.__notepadConnector);
      // sync mode toggle if present
      const modeLabel = document.getElementById('mode-label');
      if (modeLabel) {
        modeLabel.textContent = item.dataset.conn === 'code' ? 'Код' : item.dataset.conn === 'keep' ? 'Заметка' : 'Диалог';
      }
      refreshTags();
    }
    closePlus();
  });

  // Empty chat center
  function syncChatEmpty() {
    const view = document.getElementById('view-ai');
    const flow = document.getElementById('chat-flow');
    if (!view) return;
    const hasMsg = flow && flow.querySelector('.chat-bubble');
    view.classList.toggle('chat-empty', !hasMsg);
  }
  const flowEl = document.getElementById('chat-flow');
  if (flowEl) {
    new MutationObserver(syncChatEmpty).observe(flowEl, { childList: true });
  }
  syncChatEmpty();

  // Code theme
  function applyCodeTheme() {
    const hacker = localStorage.getItem(CODE_THEME_KEY);
    const on = hacker === null || hacker === '1';
    document.body.classList.toggle('code-theme-hacker', on);
    document.body.classList.toggle('code-theme-plain', !on);
    const t = document.getElementById('settings-code-theme');
    if (t && t.checked !== on) t.checked = on;
  }
  document.getElementById('settings-code-theme')?.addEventListener('change', (e) => {
    localStorage.setItem(CODE_THEME_KEY, e.target.checked ? '1' : '0');
    applyCodeTheme();
  });
  applyCodeTheme();

  // Selection toolbar
  let selectMode = false;
  let lastSel = '';
  function enterSelectCodeMode() {
    selectMode = true;
    document.body.classList.add('select-code-mode');
    const ban = document.getElementById('code-select-mode-banner');
    if (ban) ban.style.display = 'flex';
    // switch to coding panel on mobile
    document.querySelectorAll('.mobile-nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-target') === 'panel-coding');
    });
    document.querySelectorAll('#panel-info,#panel-coding,#panel-oracle').forEach(p => {
      if (p) p.classList.toggle('mobile-active', p.id === 'panel-coding');
    });
    if (typeof showToast === 'function') showToast('Выделите код в редакторе');
  }
  function exitSelectCodeMode() {
    selectMode = false;
    document.body.classList.remove('select-code-mode');
    const ban = document.getElementById('code-select-mode-banner');
    if (ban) ban.style.display = 'none';
    hideSelBar();
  }
  document.getElementById('code-select-exit')?.addEventListener('click', exitSelectCodeMode);

  const selBar = document.getElementById('code-sel-bar');
  function hideSelBar() { if (selBar) selBar.style.display = 'none'; }
  function showSelBar(x, y) {
    if (!selBar) return;
    selBar.style.display = 'flex';
    const left = Math.min(Math.max(8, x), window.innerWidth - 280);
    const top = Math.min(Math.max(8, y), window.innerHeight - 60);
    selBar.style.left = left + 'px';
    selBar.style.top = top + 'px';
  }
  function onSelectionChange(ev) {
    const ed = document.getElementById('code-editor');
    // ONLY coding area
    if (!ed) { hideSelBar(); return; }
    const activeOk = document.activeElement === ed || (ev && ed.contains && ed.contains(ev.target));
    if (!activeOk && !selectMode) {
      // ignore selections outside coding panel
      if (ev && ev.target && !ed.contains(ev.target) && ev.target !== ed) {
        hideSelBar();
        return;
      }
    }
    if (document.activeElement !== ed && !selectMode) {
      hideSelBar();
      return;
    }
    const taText = ed.value.substring(ed.selectionStart || 0, ed.selectionEnd || 0).trim();
    if (taText.length < 2) {
      hideSelBar();
      return;
    }
    lastSel = taText;
    const rect = ed.getBoundingClientRect();
    // approximate caret position near selection end
    const x = Math.min(rect.left + 40, window.innerWidth - 280);
    const y = Math.min(rect.top + 40, window.innerHeight - 70);
    showSelBar(x, y);
  }
  const codeEd = document.getElementById('code-editor');
  if (codeEd) {
    codeEd.addEventListener('mouseup', onSelectionChange);
    codeEd.addEventListener('keyup', onSelectionChange);
    codeEd.addEventListener('select', onSelectionChange);
  }
  // Do NOT bind document-level selection for sel bar

  document.getElementById('sel-send-core')?.addEventListener('click', () => {
    const input = document.getElementById('oracle-input');
    if (!lastSel || !input) return;
    input.value = (input.value ? input.value + '\n\n' : '') + '```\n' + lastSel + '\n```';
    input.dispatchEvent(new Event('input'));
    exitSelectCodeMode();
    // open Core Node panel
    document.querySelectorAll('.mobile-nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-target') === 'panel-oracle');
    });
    document.querySelectorAll('#panel-info,#panel-coding,#panel-oracle').forEach(p => {
      if (p) p.classList.toggle('mobile-active', p.id === 'panel-oracle');
    });
    if (typeof showToast === 'function') showToast('Отрезок в поле Core Node');
  });
  document.getElementById('sel-save-keeps')?.addEventListener('click', () => {
    const notes = document.getElementById('notes-editor');
    if (!lastSel || !notes) return;
    notes.innerHTML = (notes.innerHTML ? notes.innerHTML + '<br><br>' : '') +
      '<pre>' + lastSel.replace(/</g,'&lt;') + '</pre>';
    exitSelectCodeMode();
    if (typeof showToast === 'function') showToast('Сохранено в Keeps');
  });
  document.getElementById('sel-cancel')?.addEventListener('click', () => {
    hideSelBar();
    exitSelectCodeMode();
  });

  // Limit cost by model/priority for coding
  const _oldConsume = window.npConsumeLimit;
  window.npConsumeLimit = function(text, extraPct) {
    let cost = typeof extraPct === 'number' ? extraPct : null;
    if (cost == null) {
      const len = (text || '').length;
      cost = len <= 50 ? 0.5 : len <= 150 ? 1 : len <= 500 ? 2 : 5;
      const isCode = window.__notepadConnector === 'code' || window.__notepadModel === 'intify-2.5.3-coding' || /```/.test(text || '');
      if (isCode) {
        if (window.__notepadModel === 'intify-2.5.3-coding') cost = Math.max(cost, 30);
        else if (window.__notepadModel === 'intify-2.5.3-flash') cost = Math.max(cost, Math.min(50, cost * 8));
        else cost = Math.max(cost, 20);
      }
      if (window.__notepadPriority === 'high') cost = Math.min(80, cost * 1.5);
      if (window.__notepadPriority === 'low') cost = Math.min(cost, 5);
    }
    if (typeof _oldConsume === 'function') return _oldConsume(text, cost);
  };

  // boot accents
  function boot() {
    refreshTags();
    syncChatEmpty();
    const chip = document.getElementById('model-chip');
    if (chip) chip.style.display = 'none';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

(function fixPlusMenuHard() {
  const btn = document.getElementById('btn-attach');
  const menu = document.getElementById('np-plus-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const open = menu.style.display === 'flex';
    menu.style.display = open ? 'none' : 'flex';
  }, true);
})();

(function studioPolish() {
  document.getElementById('btn-studio-from-editor')?.addEventListener('click', () => {
    const ed = document.getElementById('code-editor');
    const code = ed ? ed.value : '';
    if (!code.trim()) {
      if (typeof showToast === 'function') showToast('Редактор пуст');
      return;
    }
    const name = 'Editor ' + new Date().toLocaleString('ru-RU');
    try {
      const list = JSON.parse(localStorage.getItem('oracle_notepad_ai_studio') || '[]') || [];
      list.unshift({
        id: 'ai_' + Date.now(),
        title: name,
        prompt: '',
        code: code,
        model: 'Intify',
        ts: Date.now()
      });
      localStorage.setItem('oracle_notepad_ai_studio', JSON.stringify(list.slice(0, 40)));
      if (typeof showToast === 'function') showToast('Сохранено в AI Studio');
      document.getElementById('btn-open-ai-studio')?.click();
    } catch (e) {}
  });
})();


/* ===== Accent colors that actually work (dark + light + BW) ===== */
(function accentEngine() {
  const KEY = 'oracle_np_accent';
  const PALETTE = {
    bw: {
      dark:  { primary: '#f0f0f0', container: '#ffffff', secondary: '#c8c8c8', bg: '#050505', surface: '#121212', on: '#ffffff', btnText: '#111111' },
      light: { primary: '#4a4a4a', container: '#6a6a6a', secondary: '#888888', bg: '#fafafa', surface: '#ffffff', on: '#1a1a1a', btnText: '#ffffff' },
      tb:    { primary: '#ffffff', container: '#ffffff', secondary: '#d0d0d0', bg: '#000000', surface: '#0a0a0a', on: '#ffffff', btnText: '#111111' }
    },
    blue: {
      dark:  { primary: '#adc6ff', container: '#254487', secondary: '#e8bbf1', bg: '#05070f', surface: '#14151f', on: '#e3e2e6', btnText: '#ffffff' },
      light: { primary: '#8eb4ff', container: '#b6ceff', secondary: '#e0b8f0', bg: '#f7f9ff', surface: '#ffffff', on: '#1a1b26', btnText: '#1a2744' },
      tb:    { primary: '#adc6ff', container: '#1a2744', secondary: '#e8bbf1', bg: '#000000', surface: '#0a0a0a', on: '#ffffff', btnText: '#ffffff' }
    },
    purple: {
      dark:  { primary: '#e8bbf1', container: '#5a3a6e', secondary: '#adc6ff', bg: '#0a0610', surface: '#16121c', on: '#f0e6f5', btnText: '#ffffff' },
      light: { primary: '#d4a0e0', container: '#e8c8f0', secondary: '#b6ceff', bg: '#fdf8ff', surface: '#ffffff', on: '#1a1b26', btnText: '#4a2a58' },
      tb:    { primary: '#e8bbf1', container: '#3a2048', secondary: '#adc6ff', bg: '#000000', surface: '#0a0a0a', on: '#ffffff', btnText: '#ffffff' }
    },
    cyan: {
      dark:  { primary: '#7dd3fc', container: '#0e4a6e', secondary: '#adc6ff', bg: '#041016', surface: '#0f1820', on: '#e6f4fa', btnText: '#ffffff' },
      light: { primary: '#7dd3fc', container: '#b3e7fd', secondary: '#8eb4ff', bg: '#f5fcff', surface: '#ffffff', on: '#1a1b26', btnText: '#0a3a50' },
      tb:    { primary: '#7dd3fc', container: '#0a3048', secondary: '#adc6ff', bg: '#000000', surface: '#0a0a0a', on: '#ffffff', btnText: '#ffffff' }
    },
    green: {
      dark:  { primary: '#7dd3a8', container: '#1e4d3a', secondary: '#a8e6c3', bg: '#050f0a', surface: '#101a14', on: '#e6f5ec', btnText: '#ffffff' },
      light: { primary: '#7dd3a8', container: '#b3e8cc', secondary: '#8eb4ff', bg: '#f5fcf8', surface: '#ffffff', on: '#1a1b26', btnText: '#145038' },
      tb:    { primary: '#7dd3a8', container: '#143828', secondary: '#a8e6c3', bg: '#000000', surface: '#0a0a0a', on: '#ffffff', btnText: '#ffffff' }
    },
    orange: {
      dark:  { primary: '#ffb74d', container: '#6b3f12', secondary: '#ffcc80', bg: '#120c05', surface: '#1c1610', on: '#fff3e0', btnText: '#ffffff' },
      light: { primary: '#ffb74d', container: '#ffd399', secondary: '#ffcc80', bg: '#fffaf3', surface: '#ffffff', on: '#1a1b26', btnText: '#5a3a10' },
      tb:    { primary: '#ffb74d', container: '#4a2e0c', secondary: '#ffcc80', bg: '#000000', surface: '#0a0a0a', on: '#ffffff', btnText: '#ffffff' }
    },
    rose: {
      dark:  { primary: '#ff8a80', container: '#6b2220', secondary: '#ffb4ae', bg: '#120608', surface: '#1c1012', on: '#ffe8e6', btnText: '#ffffff' },
      light: { primary: '#ff8a80', container: '#ffb3ac', secondary: '#ffb4ae', bg: '#fff7f6', surface: '#ffffff', on: '#1a1b26', btnText: '#5a2020' },
      tb:    { primary: '#ff8a80', container: '#4a1816', secondary: '#ffb4ae', bg: '#000000', surface: '#0a0a0a', on: '#ffffff', btnText: '#ffffff' }
    }
  };

  function modeKey() {
    if (document.body.classList.contains('light-theme')) return 'light';
    if (document.body.classList.contains('true-black-theme')) return 'tb';
    return 'dark';
  }

  window.npApplyAccentFull = function(name) {
    if (!PALETTE[name]) name = 'blue';
    localStorage.setItem(KEY, name);
    const mode = modeKey();
    const p = PALETTE[name][mode];
    const root = document.documentElement;
    const body = document.body;

    // set on both html and body so theme CSS cannot fully hide them
    [root, body].forEach(el => {
      el.style.setProperty('--primary', p.primary, 'important');
      el.style.setProperty('--primary-container', p.container, 'important');
      el.style.setProperty('--secondary', p.secondary, 'important');
      el.style.setProperty('--bg', p.bg, 'important');
      el.style.setProperty('--surface', p.surface, 'important');
      el.style.setProperty('--on-surface', p.on, 'important');
      el.style.setProperty('--btn-on-primary', p.btnText, 'important');
    });

    if (!body.classList.contains('accent-tinted')) body.classList.add('accent-tinted');
    if (name === 'bw') {
      if (!body.classList.contains('accent-bw')) body.classList.add('accent-bw');
    } else if (body.classList.contains('accent-bw')) {
      body.classList.remove('accent-bw');
    }
    if (body.dataset.accent !== name) body.dataset.accent = name;

    document.querySelectorAll('.accent-sw').forEach(b => {
      b.classList.toggle('active', b.dataset.accent === name);
    });
  };

  // single delegated click for swatches (works even if nodes re-rendered)
  document.addEventListener('click', (e) => {
    const sw = e.target.closest && e.target.closest('.accent-sw');
    if (!sw) return;
    e.preventDefault();
    window.npApplyAccentFull(sw.dataset.accent || 'blue');
    if (typeof showToast === 'function') {
      const labels = { bw: 'Ч/Б', blue: 'Синий', purple: 'Фиолетовый', cyan: 'Cyan', green: 'Зелёный', orange: 'Оранжевый', rose: 'Розовый' };
      showToast('Акцент: ' + (labels[sw.dataset.accent] || sw.dataset.accent));
    }
  });

  let _applying = false;
  let _lastSig = '';

  const _origApply = window.npApplyAccentFull;
  window.npApplyAccentFull = function(name) {
    if (_applying) return;
    if (!PALETTE[name]) name = 'blue';
    const mode = modeKey();
    const sig = name + '|' + mode;
    if (sig === _lastSig) return;
    _applying = true;
    try {
      _origApply(name);
      _lastSig = sig;
    } finally {
      // release after style settles
      setTimeout(() => { _applying = false; }, 0);
    }
  };

  function bootAccent() {
    _lastSig = ''; // force once
    window.npApplyAccentFull(localStorage.getItem(KEY) || 'blue');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootAccent);
  else bootAccent();

  // re-apply ONLY on theme class changes, not accent-tinted toggles
  let _themeWatch = modeKey();
  const mo = new MutationObserver(() => {
    if (_applying) return;
    const t = modeKey();
    if (t === _themeWatch) return;
    _themeWatch = t;
    _lastSig = '';
    window.npApplyAccentFull(localStorage.getItem(KEY) || 'blue');
  });
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();

/* ===== Import pack / file — clickable ===== */
(function importPackWire() {
  function doImport(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const name = file.name || 'import';
      const lower = name.toLowerCase();
      try {
        if (lower.endsWith('.json') || lower.endsWith('.worldpack')) {
          const data = JSON.parse(text);
          // project pack from Notepad export
          if (data && data.projects && Array.isArray(data.projects)) {
            let projects = [];
            try { projects = JSON.parse(localStorage.getItem('oracle_projects_list') || '[]') || []; } catch(e) {}
            data.projects.forEach(p => {
              const id = p.id || ('imp_' + Date.now() + Math.random().toString(36).slice(2,6));
              if (!projects.find(x => x.id === id)) projects.push({ id, name: p.name || id });
              if (p.state) localStorage.setItem('oracle_notepad_storage_' + id, JSON.stringify(p.state));
            });
            localStorage.setItem('oracle_projects_list', JSON.stringify(projects));
            if (typeof showToast === 'function') showToast('Пак проектов загружен');
            if (typeof renderProjectsList === 'function') renderProjectsList();
            return;
          }
          // single project state
          if (data && (data.code != null || data.notes != null || data.worlds)) {
            const ed = document.getElementById('code-editor');
            if (ed && data.code != null) ed.value = data.code;
            if (data.notes && document.getElementById('notes-editor')) {
              document.getElementById('notes-editor').innerHTML = data.notes;
            }
            if (typeof handleAutoSaveInput === 'function') handleAutoSaveInput();
            if (typeof showToast === 'function') showToast('Состояние из JSON');
            return;
          }
          // generic JSON → editor
          const ed = document.getElementById('code-editor');
          if (ed) {
            ed.value = JSON.stringify(data, null, 2);
            if (typeof handleAutoSaveInput === 'function') handleAutoSaveInput();
            if (typeof showToast === 'function') showToast('JSON в редактор: ' + name);
          }
          return;
        }
        // plain text / code files
        const ed = document.getElementById('code-editor');
        if (ed) {
          ed.value = text;
          if (typeof handleAutoSaveInput === 'function') handleAutoSaveInput();
          if (typeof showToast === 'function') showToast('Файл: ' + name);
          // mobile → coding tab
          document.querySelectorAll('.mobile-nav-item').forEach(el => {
            el.classList.toggle('active', el.getAttribute('data-target') === 'panel-coding');
          });
          document.querySelectorAll('#panel-info,#panel-coding,#panel-oracle').forEach(p => {
            if (p) p.classList.toggle('mobile-active', p.id === 'panel-coding');
          });
        }
      } catch (err) {
        // not JSON — still dump text
        const ed = document.getElementById('code-editor');
        if (ed) {
          ed.value = text;
          if (typeof handleAutoSaveInput === 'function') handleAutoSaveInput();
          if (typeof showToast === 'function') showToast('Файл: ' + name);
        } else if (typeof showAlert === 'function') {
          showAlert(String(err.message || err), 'Ошибка импорта');
        }
      }
    };
    reader.onerror = () => {
      if (typeof showAlert === 'function') showAlert('Не удалось прочитать файл');
    };
    reader.readAsText(file);
  }

  function wire() {
    const btn = document.getElementById('btn-import-pack');
    let input = document.getElementById('import-pack-input');
    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.id = 'import-pack-input';
      input.accept = '.json,.worldpack,.txt,.js,.css,.html,.md,application/json,text/plain';
      input.style.display = 'none';
      document.body.appendChild(input);
    }
    if (btn && !btn._importWired) {
      btn._importWired = true;
      btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        input.click();
      });
    }
    if (input && !input._importWired) {
      input._importWired = true;
      input.addEventListener('change', () => {
        const f = input.files && input.files[0];
        if (f) doImport(f);
        input.value = '';
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
  setTimeout(wire, 300);
})();


/* ===== Custom selects, @ connector, remove mode toggle ===== */
(function notepadSelectsAndAt() {
  const MODEL_KEY = 'oracle_notepad_model';
  const PRIO_KEY = 'oracle_np_priority';
  const CONN_KEY = 'oracle_np_connector';
  const modelLabels = {
    'intify-auto': 'Intify Auto',
    'intify-2.5.3-coding': 'Intify Coding',
    'intify-2.5.3-flash': 'Intify Flash'
  };
  const prioLabels = { low: 'Низкий', medium: 'Средний', high: 'Высокий' };
  const connLabels = { plan: '@plan', keep: '@keep', code: '@code' };

  window.__notepadModel = localStorage.getItem(MODEL_KEY) || 'intify-auto';
  if (window.__notepadModel === 'oracle-main' || window.__notepadModel === 'worldpack') {
    window.__notepadModel = 'intify-auto';
  }
  window.__notepadPriority = localStorage.getItem(PRIO_KEY) || 'medium';
  window.__notepadConnector = localStorage.getItem(CONN_KEY) || '';

  function syncUI() {
    const tm = document.getElementById('tag-model');
    const tp = document.getElementById('tag-priority');
    const sm = document.getElementById('select-model');
    const sp = document.getElementById('select-priority');
    if (tm) tm.textContent = modelLabels[window.__notepadModel] || 'Intify Auto';
    if (tp) tp.textContent = prioLabels[window.__notepadPriority] || 'Средний';
    if (sm) sm.dataset.value = window.__notepadModel;
    if (sp) sp.dataset.value = window.__notepadPriority;
    const chip = document.getElementById('tag-connector');
    const lab = document.getElementById('tag-connector-label');
    if (chip && lab) {
      if (window.__notepadConnector) {
        chip.style.display = 'inline-flex';
        lab.textContent = connLabels[window.__notepadConnector] || ('@' + window.__notepadConnector);
      } else {
        chip.style.display = 'none';
      }
    }
  }

  function closeAllMenus() {
    document.querySelectorAll('.cn-select-menu').forEach(m => m.hidden = true);
  }

  function wireSelect(rootId, menuId, onPick) {
    const root = document.getElementById(rootId);
    const menu = document.getElementById(menuId);
    const btn = root && root.querySelector('.cn-select-btn');
    if (!root || !menu || !btn || btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wasOpen = !menu.hidden;
      closeAllMenus();
      if (!wasOpen) menu.hidden = false;
    });
    menu.querySelectorAll('button[data-value]').forEach(b => {
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        onPick(b.dataset.value);
        menu.hidden = true;
        syncUI();
      });
    });
  }

  wireSelect('select-model', 'select-model-menu', (v) => {
    window.__notepadModel = v;
    localStorage.setItem(MODEL_KEY, v);
    if (typeof showToast === 'function') showToast('Агент: ' + (modelLabels[v] || v));
  });
  wireSelect('select-priority', 'select-priority-menu', (v) => {
    window.__notepadPriority = v;
    localStorage.setItem(PRIO_KEY, v);
    if (typeof showToast === 'function') showToast('Приоритет: ' + (prioLabels[v] || v));
  });

  document.addEventListener('click', () => closeAllMenus());

  // Connector X
  document.getElementById('tag-connector-x')?.addEventListener('click', (e) => {
    e.stopPropagation();
    window.__notepadConnector = '';
    localStorage.setItem(CONN_KEY, '');
    syncUI();
    if (typeof showToast === 'function') showToast('Коннектор снят');
  });

  // @ popup on input
  const input = document.getElementById('oracle-input');
  const popup = document.getElementById('at-connector-popup');
  function hideAt() { if (popup) popup.style.display = 'none'; }
  function showAt() { if (popup) popup.style.display = 'flex'; }

  if (input) {
    input.addEventListener('input', () => {
      const v = input.value;
      const caret = input.selectionStart || v.length;
      const before = v.slice(0, caret);
      // show when last token is lone @
      if (/(^|[\s])@$/.test(before)) showAt();
      else hideAt();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideAt();
    });
  }
  popup?.querySelectorAll('button[data-conn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = btn.dataset.conn;
      window.__notepadConnector = c;
      localStorage.setItem(CONN_KEY, c);
      // strip trailing @
      if (input) {
        const caret = input.selectionStart || input.value.length;
        const before = input.value.slice(0, caret).replace(/@$/, '');
        const after = input.value.slice(caret);
        input.value = before + after;
        input.focus();
        const pos = before.length;
        input.setSelectionRange(pos, pos);
        input.dispatchEvent(new Event('input'));
      }
      hideAt();
      syncUI();
      if (typeof showToast === 'function') showToast('Коннектор ' + (connLabels[c] || c));
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#at-connector-popup') && !e.target.closest('#oracle-input')) hideAt();
  });

  // Hide mode toggle if residual
  const mt = document.getElementById('mode-toggle');
  if (mt) mt.style.display = 'none';

  function boot() { syncUI(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

(function killHints() {
  const h = document.getElementById('toggle-hints');
  if (h) h.remove();
  const mt = document.getElementById('mode-toggle');
  if (mt) mt.remove();
})();
