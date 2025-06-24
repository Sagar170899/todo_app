import { render, screen, fireEvent } from "@testing-library/react";
import DeleteTodo from "../../components/DeleteTodo";

describe("Testing DeleteTodo Component", () => {
    test('renders input field and button', () => {
        render(<DeleteTodo onDelete={jest.fn()} />);
        expect(screen.getByPlaceholderText(/Enter Todo ID to delete/i)).toBeInTheDocument();
        expect(screen.getByText(/Delete/i)).toBeInTheDocument();
    });
    
    it("calls onDelete with entered ID", () => {
        const mockDelete = jest.fn();
        render(<DeleteTodo onDelete={mockDelete} />);

        const input = screen.getByPlaceholderText(/Enter Todo ID to delete/i);
        fireEvent.change(input, { target: { value: "123" } });
        fireEvent.click(screen.getByText(/Delete/i));

        expect(mockDelete).toHaveBeenCalledWith("123");
    });
});
