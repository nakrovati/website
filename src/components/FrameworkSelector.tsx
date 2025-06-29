import chroma from "chroma-js";
import Select from "react-select";
import { SelectOption } from "../common";

// Create custom type instead of using StylesConfig<SelectOption, true> because it slows down TypeScript for some reason
interface Styles<T = any> {
  control: (style: any) => void;
  option: (
    style: any,
    prop: {
      data: T;
      isDisabled: boolean;
      isFocused: boolean;
      isSelected: boolean;
    }
  ) => void;
  multiValue: (style: any, prop: { data: T }) => void;
  multiValueLabel: (style: any, prop: { data: T }) => void;
  multiValueRemove: (style: any, prop: { data: T }) => void;
}

export interface SelectOptionFramework extends SelectOption {
  color?: string;
}

interface Props {
  options: SelectOption[];
  onChange: (options: SelectOptionFramework[]) => void;
  value?: SelectOptionFramework[];
  disableStyle?: boolean;
}

/** Styles for <Select> */
const styles: Styles<SelectOptionFramework> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color!);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor:
          !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color!);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white",
    },
  }),
};

function FrameworkSelector({
  options,
  onChange,
  value = [],
  disableStyle = false,
}: Props) {
  const onOptionsChange = (data: any) => {
    onChange(data);
  };

  return (
    <Select
      isMulti
      value={value}
      placeholder="Select Frameworks..."
      onChange={onOptionsChange}
      styles={!disableStyle ? (styles as any) : undefined}
      options={options}
    />
  );
}

export default FrameworkSelector;
