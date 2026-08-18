(function () {
  'use strict';

  const STORAGE_KEY = 'todoTasks';

  let state = {
    tasks: [],
    currentFilter: 'all', // 'all' | 'active' | 'completed'
    editingTaskId: null
  };

  // ==========================================
  // DOM Elements Cache
  // ==========================================
  const addTaskForm = document.getElementById('add-task-form');
  const taskInput = document.getElementById('task-input');
  const inputError = document.getElementById('input-error');

  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const emptyIcon = document.getElementById('empty-icon');
  const emptyTitle = document.getElementById('empty-title');
  const emptyDescription = document.getElementById('empty-description');

  const filterButtonsContainer = document.querySelector('.filters');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');

  const badgeAll = document.getElementById('badge-all');
  const badgeActive = document.getElementById('badge-active');
  const badgeCompleted = document.getElementById('badge-completed');

  const statsRemaining = document.getElementById('stats-remaining');
  const statTotal = document.getElementById('stat-total');
  const statActive = document.getElementById('stat-active');
  const statCompleted = document.getElementById('stat-completed');

  // Edit Modal Elements
  const editModal = document.getElementById('edit-modal');
  const editTaskForm = document.getElementById('edit-task-form');
  const editTaskInput = document.getElementById('edit-task-input');
  const editInputError = document.getElementById('edit-input-error');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');

  // ==========================================
  // Utility Functions
  // ==========================================
  /**
   * Generates a unique task ID.
   */
  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'task_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Escapes HTML to prevent XSS.
   */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ==========================================
  // State Operations & Persistence
  // ==========================================
  /**
   * Loads tasks from localStorage safely.
   */
  function loadTasks() {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        state.tasks = [];
        return;
      }
      const parsed = JSON.parse(rawData);
      // Validate that parsed data is an array of objects
      if (Array.isArray(parsed)) {
        state.tasks = parsed.filter(
          item => item && typeof item === 'object' && typeof item.id === 'string' && typeof item.text === 'string'
        );
      } else {
        state.tasks = [];
      }
    } catch (err) {
      console.error('Failed to parse tasks from localStorage:', err);
      state.tasks = [];
    }
  }

  /**
   * Persists state.tasks to localStorage.
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (err) {
      console.error('Failed to save tasks to localStorage:', err);
    }
  }

  /**
   * Adds a new task to state.
   */
  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) {
      showInputError('Task description cannot be empty.');
      return false;
    }

    clearInputError();

    const newTask = {
      id: generateId(),
      text: trimmed,
      completed: false,
      createdAt: Date.now()
    };

    state.tasks.unshift(newTask); // New tasks at the top
    saveTasks();
    renderTasks();
    return true;
  }

  /**
   * Toggles task completed state.
   */
  function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }

  /**
   * Updates task text.
   */
  function editTask(id, newText) {
    const trimmed = newText.trim();
    if (!trimmed) {
      showEditInputError('Task description cannot be empty.');
      return false;
    }

    clearEditInputError();

    const task = state.tasks.find(t => t.id === id);
    if (task) {
      task.text = trimmed;
      saveTasks();
      renderTasks();
      return true;
    }
    return false;
  }

  /**
   * Deletes a task by ID.
   */
  function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }

  /**
   * Deletes all completed tasks.
   */
  function clearCompleted() {
    const initialCount = state.tasks.length;
    state.tasks = state.tasks.filter(t => !t.completed);
    if (state.tasks.length !== initialCount) {
      saveTasks();
      renderTasks();
    }
  }

  /**
   * Returns tasks filtered by state.currentFilter.
   */
  function getFilteredTasks() {
    switch (state.currentFilter) {
      case 'active':
        return state.tasks.filter(t => !t.completed);
      case 'completed':
        return state.tasks.filter(t => t.completed);
      case 'all':
      default:
        return state.tasks;
    }
  }

  // ==========================================
  // UI Rendering & DOM Manipulation
  // ==========================================
  /**
   * Renders the complete UI based on current state.
   */
  function renderTasks() {
    const filteredTasks = getFilteredTasks();

    // Clear task list container
    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
      renderEmptyState();
    } else {
      emptyState.classList.add('hidden');
      filteredTasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
      });
    }

    updateStats();
  }

  /**
   * Dynamically builds a task HTML item element.
   */
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
      <div class="task-main">
        <label class="checkbox-container" title="${task.completed ? 'Mark incomplete' : 'Mark complete'}">
          <input 
            type="checkbox" 
            class="task-checkbox" 
            data-action="toggle" 
            ${task.completed ? 'checked' : ''} 
            aria-label="Mark task '${escapeHTML(task.text)}' as ${task.completed ? 'incomplete' : 'complete'}"
          />
          <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </label>
        <span class="task-text">${escapeHTML(task.text)}</span>
      </div>
      <div class="task-actions">
        <button type="button" class="action-btn edit-btn" data-action="edit" title="Edit Task" aria-label="Edit task '${escapeHTML(task.text)}'">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </button>
        <button type="button" class="action-btn delete-btn" data-action="delete" title="Delete Task" aria-label="Delete task '${escapeHTML(task.text)}'">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;

    return li;
  }

  /**
   * Displays empty state depending on current filter.
   */
  function renderEmptyState() {
    emptyState.classList.remove('hidden');

    if (state.tasks.length === 0) {
      emptyIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>`;
      emptyTitle.textContent = 'No tasks yet';
      emptyDescription.textContent = 'Add your first task above to get started!';
    } else if (state.currentFilter === 'active') {
      emptyIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
      emptyTitle.textContent = 'No active tasks';
      emptyDescription.textContent = "You've completed all active tasks! Great job!";
    } else if (state.currentFilter === 'completed') {
      emptyIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      emptyTitle.textContent = 'No completed tasks';
      emptyDescription.textContent = 'Finish a task to see it listed here.';
    }
  }

  /**
   * Updates task statistics and badges.
   */
  function updateStats() {
    const total = state.tasks.length;
    const active = state.tasks.filter(t => !t.completed).length;
    const completed = total - active;

    badgeAll.textContent = total;
    badgeActive.textContent = active;
    badgeCompleted.textContent = completed;

    statTotal.textContent = total;
    statActive.textContent = active;
    statCompleted.textContent = completed;

    statsRemaining.innerHTML = `<strong>${active}</strong> task${active === 1 ? '' : 's'} remaining`;

    // Show/hide Clear Completed button
    clearCompletedBtn.style.display = completed > 0 ? 'inline-block' : 'none';
  }

  /**
   * Filter Tab Switcher.
   */
  function setFilter(filterName) {
    if (state.currentFilter === filterName) return;

    state.currentFilter = filterName;

    filterButtons.forEach(btn => {
      const isSelected = btn.dataset.filter === filterName;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    renderTasks();
  }

  // ==========================================
  // Form Validation Feedback
  // ==========================================
  function showInputError(msg) {
    inputError.textContent = msg;
    taskInput.classList.add('error');
  }

  function clearInputError() {
    inputError.textContent = '';
    taskInput.classList.remove('error');
  }

  function showEditInputError(msg) {
    editInputError.textContent = msg;
    editTaskInput.classList.add('error');
  }

  function clearEditInputError() {
    editInputError.textContent = '';
    editTaskInput.classList.remove('error');
  }

  // ==========================================
  // Modal Edit Handlers
  // ==========================================
  function openEditModal(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    state.editingTaskId = taskId;
    editTaskInput.value = task.text;
    clearEditInputError();

    if (typeof editModal.showModal === 'function') {
      editModal.showModal();
    } else {
      // Polyfill fallback if showModal is unsupported
      editModal.setAttribute('open', 'true');
    }

    editTaskInput.focus();
    editTaskInput.select();
  }

  function closeEditModal() {
    state.editingTaskId = null;
    clearEditInputError();
    if (typeof editModal.close === 'function') {
      editModal.close();
    } else {
      editModal.removeAttribute('open');
    }
  }

  // ==========================================
  // Event Delegation & Handlers
  // ==========================================
  /**
   * Delegated Event Listener for Task Actions (Toggle, Edit, Delete).
   * Ensures high performance and dynamic item handling.
   */
  function setupEventDelegation() {
    // Single click/change handler on taskList container
    taskList.addEventListener('click', function (e) {
      const actionTarget = e.target.closest('[data-action]');
      if (!actionTarget) return;

      const taskItem = actionTarget.closest('.task-item');
      if (!taskItem) return;

      const taskId = taskItem.dataset.id;
      const action = actionTarget.dataset.action;

      if (action === 'toggle') {
        toggleTask(taskId);
      } else if (action === 'edit') {
        openEditModal(taskId);
      } else if (action === 'delete') {
        deleteTask(taskId);
      }
    });

    // Checkbox change delegation for accessible focus/keyboard interaction
    taskList.addEventListener('change', function (e) {
      if (e.target.classList.contains('task-checkbox')) {
        const taskItem = e.target.closest('.task-item');
        if (taskItem) {
          toggleTask(taskItem.dataset.id);
        }
      }
    });

    // Filter Buttons Delegation
    filterButtonsContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter-btn');
      if (btn && btn.dataset.filter) {
        setFilter(btn.dataset.filter);
      }
    });

    // Add Task Form Submission (Handles Button Click & Enter Key)
    addTaskForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const success = addTask(taskInput.value);
      if (success) {
        taskInput.value = '';
        taskInput.focus();
      }
    });

    // Real-time input error clearing
    taskInput.addEventListener('input', function () {
      if (inputError.textContent) {
        clearInputError();
      }
    });

    // Clear Completed Button Click
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Modal Form Submission
    editTaskForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!state.editingTaskId) return;

      const success = editTask(state.editingTaskId, editTaskInput.value);
      if (success) {
        closeEditModal();
      }
    });

    // Modal Cancel & Close Buttons
    modalCloseBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);

    // Close modal on click outside backdrop
    editModal.addEventListener('click', function (e) {
      const rect = editModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeEditModal();
      }
    });

    // Keyboard Accessibility (Esc to cancel modal)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.editingTaskId) {
        closeEditModal();
      }
    });
  }

  // ==========================================
  // Application Initialization
  // ==========================================
  function init() {
    loadTasks();
    setupEventDelegation();
    renderTasks();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();