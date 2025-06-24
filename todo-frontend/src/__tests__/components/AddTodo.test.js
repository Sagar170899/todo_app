import { render, screen, fireEvent } from "@testing-library/react";
import AddTodo from "../../components/AddTodo"; 

describe("Testing AddTodo Component", () => {
    test('renders input field and button', () => {
        render(<AddTodo onAdd={jest.fn()} />);
        expect(screen.getByPlaceholderText(/Enter a new todo title/i)).toBeInTheDocument();
        expect(screen.getByText(/Add Todo/i)).toBeInTheDocument();
    });
    
    it("calls onAdd with input value", () => {
        const mockAdd = jest.fn();
        render(<AddTodo onAdd={mockAdd} />);

        const input = screen.getByPlaceholderText(/Enter a new todo title/i);
        fireEvent.change(input, { target: { value: "New Task" } });
        fireEvent.click(screen.getByText(/Add Todo/i));

        expect(mockAdd).toHaveBeenCalledWith("New Task");
        expect(input.value).toBe(""); // after submit it should be cleared
    });

    it("does not call onAdd with empty input", () => {
        const mockAdd = jest.fn();
        render(<AddTodo onAdd={mockAdd} />);
        fireEvent.click(screen.getByText(/Add Todo/i));
        expect(mockAdd).not.toHaveBeenCalled();
    });
});
