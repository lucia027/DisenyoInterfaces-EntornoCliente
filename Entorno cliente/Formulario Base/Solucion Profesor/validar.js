// Funciones de validación: reciben un dato y devuelven true/false
// (sin expresiones regulares, comprobando carácter a carácter)

function esDigito(caracter) {
  return caracter >= "0" && caracter <= "9";
}

function esLetraMayuscula(caracter) {
  return caracter >= "A" && caracter <= "Z";
}

function esLetraMinuscula(caracter) {
  return caracter >= "a" && caracter <= "z";
}

function esLetraONumero(caracter) {
  return esDigito(caracter) || esLetraMayuscula(caracter) || esLetraMinuscula(caracter);
}

function validarLongitud(texto, min, max) {
  return texto.length >= min && texto.length <= max;
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

function validarTelefono(telefono) {
  // Debe tener 9 dígitos y empezar por 6, 7 o 9
  if (!validarSoloNumeros(telefono, 9)) {
    return false;
  }

  const primerDigito = telefono.charAt(0);
  return primerDigito === "6" || primerDigito === "7" || primerDigito === "9";
}

function validarContrasena(contrasena) {
  // Entre 8 y 16 caracteres, solo letras/números, con al menos
  // 1 mayúscula, 1 minúscula y 1 número
  if (!validarLongitud(contrasena, 8, 16)) {
    return false;
  }

  let tieneMayuscula = false;
  let tieneMinuscula = false;
  let tieneNumero = false;

  for (let i = 0; i < contrasena.length; i++) {
    const caracter = contrasena.charAt(i);

    if (!esLetraONumero(caracter)) {
      return false; // hay un carácter que no es letra ni número
    }

    if (esLetraMayuscula(caracter)) tieneMayuscula = true;
    if (esLetraMinuscula(caracter)) tieneMinuscula = true;
    if (esDigito(caracter)) tieneNumero = true;
  }

  return tieneMayuscula && tieneMinuscula && tieneNumero;
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

function validarSeleccionMultiple(select) {
  return select.selectedOptions.length > 0;
}