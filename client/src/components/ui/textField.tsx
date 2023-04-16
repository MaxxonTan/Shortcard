type TextFieldProp = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
};

export default function TextField(props: TextFieldProp) {
  return (
    <>
      <label htmlFor={props.label}>{props.label}</label>
      <input type="text" name={props.label} />
    </>
  );
}
