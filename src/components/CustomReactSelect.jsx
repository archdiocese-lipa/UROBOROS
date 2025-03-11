import PropTypes from "prop-types";
import ReactSelect, { components } from "react-select";

import { getInitial } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const customStyles = {
  control: (styles) => ({
    ...styles,
    borderRadius: "15px",
    backgroundColor: "#F6F0ED",
    padding: "14px",
    boxShadow: "none",
    outline: "none",
    borderColor: "transparent",
    "&:hover": {
      borderColor: "transparent",
    },
  }),
  placeholder: (styles) => ({
    ...styles,
    color:"#663F30",
    fontSize:"14px"

  }),
  

  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "white",
    paddingTop: "6px",
    paddingBottom: "6px",
    boxShadow: "0px 4px 5.5px 0px rgba(102, 63, 48, 0.06)",
    paddingLeft:"10px",
    paddingRight:"10px",
    borderRadius: "5px",
  }),

  multiValueLabel: (styles) => ({
    ...styles,
    padding: "0px",
    color: "#663f30",
  }),

  multiValueRemove: (styles) => ({
    ...styles,
    color: "#663F30",
    transform: "scale(1.5)",
    backgroundColor: "white",
    ":hover": {
      backgroundColor: "white",
      color: "#663F30",
    },
  }),
};

// Custom MultiValue component to display avatars with initials
const CustomMultiValue = (props) => {
  const { data } = props;
  const initials = getInitial(data.label);

  return (
    <components.MultiValue {...props} className="flex items-center gap-2">
      <Avatar className="flex justify-center items-center h-4 w-4">
        <AvatarImage src={data.image || ""} alt={data.label} />
        <AvatarFallback className="bg-accent text-center text-2xs text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      <components.MultiValueLabel {...props} />
    </components.MultiValue>
  );
};

// Main Component
const CustomReactSelect = ({ isMulti=true, styles = customStyles, options, value, onChange, placeholder }) => {
  return (
    <ReactSelect
      isMulti={isMulti}
      styles={styles}
      components={{ MultiValue: CustomMultiValue }}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

CustomReactSelect.propTypes = {
  isMulti: PropTypes.bool,
  styles: PropTypes.object, 
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      image: PropTypes.string, 
    })
  ).isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ),
  onChange: PropTypes.func.isRequired, 
  placeholder: PropTypes.string,
};

CustomMultiValue.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    image: PropTypes.string, // Optional image URL
  }).isRequired,
}

export default CustomReactSelect;
