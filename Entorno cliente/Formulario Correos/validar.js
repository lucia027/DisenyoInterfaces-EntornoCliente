// Funciones reutilizables. No hay eventos, modales ni acceso al HTML.

function validarLongitud(texto, minimo, maximo) {
    const longitud = String(texto).trim().length;
    return longitud >= minimo && longitud <= maximo;
}

function validarDni(texto) {
    const dni = String(texto).trim().toUpperCase();
    if (!/^\d{8}[A-Z]$/.test(dni)) return false;
    return dni[8] === "TRWAGMYFPDXBNJZSQVHLCKE"[Number(dni.slice(0, 8)) % 23];
}

function validarNie(texto) {
    const nie = String(texto).trim().toUpperCase();
    if (!/^[XYZ]\d{7}[A-Z]$/.test(nie)) return false;
    const numero = { X: "0", Y: "1", Z: "2" }[nie[0]] + nie.slice(1, 8);
    return nie[8] === "TRWAGMYFPDXBNJZSQVHLCKE"[Number(numero) % 23];
}

function validarCif(texto) {
    const cif = String(texto).trim().toUpperCase();
    if (!/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(cif)) return false;

    let suma = 0;

    for (let i = 1; i <= 7; i++) {
        const numero = Number(cif[i]);

        if (i % 2 === 0) {
            suma += numero;
        } else {
            const doble = numero * 2;
            suma += Math.floor(doble / 10) + doble % 10;
        }
    }

    const control = (10 - suma % 10) % 10;
    const ultimo = cif[8];
    const cifra = String(control);
    const letra = "JABCDEFGHI"[control];

    if ("ABEH".includes(cif[0])) return ultimo === cifra;
    if ("NPQRSW".includes(cif[0])) return ultimo === letra;

    return ultimo === cifra || ultimo === letra;
}

function validarDocumento(tipo, numero) {
    if (tipo === "NIF") return validarDni(numero);
    if (tipo === "NIE") return validarNie(numero);
    if (tipo === "CIF") return validarCif(numero);
    return false;
}

// PROVINCIAS ESPAÑOLAS

const PROVINCIAS = [
    "Álava", "Albacete", "Alicante", "Almería", "Ávila", "Badajoz",
    "Illes Balears", "Barcelona", "Burgos", "Cáceres", "Cádiz", "Castellón",
    "Ciudad Real", "Córdoba", "A Coruña", "Cuenca", "Girona", "Granada",
    "Guadalajara", "Gipuzkoa", "Huelva", "Huesca", "Jaén", "León",
    "Lleida", "La Rioja", "Lugo", "Madrid", "Málaga", "Murcia",
    "Navarra", "Ourense", "Asturias", "Palencia", "Las Palmas", "Pontevedra",
    "Salamanca", "Santa Cruz de Tenerife", "Cantabria", "Segovia", "Sevilla",
    "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid",
    "Bizkaia", "Zamora", "Zaragoza", "Ceuta", "Melilla"
];

function validarCodigoPostal(texto) {
    const cp = String(texto).trim();

    return /^\d{5}$/.test(cp) &&
        Number(cp.slice(0, 2)) >= 1 &&
        Number(cp.slice(0, 2)) <= 52;
}

function obtenerProvincia(codigoPostal) {
    if (!validarCodigoPostal(codigoPostal)) return "";

    return PROVINCIAS[Number(String(codigoPostal).slice(0, 2)) - 1];
}

// TELÉFONO Y EMAIL

function validarTelefono(texto) {
    return /^[679]\d{8}$/.test(String(texto).trim());
}

function validarEmail(texto) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(texto).trim());
}

// PESO: PARTE ENTERA Y DOS DECIMALES

function validarPeso(texto) {
    const valor = String(texto).trim();

    return /^\d+[.,]\d{2}$/.test(valor) &&
        Number(valor.replace(",", ".")) > 0;
}

// NÚMEROS POSITIVOS: IMPORTES Y DIMENSIONES

function validarNumeroPositivo(texto) {
    const valor = String(texto).trim();

    return /^\d+(?:[.,]\d+)?$/.test(valor) &&
        Number(valor.replace(",", ".")) > 0;
}

// CÁLCULO DEL PESO VOLUMÉTRICO

function calcularPesoVolumetrico(alto, ancho, largo) {
    const valores = [alto, ancho, largo].map(
        v => Number(String(v).replace(",", "."))
    );

    if (!valores.every(v => Number.isFinite(v) && v > 0)) {
        return null;
    }

    return valores[0] * valores[1] * valores[2] / 6000;
}

// VALIDACIÓN DE FECHA POSTERIOR A 7 DÍAS

function validarFechaPosterior(texto, dias = 7, hoy = new Date()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;

    const [anio, mes, dia] = texto.split("-").map(Number);
    const fecha = new Date(anio, mes - 1, dia);

    if (
        fecha.getFullYear() !== anio ||
        fecha.getMonth() !== mes - 1 ||
        fecha.getDate() !== dia
    ) {
        return false;
    }

    const limite = new Date(
        hoy.getFullYear(),
        hoy.getMonth(),
        hoy.getDate()
    );

    limite.setDate(limite.getDate() + dias);

    return fecha > limite;
}

// VALIDACIÓN DE IBAN

function validarIban(texto) {
    const longitudes = {
        AD:24, AE:23, AL:28, AT:20, AZ:28, BA:20, BE:16, BG:22,
        BH:22, BR:29, BY:28, CH:21, CR:22, CY:28, CZ:24, DE:22,
        DK:18, DO:28, EE:20, EG:29, ES:24, FI:18, FO:18, FR:27,
        GB:22, GE:22, GI:23, GL:18, GR:27, GT:28, HR:21, HU:28,
        IE:22, IL:23, IQ:23, IS:26, IT:27, JO:30, KW:30, KZ:20,
        LB:28, LC:32, LI:21, LT:20, LU:20, LV:21, MC:27, MD:24,
        ME:22, MK:19, MR:27, MT:31, MU:30, NL:18, NO:15, PK:24,
        PL:28, PS:29, PT:25, QA:29, RO:24, RS:22, SA:24, SC:31,
        SE:24, SI:19, SK:24, SM:27, ST:25, SV:28, TL:23, TN:24,
        TR:26, UA:29, VA:22, VG:24, XK:20
    };

    const iban = String(texto).replace(/\s/g, "").toUpperCase();

    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) return false;

    if (iban.length !== longitudes[iban.slice(0, 2)]) {
        return false;
    }

    const reorganizado = iban.slice(4) + iban.slice(0, 4);
    let resto = 0;

    for (const caracter of reorganizado) {
        const digitos = /[A-Z]/.test(caracter)
            ? String(caracter.charCodeAt(0) - 55)
            : caracter;

        for (const digito of digitos) {
            resto = (resto * 10 + Number(digito)) % 97;
        }
    }

    return resto === 1;
}