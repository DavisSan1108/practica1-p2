document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTask();
    });

    function addTask() {
        const taskName = document.getElementById('task-name').value;
        const startDate = document.getElementById('task-start-date').value;
        const endDate = document.getElementById('task-end-date').value;
        const responsible = document.getElementById('task-responsible').value;

        if (!taskName || !startDate || !endDate || !responsible) return;
        if (new Date(endDate) < new Date(startDate)) {
            alert('La fecha de fin no puede ser menor a la fecha de inicio.');
            return;
        }

        const task = {
            id: Date.now(),
            name: taskName,
            startDate: startDate,
            endDate: endDate,
            responsible: responsible,
            resolved: false
        };

        tasks.push(task);
        saveTasks();
        renderTasks();
        taskForm.reset();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const currentDate = new Date().toISOString().split('T')[0];
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';

            if (task.resolved) {
                listItem.classList.add('task-resolved');
            } else if (currentDate > task.endDate) {
                listItem.classList.add('task-expired');
            } else {
                listItem.classList.add('task-pending');
            }

            const taskInfo = document.createElement('div');
            taskInfo.className = 'task-info';
            taskInfo.innerHTML = `
                <strong>${task.name}</strong><br>
                Inicio: ${task.startDate} - Fin: ${task.endDate}<br>
                Responsable: ${task.responsible}
            `;

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            if (!task.resolved && currentDate <= task.endDate) {
                const resolveButton = document.createElement('button');
                resolveButton.className = 'btn btn-success';
                resolveButton.textContent = 'Resolver';
                resolveButton.addEventListener('click', function() {
                    task.resolved = true;
                    saveTasks();
                    renderTasks();
                });
                taskActions.appendChild(resolveButton);
            }

            if (task.resolved) {
                const unresolvedButton = document.createElement('button');
                unresolvedButton.className = 'btn btn-warning';
                unresolvedButton.textContent = 'Desmarcar';
                unresolvedButton.addEventListener('click', function() {
                    task.resolved = false;
                    saveTasks();
                    renderTasks();
                });
                taskActions.appendChild(unresolvedButton);
            }

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', function() {
                const taskIndex = tasks.findIndex(t => t.id === task.id);
                tasks.splice(taskIndex, 1);
                saveTasks();
                renderTasks();
            });

            taskActions.appendChild(deleteButton);
            listItem.appendChild(taskInfo);
            listItem.appendChild(taskActions);
            taskList.appendChild(listItem);
        });
    }

    renderTasks();
});
