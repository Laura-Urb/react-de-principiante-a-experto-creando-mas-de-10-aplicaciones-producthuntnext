export default function validarCrearProducto(valores) {
  let errores = {};

  if (!valores.nombre) {
    errores.nombre = "El Nombre es obligatorio";
  }
  if (!valores.empresa) {
    errores.empresa = "La empresa es obligatoria";
  }
  if (!valores.url) {
    errores.url = "La url es obligatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "La url está mal formateada";
  }
  if (!valores.descripcion) {
    errores.descripcion = "La descripcion es obligatoria";
  }

  return errores;
}
