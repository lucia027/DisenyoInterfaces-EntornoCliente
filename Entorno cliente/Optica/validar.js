function esDigito(caracter) {
    return caracter >= "0" && caracter <= "9";
}

function validarLongitud(texto, minimo, maximo) {
    return texto.length >= minimo && texto.length <= maximo;
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

function validarDni(texto) {

    texto = texto.trim().toUpperCase();

    if (texto.length !== 9) {
        return false;
    }

    const numeros = texto.substring(0, 8);
    const letra = texto.charAt(8);

    if (!validarSoloNumeros(numeros, 8)) {
        return false;
    }

    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const posicion = parseInt(numeros) % 23;

    return letra === letras.charAt(posicion);
}

function validarFecha(texto) {

    if (texto.length !== 10) {
        return false;
    }

    if (texto.charAt(2) !== "/" || texto.charAt(5) !== "/") {
        return false;
    }

    const diaTexto = texto.substring(0, 2);
    const mesTexto = texto.substring(3, 5);
    const anioTexto = texto.substring(6, 10);

    if (
        !validarSoloNumeros(diaTexto, 2) ||
        !validarSoloNumeros(mesTexto, 2) ||
        !validarSoloNumeros(anioTexto, 4)
    ) {
        return false;
    }

    const dia = parseInt(diaTexto);
    const mes = parseInt(mesTexto);
    const anio = parseInt(anioTexto);

    const fecha = new Date(anio, mes - 1, dia);

    return (
        fecha.getDate() === dia &&
        fecha.getMonth() === mes - 1 &&
        fecha.getFullYear() === anio
    );
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

function validarArchivo(campo, tiposPermitidos, extensionesPermitidas) {

    if (campo.files.length === 0) {
        return false;
    }

    const archivo = campo.files[0];
    const nombreArchivo = archivo.name.toLowerCase();

    const tipoCorrecto = tiposPermitidos.includes(archivo.type);
    const extensionCorrecta = extensionesPermitidas.some(extension => nombreArchivo.endsWith(extension));

    return tipoCorrecto && extensionCorrecta;
}

function validarSeleccion(valor) {
    return valor !== "";
}