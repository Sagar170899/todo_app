import React, {useState} from 'react';



//  component can be implemented in a few different ways,
//  but the simplest way is to use a functional component that returns a form with an input field and a button.
// function AddTodo() {
//     const [todo, setTodo] = useState('This is a new task');

//     return (
//         <form onSubmit={handleSubmit}>
//             <input 
//                 type="text"
//                 value={todo}
//                 onChange={(e) => setTodo(e.target.value)}
//             />
//             <button type="submit">Add Todo</button>
//         </form>
//     );
// }


const AddTodo = ( { onAdd } ) => {
    const [todo, setTodo] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();    //Prevents the screen from reloading when the form is submitted
        if (!todo) return; // Prevent adding empty todos

        onAdd(todo); // Call the onAdd function passed as a prop with the new todo title
        setTodo(""); // Clear the input field after adding the todo
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                value={todo}
                placeholder="Enter a new todo title"
                onChange={(e) => setTodo(e.target.value)}
                required
            />
            <button type="submit">Add Todo</button>
        </form>
    );
}

export default AddTodo;