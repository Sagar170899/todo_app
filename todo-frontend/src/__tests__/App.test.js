import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
    rest.get("/get-todos", (req, res, ctx) => {
        return res(ctx.json([{ _id: "1", title: "Mock Todo from MSW" }]));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
