// =========================================
// MÓDULO DE INTERFAZ DE USUARIO (UI)
// =========================================

export const DOM = {
    todoList: document.getElementById('todoList'),
    doingList: document.getElementById('doingList'),
    doneList: document.getElementById('doneList'),
    statTotal: document.getElementById('statTotal'),
    statTodo: document.getElementById('statTodo'),
    statDoing: document.getElementById('statDoing'),
    statDone: document.getElementById('statDone'),
    countTodo: document.getElementById('countTodo'),
    countDoing: document.getElementById('countDoing'),
    countDone: document.getElementById('countDone'),
    createModal: document.getElementById('createModal'),
    detailModal: document.getElementById('detailModal'),
    createTaskForm: document.getElementById('createTaskForm'),
    commentsList: document.getElementById('commentsList')
};

// =========================================
// GESTIÓN DE MODALES
// =========================================
export function openModal(modal) {
    if (modal) modal.classList.add('active');
}

export function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        if (modal === DOM.createModal) {
            DOM.createTaskForm.reset();
        }
    }
}

// =========================================
// RENDERIZADO DEL TABLERO Y ESTADÍSTICAS
// =========================================
export function renderBoard(tasks, onCardClick) {
    DOM.todoList.innerHTML = '';
    DOM.doingList.innerHTML = '';
    DOM.doneList.innerHTML = '';

    let countT = 0, countD = 0, countDn = 0;

    tasks.forEach(task => {
        const cardElement = createTaskCardElement(task, onCardClick);

        if (task.status === 'todo') {
            DOM.todoList.appendChild(cardElement);
            countT++;
        } else if (task.status === 'doing') {
            DOM.doingList.appendChild(cardElement);
            countD++;
        } else if (task.status === 'done') {
            DOM.doneList.appendChild(cardElement);
            countDn++;
        }
    });

    DOM.countTodo.textContent = countT;
    DOM.countDoing.textContent = countD;
    DOM.countDone.textContent = countDn;

    DOM.statTodo.textContent = countT;
    DOM.statDoing.textContent = countD;
    DOM.statDone.textContent = countDn;
    DOM.statTotal.textContent = tasks.length;
}

function createTaskCardElement(task, onCardClick) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.dataset.id = task.id;

    const priorityClass = `badge-${(task.priority || 'media').toLowerCase()}`;

    card.innerHTML = `
        <div class="task-header-row">
            <h4>${escapeHTML(task.title)}</h4>
            <span class="task-badge ${priorityClass}">${task.priority}</span>
        </div>
        <p>${escapeHTML(task.description || 'Sin descripción')}</p>
        <div class="task-footer-row">
            <span class="task-due-date"><i class="fa-regular fa-calendar"></i> ${task.dueDate || 'Sin fecha'}</span>
        </div>
    `;

    card.addEventListener('click', () => onCardClick(task.id));

    return card;
}

// =========================================
// RENDERIZADO DE COMENTARIOS
// =========================================
export function renderComments(comments) {
    DOM.commentsList.innerHTML = '';
    
    if (!comments || comments.length === 0) {
        DOM.commentsList.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">No hay comentarios todavía.</p>';
        return;
    }

    comments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        
        const dateFormatted = new Date(comment.createdAt).toLocaleString();

        commentItem.innerHTML = `
            <div class="comment-header">
                <span>${escapeHTML(comment.author)}</span>
                <span>${dateFormatted}</span>
            </div>
            <p>${escapeHTML(comment.text)}</p>
        `;
        DOM.commentsList.appendChild(commentItem);
    });
}

// =========================================
// UTILIDAD DE SEGURIDAD (XSS)
// =========================================
export function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}