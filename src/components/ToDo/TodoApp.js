import React, {useState, useRef } from "react";
import Logo from '../../assets/logos/todoimage.svg';
import '../../App.css';
import  garbageIcon from '../../assets/icons/iconTrash.svg'

function TodoListApp() {

    const [task, setTask] = useState("");
    const [tasklist, updateTasklist] = useState([]);
    const [taskId, updatetaskId] = useState(0);
    /*
        Originally was using tasklist.filter to manipulate the taskslist.
        Because of the way setTimeout works it was using the old tasklist at the time of executed.
        I found some helpful discussions here: https://github.com/facebook/react/issues/14010,
        I found I needed to make use of react's useRef to get the current state of the tasklist,
        after a setTimeout "fired", otherwise it would use the tasklist's state at the time of calling the setTimeout
    */
    const tasklistRef = useRef(tasklist);
    tasklistRef.current = tasklist;

    const handleChange = (e) => {
        setTask(e.target.value);
    };

    const AddNewTask = (e) => {
        //Create a new task and update the tasklist
        if (task != ""){
            const newTask = {
                id: taskId + 1,
                value: task,
                isComplete: false,
            };
            //increase the taskid after a new task is created
            updatetaskId(taskId + 1);
            updateTasklist([...tasklist, newTask]);
            
        }
        //clear the current task/input
        setTask("");
    };

    const RemoveTask = (e, element) => {
        //the passed element will be filtered out of the tasklist and the tasklist state updated.
        const tempArray = tasklistRef.current.filter(tasks => tasks.id != element.id); 
        updateTasklist([...tempArray]);

    }
    const OnChecked = (e, element) => {
        const tempArray = [...tasklist];
        //go through the tasklist and set the element passed to isComplete true
        tempArray.forEach(tasks => {
            if (tasks.id == element.id) {
                tasks.isComplete = true;
            }
    
        });
        //visuals updated/update the tasklist
        updateTasklist([...tempArray]);

        //send the element to be removed after 4 seconds
        setTimeout(() => {
            RemoveTask(e, element);
        }, 4000);       
    }

    const BuildVisualTask = (element) => {
        /*Smoothest way I personally came up with is to just check if that task is marked completed,
        or not and return the task with different class names applied. I'm interested in seeing the 
        solutions version.
        */
        if (element.isComplete == true) {
            return (
                <div className="task"> 
                <input type="checkbox" 
                className="task-checkbox"
                onChange={(e) => OnChecked(e, element)}
                checked
                />
                <p className="task-description task-complete">{element.value}</p>
                <img 
                src={garbageIcon}
                onClick={(e) => RemoveTask(e, element)}
                alt="Remove task"
                />
            </div>
            )
        } else {
            return (
                
                <div className="task"> 
                <input type="checkbox" 
                className="task-checkbox"
                onChange={(e) => OnChecked(e, element)}

                />
                <p className="task-description">{element.value}</p>
                <img 
                src={garbageIcon}
                onClick={(e) => RemoveTask(e, element)}
                alt="Remove task"
                />
                </div>
            )
        }
        
      
    }
    return (
        <div>
            <h1 className="task-header">Task list</h1>
            <form>
                <div className="task-input-container">
                <input 
                    type="text" 
                    name="taskTextInput" 
                    id="taskTextInput"
                    className="task-input"
                    onChange={(e) => handleChange(e)}
                    value={task}
                    />
                <button 
                onClick={(e) => AddNewTask(e)} 
                className="task-create-btn"
                disabled={task.trim().length === 0}
                >
                    Create
                </button>
                </div>
            </form>


            <div className="task-list">
                {tasklist.map((element) => (
                    //foreach element in the tasklist it will return a full task div will classNames handled by BuildVisualTask
                    BuildVisualTask(element)
                ))}
            </div>


            {tasklist.length === 0 && (
                <div className='empty-tasks-container'>
                    <img className='empty-tasks-logo' src={Logo}  alt='No current tasks' />
                    <h4 className='empty-tasks-text'>No tasks yet!</h4>
                </div>
                )}
        </div>
    );

    
}

export default TodoListApp;