jest.setTimeout(30000);

const request = require("supertest");
const mongoose_e2e = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../server"); 
const Todo = require("../../models/todoModel");

describe("E2E Test: Todo API", () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = `${mongoServer.getUri()}todo-e2e`;
        // if (mongoose_e2e.connection.readyState === 0) {
        //     await mongoose_e2e.connect(uri);
        // }
    });

    afterAll(async () => {
        await mongoose_e2e.connection.close();
        await mongoose_e2e.disconnect();
        await mongoServer.stop();
        jest.clearAllMocks();
    });

    afterEach(async () => {
        await Todo.deleteMany();
    });

    it("should add, fetch and delete a todo end-to-end", async () => {
        // Add
        const addRes = await request(app)
        .post("/api/add-todo")
        .send({ title: "E2E Todo" });

        expect(addRes.statusCode).toBe(201);
        expect(addRes.body.title).toBe("E2E Todo");

        const todoId = addRes.body._id;

        // Fetch
        const getRes = await request(app).get("/api/get-todos");
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.length).toBe(1);
        expect(getRes.body[0]._id).toBe(todoId);

        // Delete
        const deleteRes = await request(app).delete(`/api/delete-todo/${todoId}`);
        expect(deleteRes.statusCode).toBe(200);
        expect(deleteRes.body._id).toBe(todoId);

        // Confirm Deletion
        const finalGet = await request(app).get("/api/get-todos");
        expect(finalGet.body.length).toBe(0);
    });
});
