class TodoList {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';

        this.initializeEventListeners();
        this.renderTasks();
    }

    initializeEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.taskList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                this.deleteTask(e.target.closest('.task-item').dataset.id);
            }
            if (e.target.classList.contains('edit-btn')) {
                this.editTask(e.target.closest('.task-item').dataset.id);
            }
            if (e.target.type === 'checkbox') {
                this.toggleTask(e.target.closest('.task-item').dataset.id);
            }
        });

        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.filterTasks(button.dataset.filter));
        });
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        if (!taskText) return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        this.taskInput.value = '';
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== Number(taskId));
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(taskId) {
        this.tasks = this.tasks.map(task => 
            task.id === Number(taskId) ? {...task, completed: !task.completed} : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    editTask(taskId) {
        const task = this.tasks.find(task => task.id === Number(taskId));
        const newText = prompt('Edit task:', task.text);
        if (newText !== null) {
            task.text = newText.trim();
            this.saveTasks();
            this.renderTasks();
        }
    }

    filterTasks(filter) {
        this.currentFilter = filter;
        this.filterButtons.forEach(btn => 
            btn.classList.toggle('active', btn.dataset.filter === filter)
        );
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        const filteredTasks = this.tasks.filter(task => {
            if (this.currentFilter === 'active') return !task.completed;
            if (this.currentFilter === 'completed') return task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.className = `task-item fade-in ${task.completed ? 'completed' : ''}`;
            taskElement.dataset.id = task.id;
            taskElement.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            this.taskList.appendChild(taskElement);
        });
    }
}

// Initialize application
const todoApp = new TodoList();
