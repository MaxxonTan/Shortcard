type TextFieldProp = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  /**
   * Used for form validation
   */
  required?: boolean;
  errorMessage?: string;
};

export default function TextField(props: TextFieldProp) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={props.label} className="font-sans text-neutral-black">
        {props.label}
      </label>
      <input
        required={props.required ?? false}
        type="text"
        name={props.label}
        className="rounded-sm bg-secondary-dark px-3 py-2 outline-none"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onValueChange(e.currentTarget.value)}
      />
      {props.errorMessage && (
        <p className="text-xs text-red-500">{props.errorMessage}</p>
      )}
    </div>
  );
}
