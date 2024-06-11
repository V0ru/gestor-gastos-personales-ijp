  import  { useState } from "react";

// eslint-disable-next-line react/prop-types
export function Radio( {actualizarRadio}) {
 const [selectedValue, setSelectedValue] = useState("");

 const handleChange = (event) => {
    setSelectedValue(event.target.value);
    actualizarRadio(event.target.value)
 };

 return (
    <div>
      <div className="form-control">
        <span className="label-text">Auxiliar</span>
        <label className="label cursor-pointer">
          <input
            type="radio"
            name="radio-categoria"
            className="radio checked:bg-red-500"
            value="medicina"
            checked={selectedValue === "medicina"}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Asistente</span>
          <input
            type="radio"
            name="radio-categoria"
            className="radio checked:bg-blue-500"
            value="otraArea"
            checked={selectedValue === "otraArea"}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Asociado</span>
          <input
            type="radio"
            name="radio-categoria"
            className="radio checked:bg-green-500"
            value="terceraOpcion"
            checked={selectedValue === "terceraOpcion"}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Titular</span>
          <input
            type="radio"
            name="radio-categoria"
            className="radio checked:bg-yellow-500"
            value="cuartaOpcion"
            checked={selectedValue === "cuartaOpcion"}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
 );
}