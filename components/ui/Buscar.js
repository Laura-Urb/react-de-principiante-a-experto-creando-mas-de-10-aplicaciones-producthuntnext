import React, { useState, useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { FirebaseContext } from "../../firebase";
import Router from "next/router";

const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 1rem;
  min-width: 300px;
`;
const InputSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 4rem;
  background-image: url("/static/img/buscar.png");
  background-repeat: no-repeat;
  position: absolute;
  right: 1rem;
  top: 1px;
  background-color: white;
  border: none;
  text-indent: -9999px;
  &:hover {
    cursor: pointer;
  }
`;

const Buscar = () => {
  const [busqueda, setBusqueda] = useState("");
   
  const onChange = (e) => {
    setBusqueda(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (busqueda.trim() === "") return;
    Router.push({ pathname: "/buscar", query: { q: busqueda } });
  };

  return (
    <form
      onSubmit={onSubmit}
      css={css`
        position: relative;
      `}
    >
      <InputText
        onChange={onChange}
        type="text"
        placeholder="Buscar Producto"
      ></InputText>
      <InputSubmit type="submit">Buscar</InputSubmit>
    </form>
  );
};

export default Buscar;
