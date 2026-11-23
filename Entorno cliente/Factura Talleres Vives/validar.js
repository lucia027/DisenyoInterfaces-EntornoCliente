
/* Funciones genéricas reutilizables en formularios y otras aplicaciones. */
'use strict';

const Validar = (() => {
    function crearElemento(etiqueta, clases = '', texto = '') {
        const elemento = document.createElement(etiqueta);
        if (clases) elemento.className = clases;
        if (texto !== '') elemento.textContent = texto;
        return elemento;
    }

    function validarTexto(valor, minimo = 1, maximo = Infinity) {
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

    return {
        crearElemento, validarTexto, validarDecimal, aNumero,
        redondear, formatearMoneda, mostrarValidacion
    };
})();