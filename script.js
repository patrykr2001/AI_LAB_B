document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskInput = document.getElementById('task-input');
    const taskDeadline = document.getElementById('task-deadline');
    const addTaskButton = document.getElementById('add-task');
    const searchInput = document.getElementById('search');

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Load tasks from Local Storage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToDOM(task));
    };

    // Save tasks to Local Storage
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('.task-text').textContent,
                deadline: taskItem.querySelector('.task-deadline').dataset.deadline
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add task to DOM
    const addTaskToDOM = (task) => {
        const taskItem = document.createElement('li');
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        const taskDeadline = document.createElement('span');
        taskDeadline.className = 'task-deadline';
        taskDeadline.textContent = formatDate(task.deadline);
        taskDeadline.dataset.deadline = task.deadline;
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
        });
        taskItem.appendChild(taskText);
        taskItem.appendChild(taskDeadline);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        // Edit task on click
        taskText.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = taskText.textContent;
            taskItem.replaceChild(input, taskText);
            input.addEventListener('blur', () => {
                taskText.textContent = input.value;
                taskItem.replaceChild(taskText, input);
                saveTasks();
            });
        });
    };

    // Add new task
    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskDeadlineValue = taskDeadline.value;
        if (taskText.length >= 3 && taskText.length <= 255 && (taskDeadlineValue === '' || new Date(taskDeadlineValue) > new Date())) {
            const task = { text: taskText, deadline: taskDeadlineValue };
            addTaskToDOM(task);
            saveTasks();
            taskInput.value = '';
            taskDeadline.value = '';
        } else {
            alert('Invalid task or deadline');
        }
    });

    // Search tasks
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        taskList.querySelectorAll('li').forEach(taskItem => {
            const taskText = taskItem.querySelector('.task-text').textContent.toLowerCase();
            if (taskText.includes(query)) {
                taskItem.style.display = '';
                taskItem.querySelector('.task-text').innerHTML = taskText.replace(new RegExp(query, 'gi'), match => `<span class="highlight">${match}</span>`);
            } else {
                taskItem.style.display = 'none';
            }
        });
    });

    loadTasks();
});