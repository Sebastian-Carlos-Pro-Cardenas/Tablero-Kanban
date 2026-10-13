// =========================================
// CONFIGURACIÓN Y ESTADO DE LA APLICACIÓN
// =========================================
const API_URL = 'http://localhost:3000';

let allTasks = [];
let activeTaskId = null; // ID de la tarea seleccionada en el modal de detalle

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const searchInput = document.getElementById('searchInput');

const todoList = document.getElementById('todoList');
const doingList = document.getElementById('doingList');
const doneList = document.getElementById('doneList');

const statTotal = document.getElementById('statTotal');
const statTodo = document.getElementById('statTodo');
const statDoing = document.getElementById('statDoing');
const statDone = document.getElementById('statDone');
const countTodo = document.getElementById('countTodo');
const countDoing = document.getElementById('countDoing');
const countDone = document.getElementById('countDone');

const createModal = document.getElementById('createModal');
const detailModal = document.getElementById('detailModal');
const openCreateModalBtn = document.getElementById('openCreateModalBtn');
const openCreateModalNav = document.getElementById('openCreateModalNav');
const closeCreateModal = document.getElementById('closeCreateModal');
const cancelCreateBtn = document.getElementById('cancelCreateBtn');
const closeDetailModal = document.getElementById('closeDetailModal');

const createTaskForm = document.getElementById('createTaskForm');
const editTaskForm = document.getElementById('editTaskForm');
const addCommentForm = document.getElementById('addCommentForm');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');

// =========================================
// INICIALIZACIÓN Y EVENT LISTENERS
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
    setupSortable();
});

async function initApp() {
    await fetchTasks();
}

function setupEventListeners() {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    openCreateModalBtn.addEventListener('click', () => openModal(createModal));
    openCreateModalNav.addEventListener('click', (e) => {
        e.preventDefault();
        mainNav.classList.remove('active');
        openModal(createModal);
    });

    closeCreateModal.addEventListener('click', () => closeModal(createModal));
    cancelCreateBtn.addEventListener('click', () => closeModal(createModal));
    closeDetailModal.addEventListener('click', () => closeModal(detailModal));

    window.addEventListener('click', (e) => {
        if (e.target === createModal) closeModal(createModal);
        if (e.target === detailModal) closeModal(detailModal);
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTasks = allTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm)
        );
        renderBoard(filteredTasks);
    });

    createTaskForm.addEventListener('submit', handleCreateTask);

    editTaskForm.addEventListener('submit', handleEditTask);

    deleteTaskBtn.addEventListener('click', handleDeleteTask);

    addCommentForm.addEventListener('submit', handleAddComment);
}

// =========================================
// GESTIÓN DE MODALES
// =========================================
function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
    if (modal === createModal) {
        createTaskForm.reset();
    }
}

// =========================================
// OPERACIONES CRUD DE TAREAS (FETCH API)
// =========================================

async function fetchTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        allTasks = await response.json();
        renderBoard(allTasks);
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron cargar las tareas. Asegúrate de que json-server está ejecutándose en http://localhost:3000');
    }
}

async function handleCreateTask(e) {
    e.preventDefault();
    
    const newTask = {
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value || new Date().toISOString().split('T')[0],
        status: 'todo' // Por defecto a "Por Hacer"
    };

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        if (!response.ok) throw new Error('Error al crear la tarea');

        closeModal(createModal);
        await fetchTasks();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo crear la tarea.');
    }
}

async function handleEditTask(e) {
    e.preventDefault();
    if (!activeTaskId) return;

    const updatedData = {
        title: document.getElementById('editTaskTitle').value.trim(),
        description: document.getElementById('editTaskDescription').value.trim(),
        priority: document.getElementById('editTaskPriority').value,
        dueDate: document.getElementById('editTaskDueDate').value
    };

    try {
        const response = await fetch(`${API_URL}/tasks/${activeTaskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error('Error al actualizar la tarea');

        closeModal(detailModal);
        await fetchTasks();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo actualizar la tarea.');
    }
}

async function handleDeleteTask() {
    if (!activeTaskId) return;
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea de forma permanente?')) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${activeTaskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar la tarea');

        closeModal(detailModal);
        await fetchTasks();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo eliminar la tarea.');
    }
}

// =========================================
// RENDERIZADO DEL TABLERO Y ESTADÍSTICAS
// =========================================
function renderBoard(tasks) {
    todoList.innerHTML = '';
    doingList.innerHTML = '';
    doneList.innerHTML = '';

    let countT = 0, countD = 0, countDn = 0;

    tasks.forEach(task => {
        const cardElement = createTaskCardElement(task);

        if (task.status === 'todo') {
            todoList.appendChild(cardElement);
            countT++;
        } else if (task.status === 'doing') {
            doingList.appendChild(cardElement);
            countD++;
        } else if (task.status === 'done') {
            doneList.appendChild(cardElement);
            countDn++;
        }
    });

    countTodo.textContent = countT;
    countDoing.textContent = countD;
    countDone.textContent = countDn;

    statTodo.textContent = countT;
    statDoing.textContent = countD;
    statDone.textContent = countDn;
    statTotal.textContent = tasks.length;
}

function createTaskCardElement(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.dataset.id = task.id;

    const priorityClass = `badge-${task.priority.toLowerCase()}`;

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

    card.addEventListener('click', () => openDetailModal(task.id));

    return card;
}

// =========================================
// INTEGRACIÓN CON SORTABLEJS (DRAG & DROP)
// =========================================
function setupSortable() {
    const options = {
        group: 'kanban',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: async function (evt) {
            const taskId = evt.item.dataset.id;
            const newStatus = evt.to.closest('.kanban-column').dataset.status;

            await updateTaskStatus(taskId, newStatus);
        }
    };

    Sortable.create(todoList, options);
    Sortable.create(doingList, options);
    Sortable.create(doneList, options);
}

async function updateTaskStatus(taskId, newStatus) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Error al actualizar el estado de la tarea');

        await fetchTasks();
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo mover la tarjeta en el servidor.');
        await fetchTasks(); // Revertir visualmente en caso de fallo
    }
}

// =========================================
// DETALLE Y COMENTARIOS DE LA TARJETA
// =========================================
async function openDetailModal(taskId) {
    activeTaskId = taskId;
    const task = allTasks.find(t => t.id == taskId);
    if (!task) return;

    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description || '';
    document.getElementById('editTaskPriority').value = task.priority;
    document.getElementById('editTaskDueDate').value = task.dueDate || '';

    await fetchComments(taskId);

    openModal(detailModal);
}

async function fetchComments(taskId) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '<p class="text-muted">Cargando comentarios...</p>';

    try {
        const response = await fetch(`${API_URL}/comments?taskId=${taskId}`);
        if (!response.ok) throw new Error('Error al cargar comentarios');
        const comments = await response.json();

        commentsList.innerHTML = '';
        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="text-muted" style="font-size:0.85rem;">No hay comentarios todavía.</p>';
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
            commentsList.appendChild(commentItem);
        });
    } catch (error) {
        console.error('Error:', error);
        commentsList.innerHTML = '<p class="text-muted">Error al cargar comentarios.</p>';
    }
}

async function handleAddComment(e) {
    e.preventDefault();
    if (!activeTaskId) return;

    const authorInput = document.getElementById('commentAuthor');
    const textInput = document.getElementById('commentText');

    const newComment = {
        taskId: activeTaskId.toString(),
        author: authorInput.value.trim(),
        text: textInput.value.trim(),
        createdAt: new Date().toISOString()
    };

    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newComment)
        });

        if (!response.ok) throw new Error('Error al añadir comentario');

        textInput.value = '';
        await fetchComments(activeTaskId);
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo añadir el comentario.');
    }
}

function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}