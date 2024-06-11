import  { useState } from "react";

// eslint-disable-next-line react/prop-types
export function Input({actualizarInput}) {
 const [selectedValue, setSelectedValue] = useState("");

 const handleChange = (event) => {
    setSelectedValue(event.target.value);
    console.log("enete click:",event.target.value );
    actualizarInput(event.target.value)
 };

 return (
    <div>
      <div className="form-control">
        <span className="label-text">En medicina humana o composición musical</span>
        <label className="label cursor-pointer">
          <input
            type="radio"
            name="radio-titulo"
            className="radio checked:bg-red-500"
            value="medicina"
            checked={selectedValue === "medicina"}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">En otra area</span>
          <input
            type="radio"
            name="radio-titulo"
            className="radio checked:bg-blue-500"
            value="otraArea"
            checked={selectedValue === "otraArea"}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
 );
}