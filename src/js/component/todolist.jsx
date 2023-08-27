import React, {useState, useEffect} from "react";

const TodoList = () => {

    const [taskList, setTaskList] = useState([])
    const [todoListExists, setTodoListState] = useState(true)

	useEffect(() => {
        fetch('https://playground.4geeks.com/apis/fake/todos/user/nat388', {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(resp => {
              if (resp.status != 200) {
                createNewTodoList()
              }
              return resp.json();
          })
          .then(data => {
            if (data.length && data[0]?.label != "example task") {
                setTaskList(data)
            }
          })
          .catch(error => {
              console.log(error);
          });
    }, []);

    const createNewTodoList = () => {
        setTodoListState(true)
        fetch('https://playground.4geeks.com/apis/fake/todos/user/nat388', {
            method: "POST",
            body: JSON.stringify(taskList),
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(resp => {
              return resp.json(); 
          })
          .then(() => {
            setTaskList([])
          })
          .catch(error => {
              console.log(error);
          });
    }

    const addTask = (e) => {
        e.preventDefault()
        let newTask = document.getElementById("newTask").value
        const temp = [...taskList, newTask];
        document.getElementById("taskForm").reset()

        if (!todoListExists) {
            createNewTodoList()
        }

        fetch('https://playground.4geeks.com/apis/fake/todos/user/nat388', {
            method: "PUT",
            body: JSON.stringify(temp),
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(resp => {
              return resp.json();
          })
          .then(() => {
              setTaskList(temp);
          })
          .catch(error => {
              console.log(error);
          });
    }

    const deleteTask = (index) => {
        const temp = [...taskList];
        temp.splice(index, 1);
        if (temp.length) {
            fetch('https://playground.4geeks.com/apis/fake/todos/user/nat388', {
                method: "PUT",
                body: JSON.stringify(temp),
                headers: {
                  "Content-Type": "application/json"
                }
              })
              .then(resp => {
                  return resp.json();
              })
              .then(() => {
                  setTaskList(temp);
              })
              .catch(error => {
                  console.log(error);
              });
        } else {
            deleteTodoList()
        }
    }

    const deleteTodoList = () => {
        setTodoListState(false)
        fetch('https://playground.4geeks.com/apis/fake/todos/user/nat388', {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(resp => {
              return resp.json();
          })
          .then(() => {
            setTaskList([]);
          })
          .catch(error => {
              console.log(error);
          });
    }

	return (
		<>
            <h2 className="todoList_title">todos</h2>
            <div className="todoList_box">
                <form method="post" id="taskForm" onSubmit={(e) => addTask(e)}>
                    <input type="text" name="newTask" id="newTask" className="todoList_taskInput" placeholder="What needs to be done?"/>
                </form>
                <hr/>
                <div>
                    {taskList.map((element, index) => {
                        return (
                            <div key={index}>
                                <div className="todoList_task">
                                    {element}
                                    <div className="todoList_deleteTask" onClick={() => deleteTask(index)}>X</div>
                                </div>
                                <hr/>
                            </div>
                        )
                    })}
                    
                </div>
                <div className="todoList_footer">
                    {taskList.length ? taskList.length + " item left" : "No tasks, add a task"}
                </div>
            </div>
		</>
	);
};

export default TodoList;
