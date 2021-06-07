import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import FirebaseContext from "../../firebase/context";
import Error404 from "../../components/layout/404";
import Layout from "../../components/layout/Layout";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Campo, InputSubmit } from "../../components/ui/Formulario";
import Boton from "../../components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;
const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Producto = () => {
  const [producto, setProducto] = useState({});
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});
  const [consultarDB, setConsultarDB] = useState(true);

  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoDb = await firebase.db.collection("productos").doc(id);
        const producto = await productoDb.get();
        if (producto.exists) {
          setProducto(producto.data());
          setConsultarDB(false);
        } else {
          setError(true);
          setConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando...";

  const {
    nombre,
    empresa,
    url,
    descripcion,
    votos,
    comentarios,
    urlImagen,
    creado,
    creador,
    ahVotado,
  } = producto;

  const votar = () => {
    if (!usuario) {
      return router.push("/login");
    }
    const total = votos + 1;
    if (ahVotado.includes(usuario.uid)) return;
    const hanVotado = [...ahVotado, usuario.uid];
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: total, ahVotado: hanVotado });
    setProducto({
      ...producto,
      votos: total,
    });
    setConsultarDB(true);
  };

  const onChangeComentario = (e) => {
    setComentario({ ...comentario, [e.target.name]: e.target.value });
  };

  const esCreador = (id) => {
    if (creador.id === id) return true;
  };

  const comentar = (e) => {
    e.preventDefault();
    if (!usuario) {
      return router.push("/login");
    }
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;
    const nuevosComentarios = [...comentarios, comentario];
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ comentarios: nuevosComentarios });
    setProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });
    setConsultarDB(true);
  };

  const puedeBorrar = (id) => {
    if (!usuario) return false;
    if (creador.id === usuario.uid) return true;
  };

  const eliminar = async() => {
    if (!usuario) {
      return router.push("/login");
    }
    if (creador.id !== usuario.uid) return router.push("/login");
    try {
      await firebase.db.collection("productos").doc(id).delete();
      return router.push("/");
    } catch (error) {
      console.log("Error");
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404></Error404>
        ) : (
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>
            <ContenedorProducto>
              <div>
                <p>
                  Publicado hace:{" "}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por: {creador.nombre} de {empresa}
                </p>
                <img src={urlImagen} />
                <p>{descripcion}</p>

                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={comentar}>
                      <Campo>
                        <input
                          onChange={onChangeComentario}
                          type="text"
                          name="mensaje"
                        ></input>
                      </Campo>
                      <InputSubmit
                        type="submit"
                        value="Agregar Comentario"
                      ></InputSubmit>
                    </form>
                  </>
                )}

                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  "Aún no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {""} {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es Creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <Boton target="_blank" bgColor="true" herf="{url}">
                  Visitar URL
                </Boton>
                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  {usuario && (
                    <Boton
                      onClick={votar}
                      css={css`
                        text-align: center;
                      `}
                    >
                      Votar
                    </Boton>
                  )}
                  <p>{votos} Votos</p>
                </div>
              </aside>
            </ContenedorProducto>
            {puedeBorrar() && (
              <Boton onClick={eliminar}>Eliminar producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
