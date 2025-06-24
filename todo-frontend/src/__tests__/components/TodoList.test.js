import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TodoList from "../../components/TodoList";
import BACKEND_URL from "../../config/config";

afterEach(() => {
    jest.clearAllMocks();
});

global.fetch = jest.fn();

describe("Testing TodoList Component", () => {
    
    test("fetches and renders todos", async () => {
        const mockTodos = [
            { _id: "1", title: "Mock_Todo_1" },
            { _id: "2", title: "Mock_Todo_2" }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTodos
        });

        render(<TodoList />);
        
        await waitFor(() => {
            expect(screen.getByText("Mock_Todo_1")).toBeInTheDocument();
            expect(screen.getByText("Mock_Todo_2")).toBeInTheDocument();
        });
        expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/get-todos`);
    });

    test("Add new todo", async () => {
        const mockTodos = [
            { _id: "1", title: "Mock_Todo_1" },
            { _id: "2", title: "Mock_Todo_2" }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTodos
        });

        render(<TodoList />);

        const input = screen.getByPlaceholderText("Enter a new todo title");
        const button = screen.getByRole("button", { name: "Add Todo" });

        fireEvent.change(input, { target: { value: "Mock_Todo_1" } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("Mock_Todo_1")).toBeInTheDocument();
            expect(screen.getByText("Mock_Todo_2")).toBeInTheDocument();
        });
        expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/add-todo`, expect.any(Object));
    });

    test("deletes a todo", async () => {
        const mockTodos = [
            { _id: "1", title: "Mock_Todo_1" },
            { _id: "2", title: "Mock_Todo_2" }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTodos
        });

        render(<TodoList />);

        await waitFor(() => {
            expect(screen.getByText("Mock_Todo_1")).toBeInTheDocument();
            expect(screen.getByText("Mock_Todo_2")).toBeInTheDocument();
        });

        fetch.mockResolvedValueOnce({
            ok: true
        });

        const deleteButton = screen.getAllByText("Delete")[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.queryByText("Mock_Todo_1")).not.toBeInTheDocument();
        });
        expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/delete-todo/1`, {
            method: 'DELETE',
        });
    });
});
