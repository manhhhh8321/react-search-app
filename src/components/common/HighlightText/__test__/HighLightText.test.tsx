import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HighlightText from "..";
import { ITextFormat } from "@/utils/highlight-text";

describe("HighlightText Component", () => {
  test("renders without errors when textFormats is empty", () => {
    render(<HighlightText textFormats={[]} />);
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  test("renders text with correct formatting", () => {
    const textFormats: ITextFormat[] = [
      {
        text: "Hello",
        type: "normal",
      },
      {
        text: "World",
        type: "bold",
      },
    ];

    render(<HighlightText textFormats={textFormats} />);

    const normalText = screen.getByText("Hello");
    const boldText = screen.getByText("World");

    expect(normalText).toBeInTheDocument();
    expect(boldText).toBeInTheDocument();
    expect(boldText).toHaveClass("font-bold");
    expect(normalText).not.toHaveClass("font-bold");
  });

  test("renders multiple formatted text pieces correctly", () => {
    const textFormats: ITextFormat[] = [
      { text: "BoldText", type: "bold" },
      { text: "NormalText", type: "normal" },
      { text: "AnotherBold", type: "bold" },
    ];

    render(<HighlightText textFormats={textFormats} />);

    const boldText1 = screen.getByText("BoldText");
    const normalText = screen.getByText("NormalText");
    const boldText2 = screen.getByText("AnotherBold");

    expect(boldText1).toHaveClass("font-bold");
    expect(normalText).not.toHaveClass("font-bold");
    expect(boldText2).toHaveClass("font-bold");
  });
});
