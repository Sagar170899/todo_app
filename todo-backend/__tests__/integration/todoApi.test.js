jest.setTimeout(30000);

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../server"); 
const Todo = require("../../models/todoModel");

describe("Todo API Integration Tests", () => {

    let mongoServer;

    beforeAll(async () => {
        try {
            mongoServer = await MongoMemoryServer.create();
            const mongoUri = `${mongoServer.getUri()}todo-api`;
            // if (mongoose.connection.readyState === 0) {
            //     await mongoose.connect(mongoUri);
            // }
        } catch (err) {
            console.error("Error setting up MongoMemoryServer:", err);
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoose.disconnect();
        await mongoServer.stop();
        jest.clearAllMocks();
    });

    afterEach(async () => {
        await Todo.deleteMany(); 
    });

    describe("GET /api/get-todos", () => {
        it("should fetch all todos", async () => {
            await Todo.create({ title: "Todo 1" });
            await Todo.create({ title: "Todo 2" });

            const res = await request(app).get("/api/get-todos");

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe("POST /api/add-todo", () => {
        it("should add a new todo", async () => {
            const newTodo = { title: "New Todo" };

            const res = await request(app)
                .post("/api/add-todo")
                .send(newTodo);

            expect(res.statusCode).toEqual(201);
            expect(res.body.title).toBe(newTodo.title);

            const todos = await Todo.find();
            expect(todos.length).toBe(1);
            expect(todos[0].title).toBe(newTodo.title);
        });

        it("should not add todo with empty title", async () => {
            const res = await request(app).post("/api/add-todo").send({});

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Title is required");
        });
    });

    describe("DELETE /api/delete-todo/:id", () => {
        it("should delete a todo", async () => {
            const todo = await Todo.create({ title: "To Delete" });

            const res = await request(app).delete(`/api/delete-todo/${todo._id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe("To Delete");

            const allTodos = await Todo.find();
            expect(allTodos.length).toBe(0);
        });

        it("should return 404 for deleting non-existent todo", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app).delete(`/api/delete-todo/${fakeId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Todo not found");
        });
    });
});
