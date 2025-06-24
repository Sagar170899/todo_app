import React, {useState} from 'react';


const DeleteTodo = ({ onDelete }) => {
    const [todoId, setTodoId] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();    //Prevents the screen from reloading when the form is submitted
        onDelete(todoId);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                value={todoId}
                placeholder="Enter Todo ID to delete"
                onChange={(e) => setTodoId(e.target.value)}
                required
            />
            <button type='submit'>Delete</button>
        </form>
    );
}

export default DeleteTodo;