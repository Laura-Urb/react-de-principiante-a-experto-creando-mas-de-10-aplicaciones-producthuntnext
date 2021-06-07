import React, { useState, useContext } from "react";
import { css } from "@emotion/core";
import Router, { useRouter } from "next/router";
import Layout from "../components/layout/Layout";
import FileUploader from "react-firebase-file-uploader";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error,
} from "../components/ui/Formulario";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearProducto from "../validacion/validarCrearProducto";
import firebase, { FirebaseContext } from "../firebase";
import Error404 from "../components/layout/404";

const STATE_INICIAL = {
  nombre: "",
  empresa: "",
  url: "",
  descripcion: "",
};
const NuevoProducto = () => {
  const [error, guardarError] = useState(false);
  const [nombreImagen, setNombreImagen] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImagen, setUrlImagen] = useState("");

  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, url, descripcion } = valores;

  const { usuario, firebase } = useContext(FirebaseContext);

  const router = useRouter();

  async function crearProducto() {
    try {
      if (!usuario) {
        return router.push("/login");
      }
      const producto = {
        nombre,
        empresa,
        url,
        descripcion,
        votos: 0,
        comentarios: [],
        urlImagen,
        creado: Date.now(),
        creador: {
          id: usuario.uid,
          nombre: usuario.displayName,
        },
        ahVotado: []
      };
      firebase.db.collection("productos").add(producto);
      return router.push("/");
    } catch (error) {
      guardarError(error.message);
    }
  }

  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };

  const handleProgress = (progress) => {
    setProgreso(progress);
  };

  const handleUploadError = (error) => {
    setSubiendo(error);
    console.error(error);
  };

  const handleUploadSuccess = (filename) => {
    setProgreso(100);
    setSubiendo(false);
    setNombreImagen(filename);
    firebase.storage
      .ref("pruductos")
      .child(filename)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        setUrlImagen(url);
      });
  };
  return (
    <div>
      <Layout>
        {!usuario ? (
          <Error404></Error404>
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              Nuevo Producto
            </h1>
            <Formulario onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>Información General</legend>
                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    placeholder="Tu Nombre"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input
                    type="text"
                    id="empresa"
                    placeholder="Empresa"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <FileUploader
                    accept="image/*"
                    name="imagen"
                    id="imagen"
                    randomizeFilename
                    storageRef={firebase.storage.ref("pruductos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
                </Campo>

                <Campo>
                  <label htmlFor="url">URL</label>
                  <input
                    type="url"
                    id="url"
                    placeholder="URL"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.url && <Error>{errores.url}</Error>}
              </fieldset>

              <fieldset>
                <legend>Sobre tu producto</legend>
                <Campo>
                  <label htmlFor="descripcion">Descripcion</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>

              {error && <Error>{error}</Error>}

              <InputSubmit type="submit" value="Crear Producto" />
            </Formulario>
          </>
        )}
      </Layout>
    </div>
  );
};

export default NuevoProducto;
