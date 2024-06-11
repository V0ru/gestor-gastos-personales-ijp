import { set, useForm } from "react-hook-form";
import { Input } from "./components/Input";
import { Radio } from "./components/ui/Radio";
import { useState } from "react";
export default function App() {
  const { register, handleSubmit } = useForm();
  const [chek1, setchek1] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cortos, setCortos] = useState(0);
  const [completos, setCompletos] = useState(0);
  const [externos, setExternos] = useState(0);
  
  const [medicina, setMedicina] = useState(0);
  const [noclinica, setNoclinica] = useState(0);
  const [magister, setMagister] = useState(0);
  const [doctorado, setDoctorado] = useState(0);
  const [añosxp, setAñosxp] = useState(0);

  const [internacional, setInternacional] = useState(0);
  const [nacional, setNacional] = useState(0);
  const [investiga, setInvestiga] = useState(0);
  const [libtexto, setLibtexto] = useState(0);
  const [libensayo, setLibensayo] = useState(0);
  const [premio, setPremio] = useState(0);
  const [libtradu, setLibtradu] = useState(0);
  const [patente, setPatente] = useState(0);
  const [obrasnacio, setObrasnacio] = useState(0);
  const [obrasinter, setObrasinter] = useState(0);
  const [inova, setInova] = useState(0);
  const [adapta, setAdapta] = useState(0);
  const [software, setSoftware] = useState(0);

  const actualizarInput = (checked) => {
    setchek1(checked);
  };
  const actualizarInput2 = (checked) => {
    setCategoria(checked);
  };
  const calcularArticulo = (MinA1, MinA2, MinB, MinC, TipoArticulo) => {
    let totalPuntosArticulo = 0;
    if (TipoArticulo === "completo") {
      totalPuntosArticulo = MinA1 * 15 + MinA2 * 12 + MinB * 8 + MinC * 3;
      console.log("TOTAL ARTICULO COMPLETO:", totalPuntosArticulo);
      setCompletos(totalPuntosArticulo);
    }
    if (TipoArticulo === "cortos") {
      totalPuntosArticulo =
        MinA1 * (15 * 0.6) +
        MinA2 * (12 * 0.6) +
        MinB * (8 * 0.6) +
        MinC * (3 * 0.6);
      console.log("TOTAL ARTICULO CORTO:", totalPuntosArticulo);
      setCortos(totalPuntosArticulo);
    }
    if (TipoArticulo === "externos") {
      totalPuntosArticulo =
        MinA1 * (15 * 0.3) +
        MinA2 * (12 * 0.3) +
        MinB * (8 * 0.3) +
        MinC * (3 * 0.3);
      setExternos(totalPuntosArticulo);
      console.log("TOTAL ARTICULO EXTERNOS:", totalPuntosArticulo);
    }
  };
  const calcularTitulo =(añoAcademico,medicinaHumana,noclinicas,magister,doctorado, TipoTitulo) =>{
    let totalAños = 0;
    let pmedicina = 0;
    let pnoclini = 0;
    let pmagister = 0;
    let pdocto = 0;
    
    if(añoAcademico >= 1 && añoAcademico <= 2){
      totalAños = 20;
      console.log("TOTAL POR AÑO ACADEMICO",totalAños);
      setAñosxp(totalAños);
    } else{
      totalAños = 30;
      console.log("TOTAL POR AÑO ACADEMICO",totalAños);
      setAñosxp(totalAños);
    }

    if(TipoTitulo === "medicina" ){
      pmedicina = totalAños * 15;
      while(pmedicina > 75){
        pmedicina = 75;
      } 
      console.log("VALOR MEDICA",pmedicina);
      setMedicina(pmedicina);
    }

    if (TipoTitulo === "noclinica"){
      pnoclini = totalAños * 20;
      while(pnoclini > 30){
        pnoclini = 30;
      }
      console.log("VALOR NO CLINICA",pnoclini);
      setNoclinica(pnoclini);
    }

    if(TipoTitulo === "magister" && "noclinicas" != 0 ){
      pmagister = totalAños * 40;
      while(pmagister > 60){
        pmagister = 60;
      }
      console.log("VALOR MAGISTER",pmagister);
      setMagister(pmagister);
    } else{
      pmagister= 40;
      console.log("VALOR MAGISTER",pmagister);
      setMagister(pmagister);
    }

    if(TipoTitulo === "doctorado" && "magister" == 0 ){
      pdocto = 120;
      console.log("VALOR DOCTORADO",pdocto);
      setDoctorado(pdocto);
    }else{
      pdocto = 80;
      console.log("VALOR DOCTORADO",pdocto);
      setDoctorado(pdocto);
    }
  };

  const calcularProduccion = (TipoProduccion, DifusionII, DifusionIN, LibrosI, LibrosT, 
    LibrosEnsayo, PremiosNal, Patentes, TraduLibros, ObrasArtII, ObrasArtIN, ITecnologica, ATecnologica,
    ProduccSoft) => {
    let totalPuntosProduccion = 0;
    if (TipoProduccion === "internacional") {
      totalPuntosProduccion = DifusionII * 12;
      console.log("TOTAL PRODUCCION DIFUSION INTERNACIONAL:", totalPuntosProduccion);
      setInternacional(totalPuntosProduccion);
    }
    if (TipoProduccion === "nacional") {
      totalPuntosProduccion = DifusionIN * 7;
      console.log("TOTAL PRODUCCION DIFUSION NACIONAL:", totalPuntosProduccion);
      setNacional(totalPuntosProduccion);
    }

    if (TipoProduccion === "libroinvestiga") {
      totalPuntosProduccion = LibrosI * 20;
      console.log("TOTAL PRODUCCION LIBRO INVESTIGATIVO:", totalPuntosProduccion);
      setInvestiga(totalPuntosProduccion);
    }

    if (TipoProduccion === "librotexto") {
      totalPuntosProduccion = LibrosT * 15;
      console.log("TOTAL PRODUCCION LIBRO TEXTO:", totalPuntosProduccion);
      setLibtexto(totalPuntosProduccion);
    }

    if (TipoProduccion === "libroensayo") {
      totalPuntosProduccion = LibrosEnsayo * 15;
      console.log("TOTAL PRODUCCION LIBRO ENSAYO:", totalPuntosProduccion);
      setLibensayo(totalPuntosProduccion);
    }

    if (TipoProduccion === "premios") {
      totalPuntosProduccion = PremiosNal * 15;
      console.log("TOTAL PRODUCCION PREMIOS:", totalPuntosProduccion);
      setPremio(totalPuntosProduccion);
    }

    if (TipoProduccion === "patente") {
      totalPuntosProduccion = Patentes * 15;
      console.log("TOTAL PRODUCCION PATENTES:", totalPuntosProduccion);
      setPatente(totalPuntosProduccion);
    }

    if (TipoProduccion === "libtraduccion") {
      totalPuntosProduccion = TraduLibros * 15;
      console.log("TOTAL PRODUCCION LIBROS DE TRADUCCION:", totalPuntosProduccion);
      setLibtradu(totalPuntosProduccion);
    }

    if (TipoProduccion === "obrasinter") {
      totalPuntosProduccion = ObrasArtII * 20;
      console.log("TOTAL PRODUCCION OBRAS INTERNACIONALES:", totalPuntosProduccion);
      setObrasinter(totalPuntosProduccion);
    }

    if (TipoProduccion === "obrasnacio") {
      totalPuntosProduccion = ObrasArtIN * 14;
      console.log("TOTAL PRODUCCION OBRAS NACIONALES:", totalPuntosProduccion);
      setObrasnacio(totalPuntosProduccion);
    }

    if (TipoProduccion === "inova") {
      totalPuntosProduccion = ITecnologica * 15;
      console.log("TOTAL PRODUCCION INNOVACION TECNOLOGICA:", totalPuntosProduccion);
      setInova(totalPuntosProduccion);
    }

    if (TipoProduccion === "adapta") {
      totalPuntosProduccion = ATecnologica * 8;
      console.log("TOTAL PRODUCCION ADAPTACION TECNOLOGICA", totalPuntosProduccion);
      setAdapta(totalPuntosProduccion);
    }

    if (TipoProduccion === "sowa") {
      totalPuntosProduccion = ProduccSoft* 14;
      console.log("TOTAL PRODUCCION SOFTWARE:", totalPuntosProduccion);
      setSoftware(totalPuntosProduccion);
    }
  }

  console.log("TOTAL PUNTOS ARTICULOS ", cortos + externos + completos);
  console.log("TOTAL POR AÑO ACADEMICO ", añosxp);
  console.log("TOTAL PUNTOS TITULOS ", medicina + noclinica + magister + doctorado);
  console.log("TOTAL PUNTOS PRODUCCION", internacional + nacional + investiga + libtexto +
    libensayo + premio + libtradu + patente + obrasinter + obrasnacio + inova + adapta +
    software);

  const onSubmit = handleSubmit((data) => {
    data.cheked1 = chek1;
    data.categoria = categoria;
    console.log(data);
    console.log("longitud", data.length);
    calcularArticulo(data.MinA1, data.MinA2, data.MinB, data.MinC, "completo");
    calcularArticulo(
      data.CortosMinA1,
      data.CortosMinA2,
      data.CortosMinB,
      data.CortosMinC,
      "cortos"
    );
    calcularArticulo(
      data.RMinA1,
      data.RMinA2,
      data.RMinB,
      data.RMinC,
      "externos"
    );
    calcularTitulo(
      data.añoAcademico, data.medicinaHumana,
      data.noclinicas, data.magister, data.doctorado,"medicina"
    );
    calcularTitulo(
      data.añoAcademico, data.medicinaHumana,
      data.noclinicas, data.magister, data.doctorado,"noclinica"
    );
    calcularTitulo(
      data.añoAcademico, data.medicinaHumana,
      data.noclinicas, data.magister, data.doctorado,"magister"
    );
    calcularTitulo(
      data.añoAcademico, data.medicinaHumana,
      data.noclinicas, data.magister, data.doctorado,"doctorado"
    );

    calcularProduccion(
      "internacional", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "nacional", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "libroinvestiga", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "librotexto", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "libroensayo", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "premios", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "patente", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "libtraduccion", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "obrasinter", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "obrasnacio", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "inova", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "adapta", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );
    calcularProduccion(
      "sowa", data.DifusionII, data.DifusionIN, data.LibrosI, data.LibrosT, data.LibrosEnsayo,
      data.PremiosNal, data.Patentes, data.TraduLibros, data.ObrasArtII, data.ObrasArtIN, data.ITecnologica,
      data.ATecnologica, data.ProduccSoft
    );

  });

  return (
    <form className="w-full" onSubmit={onSubmit}>
      <h1 className="text-3xl font-bold container text-center">
        <b>Decreto Salariales</b>
      </h1>
      <h2 className="text-center">
        <b>Titulos de estudios universitarios</b>
      </h2>
      <Input actualizarInput={actualizarInput} />
      <p className="  ">
        <b >Por títulos de Posgrado. Especializaciones (incluye subespecializaciones clínicas o médicas)</b> 
      </p>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <ul>
            <li className="mt-1">Años Academicos</li>
            <li>Clínicas en Medicina Humana</li>
            <li>No Clínicas</li>
            <li>Magister o Maestrías</li>
            <li >Ph.D. o Doctorado</li>
          </ul>
        </div>

        <div className="w-1/2 flex flex-col justify-between">
        <input
            type="text"
            placeholder="Digite año"
            {...register("añoAcademico")}
            className="input input-bordered w-full text-black max-w-xs rounded-full mb-1  "
          />
          <input
            type="text"
            placeholder="Programas Cursados"
            {...register("medicinaHumana")}
            className="input input-bordered w-full text-black max-w-xs rounded-full mb-1"
          />
          <input
            type="text"
            placeholder="Programas cursados"
            {...register("noclinicas")}
            className="input input-bordered w-full max-w-xs rounded-full mb-1 text-black"
          />
          <input
            type="text"
            placeholder="Programas cursados"
            {...register("magister")}
            className="input input-bordered w-full max-w-xs mb-1 rounded-full text-black" 
          />
          <input
            type="text"
            placeholder="Programas cursados"
            {...register("doctorado")}
            className="input input-bordered w-full max-w-xs mb-1 rounded-full text-black"
          />
        </div>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">
            Título de Doctorado obtenido después de 1998
          </span>
          <input
            type="radio"
            name="radio-doctorado"
            {...register("doctorado1998")}
            className="radio checked:bg-green-500"
          />
        </label>
      </div>
      <h3 className="text-center">
        <b>Categorías Dentro Del Escalafón Docente</b>
      </h3>
      <p>
        <b>Categoría</b>
      </p>
      <Radio actualizarRadio={actualizarInput2} />
      <div>
        <h3 className="text-center">
          <b>Experiencia Calificada</b>
        </h3>
        <b>Por títulos de Posgrado.</b>
        <div className="flex">
          <div className="w-1/2 pr-4">
            <ul>
              <li className="mt-3">Experiencia investigativa</li>
              <li className="text">Experiencia docente</li>
              <li>Experiencia Cargos Dirección académica</li>
              <li>Experiencia no Docente</li>
            </ul>
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <input
              type="text"
              placeholder="Digite Años"
              {...register("xpInvetigativa")}
              className="input input-bordered w-full max-w-xs mt-1 mb-1 text-black rounded-full"
            />{" "}
            <input
              type="text"
              placeholder="Digite Años"
              {...register("xpDocente")}
              className="input input-bordered w-full max-w-xs mb-1  rounded-full text-black"
            />
            <input
              type="text"
              placeholder="Digite Años"
              {...register("xpDirAcademica")}
              className="input input-bordered w-full max-w-xs mb-1 rounded-full text-black"
            />
            <input
              type="text"
              placeholder="Digite Años"
              {...register("xpNodocente")}
              className="input input-bordered w-full max-w-xs mb-1  rounded-full text-black"
            />
          </div>
        </div>
      </div>
      <h4 className="text-center">
        <b>Proctuvidad academica</b>
      </h4>
      <p>
        <b>Articulos</b>
      </p>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <p>En revistas indexadas por MINCIENCIAS A1</p>
          <p>En revistas indexadas por MINCIENCIAS A2</p>
          <p>En revistas indexadas por MINCIENCIAS B</p>
          <p>En revistas indexadas por MINCIENCIAS C</p>
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <input
            type="text"
            placeholder="Número de árticulos"
            {...register("MinA1")}
            className="input input-bordered w-full text-black max-w-xs rounded-full mt-1 mb-1"
          />
          <input
            type="text"
            placeholder="Número de árticulos"
            {...register("MinA2")}
            className="input input-bordered w-full max-w-xs rounded-full mb-1 text-black"
          />
          <input
            type="text"
            {...register("MinB")}
            placeholder="Número de árticulos"
            className="input input-bordered w-full max-w-xs rounded-full mb-1 text-black"
          />
          <input
            type="text"
            {...register("MinC")}
            placeholder="Número de árticulos"
            className="input input-bordered w-full max-w-xs rounded-full mb-1 text-black"
          />
        </div>
      </div>
      <p className="mt-10">
        <b>Otros-Artículos cortos</b>
      </p>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <p>En revistas indexadas por MINCIENCIAS A1</p>
          <p>En revistas indexadas por MINCIENCIAS A2</p>
          <p>En revistas indexadas por MINCIENCIAS B</p>
          <p>En revistas indexadas por MINCIENCIAS C</p>
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <input
            type="text"
            placeholder="Número de árticulos"
            {...register("CortosMinA1")}
            className="input input-bordered w-full text-black max-w-xs rounded-full mt-1 mb-1"
          />
          <input
            type="text"
            placeholder="Número de árticulos"
            {...register("CortosMinA2")}
            className="input input-bordered w-full max-w-xs rounded-full mb-1 text-black"
          />
          <input
            type="text"
            placeholder="Número de árticulos"
            {...register("CortosMinB")}
            className="input input-bordered w-full max-w-xs rounded-full mb-1 text-black"
          />
          <input
            type="text"
            placeholder="Número de árticulos"
            {...register("CortosMinC")}
            className="input input-bordered w-full text-black rounded-full max-w-xs mb-1"
          />
        </div>
      </div>
      <p className="mt-10">
        <b>
          Otros - Reportes de Casos, Revisión de Temas, Carta al Editor o
          Editorial
        </b>
      </p>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <p>En revistas indexadas por MINCIENCIAS A1</p>
          <p>En revistas indexadas por MINCIENCIAS A2</p>
          <p>En revistas indexadas por MINCIENCIAS B</p>
          <p>En revistas indexadas por MINCIENCIAS C</p>
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <input
            type="text"
            placeholder="Número de árticulos"
            {...register("RMinA1")}
            className="input input-bordered w-full max-w-xs rounded-full mt-1 mb-1 text-black"
          />
          <input
            type="text"
            placeholder="Número de árticulos"
            {...register("RMinA2")}
            className="input input-bordered w-full text-black max-w-xs rounded-full mb-1"
          />
          <input
            type="text"
            placeholder="Número de árticulos"
            {...register("RMinB")}
            className="input input-bordered text-black w-full max-w-xs rounded-full mb-1"
          />
          <input
            type="text"
            placeholder="Número de árticulos"
            {...register("RMinC")}
            className="input input-bordered text-black w-full max-w-xs rounded-full mb-1"
          />
        </div>
      </div>
      <p className="mt-10">
        <b>Producción de Videos Cinematográficos o Fonográficos</b>
      </p>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <p>Difusión de Impacto Internacional</p>
          <p>Difusión de Impacto Nacional</p>
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <input
            type="text"
            placeholder="Número de Trabajos"
            {...register("DifusionII")}
            className="input input-bordered w-full max-w-xs mt-1 mb-1 rounded-full text-black"
          />
          <input
            type="text"
            placeholder="Número de Trabajos"
            {...register("DifusionIN")}
            className="input input-bordered w-full max-w-xs rounded-full mb-1 text-black"
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <p className="mt-5">
            Libros que resultan de una labor de investigación
          </p>
          <p className="mt-5">Libros texto</p>
          <p className="mt-5">Libros de ensayo</p>
          <p className="mt-5">Premios nacionales o internacionales</p>
          <p className="mt-5">Patentes</p>
          <p className="mt-5">Traducciones de libros</p>
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <input
            type="text"
            placeholder="Número Libros"
            {...register("LibrosI")}
            className="input input-bordered w-full max-w-xs mt-5 rounded-full text-black"
          />
          <input
            type="text"
            placeholder="Número de Libros"
            {...register("LibrosT")}
            className="input input-bordered w-full max-w-xs mt-5 rounded-full text-black"
          />
          <input
            type="text"
            placeholder="Número de Libros"
            {...register("LibrosEnsayo")}
            className="input input-bordered w-full max-w-xs mt-5 rounded-full text-black"
          />
          <input
            type="text"
            placeholder="Número de premios"
            {...register("PremiosNal")}
            className="input input-bordered w-full max-w-xs mt-5 rounded-full text-black"
          />
          <input
            type="text"
            placeholder="Número de patentes"
            {...register("Patentes")}
            className="input input-bordered w-full max-w-xs mt-5 rounded-full text-black"
          />
          <input
            type="text"
            placeholder="Número de Libros"
            {...register("TraduLibros")}
            className="input input-bordered w-full max-w-xs mt-5 rounded-full text-black"
          />
        </div>
      </div>

      <p className="mt-10">
        <b>Obras artisticas</b>
      </p>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <p> De impacto y trascendencia internacional</p>
          <p> De impacto y trascendencia nacional</p>
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <input
            type="text"
            placeholder="Número de Obras"
            {...register("ObrasArtII")}
            className="input input-bordered w-full max-w-xs mt-1 mb-1 rounded-full text-black"
          />
          <input
            type="text"
            placeholder="Número de Obras"
            {...register("ObrasArtIN")}
            className="input input-bordered w-full max-w-xs mb-1 rounded-full text-black"
          />
        </div>
      </div>
      <p className="mt-10">
        <b>Produccion tecnica</b>
      </p>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <p> Innovación tecnológica</p>
          <p> Adaptación tecnológica</p>
          <p>Produccion de Software</p>
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <input
            type="text"
            placeholder="Número Trabajos"
            {...register("ITecnologica")}
            className="input input-bordered w-full max-w-xs mt-1  rounded-full text-black"
          />
          <input
            type="text"
            placeholder="Número Trabajos"
            {...register("ATecnologica")}
            className="input input-bordered w-full max-w-xs  mt-1 rounded-full text-black"
          />
          <input
            type="text"
            placeholder="Número Trabajos"
            {...register("ProduccSoft")}
            className="input input-bordered w-full max-w-xs  mt-1 rounded-full text-black"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button className="px-8 py-3 font-semibold rounded-full dark:bg-gray-100 dark:text-gray-800 mt-4 ">
          Enviar
        </button>
      </div>
      <div className="w-full flex justify-center mt-5">
        {" "}
        <div className="bg-black bg-opacity-30  p-2 rounded-lg ">
          <div className="flex bg-black bg-opacity-50 rounded-lg p-2 justify-between">
            {" "}
            <span className="">Factor</span>
            <span className=" ">Puntaje</span>
          </div>
          <div className="  p-2 ">
            <div className="flex justify-between">
              {" "}
              <span>Valor Punto</span>
              <span>💲20.895</span>
            </div>
            <div className=" w-96 ">
              <div className="flex justify-between">
                {" "}
                <span>Sueldo estimado</span>
                <span>{cortos + externos + completos + medicina + noclinica + magister + doctorado + 
                internacional + nacional + investiga + libtexto + libensayo + premio + libtradu + 
                patente + obrasinter + obrasnacio + inova + adapta + software}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
