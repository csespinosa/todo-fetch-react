import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/ToDo.css';

const ToDo = () => {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const username = "draxerting";
    const API_BASE = "https://playground.4geeks.com/todo";

// GET de los Task
    const loadTasks = async () => {
        try {
            console.log("🔄 Cargando tareas...");
            const response = await fetch(`${API_BASE}/users/${username}`); // Hice esto para manejar los path de forma dinamica

            console.log("📡 Status:", response.status);
            console.log("📡 OK:", response.ok);

            if (!response.ok) throw new Error(`Error HTTP ${response.status} : ${response.statusText}`);

            const data = await response.json();
            console.log("Datos recibidos:", data);

            setTasks(data.todos || []);
        } catch (error) {
            console.error("Error cargando tareas:", error);
            setTasks([]);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    // Agregar una tarea POST
    const addTask = async () => {
        if (task.trim() === '') return;

        const newTask = { label: task, is_done: false };

        try {
            console.log("📝 Creando tarea:", newTask);
            const response = await fetch(`${API_BASE}/todos/${username}`, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: { "Content-Type": "application/json" }
            });

            console.log("Estatus:", response.status);
            console.log("OK:", response.ok);

            if (!response.ok) throw new Error(`Error ${response.status} : ${response.statusText}`);

            console.log("Tarea creada");
            setTask('');
            loadTasks();
        } catch (error) {
            console.error("Error al agregar tarea:", error);
        }
    };

    // Eliminar una tarea DELETE
    const deleteTask = async (taskId) => {
        try {
            console.log(`🗑️ Eliminando tarea con ID ${taskId}`);
            const response = await fetch(`${API_BASE}/todos/${taskId}`, {
                method: "DELETE"
            });

            console.log("📡 Status:", response.status);
            console.log("📡 OK:", response.ok);

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            console.log("Tarea eliminada");
            loadTasks();
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };

    // Eliminar todas las tareas DELETE for of
    const clearAllTasks = async () => {
        try {
            console.log("🗑️ Eliminando todas las tareas...");

            for (const task of tasks) {
                console.log(`🗑️ Eliminando tarea con ID ${task.id}...`);
                const response = await fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                    method: "DELETE"
                });

                console.log("📡 Status:", response.status);
                console.log("📡 OK:", response.ok);

                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            console.log("Todas las tareas eliminadas");
            setTasks([]);
        } catch (error) {
            console.error("Error al eliminar todas las tareas:", error);
        }
    };

    // Marcar una tarea como completada o no
    const toggleTaskCompletion = async (taskId, isDone) => {
        try {
            console.log(`🔄 Cambiando estado de tarea ${taskId} a ${!isDone}`);
            const response = await fetch(`${API_BASE}/todos/${taskId}`, {
                method: "PUT",
                body: JSON.stringify({ is_done: !isDone }),
                headers: { "Content-Type": "application/json" }
            });

            console.log("📡 Status:", response.status);
            console.log("📡 OK:", response.ok);

            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            console.log("✅ Tarea actualizada");
            loadTasks();
        } catch (error) {
            console.error("❌ Error al actualizar tarea:", error);
        }
    };


    const pressEnter = (event) => {
        if (event.key === 'Enter') addTask();
    };

    return (
        <div className="todo-wrapper">
            <div className="todo-container">
                <h1 className="todo-title">To Do</h1>

                <div className="input-container">
                    <input
                        type="text"
                        value={task}
                        onChange={(event) => setTask(event.target.value)}
                        onKeyDown={pressEnter}
                        placeholder="Add a new task..."
                        className="task-input"
                    />
                    <button className="add-button" onClick={addTask}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>

                <div className="tasks-container">
                    {tasks.length > 0 ? (
                        tasks.map((taskItem) => (
                            <div key={taskItem.id} className="task-item">
                                <input
                                    type="checkbox"
                                    checked={taskItem.is_done}
                                    onChange={() => toggleTaskCompletion(taskItem.id, taskItem.is_done)}
                                />
                                <span className="task-text">{taskItem.label}</span>
                                <button className="delete-button" onClick={() => deleteTask(taskItem.id)}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-tasks">No hay tareas pendientes.</p>
                    )}
                </div>

                {tasks.length > 0 && (
                    <button className="clear-all-button" onClick={clearAllTasks}>
                        <FontAwesomeIcon icon={faTrash} /> Limpiar todas las tareas
                    </button>
                )}
            </div>
        </div>
    );
};

export default ToDo;