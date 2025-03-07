import { ITextFormat } from "@/utils/highlight-text";

interface IProps {
  textFormats: ITextFormat[];
}

function HighlightText(props: IProps) {
  const { textFormats } = props;

  return (
    <>
      {textFormats.map(({ text, type }, index) => (
        <span key={index} className={type === "bold" ? "font-bold" : ""}>
          {text}
        </span>
      ))}
    </>
  );
}

export default HighlightText;
