type IOption = {
  default?: boolean;
  id: string;
  text: string;
};

type ISelect = {
  options: IOption[];
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
};

export default function Select({ options, onChange }: ISelect) {
  return (
    <select
      defaultValue={options.filter((opt) => opt.default)[0].id}
      onChange={onChange}
    >
      {options.map((value, index) => (
        <option key={index} value={value.id}>
          {value.text}
        </option>
      ))}
    </select>
  );
}
