import React from "react";
import Layout from "../components/layout/Layout";
import { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../firebase";
import Producto from "../components/layout/Producto";
import useProductos from "../hooks/useProductos";

const Populares = () => {
  const { productos } = useProductos("votos");
  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {productos.map((producto) => (
                <Producto key={producto.id} producto={producto}></Producto>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
      {/* <style jsx>{`
        h1 {
          color: red;
        }
      `}</style>
      Es más performante porque se carga cuando ya renderizó */}
    </div>
  );
};

export default Populares;
