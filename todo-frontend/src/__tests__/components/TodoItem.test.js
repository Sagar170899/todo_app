import { render, screen, fireEvent } from "@testing-library/react";
import TodoItem from "../../components/TodoItem";

describe("TodoItem", () => {

	test("renders todo title", () => {
		render(<TodoItem todo={{ title: "Learn React" }} />);
		expect(screen.getByText(/learn react/i)).toBeInTheDocument();
	});

	test("calls onDelete when delete button is clicked", () => {
		const mockDelete = jest.fn();
		render(<TodoItem todo={{ title: "Learn React" }} onDelete={mockDelete} />);
		
		const deleteButton = screen.getByText(/delete/i);
		fireEvent.click(deleteButton);
		
		expect(mockDelete).toHaveBeenCalledTimes(1);
	});
});
