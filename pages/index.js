import Head from "next/head";
import styled from "@emotion/styled";
import Layout from "../components/layout/Layout";
import Producto from "../components/layout/Producto";
import useProductos from "../hooks/useProductos";

export default function Home() {
 
  const { productos } = useProductos("creado");

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
}
