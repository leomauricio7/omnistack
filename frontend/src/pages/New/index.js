import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import camera from "../../assets/camera.svg";
import "./styles.css";
import api from "../../services/api";

export default function New({ history }) {
  const [company, setCompany] = useState("");
  const [price, setPrice] = useState("");
  const [techs, setTechs] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function headleSubmit(event) {
    event.preventDefault();

    const user_id = localStorage.getItem("user");

    const formData = new FormData();

    formData.append("company", company);
    formData.append("techs", techs);
    formData.append("price", price);
    formData.append("thumbnail", thumbnail);

    await api.post("/spots", formData, {
      headers: { user_id }
    });

    history.push("/dashboard");
  }

  return (
    <form onSubmit={headleSubmit}>
      <label
        id="thumbnail"
        style={{ backgroundImage: `url(${preview})` }}
        className={thumbnail ? "has-thumbnail" : ""}
      >
        <input
          type="file"
          onChange={event => setThumbnail(event.target.files[0])}
        />
        <img src={camera} alt="Select file" />
      </label>

      <label htmlFor="company">EMPRESA *</label>
      <input
        id="company"
        placeholder="Sua empresa"
        value={company}
        onChange={event => setCompany(event.target.value)}
      />

      <label htmlFor="techs">
        TECNOLOGIAS * <span>(separadas por vírgula)</span>
      </label>
      <input
        id="techs"
        placeholder="Quais tecnologias usam?"
        value={techs}
        onChange={event => setTechs(event.target.value)}
      />

      <label htmlFor="price">
        VALOR DA DIÁRIA * <span>(em branco para gratuito)</span>
      </label>
      <input
        id="price"
        placeholder="Valor cobrado por dia"
        value={price}
        onChange={event => setPrice(event.target.value)}
      />

      <button type="submit" className="btn">
        CADASTRAR
      </button>
      <Link to="/dashboard">
        <button className="btn dark">&#8629; VOLTAR</button>
      </Link>
    </form>
  );
}
