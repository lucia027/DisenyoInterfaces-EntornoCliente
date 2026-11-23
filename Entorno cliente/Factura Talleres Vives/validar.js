
// Funciones de validación que se pueden usar en otros ejercicios.
// No hay eventos aquí: los eventos van en el script del index.
'use strict';

function crearElemento(etiqueta, clases = '', texto = '') {
    const elemento = document.createElement(etiqueta);
    if (clases) elemento.className = clases;
    if (texto !== '') elemento.textContent = texto;
    return elemento;
}

function validarLongitud(valor, minimo = 1, maximo = Infinity) {
    const longitud = String(valor).trim().length;
    return longitud >= minimo && longitud <= maximo;
}

// Permite de 1 a 3 dígitos enteros y hasta 2 decimales; acepta coma o punto.
function validarDecimal(valor, enteros = 3, decimales = 2, permitirCero = true) {
    const texto = String(valor).trim();
    const patron = new RegExp(`^\\d{1,${enteros}}(?:[.,]\\d{1,${decimales}})?$`);
    if (!patron.test(texto)) return false;
    const numero = Number(texto.replace(',', '.'));
    return Number.isFinite(numero) && (permitirCero ? numero >= 0 : numero > 0);
}

function aNumero(valor) {
    return Number(String(valor).trim().replace(',', '.'));
}

function redondear(valor, decimales = 2) {
    const factor = 10 ** decimales;
    return Math.round((valor + Number.EPSILON) * factor) / factor;
}

function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency', currency: 'EUR'
    }).format(valor);
}

// Las clases de Bootstrap muestran la validación sin estilos CSS adicionales.
function mostrarValidacion(campo, correcto, mensaje = '') {
    campo.classList.toggle('is-invalid', !correcto);
    campo.classList.toggle('is-valid', correcto);
    const aviso = campo.parentElement.querySelector('.invalid-feedback');
    if (aviso && mensaje) aviso.textContent = mensaje;
    return correcto;
}

function validarCodigoPostal(valor) {
    const cp = String(valor).trim();
    return /^\d{5}$/.test(cp) && Number(cp.slice(0, 2)) >= 1 && Number(cp.slice(0, 2)) <= 52;
}

const provincias = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Ávila', 'Badajoz',
    'Illes Balears', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Castellón',
    'Ciudad Real', 'Córdoba', 'A Coruña', 'Cuenca', 'Girona', 'Granada',
    'Guadalajara', 'Gipuzkoa', 'Huelva', 'Huesca', 'Jaén', 'León',
    'Lleida', 'La Rioja', 'Lugo', 'Madrid', 'Málaga', 'Murcia',
    'Navarra', 'Ourense', 'Asturias', 'Palencia', 'Las Palmas', 'Pontevedra',
    'Salamanca', 'Santa Cruz de Tenerife', 'Cantabria', 'Segovia', 'Sevilla',
    'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid',
    'Bizkaia', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla'
];

function obtenerProvincia(cp) {
    return validarCodigoPostal(cp) ? provincias[Number(String(cp).slice(0, 2)) - 1] : '';
}

function validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(valor).trim());
}

function validarTelefono(valor) {
    return /^[679]\d{8}$/.test(String(valor).trim());
}

function validarNif(valor) {
    const nif = String(valor).trim().toUpperCase();
    return /^\d{8}[A-Z]$/.test(nif) &&
        nif[8] === 'TRWAGMYFPDXBNJZSQVHLCKE'[Number(nif.slice(0, 8)) % 23];
}

function validarNie(valor) {
    const nie = String(valor).trim().toUpperCase();
    if (!/^[XYZ]\d{7}[A-Z]$/.test(nie)) return false;
    const numero = { X: '0', Y: '1', Z: '2' }[nie[0]] + nie.slice(1, 8);
    return nie[8] === 'TRWAGMYFPDXBNJZSQVHLCKE'[Number(numero) % 23];
}

function validarCif(valor) {
    const cif = String(valor).trim().toUpperCase();
    if (!/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(cif)) return false;

    let suma = 0;

    for (let i = 1; i <= 7; i++) {
        const n = Number(cif[i]);

        if (i % 2 === 0) suma += n;
        else {
            const doble = n * 2;
            suma += Math.floor(doble / 10) + doble % 10;
        }
    }

    const control = (10 - suma % 10) % 10;

    if ('ABEH'.includes(cif[0])) return cif[8] === String(control);
    if ('NPQRSW'.includes(cif[0])) return cif[8] === 'JABCDEFGHI'[control];

    return cif[8] === String(control) || cif[8] === 'JABCDEFGHI'[control];
}

function validarDocumento(valor) {
    return validarNif(valor) || validarNie(valor) || validarCif(valor);
}