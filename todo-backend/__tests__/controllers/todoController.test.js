const bodyParser = require("body-parser");
const todoController = require("../../controllers/todoController")

jest.mock("../../models/todoModel")

const mockSave = jest.fn();
const mockFind = jest.fn();

const Todo = require("../../models/todoModel");

Todo.find = mockFind;

describe("When ToDo Controller is invoked", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res)
        };
    });

    describe("For getTodos function", () => {
        it("should return all the todos", async () => {
            const mockTodos = [
                { _id: "1", title: "Test Todo 1", completed: false },
                { _id: "2", title: "Test Todo 2", completed: false },
                { _id: "3", title: "Test Todo 3", completed: false },
                { _id: "4", title: "Test Todo 4", completed: false },
                { _id: "5", title: "Test Todo 5", completed: false }
            ]
            mockFind.mockResolvedValue(mockTodos);
            await todoController.getTodos(req, res);
            expect(mockFind).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockTodos);
        })
        it("should return 500 if there is an error while fetching todos", async () => {
            mockFind.mockRejectedValue(new Error("Database error"));
            await todoController.getTodos(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error fetching todos" });
        });
        it("should return 200 if there is no todos", async () => {
            mockFind.mockResolvedValue([]);
            await todoController.getTodos(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe("For addTodo function", () => {
        it("should add a new todo", async () => {
            req.body.title = "Test Todo";
            mockSave.mockResolvedValue({ _id: "1", title: "Test Todo", completed: false });
            Todo.prototype.save = mockSave;

            await todoController.addTodo(req, res);
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ _id: "1", title: "Test Todo", completed: false });
        });

        it("should return 400 if title is not provided", async () => {
            await todoController.addTodo(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Title is required" });
        });
        
        it("should return 500 if there is an error while adding todo", async () => {
            req.body.title = "Test Todo";
            Todo.prototype.save = mockSave;
            mockSave.mockRejectedValue(new Error("Database error"));

            await todoController.addTodo(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error adding todo" });
        });
    });

    describe("For deleteTodo function", () => {
        it("should delete a todo by ID", async () => {
            req.params.id = "1";
            const mockDeletedTodo = { _id: "1", title: "Test Todo", completed: false };
            Todo.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedTodo);
            await todoController.deleteTodo(req, res);
            expect(Todo.findByIdAndDelete).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockDeletedTodo);
        });

        it("should return 404 if todo is not found", async () => {
            req.params.id = "1";
            Todo.findByIdAndDelete = jest.fn().mockResolvedValue(null);
            await todoController.deleteTodo(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Todo not found" });
        });

        it("should return 500 if there is an error while deleting todo", async () => {
            req.params.id = "1";
            Todo.findByIdAndDelete = jest.fn().mockRejectedValue(new Error("Database error"));
            await todoController.deleteTodo(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error deleting todo" });
        });
    });
});