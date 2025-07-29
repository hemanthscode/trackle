class TodoApp {
  constructor() {
    this.tasks = [];
    this.filter = "all";
    this.editingId = null;
    this.deletingId = null;
    this.clearCompletedCount = 0;

    this.initElements();
    this.bindEvents();
    this.loadTasks();
    this.render();

    setTimeout(() => this.elements.input.focus(), 100);
  }

  initElements() {
    this.elements = {
      form: document.getElementById("taskForm"),
      input: document.getElementById("taskInput"),
      error: document.getElementById("errorMsg"),
      taskList: document.getElementById("taskList"),
      emptyState: document.getElementById("emptyState"),
      clearBtn: document.getElementById("clearBtn"),

      // Filters
      filters: document.querySelectorAll(".filter-btn"),
      allCount: document.getElementById("allCount"),
      pendingCount: document.getElementById("pendingCount"),
      doneCount: document.getElementById("doneCount"),

      // Stats
      totalTasks: document.getElementById("totalTasks"),
      completedTasks: document.getElementById("completedTasks"),
      pendingTasks: document.getElementById("pendingTasks"),

      // Edit Modal
      editModal: document.getElementById("editModal"),
      editInput: document.getElementById("editInput"),
      editSave: document.getElementById("saveEdit"),
      editCancel: document.getElementById("cancelEdit"),
      editClose: document.getElementById("editClose"),

      // Delete Modal
      deleteModal: document.getElementById("deleteModal"),
      deleteConfirm: document.getElementById("confirmDelete"),
      deleteCancel: document.getElementById("cancelDelete"),
      deleteClose: document.getElementById("deleteClose"),
      deletePreview: document.getElementById("deletePreview"),

      // Clear Completed Modal
      clearCompletedModal: document.getElementById("clearCompletedModal"),
      clearCompletedMessage: document.getElementById("clearCompletedMessage"),
      clearClose: document.getElementById("clearClose"),
      cancelClear: document.getElementById("cancelClear"),
      confirmClear: document.getElementById("confirmClear"),

      // Toast container
      toastContainer: document.getElementById("toastContainer"),
    };
  }

  bindEvents() {
    // Form Submission
    this.elements.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTask(this.elements.input.value);
    });

    this.elements.input.addEventListener("input", () => this.hideError());

    // Filters
    this.elements.filters.forEach((btn) => {
      btn.addEventListener("click", () => this.setFilter(btn.dataset.filter));
    });

    // Clear Completed Button opens modal
    this.elements.clearBtn.addEventListener("click", () =>
      this.openClearCompletedModal()
    );

    // Edit Modal events
    this.elements.editSave.addEventListener("click", () => this.saveEdit());
    this.elements.editCancel.addEventListener("click", () => this.closeEdit());
    this.elements.editClose.addEventListener("click", () => this.closeEdit());
    this.elements.editModal.addEventListener("click", (e) => {
      if (e.target === this.elements.editModal) this.closeEdit();
    });

    // Delete Modal events
    this.elements.deleteConfirm.addEventListener("click", () =>
      this.confirmDelete()
    );
    this.elements.deleteCancel.addEventListener("click", () =>
      this.closeDelete()
    );
    this.elements.deleteClose.addEventListener("click", () =>
      this.closeDelete()
    );
    this.elements.deleteModal.addEventListener("click", (e) => {
      if (e.target === this.elements.deleteModal) this.closeDelete();
    });

    // Clear Completed Modal events
    this.elements.clearClose.addEventListener("click", () =>
      this.closeClearCompletedModal()
    );
    this.elements.cancelClear.addEventListener("click", () =>
      this.closeClearCompletedModal()
    );
    this.elements.confirmClear.addEventListener("click", () =>
      this.clearCompletedConfirmed()
    );
    this.elements.clearCompletedModal.addEventListener("click", (e) => {
      if (e.target === this.elements.clearCompletedModal)
        this.closeClearCompletedModal();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeEdit();
        this.closeDelete();
        this.closeClearCompletedModal();
      }
    });

    this.elements.editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.saveEdit();
    });
  }

  loadTasks() {
    try {
      const stored = localStorage.getItem("trackle-tasks");
      this.tasks = stored ? JSON.parse(stored) : [];
    } catch {
      this.tasks = [];
    }
  }

  saveTasks() {
    try {
      localStorage.setItem("trackle-tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Failed to save tasks:", error);
      this.showToast("Failed to save tasks", "error");
    }
  }

  addTask(text) {
    text = text.trim();
    if (!this.validateTask(text)) return;

    const task = {
      id: Date.now() + Math.random().toString(36).slice(2),
      text: this.sanitizeHTML(text),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.unshift(task);
    this.saveTasks();
    this.elements.input.value = "";
    this.hideError();
    this.render();
    this.showToast("Task added successfully", "success");
  }

  toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.render();
    }
  }

  editTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      this.editingId = id;
      this.elements.editInput.value = task.text;
      this.showModal(this.elements.editModal);
      setTimeout(() => {
        this.elements.editInput.focus();
        this.elements.editInput.select();
      }, 100);
    }
  }

  saveEdit() {
    const text = this.elements.editInput.value.trim();
    if (!this.validateTask(text, this.editingId)) return;

    const task = this.tasks.find((t) => t.id === this.editingId);
    if (task) {
      task.text = this.sanitizeHTML(text);
      this.saveTasks();
      this.closeEdit();
      this.render();
      this.showToast("Task updated successfully", "success");
    }
  }

  closeEdit() {
    this.hideModal(this.elements.editModal);
    this.editingId = null;
    this.elements.editInput.value = "";
    setTimeout(() => this.elements.input.focus(), 100);
  }

  deleteTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      this.deletingId = id;
      this.elements.deletePreview.textContent = task.text;
      this.showModal(this.elements.deleteModal);
    }
  }

  confirmDelete() {
    this.tasks = this.tasks.filter((t) => t.id !== this.deletingId);
    this.saveTasks();
    this.closeDelete();
    this.render();
    this.showToast("Task deleted successfully", "success");
  }

  closeDelete() {
    this.hideModal(this.elements.deleteModal);
    this.deletingId = null;
    setTimeout(() => this.elements.input.focus(), 100);
  }

  openClearCompletedModal() {
    this.clearCompletedCount = this.tasks.filter((t) => t.completed).length;
    if (this.clearCompletedCount === 0) {
      this.showToast("No completed tasks to clear", "error");
      return;
    }
    this.elements.clearCompletedMessage.textContent = `Delete ${
      this.clearCompletedCount
    } completed task${this.clearCompletedCount > 1 ? "s" : ""}?`;
    this.showModal(this.elements.clearCompletedModal);
  }

  closeClearCompletedModal() {
    this.hideModal(this.elements.clearCompletedModal);
  }

  clearCompletedConfirmed() {
    const count = this.clearCompletedCount;
    this.tasks = this.tasks.filter((t) => !t.completed);
    this.clearCompletedCount = 0;
    this.saveTasks();
    this.closeClearCompletedModal();
    this.render();
    this.showToast(
      `${count} completed task${count > 1 ? "s" : ""} cleared`,
      "success"
    );
  }

  setFilter(filterType) {
    this.filter = filterType;
    this.elements.filters.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filterType);
    });
    this.render();
  }

  validateTask(text, excludeId = null) {
    if (!text) {
      this.showError("Task cannot be empty!");
      return false;
    }
    if (text.length > 100) {
      this.showError("Task too long! Max 100 characters.");
      return false;
    }
    if (
      this.tasks.some(
        (t) => t.id !== excludeId && t.text.toLowerCase() === text.toLowerCase()
      )
    ) {
      this.showError("Task already exists!");
      return false;
    }
    return true;
  }

  sanitizeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML.replace(
      /[<>]/g,
      (match) =>
        ({
          "<": "&lt;",
          ">": "&gt;",
        }[match])
    );
  }

  getFilteredTasks() {
    switch (this.filter) {
      case "pending":
        return this.tasks.filter((t) => !t.completed);
      case "completed":
        return this.tasks.filter((t) => t.completed);
      default:
        return this.tasks;
    }
  }

  render() {
    this.renderTasks();
    this.renderStats();
    this.renderCounts();
  }

  renderTasks() {
    const filtered = this.getFilteredTasks();
    this.elements.taskList.innerHTML = "";
    this.elements.emptyState.classList.toggle("hidden", filtered.length > 0);

    filtered.forEach((task) => {
      const li = document.createElement("li");
      li.className = `task-item${task.completed ? " completed" : ""}`;
      li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${
          task.completed ? "checked" : ""
        }>
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
          <button class="task-btn edit-btn" data-id="${task.id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="task-btn delete-btn" data-id="${task.id}">
            <i class="fas fa-trash"></i> Del
          </button>
        </div>
      `;

      li.querySelector(".task-checkbox").addEventListener("change", () =>
        this.toggleTask(task.id)
      );
      li.querySelector(".edit-btn").addEventListener("click", () =>
        this.editTask(task.id)
      );
      li.querySelector(".delete-btn").addEventListener("click", () =>
        this.deleteTask(task.id)
      );

      this.elements.taskList.appendChild(li);
    });
  }

  renderStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((t) => t.completed).length;

    this.elements.totalTasks.textContent = total;
    this.elements.completedTasks.textContent = completed;
    this.elements.pendingTasks.textContent = total - completed;
  }

  renderCounts() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    this.elements.allCount.textContent = total;
    this.elements.pendingCount.textContent = pending;
    this.elements.doneCount.textContent = completed;

    this.elements.clearBtn.style.display = completed > 0 ? "block" : "none";
  }

  showModal(modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  hideModal(modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  showToast(message, type = "error") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas ${
        type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
      }"></i>
      <span>${message}</span>
    `;

    this.elements.toastContainer.appendChild(toast);

    // Show animation
    requestAnimationFrame(() => toast.classList.add("show"));

    // Auto-remove after 4 seconds
    const removeToast = () => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    };

    const timeoutId = setTimeout(removeToast, 4000);

    // Click to dismiss
    toast.addEventListener("click", () => {
      clearTimeout(timeoutId);
      removeToast();
    });
  }

  showError(message) {
    this.showToast(message, "error");
  }

  hideError() {
    this.elements.error.textContent = "";
    this.elements.error.classList.remove("show");
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => new TodoApp());
