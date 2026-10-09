import { API } from './api.js';

export function initDragAndDrop(onStatusChange) {
  const columns = document.querySelectorAll('.kanban-column-content');

  columns.forEach(column => {
    new Sortable(column, {
      group: 'kanban',
      animation: 150,
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      onEnd: async (evt) => {
        const itemEl = evt.item;
        const taskId = itemEl.dataset.id;
        const newStatus = evt.to.dataset.status;
        const oldStatus = evt.from.dataset.status;

        // Si la tarjeta cambió de columna
        if (newStatus !== oldStatus) {
          try {
            await API.updateTaskStatus(taskId, newStatus);
            if (onStatusChange) onStatusChange(); // Actualiza contadores y estadísticas
          } catch (error) {
            console.error('Error al actualizar el estado de la tarea:', error);
          }
        }
      }
    });
  });
}