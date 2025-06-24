const Todo = require("../models/todoModel");


exports.getTodos = async (req, res) => {
    console.log("Fetching all todos from the database");
    
    try {
        const todos = await Todo.find();
        console.log("fetched all todos successfully:", todos);
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Error fetching todos" });
    }
}

exports.addTodo = async (req, res) => {
    // const title = req.body;
    // console.log("Adding a new todo:", title);
    // const newTodo = new Todo({
    //     title: title.todo
    // });
    // console.log("Adding the todo to db:", newTodo);
    // const savedTodo = await newTodo.save();
    // console.log("Added the todo to db:", savedTodo);
    // res.status(200).json(savedTodo);

    const { title } = req.body; //Destructures 'title' directly
    console.log("Adding a new todo with title:", title);

    if (!title) { //Validation for missing title
        return res.status(400).json({ message: "Title is required" });
    }

    try {
        const newTodo = new Todo({ title }); 
        console.log("Saving the todo to db:", newTodo);

        const savedTodo = await newTodo.save();
        console.log("Added the todo to db:", savedTodo);
        res.status(201).json(savedTodo);         
    } catch (error) {
        console.error("Error adding todo:", error);
        res.status(500).json({ message: "Error adding todo" });
    }
}

exports.deleteTodo = async (req, res) => {
    const todoId = req.params.id; //Extracts the todo ID from the request parameters
    console.log("Deleting todo with ID:", todoId);

    try {
        const deletedTodo = await Todo.findByIdAndDelete(todoId); //Finds and deletes the todo by ID

        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" }); //Handles case where todo is not found
        }

        res.status(200).json(deletedTodo); //Returns the deleted todo
    } catch (error) {
        res.status(500).json({ message: "Error deleting todo" }); //Handles errors during deletion
    }
}