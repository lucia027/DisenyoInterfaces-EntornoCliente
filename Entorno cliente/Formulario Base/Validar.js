function validarLongitud(texto, min, max) {
  return texto.length >= min && texto.length <= max;
}

function validarTelefono(telefono) {
  // Debe tener 9 dígitos y empezar por 6, 7 o 9
  if (!validarSoloNumeros(telefono, 9)) {
    return false;
  }

  const primerDigito = telefono.charAt(0);
  return primerDigito === "6" ||
         primerDigito === "7" ||
         primerDigito === "9";
}

function validarCodigoPostal(codigoPostal) {
  const regex = /^[0-9]{5}$/;
  return regex.test(codigoPostal) &&
         codigoPostal >= 1001 &&
         codigoPostal <= 52006;
}

function validarSoloNumeros(texto, longitud) {
  if (texto.length !== longitud) {
    return false;
  }

  for (let i = 0; i < texto.length; i++) {
    if (!esDigito(texto.charAt(i))) {
      return false;
    }
  }

  return true;
}

function esDigito(caracter) {
  return caracter >= "0" && caracter <= "9";
}

function validarRadioMarcado(nombreGrupo) {
  const opciones = document.getElementsByName(nombreGrupo);

  for (let i = 0; i < opciones.length; i++) {
    if (opciones[i].checked) {
      return true;
    }
  }

  return false;
}