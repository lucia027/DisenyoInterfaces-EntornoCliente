/* ============================================================================
   KIT DE EXAMEN · 2º · DESARROLLO WEB EN ENTORNO CLIENTE / DISEÑO DE INTERFACES
   VALIDAR.JS — funciones reutilizables + prácticas completas + Bootstrap local.
   ============================================================================
   CONECTAR: <script src="validar.js" defer></script> (en el <head>).
   En otra página puedes llamar a las funciones desde tu propio script después
   de cargar este archivo, o desde DOMContentLoaded. No se valida ni modifica
   ningún formulario automáticamente salvo que abras un ejemplo del kit.

   BUSCAR CON Ctrl+F:
    01 · VALIDACIONES DE TEXTO, NÚMEROS, DOCUMENTOS, FECHAS Y CONTRASEÑAS
    02 · PROVINCIAS, CP, IBAN, ARCHIVOS, RADIOS, CHECKBOX Y SELECT
    03 · DINERO, DECIMALES, IVA Y OPERACIONES CON ARRAYS
    04 · DOM, VALIDACIÓN VISUAL, EVENTOS Y BOOTSTRAP
    05 · SELECTS DEPENDIENTES, LISTAS Y TABLAS DINÁMICAS
    06 · FILTROS, AUTOCOMPLETE, CAPS LOCK, CLIPBOARD Y CONTADOR
    07 · FECHAS, MENÚ RESPONSIVE, CARRUSEL, FETCH Y MAPAS
    08 · PRÁCTICAS COMPLETAS (cada función iniciarDemo_* es independiente)
    09 · NAVEGACIÓN Y VISOR DE CÓDIGO DEL KIT
    10 · BOOTSTRAP 5.3.6 BUNDLE INTEGRADO (no editar el código de la librería)

   CONVENCIÓN: validar...(valor) devuelve true o false. comprobar...(campo)
   puede pintar el HTML. .value devuelve texto, incluso en input type=number.
   Para un dato obligatorio usa trim() o una regla de longitud. Los nombres
   originales se conservan siempre que no choquen; los métodos alternativos
   tienen un nombre descriptivo. Las prácticas conservan sus reglas concretas.
   VALIDACIÓN DEL CLIENTE: mejora la UX; no sustituye la validación del servidor.
   ============================================================================ */

// ============================================================================
// 01 · VALIDACIONES DE TEXTO, NÚMEROS, DOCUMENTOS, FECHAS Y CONTRASEÑAS
// ============================================================================

/** Comprueba un único dígito ASCII. Ej.: esDigito('7') -> true. */
// Uso: esDigito(c).
function esDigito(c) {
    return typeof c === 'string' && c.length === 1 && c >= '0' && c <= '9';
}
/** Letras ASCII (sin tildes): variante sin expresiones regulares del profesor. */
// Uso: esLetraMayuscula(c).
function esLetraMayuscula(c) {
    return typeof c === 'string' && c.length === 1 && c >= 'A' && c <= 'Z';
}
// esLetraMinuscula: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: esLetraMinuscula(c).
function esLetraMinuscula(c) {
    return typeof c === 'string' && c.length === 1 && c >= 'a' && c <= 'z';
}
// esLetraONumero: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: esLetraONumero(c).
function esLetraONumero(c) {
    return esDigito(c) || esLetraMayuscula(c) || esLetraMinuscula(c);
}

/** Longitud inclusiva, ignorando espacios al principio y al final (Talleres).
 *  Ej.: validarLongitud(nombre.value, 2, 100). No pasa un nombre vacío. */
// Uso: validarLongitud(valor, minimo, maximo).
function validarLongitud(valor, minimo = 1, maximo = Infinity) {
    const longitud = String(valor ?? '').trim().length;
    return longitud >= minimo && longitud <= maximo;
}
/** Variante de los primeros formularios: cuenta los espacios tal como están. */
// Uso: validarLongitudSinTrim(texto, minimo, maximo).
function validarLongitudSinTrim(texto, minimo, maximo = Infinity) {
    return String(texto ?? '').length >= minimo && String(texto ?? '').length <= maximo;
}
// validarObligatorio: devuelve true si la comprobación es correcta.
// Uso: validarObligatorio(valor).
function validarObligatorio(valor) {
    return String(valor ?? '').trim() !== '';
}
/** Exactamente N dígitos; permite ceros iniciales. NO convertir el CP o DNI a número. */
// Uso: validarSoloNumeros(texto, longitud).
function validarSoloNumeros(texto, longitud) {
    texto = String(texto ?? '');
    if (texto.length !== longitud) return false;
    for (let i = 0; i < texto.length; i++) if (!esDigito(texto.charAt(i))) return false;
    return true;
}
/** Número finito (no vacío, no Infinity). Para entero añade Number.isInteger. */
// Uso: validarNumero(valor, minimo, maximo, entero).
function validarNumero(valor, minimo = -Infinity, maximo = Infinity, entero = false) {
    if (!validarObligatorio(valor)) return false;
    const n = Number(valor);
    return Number.isFinite(n) && n >= minimo && n <= maximo && (!entero || Number.isInteger(n));
}
// validarEntero: devuelve true si la comprobación es correcta.
// Uso: validarEntero(valor, minimo, maximo).
function validarEntero(valor, minimo = -Infinity, maximo = Infinity) {
    return validarNumero(valor, minimo, maximo, true);
}
/** Teléfono español de 9 dígitos y prefijo 6, 7 o 9. opcional=true acepta vacío. */
// Uso: validarTelefono(valor, opcional).
function validarTelefono(valor, opcional = false) {
    const texto = String(valor ?? '').trim();
    return (opcional && texto === '') || /^[679]\d{8}$/.test(texto);
}
// validarTelefonoSinRegex: devuelve true si la comprobación es correcta.
// Uso: validarTelefonoSinRegex(texto).
function validarTelefonoSinRegex(texto) {
    return validarSoloNumeros(texto, 9) && ['6', '7', '9'].includes(texto.charAt(0));
}
/** Email de Talleres: sin espacios, @, punto y sufijo de 2 o más caracteres. */
// Uso: validarEmail(valor).
function validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(valor ?? '').trim());
}
/** Variante de Form.html / W3Schools (sufijo de al menos un carácter). */
// Uso: validarEmailBasico(valor).
function validarEmailBasico(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor ?? '').trim());
}

/** DNI español: 8 cifras + letra de control, módulo 23. Ej.: 12345678Z. */
// Uso: validarDni(texto).
function validarDni(texto) {
    texto = String(texto ?? '').trim().toUpperCase();
    if (texto.length !== 9 || !validarSoloNumeros(texto.substring(0, 8), 8)) return false;
    return texto.charAt(8) === 'TRWAGMYFPDXBNJZSQVHLCKE'.charAt(parseInt(texto.substring(0, 8), 10) % 23);
}
// validarNif: devuelve true si la comprobación es correcta.
// Uso: validarNif(valor).
function validarNif(valor) {
    return validarDni(valor);
}
/** NIE: sustituye X/Y/Z por 0/1/2 y calcula la letra igual que el DNI. */
// Uso: validarNie(valor).
function validarNie(valor) {
    const nie = String(valor ?? '').trim().toUpperCase();
    if (!/^[XYZ]\d{7}[A-Z]$/.test(nie)) return false;
    const numero = { X: '0', Y: '1', Z: '2' }[nie[0]] + nie.slice(1, 8);
    return nie[8] === 'TRWAGMYFPDXBNJZSQVHLCKE'[Number(numero) % 23];
}
/** Variante de los apuntes Bootstrap: admite DNI o NIE, espacios y guiones. */
// Uso: validarDNI(valor).
function validarDNI(valor) {
    const v = String(valor ?? '').toUpperCase().replace(/[\s-]/g, '');
    return validarDni(v) || validarNie(v);
}
/** CIF/NIF de entidad: letra inicial, 7 cifras, carácter de control. Regla de Talleres. */
// Uso: validarCif(valor).
function validarCif(valor) {
    const cif = String(valor ?? '').trim().toUpperCase();
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
// validarDocumento: devuelve true si la comprobación es correcta.
// Uso: validarDocumento(valor).
function validarDocumento(valor) {
    return validarNif(valor) || validarNie(valor) || validarCif(valor);
}

/** dd/mm/aaaa ESTRICTO, también comprueba días inexistentes y años bisiestos.
 *  Date normaliza fechas imposibles; por eso se comparan otra vez día/mes/año. */
// Uso: fechaDesdeTexto(texto).
function fechaDesdeTexto(texto) {
    const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(texto ?? ''));
    if (!partes) return null;
    const [, d, m, a] = partes.map(Number);
    if (a < 1 || m < 1 || m > 12 || d < 1 || d > 31) return null;
    const fecha = new Date(0);
    fecha.setHours(0, 0, 0, 0);
    fecha.setFullYear(a, m - 1, d);
    return fecha.getDate() === d && fecha.getMonth() === m - 1 && fecha.getFullYear() === a ? fecha : null;
}
// validarFecha: devuelve true si la comprobación es correcta.
// Uso: validarFecha(texto).
function validarFecha(texto) {
    return fechaDesdeTexto(texto) !== null;
}
/** Para input type=date (AAAA-MM-DD), no dd/mm/aaaa. */
// Uso: fechaDesdeISO(texto).
function fechaDesdeISO(texto) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(texto ?? ''));
    return m ? fechaDesdeTexto(`${m[3]}/${m[2]}/${m[1]}`) : null;
}
// validarFechaISO: devuelve true si la comprobación es correcta.
// Uso: validarFechaISO(texto).
function validarFechaISO(texto) {
    return fechaDesdeISO(texto) !== null;
}
/** Óptica: a partir de mañana (inclusive). Evita comparar horas distintas. */
// Uso: validarFechaDeseada(texto).
function validarFechaDeseada(texto) {
    const fecha = fechaDesdeTexto(String(texto ?? '').trim());
    const manana = new Date();
    manana.setHours(0, 0, 0, 0);
    manana.setDate(manana.getDate() + 1);
    return fecha !== null && fecha >= manana;
}
/** Años cumplidos. Devuelve NaN si la fecha no es válida. */
// Uso: calcularEdad(fechaISO, hoy).
function calcularEdad(fechaISO, hoy = new Date()) {
    const nac = fechaDesdeISO(fechaISO);
    if (!nac) return NaN;
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
}
/** Contraseña del formulario base: 8-16, SOLO letras ASCII y números;
 *  debe tener una mayúscula, una minúscula y un dígito. Sin regex. */
// Uso: validarContrasena(contrasena).
function validarContrasena(contrasena) {
    if (!validarLongitudSinTrim(contrasena, 8, 16)) return false;
    let mayuscula = false, minuscula = false, numero = false;
    for (const c of contrasena) {
        if (!esLetraONumero(c)) return false;
        if (esLetraMayuscula(c)) mayuscula = true;
        if (esLetraMinuscula(c)) minuscula = true;
        if (esDigito(c)) numero = true;
    }
    return mayuscula && minuscula && numero;
}
/** W3Schools / registro: mínimo 8, mayúscula, minúscula y número; sin máximo. */
// Uso: validarContrasenaW3(pw, minimo).
function validarContrasenaW3(pw, minimo = 8) {
    return typeof pw === 'string' && pw.length >= minimo && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw);
}
// validarContrasenasIguales: devuelve true si la comprobación es correcta.
// Uso: validarContrasenasIguales(a, b).
function validarContrasenasIguales(a, b) {
    return a !== '' && a === b;
}
/** Apuntes del profesor: devuelve un objeto de reglas y una puntuación 0-5. */
// Uso: analizarPassword(pw).
function analizarPassword(pw) {
    pw = String(pw ?? '');
    const reglas = { longitud: pw.length >= 8, mayuscula: /[A-ZÁÉÍÓÚÑ]/.test(pw), minuscula: /[a-záéíóúñ]/.test(pw), numero: /\d/.test(pw), simbolo: /[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/.test(pw) };
    return { reglas, puntos: Math.min(5, Object.values(reglas).filter(Boolean).length + (pw.length >= 12 ? 1 : 0)) };
}
/** Simulación de disponibilidad de usuario; NO consulta un servidor real. */
// Uso: comprobarUsuarioServidor(usuario).
function comprobarUsuarioServidor(usuario) {
    const ocupados = ['admin', 'root', 'usuario', 'test', 'profesor'];
    return new Promise(resolve => setTimeout(() => resolve(!ocupados.includes(String(usuario).toLowerCase())), 900));
}

// ============================================================================
// 02 · PROVINCIAS, CP, IBAN, ARCHIVOS, RADIOS, CHECKBOX Y SELECT
// ============================================================================
const PROVINCIAS = ['Álava', 'Albacete', 'Alicante', 'Almería', 'Ávila', 'Badajoz', 'Illes Balears', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Castellón', 'Ciudad Real', 'Córdoba', 'A Coruña', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Gipuzkoa', 'Huelva', 'Huesca', 'Jaén', 'León', 'Lleida', 'La Rioja', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Asturias', 'Palencia', 'Las Palmas', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Cantabria', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Bizkaia', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla'];
/** Conserva ceros iniciales: 01-52. Verifica formato/prefijo, no existencia real. */
// Uso: validarCodigoPostal(valor).
function validarCodigoPostal(valor) {
    const cp = String(valor ?? '').trim();
    return /^\d{5}$/.test(cp) && Number(cp.slice(0, 2)) >= 1 && Number(cp.slice(0, 2)) <= 52;
}
/** Variante del enunciado Formulario Pro: intervalo numérico 01001-52006. */
// Uso: validarCodigoPostalRango(valor).
function validarCodigoPostalRango(valor) {
    const cp = String(valor ?? '').trim();
    return validarCodigoPostal(cp) && Number(cp) >= 1001 && Number(cp) <= 52006;
}
// obtenerProvincia: obtiene el dato solicitado.
// Uso: obtenerProvincia(cp).
function obtenerProvincia(cp) {
    cp = String(cp ?? '').trim();
    return validarCodigoPostal(cp) ? PROVINCIAS[Number(cp.slice(0, 2)) - 1] : '';
}
/** Permite obtener provincia mientras se escribe (bastan dos cifras). */
// Uso: provinciaDeCP(cp).
function provinciaDeCP(cp) {
    cp = String(cp ?? '').trim();
    const prefijo = cp.slice(0, 2);
    return /^\d{2}$/.test(prefijo) ? PROVINCIAS[Number(prefijo) - 1] || null : null;
}
// validarProvincia: devuelve true si la comprobación es correcta.
// Uso: validarProvincia(provincia, cp).
function validarProvincia(provincia, cp) {
    return validarCodigoPostal(cp) && provincia !== '' && provincia === String(cp).slice(0, 2);
}
// rellenarProvincias: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: rellenarProvincias(select, textoInicial). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function rellenarProvincias(select, textoInicial = '- Selecciona provincia -') {
    rellenarSelect(select, PROVINCIAS.map((nombre, i) => ({ valor: String(i + 1).padStart(2, '0'), texto: nombre })), textoInicial);
}
/** campoCP y campoProvincia son elementos, no sus values. */
// Uso: conectarProvincia(campoCP, campoProvincia). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function conectarProvincia(campoCP, campoProvincia) {
    const actualizar = () => {
        campoProvincia.value = provinciaDeCP(campoCP.value) || '';
    };
    campoCP.addEventListener('input', actualizar);
    actualizar();
    return actualizar;
}
/** IBAN: módulo 97, longitud española 24. No comprueba existencia de cuenta. */
// Uso: validarIBAN(valor).
function validarIBAN(valor) {
    const s = String(valor ?? '').replace(/\s+/g, '').toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s) || (s.startsWith('ES') && !/^ES\d{22}$/.test(s))) return false;
    const numerico = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, c => String(c.charCodeAt(0) - 55));
    let resto = 0;
    for (const cifra of numerico) resto = (resto * 10 + Number(cifra)) % 97;
    return resto === 1;
}
/** Radios: agrupar con el mismo atributo name. Ej.: validarRadioMarcado('sexo'). */
// Uso: validarRadioMarcado(nombreGrupo, raiz). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function validarRadioMarcado(nombreGrupo, raiz = document) {
    return Array.from(raiz.querySelectorAll('input[type="radio"]')).some(r => r.name === nombreGrupo && r.checked);
}
// obtenerRadio: obtiene el dato solicitado.
// Uso: obtenerRadio(nombreGrupo, raiz). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function obtenerRadio(nombreGrupo, raiz = document) {
    return Array.from(raiz.querySelectorAll('input[type="radio"]')).find(r => r.name === nombreGrupo && r.checked)?.value ?? '';
}
// validarSeleccion: devuelve true si la comprobación es correcta.
// Uso: validarSeleccion(valor).
function validarSeleccion(valor) {
    return valor !== '' && valor != null;
}
// validarSeleccionMultiple: devuelve true si la comprobación es correcta.
// Uso: validarSeleccionMultiple(select). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function validarSeleccionMultiple(select) {
    return select.selectedOptions.length > 0;
}
// obtenerSeleccionados: obtiene el dato solicitado.
// Uso: obtenerSeleccionados(select). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function obtenerSeleccionados(select) {
    return Array.from(select.selectedOptions, op => op.value);
}
// obtenerChecks: obtiene el dato solicitado.
// Uso: obtenerChecks(nombreGrupo, raiz). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function obtenerChecks(nombreGrupo, raiz = document) {
    return Array.from(raiz.querySelectorAll('input[type="checkbox"]:checked')).filter(c => c.name === nombreGrupo).map(c => c.value);
}
// validarCheckbox: devuelve true si la comprobación es correcta.
// Uso: validarCheckbox(campo). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function validarCheckbox(campo) {
    return campo.checked;
}
// validarGrupoChecks: devuelve true si la comprobación es correcta.
// Uso: validarGrupoChecks(nombreGrupo, min, max, raiz). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function validarGrupoChecks(nombreGrupo, min = 1, max = Infinity, raiz = document) {
    const n = obtenerChecks(nombreGrupo, raiz).length;
    return n >= min && n <= max;
}
/** Input type=file: los dos requisitos del profesor (MIME y extensión).
 *  Ej.: validarArchivo(archivoDni,['image/jpeg','image/png'],['.jpg','.jpeg','.png']).
 *  Opcional: máximo de bytes. No demuestra el contenido real del fichero. */
// Uso: validarArchivo(campo, tiposPermitidos, extensionesPermitidas, maxBytes). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function validarArchivo(campo, tiposPermitidos, extensionesPermitidas, maxBytes = Infinity) {
    if (!campo.files || campo.files.length === 0) return false;
    return Array.from(campo.files).every(a => tiposPermitidos.includes(a.type) && extensionesPermitidas.some(e => a.name.toLowerCase().endsWith(e.toLowerCase())) && a.size <= maxBytes);
}

// ============================================================================
// 03 · DINERO, DECIMALES, IVA Y OPERACIONES CON ARRAYS
// ============================================================================
/** Cantidad entera positiva. Panadería: 1,2,3... pero no 0 ni 1,5. */
// Uso: cantidadValida(valor).
function cantidadValida(valor) {
    return validarEntero(valor, 1);
}
/** Talleres: N cifras enteras y hasta D decimales, coma o punto; sin negativos.
 *  validarDecimal('12,50',3,2,false) -> true; false permite excluir el cero. */
// Uso: validarDecimal(valor, enteros, decimales, permitirCero).
function validarDecimal(valor, enteros = 3, decimales = 2, permitirCero = true) {
    const texto = String(valor ?? '').trim();
    const patron = new RegExp(`^\\d{1,${enteros}}${decimales > 0 ? `(?:[.,]\\d{1,${decimales}})?` : ''}$`);
    if (!patron.test(texto)) return false;
    const numero = Number(texto.replace(',', '.'));
    return Number.isFinite(numero) && (permitirCero ? numero >= 0 : numero > 0);
}
/** Convertir coma decimal a punto. Validar ANTES de convertir (Number('')=0). */
// Uso: aNumero(valor).
function aNumero(valor) {
    return Number(String(valor).trim().replace(',', '.'));
}
// redondear: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: redondear(valor, decimales).
function redondear(valor, decimales = 2) {
    const factor = 10 ** decimales;
    return Math.round((valor + Number.EPSILON) * factor) / factor;
}
// formatearPrecio: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: formatearPrecio(precio).
function formatearPrecio(precio) {
    return Number(precio).toFixed(2).replace('.', ',') + ' €';
}
// formatearMoneda: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: formatearMoneda(valor).
function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(valor);
}
/** IVA por línea: la base y cuota se redondean a céntimos por separado. */
// Uso: calcularImportes(cantidad, precio, iva).
function calcularImportes(cantidad, precio, iva) {
    const base = redondear(cantidad * precio);
    const cuota = redondear(base * iva / 100);
    return { base, cuota, total: redondear(base + cuota) };
}
/** Total por IVA de un array de objetos {cantidad,precio,iva}; suma céntimos. */
// Uso: calcularTotalesIVA(lineas).
function calcularTotalesIVA(lineas) {
    const grupos = {};
    let total = 0;
    for (const linea of lineas) {
        const { base, cuota } = calcularImportes(linea.cantidad, linea.precio, linea.iva);
        const grupo = grupos[linea.iva] ??= { base: 0, cuota: 0 };
        grupo.base += Math.round(base * 100);
        grupo.cuota += Math.round(cuota * 100);
        total += Math.round(base * 100) + Math.round(cuota * 100);
    }
    for (const grupo of Object.values(grupos)) {
        grupo.base /= 100;
        grupo.cuota /= 100;
    }
    return { grupos, total: total / 100 };
}
/** Añade a la cesta o suma cantidad si ya existe. El array se modifica. */
// Uso: anadirAlPedido(pedido, producto, cantidad).
function anadirAlPedido(pedido, producto, cantidad) {
    const existente = pedido.find(l => l.nombre === producto.nombre);
    if (existente) existente.cantidad += cantidad; else pedido.push({ ...producto, cantidad });
    return pedido;
}
// totalPedido: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: totalPedido(pedido).
function totalPedido(pedido) {
    return pedido.reduce((total, l) => total + l.precio * l.cantidad, 0);
}
// borrarPosiciones: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: borrarPosiciones(lista, posiciones).
function borrarPosiciones(lista, posiciones) {
    return lista.filter((_, i) => !posiciones.includes(i));
}
// CalcularAreaRectangulo: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: CalcularAreaRectangulo(base, altura).
function CalcularAreaRectangulo(base, altura) {
    return base * altura;
}
// CalcularPerimetroRectangulo: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: CalcularPerimetroRectangulo(base, altura).
function CalcularPerimetroRectangulo(base, altura) {
    return (base + altura) * 2;
}
// ClasificarNumero: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: ClasificarNumero(numero).
function ClasificarNumero(numero) {
    return numero % 2 === 0 ? 'Es par.' : 'Es impar.';
}
// sumaRango: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: sumaRango(desde, hasta).
function sumaRango(desde, hasta) {
    let suma = 0;
    for (let i = desde; i <= hasta; i++)suma += i;
    return suma;
}
/** Entero aleatorio entre mínimo y máximo inclusive. */
// Uso: aleatorio(min, max).
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// generarCaptcha: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: generarCaptcha(min, max).
function generarCaptcha(min = 1, max = 9) {
    const a = aleatorio(min, max), b = aleatorio(min, max);
    return { texto: `${a} + ${b}`, resultado: a + b };
}

// ============================================================================
// 04 · DOM, VALIDACIÓN VISUAL, EVENTOS Y BOOTSTRAP
// ============================================================================
/** Crear DOM sin concatenar HTML de datos del usuario. Ej.: crearElemento('td','','Hola'). */
// Uso: crearElemento(etiqueta, clases, texto).
function crearElemento(etiqueta, clases = '', texto = '') {
    const el = document.createElement(etiqueta);
    if (clases) el.className = clases;
    if (texto !== '') el.textContent = String(texto);
    return el;
}
// porId: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: porId(id).
function porId(id) {
    return document.getElementById(id);
}
/** Marca Bootstrap .is-valid / .is-invalid. Devuelve el booleano para encadenar. */
// Uso: marcarCampo(campo, correcto, mensajeError). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function marcarCampo(campo, correcto, mensajeError = null) {
    campo.classList.toggle('is-invalid', !correcto);
    campo.classList.toggle('is-valid', correcto);
    campo.setAttribute('aria-invalid', String(!correcto));
    if (mensajeError) mensajeError.classList.toggle('d-block', !correcto);
    return correcto;
}
// mostrarValidacion: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: mostrarValidacion(campo, correcto, mensaje). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function mostrarValidacion(campo, correcto, mensaje = '') {
    const aviso = campo.parentElement?.querySelector('.invalid-feedback');
    if (aviso && mensaje) aviso.textContent = mensaje;
    return marcarCampo(campo, correcto, aviso);
}
/** Alternativa CSS sin Bootstrap del formulario base. */
// Uso: marcarError(campo, correcto, mensajeError). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function marcarError(campo, correcto, mensajeError = null) {
    campo.classList.toggle('campo-error', !correcto);
    campo.classList.toggle('campo-valido', correcto);
    if (mensajeError) mensajeError.classList.toggle('visible', !correcto);
    return correcto;
}
// entroEnFoco: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: entroEnFoco(elemento). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function entroEnFoco(elemento) {
    elemento.classList.add('enfoco');
}
// salirDeFoco: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: salirDeFoco(elemento). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function salirDeFoco(elemento) {
    elemento.classList.remove('enfoco');
}
// revisarObligatorio: comprueba el campo y actualiza su estado.
// Uso: revisarObligatorio(el). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function revisarObligatorio(el) {
    const ok = validarObligatorio(el.value);
    el.classList.toggle('error', !ok);
    return ok;
}
// revisarLongitud: comprueba el campo y actualiza su estado.
// Uso: revisarLongitud(el, min, max). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function revisarLongitud(el, min, max = Infinity) {
    const ok = validarLongitud(el.value, min, max);
    el.classList.toggle('error', !ok);
    return ok;
}
// revisarNumero: comprueba el campo y actualiza su estado.
// Uso: revisarNumero(el). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function revisarNumero(el) {
    const ok = validarNumero(el.value);
    el.classList.toggle('error', !ok);
    return ok;
}
// revisarEmail: comprueba el campo y actualiza su estado.
// Uso: revisarEmail(el). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function revisarEmail(el) {
    const ok = validarEmailBasico(el.value);
    el.classList.toggle('error', !ok);
    return ok;
}
/** Validar al salir, y mientras se escribe SOLO si el campo ya se comprobó. */
// Uso: conectarValidacion(campo, comprobar). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function conectarValidacion(campo, comprobar) {
    campo.addEventListener('blur', comprobar);
    campo.addEventListener('input', () => {
        if (campo.classList.contains('is-valid') || campo.classList.contains('is-invalid')) comprobar();
    });
}
/** Recibe funciones (no resultados). Ejecuta TODAS para no ocultar errores.
 *  Uso: comprobarTodas([comprobarNombre,comprobarEmail]) */
// Uso: comprobarTodas(comprobaciones).
function comprobarTodas(comprobaciones) {
    return comprobaciones.map(f => f()).every(Boolean);
}
// revisarSiValidado: comprueba el campo y actualiza su estado.
// Uso: revisarSiValidado(campo, comprobar). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function revisarSiValidado(campo, comprobar) {
    if (campo.classList.contains('is-valid') || campo.classList.contains('is-invalid')) comprobar();
}
/** Validación nativa HTML5 + Bootstrap. Usa required, pattern, min, max, etc. */
// Uso: conectarValidacionNativa(form, onCorrecto). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function conectarValidacionNativa(form, onCorrecto = () => { }) {
    form.addEventListener('submit', evento => {
        evento.preventDefault();
        form.classList.add('was-validated');
        if (form.checkValidity()) onCorrecto(form); else evento.stopPropagation();
    });
}
// limpiarValidacion: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: limpiarValidacion(form). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function limpiarValidacion(form) {
    form.classList.remove('was-validated');
    form.querySelectorAll('.is-valid,.is-invalid,.campo-error,.campo-valido').forEach(el => el.classList.remove('is-valid', 'is-invalid', 'campo-error', 'campo-valido'));
    form.querySelectorAll('input,select,textarea').forEach(el => el.setCustomValidity(''));
    form.querySelectorAll('.invalid-feedback.d-block').forEach(el => el.classList.remove('d-block'));
}
/** FormData necesita name=... en los inputs. getAll conserva selecciones múltiples. */
// Uso: datosFormulario(form). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function datosFormulario(form) {
    return new FormData(form);
}
// errorNativo: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: errorNativo(campo). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function errorNativo(campo) {
    const v = campo.validity;
    if (v.valueMissing) return 'Este campo es obligatorio';
    if (v.typeMismatch) return 'Formato no válido';
    if (v.tooShort) return `Mínimo ${campo.minLength} caracteres`;
    if (v.tooLong) return `Máximo ${campo.maxLength} caracteres`;
    if (v.patternMismatch) return campo.dataset.patron || 'Formato incorrecto';
    if (v.rangeUnderflow) return `Mínimo ${campo.min}`;
    if (v.rangeOverflow) return `Máximo ${campo.max}`;
    if (v.stepMismatch) return 'Valor no permitido';
    return '';
}
// marcarConMensaje: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: marcarConMensaje(campo, error, mensajeOk). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function marcarConMensaje(campo, error, mensajeOk = '') {
    campo.setCustomValidity(error);
    marcarCampo(campo, !error);
    const aviso = porId(campo.id + '-error');
    const exito = porId(campo.id + '-ok');
    if (aviso) aviso.textContent = error;
    if (exito) exito.textContent = mensajeOk;
}
/** Modal, toast, tooltip y popover requieren Bootstrap JS (incluido al final). */
// Uso: mostrarModal(id).
function mostrarModal(id) {
    return bootstrap.Modal.getOrCreateInstance(typeof id === 'string' ? porId(id) : id).show();
}
// ocultarModal: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: ocultarModal(id).
function ocultarModal(id) {
    bootstrap.Modal.getInstance(typeof id === 'string' ? porId(id) : id)?.hide();
}
// mostrarToast: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: mostrarToast(id).
function mostrarToast(id) {
    bootstrap.Toast.getOrCreateInstance(typeof id === 'string' ? porId(id) : id).show();
}
// activarTooltipsPopovers: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: activarTooltipsPopovers(raiz). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function activarTooltipsPopovers(raiz = document) {
    raiz.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => bootstrap.Tooltip.getOrCreateInstance(el));
    raiz.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => bootstrap.Popover.getOrCreateInstance(el));
}
/** Mostrar contraseña (1 o más inputs). Ej.: mostrarPassword([psw,repeat], checkbox.checked). */
// Uso: mostrarPassword(campos, mostrar). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function mostrarPassword(campos, mostrar) {
    const lista = Array.isArray(campos) ? campos : [campos];
    const tipo = (mostrar ?? lista[0].type === 'password') ? 'text' : 'password';
    lista.forEach(c => c.type = tipo);
}

// ============================================================================
// 05 · SELECTS DEPENDIENTES, LISTAS Y TABLAS DINÁMICAS
// ============================================================================
/** Vacía un select y lo rellena. Admite strings o {valor,texto}. */
// Uso: rellenarSelect(select, lista, textoInicial). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function rellenarSelect(select, lista, textoInicial = null) {
    select.replaceChildren();
    if (textoInicial !== null) select.add(new Option(textoInicial, ''));
    lista.forEach(item => {
        const obj = typeof item === 'object';
        select.add(new Option(obj ? item.texto : item, obj ? item.valor : item));
    });
}
/** Rango de opciones con selected. Meses: 1-12. Años: 1900-año actual. */
// Uso: crearOption(select, desde, hasta, selected). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function crearOption(select, desde, hasta, selected) {
    for (let i = desde; i <= hasta; i++)select.add(new Option(i, i, false, i === selected));
}
/** 3 selects encadenados: {grupo:{producto:[ingredientes]}}. */
// Uso: configurarSelectsDependientes(primero, segundo, tercero, datos, resultado).
function configurarSelectsDependientes(primero, segundo, tercero, datos, resultado) {
    rellenarSelect(primero, Object.keys(datos), '- Selecciona tipo -');
    function actualizarResultado() {
        if (resultado) resultado.textContent = [primero.value, segundo.value, tercero.value].every(Boolean) ? [primero.value, segundo.value, tercero.value].join(' - ') : '';
    }
    function actualizarTercero() {
        const opciones = datos[primero.value]?.[segundo.value] || [];
        rellenarSelect(tercero, opciones, '- Selecciona opción -');
        tercero.disabled = !opciones.length;
        actualizarResultado();
    }
    function actualizarSegundo() {
        const opciones = Object.keys(datos[primero.value] || {});
        rellenarSelect(segundo, opciones, '- Selecciona producto -');
        segundo.disabled = !opciones.length;
        actualizarTercero();
    }
    primero.addEventListener('change', actualizarSegundo);
    segundo.addEventListener('change', actualizarTercero);
    tercero.addEventListener('change', actualizarResultado);
    actualizarSegundo();
}
/** Log en textarea. scrollTop al final hace visible el mensaje nuevo. */
// Uso: registrarLog(log, mensaje).
function registrarLog(log, mensaje) {
    log.value += mensaje + '\n';
    log.scrollTop = log.scrollHeight;
}
// agregarElemento: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: agregarElemento(input, select, log). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function agregarElemento(input, select, log = null) {
    const texto = input.value.trim();
    if (!texto) return false;
    select.add(new Option(texto, texto));
    if (log) registrarLog(log, 'Añadido: ' + texto);
    input.value = '';
    input.focus();
    return true;
}
/** Copia la colección viva antes de eliminar/mover. */
// Uso: borrarSeleccionados(select, log). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function borrarSeleccionados(select, log = null) {
    const opciones = Array.from(select.selectedOptions);
    for (const op of opciones) {
        if (log) registrarLog(log, 'Borrado: ' + op.textContent);
        op.remove();
    }
    return opciones.length;
}
// moverSeleccionados: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: moverSeleccionados(origen, destino, log).
function moverSeleccionados(origen, destino, log = null) {
    const opciones = Array.from(origen.selectedOptions);
    for (const op of opciones) {
        destino.appendChild(op);
        op.selected = false;
        if (log) registrarLog(log, 'Movido: ' + op.textContent);
    }
    return opciones.length;
}
/** Tabla con cabecera y filas de datos. Acepta arrays de arrays. */
// Uso: crearTabla(tabla, encabezados, filas).
function crearTabla(tabla, encabezados, filas) {
    tabla.replaceChildren();
    const tr = tabla.createTHead().insertRow();
    encabezados.forEach(t => {
        const th = crearElemento('th', '', t);
        th.scope = 'col';
        tr.appendChild(th);
    });
    const cuerpo = tabla.createTBody();
    filas.forEach(datos => {
        const f = cuerpo.insertRow();
        datos.forEach(d => f.insertCell().textContent = String(d));
    });
    return cuerpo;
}
/** Sucursales x meses, con input por celda. No se ejecuta hasta que se llama. */
// Uso: crearTablaSucursales(tabla, n, meses).
function crearTablaSucursales(tabla, n, meses = 12) {
    if (!Number.isInteger(n) || n < 0 || n > 200) throw new Error('Entre 0 y 200 sucursales');
    const cuerpo = crearTabla(tabla, ['Sucursal', ...Array.from({ length: meses }, (_, i) => `Mes ${i + 1}`)], []);
    for (let i = 1; i <= n; i++) {
        const tr = cuerpo.insertRow();
        tr.insertCell().textContent = `Sucu.${i}`;
        for (let m = 1; m <= meses; m++) {
            const input = crearElemento('input', 'form-control form-control-sm');
            input.type = 'text';
            input.value = `${i}-${m}`;
            input.setAttribute('aria-label', `Sucursal ${i}, mes ${m}`);
            tr.insertCell().appendChild(input);
        }
    }
    return cuerpo;
}

// ============================================================================
// 06 · FILTROS, AUTOCOMPLETE, CAPS LOCK, CLIPBOARD Y CONTADOR
// ============================================================================
// normalizarBusqueda: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: normalizarBusqueda(texto).
function normalizarBusqueda(texto) {
    return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
/** Filtro de tabla: columna concreta (0=primera); null=texto de toda la fila. */
// Uso: filtrarTabla(tabla, texto, columna).
function filtrarTabla(tabla, texto, columna = null) {
    const filtro = normalizarBusqueda(texto);
    tabla.querySelectorAll('tbody tr').forEach(f => {
        const t = columna === null ? f.textContent : f.cells[columna]?.textContent || '';
        f.hidden = !normalizarBusqueda(t).includes(filtro);
    });
}
// filtrarLista: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: filtrarLista(lista, texto).
function filtrarLista(lista, texto) {
    const filtro = normalizarBusqueda(texto);
    lista.querySelectorAll('li').forEach(el => el.hidden = !normalizarBusqueda(el.textContent).includes(filtro));
}
/** Autocompletar W3Schools: click, flechas, Enter, Escape, click fuera. */
// Uso: configurarAutocomplete(input, contenedor, valores). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function configurarAutocomplete(input, contenedor, valores) {
    let actual = -1;
    function cerrar() {
        contenedor.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        actual = -1;
    }
    function elegir(valor) {
        input.value = valor;
        cerrar();
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.addEventListener('input', () => {
        contenedor.replaceChildren();
        actual = -1;
        const valor = normalizarBusqueda(input.value);
        if (!valor) {
            cerrar();
            return;
        }
        valores.filter(v => normalizarBusqueda(v).startsWith(valor)).forEach(v => {
            const op = crearElemento('div', '', v);
            op.addEventListener('click', () => elegir(v));
            contenedor.appendChild(op);
        });
        contenedor.hidden = !contenedor.children.length;
        input.setAttribute('aria-expanded', String(!contenedor.hidden));
    });
    input.addEventListener('keydown', e => {
        const ops = Array.from(contenedor.children);
        if (contenedor.hidden || !ops.length) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            actual = e.key === 'ArrowDown' ? (actual + 1) % ops.length : (actual <= 0 ? ops.length - 1 : actual - 1);
            ops.forEach((op, i) => op.classList.toggle('autocomplete-active', i === actual));
        } else if (e.key === 'Enter' && actual >= 0) {
            e.preventDefault();
            elegir(ops[actual].textContent);
        } else if (e.key === 'Escape') cerrar();
    });
    document.addEventListener('click', e => {
        if (e.target !== input && !contenedor.contains(e.target)) cerrar();
    });
    return cerrar;
}
// detectarMayus: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: detectarMayus(evento, aviso).
function detectarMayus(evento, aviso) {
    aviso.hidden = !evento.getModifierState('CapsLock');
}
// conectarCapsLock: configura los eventos o la relación entre elementos.
// Uso: conectarCapsLock(input, aviso). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
function conectarCapsLock(input, aviso) {
    const detectar = e => detectarMayus(e, aviso);
    input.addEventListener('keydown', detectar);
    input.addEventListener('keyup', detectar);
    input.addEventListener('blur', () => aviso.hidden = true);
}
/** Copiar texto: Clipboard API requiere contexto seguro y permiso del navegador. */
// Uso: copiarTexto(texto).
async function copiarTexto(texto) {
    try {
        await navigator.clipboard.writeText(texto);
        return true;
    } catch {
        const area = crearElemento('textarea');
        area.value = texto;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        let ok = false;
        try {
            ok = document.execCommand('copy');
        } catch { }
        area.remove();
        return ok;
    }
}
// copiarDireccion: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: copiarDireccion(input, mensaje). Pasa el elemento DOM, no su ID ni su value, salvo que se indique.
async function copiarDireccion(input, mensaje) {
    input.select();
    const ok = await copiarTexto(input.value);
    mensaje.textContent = ok ? 'Dirección copiada' : 'No se pudo copiar. Pulsa Ctrl+C.';
    return ok;
}
/** evento = 'click', 'mouseover', 'dblclick'... El cierre guarda su propio contador. */
// Uso: configurarContador(boton, salida, reinicio, evento).
function configurarContador(boton, salida, reinicio, evento = 'click') {
    let contador = 0;
    const pintar = () => salida.textContent = String(contador);
    boton.addEventListener(evento, () => {
        contador++;
        pintar();
    });
    reinicio.addEventListener('click', () => {
        contador = 0;
        pintar();
    });
    pintar();
}

// ============================================================================
// 07 · FECHAS, MENÚ RESPONSIVE, CARRUSEL, FETCH Y MAPAS
// ============================================================================
// fechaHoyTexto: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: fechaHoyTexto(fecha).
function fechaHoyTexto(fecha = new Date()) {
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
// diasDelMes: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: diasDelMes(mes, anio).
function diasDelMes(mes, anio) {
    return new Date(anio, mes, 0).getDate();
}
/** Los tres select: actualiza días según mes/año y conserva un día válido. */
// Uso: conectarFechaNacimiento(dia, mes, anio, desde, hasta).
function conectarFechaNacimiento(dia, mes, anio, desde = 1900, hasta = new Date().getFullYear()) {
    const hoy = new Date();
    rellenarSelect(mes, []);
    crearOption(mes, 1, 12, hoy.getMonth() + 1);
    rellenarSelect(anio, []);
    crearOption(anio, desde, hasta, hoy.getFullYear());
    const actualizar = () => {
        const anterior = Number(dia.value) || hoy.getDate();
        const max = diasDelMes(Number(mes.value), Number(anio.value));
        dia.replaceChildren();
        crearOption(dia, 1, max, Math.min(anterior, max));
    };
    mes.addEventListener('change', actualizar);
    anio.addEventListener('change', actualizar);
    actualizar();
}
/** Menú responsive propio, con aria-expanded accesible. CSS muestra .abierto. */
// Uso: conectarMenu(boton, menu).
function conectarMenu(boton, menu) {
    function estado(abierto) {
        menu.classList.toggle('abierto', abierto);
        boton.setAttribute('aria-expanded', String(abierto));
        boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    }
    boton.addEventListener('click', () => estado(!menu.classList.contains('abierto')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => estado(false)));
}
/** Carrusel propio (no Bootstrap), índice circular con módulo. */
// Uso: conectarCarrusel(fotos, puntos, anterior, siguiente).
function conectarCarrusel(fotos, puntos, anterior, siguiente) {
    fotos = Array.from(fotos);
    puntos = Array.from(puntos);
    if (!fotos.length) return;
    let i = 0;
    function mostrar(n) {
        i = (n + fotos.length) % fotos.length;
        fotos.forEach((f, j) => {
            f.classList.toggle('activa', j === i);
            f.setAttribute('aria-hidden', String(j !== i));
        });
        puntos.forEach((p, j) => {
            p.classList.toggle('activo', j === i);
            if (j === i) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current');
        });
    }
    anterior.addEventListener('click', () => mostrar(i - 1));
    siguiente.addEventListener('click', () => mostrar(i + 1));
    puntos.forEach((p, j) => p.addEventListener('click', () => mostrar(j)));
    mostrar(0);
    return mostrar;
}
/** Fetch local: abrir con Live Server o python -m http.server; file:// puede fallar. */
// Uso: cargarJSON(url).
async function cargarJSON(url) {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`No se pudo cargar ${url} (${respuesta.status})`);
    return respuesta.json();
}
/** Cargar recursos externos sólo cuando hacen falta. No bloquea el resto del kit. */
// Uso: cargarScript(url, limite).
function cargarScript(url, limite = 15000) {
    return new Promise((resolve, reject) => {
        const s = crearElemento('script');
        let terminado = false;
        const fin = (error) => {
            if (terminado) return;
            terminado = true;
            clearTimeout(t);
            if (error) {
                s.remove();
                reject(error);
            } else resolve();
        };
        const t = setTimeout(() => fin(new Error('Tiempo de carga agotado: ' + url)), limite);
        s.onload = () => fin();
        s.onerror = () => fin(new Error('No se pudo cargar ' + url));
        s.src = url;
        document.head.appendChild(s);
    });
}
// cargarCSS: utilidad reutilizable; consulta el ejemplo y el cuerpo de la función.
// Uso: cargarCSS(url).
function cargarCSS(url) {
    if (!Array.from(document.styleSheets).some(s => s.href === url)) {
        const l = crearElemento('link');
        l.rel = 'stylesheet';
        l.href = url;
        document.head.appendChild(l);
    }
}

// ============================================================================
// 08 · PRÁCTICAS COMPLETAS: HTML en index.html, CSS propio en styles.css.
// Cada iniciarDemo_* contiene la lógica de un ejercicio. Elige una sola práctica
// y reutiliza sus funciones o su inicializador completo, con los mismos IDs.
// ============================================================================
/** Ejecuta una función con el DOM disponible. Permite reutilizar los ejemplos
 *  tanto con defer como con un script al final del body. */
function cuandoDOMListo(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
}

/** Adaptación práctica de Leaflet. Las zonas de prueba NO son límites oficiales.
 *  Para datos reales, sustituye las constantes de ejemplo por:
 *  const [geojson, datos] = await Promise.all([
 *      cargarJSON('data/provincias.geojson'), cargarJSON('data/temperaturas.json')
 *  ]);
 *  Formato esperado: feature.properties.code, feature.properties.nombre;
 *  temperatura: {code, temperatura, lat, lon}. Usar un servidor local.
 */
// INICIO PRÁCTICA: leaflet
// HTML: template demo-leaflet. CSS: data-demo="leaflet".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
async function iniciarDemo_leaflet() {
    const aviso = porId('datos');
    const datos = [{ code: '28', nombre: 'Madrid', temperatura: 12, lat: 40.4168, lon: -3.7038 }, { code: '08', nombre: 'Barcelona', temperatura: 18, lat: 41.3874, lon: 2.1686 }, { code: '41', nombre: 'Sevilla', temperatura: 25, lat: 37.3891, lon: -5.9845 }];
    const geojson = { type: 'FeatureCollection', features: datos.map(d => ({ type: 'Feature', properties: { code: d.code, nombre: d.nombre }, geometry: { type: 'Polygon', coordinates: [[[d.lon - .22, d.lat - .15], [d.lon + .22, d.lat - .15], [d.lon + .22, d.lat + .15], [d.lon - .22, d.lat + .15], [d.lon - .22, d.lat - .15]]] } })) };
    const TRAMOS = [{ hasta: 10, color: '#3498db', clase: 'azul' }, { hasta: 20, color: '#2ecc71', clase: 'verde' }, { hasta: 25, color: '#f1c40f', clase: 'amarillo' }, { hasta: 30, color: '#e67e22', clase: 'naranja' }, { hasta: Infinity, color: '#e74c3c', clase: 'rojo' }];
    const porCodigo = Object.fromEntries(datos.map(d => [d.code, d]));
    const marcadores = {};
    let modo = 'ambos';
    function tramoDe(temperatura) {
        return TRAMOS.find(t => temperatura <= t.hasta);
    }
    try {
        cargarCSS('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        if (!window.L) await cargarScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 8000);
        const mapa = L.map('mapa', { zoomSnap: .25, attributionControl: true });
        mapa.attributionControl.setPrefix('Leaflet · geometrías de demostración');
        mapa.fitBounds([[35.6, -9.6], [43.9, 4.4]]);
        function estiloProvincia(feature) {
            const dato = porCodigo[feature.properties.code];
            const colorear = modo !== 'marcadores' && dato;
            return { fillColor: colorear ? tramoDe(dato.temperatura).color : '#e8d3df', fillOpacity: colorear ? .85 : .1, color: '#75405a', weight: 1 };
        }
        function irA(code) {
            const d = porCodigo[code];
            if (d) {
                mapa.setView([d.lat, d.lon], 8);
                aviso.textContent = `${d.nombre}: ${d.temperatura} °C`;
                marcadores[code]?.openTooltip();
            }
        }
        const capaProvincias = L.geoJSON(geojson, {            
style: estiloProvincia, onEachFeature: (feature, capa) => {
                const d = porCodigo[feature.properties.code];
                capa.bindTooltip(`${feature.properties.nombre} · ${d.temperatura} °C`, { sticky: true });
                capa.on('mouseover', () => capa.setStyle({ weight: 3, color: '#b52f6b' }));
                capa.on('mouseout', () => capaProvincias.resetStyle(capa));
                capa.on('click', () => irA(feature.properties.code));
            }        
}).addTo(mapa);
        const capaMarcadores = L.layerGroup().addTo(mapa);
        datos.forEach(d => {
            const tramo = tramoDe(d.temperatura);
            const icon = L.divIcon({ className: '', html: `<div class="mk ${tramo.clase}" style="background:${tramo.color}">${d.temperatura}°</div>`, iconSize: [38, 38] });
            marcadores[d.code] = L.marker([d.lat, d.lon], { icon }).bindTooltip(d.nombre).on('click', () => irA(d.code)).addTo(capaMarcadores);
        });
        porId('modoMapa').addEventListener('change', e => {
            modo = e.target.value;
            capaProvincias.setStyle(estiloProvincia);
            if (modo === 'provincias') mapa.removeLayer(capaMarcadores); else capaMarcadores.addTo(mapa);
        });
        porId('resetMapa').addEventListener('click', () => mapa.fitBounds([[35.6, -9.6], [43.9, 4.4]]));
        aviso.textContent = 'Selecciona una zona o un marcador. Temperaturas ficticias para practicar.';
    } catch (error) {
        aviso.textContent = 'No se pudo cargar Leaflet. El código está disponible sin conexión. ' + error.message;
        porId('mapa').hidden = true;
    }
}
// FIN PRÁCTICA: leaflet


/* ----------------------------------------------------------------------------
   Plantilla rosa lista para el examen · iniciarDemo_inicio_rapido()
   Fuente: ejemplo de síntesis
   Base reutilizable: head, Bootstrap offline, grid, formulario, feedback, modal y tabla. Copia el código como punto de partida.
   Ejemplo adicional creado para reunir el patrón HTML + CSS + JS.
   HTML: busca id="demo-inicio_rapido" en index.html.
   CSS: busca data-demo="inicio_rapido" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: inicio_rapido
// HTML: template demo-inicio_rapido. CSS: data-demo="inicio_rapido".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_inicio_rapido() {
    // 1. Capturar los IDs. 2. Escribir una comprobación por campo. 3. Conectar eventos.
    const form = porId('formBase'), nombre = porId('nombreBase'), email = porId('emailBase'), cp = porId('cpBase'), provincia = porId('provinciaBase'), tipo = porId('tipoBase'), cond = porId('condBase');
    conectarProvincia(cp, provincia);
    const comprobaciones = [() => mostrarValidacion(nombre, validarLongitud(nombre.value, 2, 100)), () => mostrarValidacion(email, validarEmail(email.value)), () => mostrarValidacion(cp, validarCodigoPostal(cp.value)), () => mostrarValidacion(tipo, validarSeleccion(tipo.value)), () => mostrarValidacion(cond, cond.checked)];
    [nombre, email, cp, tipo, cond].forEach((campo, i) => conectarValidacion(campo, comprobaciones[i]));
    // Valida radio y actualiza el estado del campo.
    function comprobarRadio() {
        const ok = validarRadioMarcado('preferencia');
        form.querySelectorAll('[name=preferencia]').forEach(r => marcarCampo(r, ok));
        porId('errorRadioBase').classList.toggle('d-block', !ok);
        return ok;
    }
    form.querySelectorAll('[name=preferencia]').forEach(r => r.addEventListener('change', comprobarRadio));
    // 4. Validación final: ejecutar todas las comprobaciones sin cortocircuito.
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!comprobarTodas([...comprobaciones, comprobarRadio])) return;
        const datos = new FormData(form); // usa los atributos name
        const tr = porId('tablaBase').tBodies[0].insertRow();
        [datos.get('nombre'), datos.get('email'), datos.get('provincia')].forEach(t => tr.insertCell().textContent = t);
        const btn = crearElemento('button', 'btn btn-sm btn-outline-danger', 'Borrar');
        btn.type = 'button';
        btn.addEventListener('click', () => tr.remove());
        tr.insertCell().appendChild(btn);
        porId('resumenBase').textContent = Array.from(datos, ([k, v]) => `${k}: ${v}`).join('\n');
        mostrarModal('modalBase');
    });
    form.addEventListener('reset', () => setTimeout(() => {
        limpiarValidacion(form);
        provincia.value = '';
    }, 0));
    activarTooltipsPopovers();
}
// FIN PRÁCTICA: inicio_rapido


/* ----------------------------------------------------------------------------
   JavaScript básico y arrays · iniciarDemo_basicos()
   Fuente: PractivaJS.js
   Variables, const/let, template literals, push, for/of, while, funciones, módulo %, suma, área y perímetro.
   HTML: busca id="demo-basicos" en index.html.
   CSS: busca data-demo="basicos" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: basicos
// HTML: template demo-basicos. CSS: data-demo="basicos".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_basicos() {
    // PractivaJS.js: funciones de área/perímetro/paridad disponibles en sección 03.
    function ejecutar() {
        const nombre = 'Lucía', edad = 19, ciudad = 'Humanes'; // datos ficticios del ejercicio
        const salida = [`Mi nombre es ${nombre}, tengo ${edad} años y mi ciudad es ${ciudad}`];
        let frutas = ['manzana', 'platano', 'naranja', 'fresa', 'uva'];
        salida.push('Longitud: ' + frutas.length);
        for (const fruta of frutas) salida.push(fruta);
        frutas.push('mandarina');
        salida.push('Después de push: ' + frutas.join(', '));
        salida.push('Área: ' + CalcularAreaRectangulo(5.5, 3), 'Perímetro: ' + CalcularPerimetroRectangulo(5, 3), ClasificarNumero(7), 'Suma del 1 al 100: ' + sumaRango(1, 100));
        let numero = 1;
        const pares = [];
        while (numero <= 20) {
            if (numero % 2 === 0) pares.push(numero);
            numero++;
        }
        salida.push('Pares del 1 al 20: ' + pares.join(', '));
        // Otros métodos de tus ejercicios: find, filter, map, splice, indexOf, includes.
        salida.push('find: ' + frutas.find(f => f.startsWith('m')), 'filter: ' + frutas.filter(f => f.length > 5).join(', '), 'map: ' + frutas.map(f => f.toUpperCase()).join(', '));
        porId('salidaJS').textContent = salida.join('\n');
        console.log(salida.join('\n'));
    }
    porId('probarJS').addEventListener('click', ejecutar);
    ejecutar();
}
// FIN PRÁCTICA: basicos


/* REFERENCIA ORIGINAL · JavaScript básico y arrays (no ejecutar; ver versión anterior adaptada)
const nombre = 'Lucia';
const edad = 19;
const ciudad = 'Humanes';
console.log(`Mi nombre es ${nombre} tengo ${edad} años y mi ciudad es ${ciudad}`);

let frutas = ["manzana", "platano", "naranja", "fresa", "uva"];
console.log(frutas.length);

for(fruta of frutas){
    console.log(fruta);
}

frutas.push("mandarina");

for(fruta of frutas){
    console.log(fruta);
}

function CalcularAreaRectangulo(base, altura){
    return base * altura;
}

function CalcularPerimetroRectangulo(base, altura){
    return (base + altura) * 2;
}

console.log(CalcularAreaRectangulo(5.5, 3))
console.log(CalcularPerimetroRectangulo(5, 3))

function ClasificarNumero(numero){
    if(numero%2 == 0)
        return console.log("Es par.");
    return console.log("Es inpar.");
}

console.log(ClasificarNumero(7))


let suma = 0;
for(let i = 1; i <= 100; i++){
    suma += i;
}
console.log(`La suma es ${suma}`)

let  numero = 1;
while(numero <= 20){
    if(numero % 2 === 0){
        console.log(`El numero ${numero} par.`);
    }
    numero++;
}



*/

/* ----------------------------------------------------------------------------
   Eventos del ratón · iniciarDemo_raton()
   Fuente: EventoMouse.html
   click, dblclick, mouseover y mouseout. Caja interactiva y registro de eventos.
   Se corrigen las unidades CSS y se sustituye el alert repetitivo por un registro; queda un modo de alertas opcional.
   HTML: busca id="demo-raton" en index.html.
   CSS: busca data-demo="raton" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: raton
// HTML: template demo-raton. CSS: data-demo="raton".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_raton() {
    // El original usaba alert() en cada evento; un log evita bloquear el ratón.
    const caja = porId('Caja'), log = porId('logRaton');
    function mostrar(mensaje) {
        registrarLog(log, mensaje);
        if (porId('alertRaton').checked) alert(mensaje);
    }
    caja.addEventListener('click', () => mostrar('Has hecho click.'));
    caja.addEventListener('dblclick', () => mostrar('Has hecho doble click.'));
    caja.addEventListener('mouseover', () => mostrar('Has pasado sobre el elemento.'));
    caja.addEventListener('mouseout', () => mostrar('Te has salido del elemento.'));
    caja.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            caja.click();
        }
    });
}
// FIN PRÁCTICA: raton


/* REFERENCIA ORIGINAL · Eventos del ratón (no ejecutar; ver versión anterior adaptada)

        const caja = document.getElementById("Caja");
        //caja.addEventListener("click", () => alert("Has hecho click."))
        caja.addEventListener("dblclick", () => alert("Has hecho doble click."))
        caja.addEventListener("mouseover", () => alert("Has pasado sobre el elemento."))
        caja.addEventListener("mouseout", () => alert("Te has alido del elemento."))
    
*/

/* ----------------------------------------------------------------------------
   Eventos del formulario y teclado · iniciarDemo_eventos_form()
   Fuente: EventosFormulario.html
   focus, blur, change, input, keyup, event.key, Ctrl, submit y preventDefault.
   Registro visible en lugar de ventanas emergentes repetitivas; modo alert opcional.
   HTML: busca id="demo-eventos_form" en index.html.
   CSS: busca data-demo="eventos_form" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: eventos_form
// HTML: template demo-eventos_form. CSS: data-demo="eventos_form".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_eventos_form() {
    const form = porId('form1'), nombre = porId('nombre'), log = porId('logEventos');
    function mostrar(mensaje) {
        registrarLog(log, mensaje);
        if (porId('alertEvento').checked) alert(mensaje);
    }
    function mostrarTecla(event) {
        mostrar('Tecla: ' + event.key);
        if (event.ctrlKey) mostrar('Se ha presionado Ctrl');
    }
    form.addEventListener('submit', event => {
        event.preventDefault();
        mostrar('Se ha enviado el formulario (simulación).');
    });
    nombre.addEventListener('focus', () => mostrar('El campo ha entrado en foco'));
    nombre.addEventListener('blur', () => mostrar('El campo ha salido de foco'));
    nombre.addEventListener('change', () => mostrar('change: ' + nombre.value));
    nombre.addEventListener('input', () => registrarLog(log, 'input: ' + nombre.value));
    nombre.addEventListener('keyup', mostrarTecla);
}
// FIN PRÁCTICA: eventos_form


/* REFERENCIA ORIGINAL · Eventos del formulario y teclado (no ejecutar; ver versión anterior adaptada)

        function mostrarTecla(event){
            alert(event.key);
            if(event.ctrlKey){
                alert("Se ha presionado la tecla Ctrl");
            }
        }    

        const form = document.getElementById("form1");
        const nombre = document.getElementById("nombre");

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            alert("Se ha enviado el formulario");
        });

        nombre.addEventListener("focus", () => alert("El campo de texto ha entrado en foco"));
        nombre.addEventListener("blur", () => alert("El campo de texto ha salido de foco"));
        nombre.addEventListener("change", () => alert("El valor del campo de texto ha cambiado"));
        nombre.addEventListener("keyup", mostrarTecla);
        
    
*/

/* ----------------------------------------------------------------------------
   Contadores y fecha actual · iniciarDemo_contador()
   Fuente: PAgina contadora de clics.html
   Contador de clics, contador mouseover, reinicio, textContent, new Date, getDay, getMonth.
   Se corrigen los días de la semana (domingo es 0) y el elemento Fecha inexistente; se muestran ambos tipos de contador.
   HTML: busca id="demo-contador" en index.html.
   CSS: busca data-demo="contador" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: contador
// HTML: template demo-contador. CSS: data-demo="contador".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_contador() {
    // Versión paso a paso para el examen. Cambiar 'click' por 'mouseover' cambia el evento.
    let contador = 0;
    const spanContador = porId('Contador');
    porId('botonContador').addEventListener('click', () => {
        contador++;
        spanContador.textContent = contador;
    });
    porId('botonReinicio').addEventListener('click', () => {
        contador = 0;
        spanContador.textContent = contador;
    });
    configurarContador(porId('botonHoverCont'), porId('contadorHover'), porId('reinicioHover'), 'mouseover');
    // getDay(): domingo=0; getMonth(): enero=0. El original no incluía domingo/sábado.
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const hoy = new Date();
    porId('Fecha').textContent = `Hoy es ${dias[hoy.getDay()]} ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`;
}
// FIN PRÁCTICA: contador


/* REFERENCIA ORIGINAL · Contadores y fecha actual (no ejecutar; ver versión anterior adaptada)

        let contador = 0;
        const spanContador = document.getElementById("Contador");
        const boton = document.getElementById("botonContador");
        const botonReinicio = document.getElementById("botonReinicio");
        boton.addEventListener("mouseover", () => {
            contador++;
            spanContador.textContent = contador;
        })

        botonReinicio.addEventListener("click", () => {
            contador = 0;
            spanContador.textContent = contador;
        })

        const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
        const mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const hoy = new Date();
        const texto = `Hoy es ${dias[hoy.getDay()]} ${hoy.getDate()}, de ${mes[hoy.getMonth()]}`;
        document.getElementById("Fecha").textContent = texto;



    
*/

/* ----------------------------------------------------------------------------
   Selects de fecha de nacimiento · iniciarDemo_nacimiento()
   Fuente: PagNacimiento.html
   Crear opciones con for, selected, Date, día/mes/año, bisiestos y número de días del mes.
   Se conserva la lógica de opciones y se añade ajuste de días al mes y año.
   HTML: busca id="demo-nacimiento" en index.html.
   CSS: busca data-demo="nacimiento" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: nacimiento
// HTML: template demo-nacimiento. CSS: data-demo="nacimiento".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_nacimiento() {
    // Original: crearOption(dia,1,31,hoy.getDate()); crearOption(mes,1,12,hoy.getMonth()+1);
    // crearOption(anyo,2000,2050,hoy.getFullYear());. Mejora: rango para nacimiento y días reales.
    const dia = porId('dia'), mes = porId('mes'), anyo = porId('anyo');
    conectarFechaNacimiento(dia, mes, anyo, 1900, new Date().getFullYear());
    function mostrar() {
        const texto = `${String(dia.value).padStart(2, '0')}/${String(mes.value).padStart(2, '0')}/${anyo.value}`;
        porId('fechaSeleccionada').textContent = texto + (validarFecha(texto) ? ' · Fecha válida' : ' · Fecha inválida');
    }
    [dia, mes, anyo].forEach(c => c.addEventListener('change', mostrar));
    mostrar();
}
// FIN PRÁCTICA: nacimiento


/* REFERENCIA ORIGINAL · Selects de fecha de nacimiento (no ejecutar; ver versión anterior adaptada)

        function crearOption(select, desde, hasta, selected){
            for(let i = desde; i <= hasta; i++){
                const option = document.createElement("option");
                option.value = i;
                option.textContent = i;
                if(i === selected){
                    option.selected = true;
                }
                select.appendChild(option);
            }
        }

        let hoy = new Date();
        crearOption(document.getElementById("dia"), 1, 31, hoy.getDate());
        crearOption(document.getElementById("mes"), 1, 12, hoy.getMonth()+1);
        crearOption(document.getElementById("anyo"), 2000, 2050, hoy.getFullYear());


    
*/

/* ----------------------------------------------------------------------------
   Selects dependientes: comidas · iniciarDemo_selects()
   Fuente: ArraysInteractivos.html
   Objetos anidados, Object.keys, arrays, createElement, opciones dependientes, disabled, change.
   HTML: busca id="demo-selects" en index.html.
   CSS: busca data-demo="selects" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: selects
// HTML: template demo-selects. CSS: data-demo="selects".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_selects() {
    const comidas = {
        "Salado": {
            "Patatas": ["Sal", "Aceite", "Patata"],
            "Bocadillo": ["Pan", "Jamón", "Queso"],
            "Pizza": ["Tomate", "Queso", "Pepperoni"],
            "Hamburguesa": ["Pan", "Carne", "Lechuga"]
        },
        "Dulce": {
            "Chocolate": ["Cacao", "Azúcar", "Leche"],
            "Helado": ["Leche", "Azúcar", "Nata"],
            "Galletas": ["Harina", "Azúcar", "Mantequilla"],
            "Pastel": ["Harina", "Huevos", "Azúcar"]
        },
        "Ácido": {
            "Limón": ["Limón", "Agua", "Azúcar"],
            "Vinagre": ["Vino", "Agua", "Ácido acético"],
            "Pepinillos": ["Pepino", "Vinagre", "Sal"],
            "Yogur Griego": ["Leche", "Fermentos", "Nata"]
        }
    };

    const selectTipoComida = document.getElementById("tipoComida");
    const selectComida = document.getElementById("comida");
    const selectIngrediente = document.getElementById("ingrediente");
    const resultado = document.getElementById("resultado");

    // Vacía un select, añade opción inicial y opciones del array.
    function rellenarSelect(select, lista, textoInicial) {
        select.innerHTML = "";

        const opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent = textoInicial;
        select.appendChild(opcionInicial);

        for (let i = 0; i < lista.length; i++) {
            const opcion = document.createElement("option");
            opcion.value = lista[i];
            opcion.textContent = lista[i];
            select.appendChild(opcion);
        }
    }

    // Crea las opciones iniciales desde Object.keys.
    function cargarTiposComida() {
        const tipos = Object.keys(comidas);

        rellenarSelect(selectTipoComida, tipos, "- Seleccione un tipo -");
        rellenarSelect(selectComida, [], "- Seleccione una comida -");
        rellenarSelect(selectIngrediente, [], "- Seleccione un ingrediente -");
    }

    // Actualiza el segundo select y reinicia el tercero cuando cambia el tipo.
    function alCambiarTipoComida() {
        const tipoSeleccionado = selectTipoComida.value;

        if (tipoSeleccionado === "") {
            rellenarSelect(selectComida, [], "- Seleccione una comida -");
            selectComida.disabled = true;
        } else {
            const listaComidas = Object.keys(comidas[tipoSeleccionado]);
            rellenarSelect(selectComida, listaComidas, "- Seleccione una comida -");
            selectComida.disabled = false;
        }

        rellenarSelect(selectIngrediente, [], "- Seleccione un ingrediente -");
        selectIngrediente.disabled = true;

        mostrarResultado();
    }

    // Actualiza ingredientes al cambiar el producto.
    function alCambiarComida() {
        const tipoSeleccionado = selectTipoComida.value;
        const comidaSeleccionada = selectComida.value;

        if (comidaSeleccionada === "") {
            rellenarSelect(selectIngrediente, [], "- Seleccione un ingrediente -");
            selectIngrediente.disabled = true;
        } else {
            const ingredientes = comidas[tipoSeleccionado][comidaSeleccionada];
            rellenarSelect(selectIngrediente, ingredientes, "- Seleccione un ingrediente -");
            selectIngrediente.disabled = false;
        }

        mostrarResultado();
    }

    // Muestra el texto sólo cuando todas las opciones están elegidas.
    function mostrarResultado() {
        if (selectTipoComida.value !== "" && selectComida.value !== "" && selectIngrediente.value !== "") {
            resultado.textContent = "Has seleccionado: " + selectTipoComida.value + " - " + selectComida.value + " - " + selectIngrediente.value;
        } else {
            resultado.textContent = "";
        }
    }

    selectTipoComida.addEventListener("change", alCambiarTipoComida);
    selectComida.addEventListener("change", alCambiarComida);
    selectIngrediente.addEventListener("change", mostrarResultado);

    cargarTiposComida();
}
// FIN PRÁCTICA: selects


/* ----------------------------------------------------------------------------
   Listas dobles interactivas · iniciarDemo_listas()
   Fuente: ListasInversas.html
   Añadir, borrar y mover opciones entre select multiple; Array.from, selectedOptions, appendChild, remove, registro log.
   HTML: busca id="demo-listas" en index.html.
   CSS: busca data-demo="listas" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: listas
// HTML: template demo-listas. CSS: data-demo="listas".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_listas() {
    const inputIzquierda = document.getElementById("inputIzquierda");
    const inputDerecha = document.getElementById("inputDerecha");

    const listaIzquierda = document.getElementById("listaIzquierda");
    const listaDerecha = document.getElementById("listaDerecha");

    const agregarIzquierda = document.getElementById("agregarIzquierda");
    const agregarDerecha = document.getElementById("agregarDerecha");

    const borrarIzquierda = document.getElementById("borrarIzquierda");
    const borrarDerecha = document.getElementById("borrarDerecha");

    const moverDerecha = document.getElementById("moverDerecha");
    const moverIzquierda = document.getElementById("moverIzquierda");

    const log = document.getElementById("log");

    // Añade una línea al textarea y desplaza el scroll al final.
    function registrarLog(mensaje) {
        log.value += mensaje + "\n";
        log.scrollTop = log.scrollHeight;
    }

    // Crea un option desde el input; no añade cadenas vacías.
    function agregarElemento(input, select, nombreLista) {
        const texto = input.value.trim();

        if (texto === "") {
            return;
        }

        const opcion = document.createElement("option");

        opcion.textContent = texto;
        opcion.value = texto;

        select.appendChild(opcion);

        registrarLog("Añadido \"" + texto + "\" a " + nombreLista);

        input.value = "";
        input.focus();
    }

    // Elimina las opciones seleccionadas; copia primero la colección.
    function borrarSeleccionados(select, nombreLista) {
        const seleccionados = Array.from(select.selectedOptions);

        for (const opcion of seleccionados) {
            registrarLog("Borrado \"" + opcion.textContent + "\" de " + nombreLista);
            opcion.remove();
        }
    }

    // Traslada nodos seleccionados al otro select.
    function moverSeleccionados(origen, destino, nombreOrigen, nombreDestino) {
        const seleccionados = Array.from(origen.selectedOptions);

        for (const opcion of seleccionados) {
            registrarLog(
                "Movido \"" + opcion.textContent + "\" de " +
                nombreOrigen + " a " + nombreDestino
            );

            destino.appendChild(opcion);
            opcion.selected = false;
        }
    }

    agregarIzquierda.addEventListener("click", function () {
        agregarElemento(inputIzquierda, listaIzquierda, "Lista 1");
    });

    agregarDerecha.addEventListener("click", function () {
        agregarElemento(inputDerecha, listaDerecha, "Lista 2");
    });

    borrarIzquierda.addEventListener("click", function () {
        borrarSeleccionados(listaIzquierda, "Lista 1");
    });

    borrarDerecha.addEventListener("click", function () {
        borrarSeleccionados(listaDerecha, "Lista 2");
    });

    moverDerecha.addEventListener("click", function () {
        moverSeleccionados(
            listaIzquierda,
            listaDerecha,
            "Lista 1",
            "Lista 2"
        );
    });

    moverIzquierda.addEventListener("click", function () {
        moverSeleccionados(
            listaDerecha,
            listaIzquierda,
            "Lista 2",
            "Lista 1"
        );
    });
}
// FIN PRÁCTICA: listas


/* ----------------------------------------------------------------------------
   Formulario básico: validación manual · iniciarDemo_form_simple()
   Fuente: Form.html
   Obligatorios, longitud, correo, edad, estado civil, checkbox, focus/blur, alert y submit.
   Se evita doble alerta y navegación; se conserva la validación por clases sin borrar otras clases del elemento.
   HTML: busca id="demo-form_simple" en index.html.
   CSS: busca data-demo="form_simple" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: form_simple
// HTML: template demo-form_simple. CSS: data-demo="form_simple".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_form_simple() {
    const form = porId('formRegistro'), nombre = porId('nombre'), direccion = porId('direccion'), email = porId('email'), edad = porId('edad'), estadoCivil = porId('estadocivil'), condiciones = porId('acptoCondiciones');
    const reglas = [() => revisarLongitud(nombre, 3), () => revisarLongitud(direccion, 10), () => revisarEmail(email), () => revisarNumero(edad), () => {
        const ok = validarSeleccion(estadoCivil.value);
        estadoCivil.classList.toggle('error', !ok);
        return ok;
    }, () => condiciones.checked];
    [nombre, direccion, email, edad, estadoCivil].forEach((campo, idx) => {
        campo.addEventListener('focus', () => entroEnFoco(campo));
        campo.addEventListener('blur', () => {
            salirDeFoco(campo);
            reglas[idx]();
        });
    });
    // Comprueba todas las reglas del formulario y devuelve un booleano.
    function validar() {
        return comprobarTodas(reglas);
    }
    form.noValidate = true;
    form.addEventListener('submit', event => {
        event.preventDefault();
        const ok = validar();
        alert(ok ? 'Formulario enviado correctamente (simulación)' : 'Por favor, completa correctamente todos los campos obligatorios.');
    });
}
// FIN PRÁCTICA: form_simple


/* REFERENCIA ORIGINAL · Formulario básico: validación manual (no ejecutar; ver versión anterior adaptada)

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const nombre = document.getElementById('nombre');
        nombre.addEventListener('focus', () => entroEnFoco(nombre));
        nombre.addEventListener('blur', () => {
            salirDeFoco(nombre);
            revisarObligatorio(nombre);
            revisarLongitud(nombre, 3);
        });

        const direccion = document.getElementById('direccion');
        direccion.addEventListener('focus', () => entroEnFoco(direccion));
        direccion.addEventListener('blur', () => {
            salirDeFoco(direccion);
            revisarObligatorio(direccion);
            revisarLongitud(direccion, 10);
        });

        const email = document.getElementById('email');
        email.addEventListener('focus', () => entroEnFoco(email));
        email.addEventListener('blur', () => {
            salirDeFoco(email);
            revisarObligatorio(email);
            revisarLongitud(email, 5);
        });

        const edad = document.getElementById('edad');
        edad.addEventListener('focus', () => entroEnFoco(edad));
        edad.addEventListener('blur', () => {
            salirDeFoco(edad);
            revisarObligatorio(edad);
            revisarNumero(edad);
        });

        const estadocivil = document.getElementById('estadocivil');
        estadocivil.addEventListener('focus', () => entroEnFoco(estadocivil));
        estadocivil.addEventListener('blur', () => {salirDeFoco(estadocivil);});

        const formulario = document.getElementById('formRegistro');
        formulario.addEventListener('submit', (event) => {
            if(!validar()) {
                event.preventDefault();
                alert('Por favor, complete correctamente todos los campos obligatorios antes de enviar el formulario.');
            } else {
                alert('Formulario enviado correctamente');
            }
        });

        function validar() {
            let estadoOk = true;

            const nombre = document.getElementById('nombre');
            const direccion = document.getElementById('direccion');
            const email = document.getElementById('email');
            const edad = document.getElementById('edad');
            const estadocivil = document.getElementById('estadocivil');
            const acptoCondiciones = document.getElementById('acptoCondiciones');

            if(nombre.value.length < 3) {
                estadoOk = false;
            }

            if(direccion.value.length < 10) {
                estadoOk = false;
            }

            if(edad.value === '' || isNaN(edad.value)) {
                estadoOk = false;
            }

            if(!emailRegex.test(email.value)) {
                estadoOk = false;
            }

            if(estadocivil.value === '') {
                estadoOk = false;
            }

            if(!acptoCondiciones.checked) {
                estadoOk = false;
            }

            if(!estadoOk) {
               alert('Por favor, complete correctamente todos los campos obligatorios antes de enviar el formulario.'); 
            }

            return estadoOk;
        }

        function entroEnFoco(elemento) {
            elemento.className = 'enfoco';
        }

        function salirDeFoco(elemento) {
            elemento.className = '';
        }

        function revisarObligatorio(elemento) {
            elemento.className = elemento.value === '' ? 'error' : '';
        }

        function revisarLongitud(elemento, minimo) {
            if (elemento.value !== ``) {
                elemento.className = elemento.value.length < minimo ? 'error' : '';
            }
        }

        function revisarNumero(elemento,) {
            if (elemento.value !== ``) {
                elemento.className = isNaN(elemento.value) ? 'error' : '';
            }
        }

        function revisarEmail(elemento) {
            if (elemento.value !== ``) {
                elemento.className = emailRegex.test(elemento.value) ? '' : 'error';
            }
        }
    
*/

/* ----------------------------------------------------------------------------
   Formulario Pro · iniciarDemo_form_pro()
   Fuente: Formulario.html
   Nombre, dirección, teléfono, código postal 01001–52006, provincias, radio, preferente, errores y resumen.
   Se usa validarCodigoPostalRango según el enunciado. El archivo Validar.js original no incluía esa función.
   HTML: busca id="demo-form_pro" en index.html.
   CSS: busca data-demo="form_pro" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: form_pro
// HTML: template demo-form_pro. CSS: data-demo="form_pro".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_form_pro() {
    const validarLongitud = validarLongitudSinTrim; // conserva la variante del ejercicio original
    const nombre = document.getElementById("nombre");
    const direccion = document.getElementById("direccion");
    const direccionCompleta = document.getElementById("direccionCompleta");
    const telefono = document.getElementById("telefono");
    const codigoPostal = document.getElementById("codigoPostal");
    const ciudad = document.getElementById("ciudad");
    const provincia = document.getElementById("provincia");
    const preferente = document.getElementById("preferente");
    const contenedorSexo = document.getElementById("sexo");

    const provincias = [
        { nombre: "Álava", codigo: "01" },
        { nombre: "Albacete", codigo: "02" },
        { nombre: "Alicante", codigo: "03" },
        { nombre: "Almería", codigo: "04" },
        { nombre: "Asturias", codigo: "33" },
        { nombre: "Ávila", codigo: "05" },
        { nombre: "Badajoz", codigo: "06" },
        { nombre: "Barcelona", codigo: "08" },
        { nombre: "Burgos", codigo: "09" },
        { nombre: "Cáceres", codigo: "10" },
        { nombre: "Cádiz", codigo: "11" },
        { nombre: "Cantabria", codigo: "39" },
        { nombre: "Castellón", codigo: "12" },
        { nombre: "Ciudad Real", codigo: "13" },
        { nombre: "Córdoba", codigo: "14" },
        { nombre: "Cuenca", codigo: "16" },
        { nombre: "Girona", codigo: "17" },
        { nombre: "Granada", codigo: "18" },
        { nombre: "Guadalajara", codigo: "19" },
        { nombre: "Guipúzcoa", codigo: "20" },
        { nombre: "Huelva", codigo: "21" },
        { nombre: "Huesca", codigo: "22" },
        { nombre: "Illes Balears", codigo: "07" },
        { nombre: "Jaén", codigo: "23" },
        { nombre: "La Coruña", codigo: "15" },
        { nombre: "La Rioja", codigo: "26" },
        { nombre: "Las Palmas", codigo: "35" },
        { nombre: "León", codigo: "24" },
        { nombre: "Lleida", codigo: "25" },
        { nombre: "Lugo", codigo: "27" },
        { nombre: "Madrid", codigo: "28" },
        { nombre: "Málaga", codigo: "29" },
        { nombre: "Murcia", codigo: "30" },
        { nombre: "Navarra", codigo: "31" },
        { nombre: "Ourense", codigo: "32" },
        { nombre: "Palencia", codigo: "34" },
        { nombre: "Pontevedra", codigo: "36" },
        { nombre: "Salamanca", codigo: "37" },
        { nombre: "Santa Cruz de Tenerife", codigo: "38" },
        { nombre: "Segovia", codigo: "40" },
        { nombre: "Sevilla", codigo: "41" },
        { nombre: "Soria", codigo: "42" },
        { nombre: "Tarragona", codigo: "43" },
        { nombre: "Teruel", codigo: "44" },
        { nombre: "Toledo", codigo: "45" },
        { nombre: "Valencia", codigo: "46" },
        { nombre: "Valladolid", codigo: "47" },
        { nombre: "Vizcaya", codigo: "48" },
        { nombre: "Zamora", codigo: "49" },
        { nombre: "Zaragoza", codigo: "50" }
    ];

    provincias.forEach((provinciaActual) => {
        const opcion = document.createElement("option");
        opcion.value = provinciaActual.codigo;
        opcion.textContent = provinciaActual.nombre;
        provincia.appendChild(opcion);
    });

    // Controla las clases de error y el mensaje visible.
    function marcarError(campo, esValido, mensajeError) {
        campo.classList.toggle("campo-error", !esValido);

        if (mensajeError) {
            mensajeError.classList.toggle("visible", !esValido);
        }
    }

    const camposConFoco = [
        nombre,
        direccion,
        direccionCompleta,
        telefono,
        codigoPostal,
        ciudad,
        provincia
    ];

    camposConFoco.forEach((campo) => {
        campo.addEventListener("focus", () => {
            campo.classList.add("foco");
        });

        campo.addEventListener("blur", () => {
            campo.classList.remove("foco");
        });
    });

    nombre.addEventListener("blur", comprobarNombre);
    direccion.addEventListener("blur", comprobarDireccion);
    direccionCompleta.addEventListener("blur", comprobarDireccionCompleta);
    telefono.addEventListener("blur", comprobarTelefono);
    codigoPostal.addEventListener("blur", comprobarCodigoPostal);
    ciudad.addEventListener("blur", comprobarCiudad);
    provincia.addEventListener("blur", comprobarProvincia);

    // Valida nombre y actualiza el estado del campo.
    function comprobarNombre() {
        const esValido = validarLongitud(nombre.value, 2, 120);
        marcarError(nombre, esValido, document.getElementById("errorNombre"));
        return esValido;
    }

    // Valida direccion y actualiza el estado del campo.
    function comprobarDireccion() {
        const esValido = validarLongitud(direccion.value, 4, 120);
        marcarError(direccion, esValido, document.getElementById("errorDireccion"));
        return esValido;
    }

    // Valida direccion completa y actualiza el estado del campo.
    function comprobarDireccionCompleta() {
        const esValido = validarLongitud(direccionCompleta.value, 4, 200);
        marcarError(
            direccionCompleta,
            esValido,
            document.getElementById("errorDireccionCompleta")
        );
        return esValido;
    }

    // Valida telefono y actualiza el estado del campo.
    function comprobarTelefono() {
        const esValido = validarTelefono(telefono.value);
        marcarError(telefono, esValido, document.getElementById("errorTelefono"));
        return esValido;
    }

    // Valida codigo postal y actualiza el estado del campo.
    function comprobarCodigoPostal() {
        const esValido = validarCodigoPostalRango(codigoPostal.value);
        marcarError(codigoPostal, esValido, document.getElementById("errorCP"));
        return esValido;
    }

    // Valida ciudad y actualiza el estado del campo.
    function comprobarCiudad() {
        const esValido = validarLongitud(ciudad.value, 1, 50);
        marcarError(ciudad, esValido, document.getElementById("errorCiudad"));
        return esValido;
    }

    // Valida provincia y actualiza el estado del campo.
    function comprobarProvincia() {
        const esValida = provincia.value !== "selecciona";
        marcarError(provincia, esValida, null);
        return esValida;
    }

    // Valida sexo y actualiza el estado del campo.
    function comprobarSexo() {
        const marcado = validarRadioMarcado("sexo");
        const mensajeSexo = document.getElementById("obligatorioSexo");

        contenedorSexo.classList.toggle("campo-error", !marcado);
        mensajeSexo.classList.toggle("visible", !marcado);

        return marcado;
    }

    // Compone los datos que se muestran al enviar.
    function obtenerResumen() {
        const sexoSeleccionado = document.querySelector(
            'input[name="sexo"]:checked'
        );

        const provinciaSeleccionada =
            provincia.options[provincia.selectedIndex].text;

        return `Nombre: ${nombre.value}
              Dirección: ${direccion.value}
              Dirección completa: ${direccionCompleta.value}
              Teléfono: ${telefono.value}
              Código postal: ${codigoPostal.value}
              Ciudad: ${ciudad.value}
              Provincia: ${provinciaSeleccionada}
              Preferente: ${preferente.checked ? "Sí" : "No"}
              Sexo: ${sexoSeleccionado ? sexoSeleccionado.value : "No seleccionado"}`;
    }

    // Ejecuta todas las comprobaciones y acumula errores.
    function obtenerErrores() {
        const errores = [];

        if (!comprobarNombre()) {
            errores.push("El nombre debe tener entre 2 y 120 caracteres.");
        }
        if (!comprobarDireccion()) {
            errores.push("La dirección debe tener entre 4 y 120 caracteres.");
        }
        if (!comprobarDireccionCompleta()) {
            errores.push("La dirección completa debe tener entre 4 y 200 caracteres.");
        }
        if (!comprobarTelefono()) {
            errores.push("El teléfono debe tener 9 dígitos y empezar por 6, 7 o 9.");
        }
        if (!comprobarCodigoPostal()) {
            errores.push("El código postal debe estar entre 01001 y 52006.");
        }
        if (!comprobarCiudad()) {
            errores.push("La ciudad es obligatoria y debe tener como máximo 50 caracteres.");
        }
        if (!comprobarProvincia()) {
            errores.push("Debes seleccionar una provincia.");
        }
        if (!comprobarSexo()) {
            errores.push("Debes seleccionar una opción de sexo.");
        }

        return errores;
    }

    document.getElementById("formulario").addEventListener("submit", (event) => {
        event.preventDefault();

        const errores = obtenerErrores();

        if (errores.length === 0) {
            alert(obtenerResumen());
        } else {
            alert("Corrige estos errores:\n- " + errores.join("\n- "));
        }
    });
}
// FIN PRÁCTICA: form_pro


/* ----------------------------------------------------------------------------
   Formulario normalizado completo · iniciarDemo_form_base()
   Fuente: indexFormularioBase.html
   Usuario, contraseña 8–16 sin regex, repetir contraseña, radio, select multiple, provincia/CP, resumen y errores.
   Se activa también la comprobación de correspondencia provincia–CP, que estaba definida pero no conectada.
   HTML: busca id="demo-form_base" en index.html.
   CSS: busca data-demo="form_base" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: form_base
// HTML: template demo-form_base. CSS: data-demo="form_base".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_form_base() {
    const validarLongitud = validarLongitudSinTrim; // conserva la variante del ejercicio original
    // --- Referencias a los campos ---
    const nombre = document.getElementById("nombre");
    const direccion = document.getElementById("direccion");
    const direccionCompleta = document.getElementById("direccionCompleta");
    const telefono = document.getElementById("telefono");
    const codigoPostal = document.getElementById("codigoPostal");
    const ciudad = document.getElementById("ciudad");
    const provincia = document.getElementById("provincia");
    const preferente = document.getElementById("preferente");
    const sexo = document.getElementById("sexo");
    const interes = document.getElementById("interes");
    const usuario = document.getElementById("usuario");
    const contrasena = document.getElementById("contrasena");
    const contrasena2 = document.getElementById("contrasena2");

    const provincias = [{ prefijo: "15", nombre: "A Coruña" }, { prefijo: "01", nombre: "Álava" }, { prefijo: "02", nombre: "Albacete" },
    { prefijo: "03", nombre: "Alicante" }, { prefijo: "04", nombre: "Almería" }, { prefijo: "33", nombre: "Asturias" },
    { prefijo: "05", nombre: "Ávila" }, { prefijo: "06", nombre: "Badajoz" }, { prefijo: "08", nombre: "Barcelona" },
    { prefijo: "09", nombre: "Burgos" }, { prefijo: "10", nombre: "Cáceres" }, { prefijo: "11", nombre: "Cádiz" },
    { prefijo: "39", nombre: "Cantabria" }, { prefijo: "12", nombre: "Castellón" }, { prefijo: "51", nombre: "Ceuta" },
    { prefijo: "13", nombre: "Ciudad Real" }, { prefijo: "14", nombre: "Córdoba" }, { prefijo: "16", nombre: "Cuenca" },
    { prefijo: "17", nombre: "Girona" }, { prefijo: "18", nombre: "Granada" }, { prefijo: "19", nombre: "Guadalajara" },
    { prefijo: "20", nombre: "Guipúzcoa" }, { prefijo: "21", nombre: "Huelva" }, { prefijo: "22", nombre: "Huesca" },
    { prefijo: "07", nombre: "Illes Balears" }, { prefijo: "23", nombre: "Jaén" }, { prefijo: "26", nombre: "La Rioja" },
    { prefijo: "35", nombre: "Las Palmas" }, { prefijo: "24", nombre: "León" }, { prefijo: "25", nombre: "Lleida" },
    { prefijo: "27", nombre: "Lugo" }, { prefijo: "28", nombre: "Madrid" }, { prefijo: "29", nombre: "Málaga" },
    { prefijo: "52", nombre: "Melilla" }, { prefijo: "30", nombre: "Murcia" }, { prefijo: "31", nombre: "Navarra" },
    { prefijo: "32", nombre: "Ourense" }, { prefijo: "34", nombre: "Palencia" }, { prefijo: "36", nombre: "Pontevedra" },
    { prefijo: "37", nombre: "Salamanca" }, { prefijo: "38", nombre: "Santa Cruz de Tenerife" }, { prefijo: "40", nombre: "Segovia" },
    { prefijo: "41", nombre: "Sevilla" }, { prefijo: "42", nombre: "Soria" }, { prefijo: "43", nombre: "Tarragona" },
    { prefijo: "44", nombre: "Teruel" }, { prefijo: "45", nombre: "Toledo" }, { prefijo: "46", nombre: "Valencia" },
    { prefijo: "47", nombre: "Valladolid" }, { prefijo: "48", nombre: "Vizcaya" }, { prefijo: "49", nombre: "Zamora" },
    { prefijo: "50", nombre: "Zaragoza" }
    ];

    provincias.forEach(prov => {
        const option = document.createElement("option");
        option.value = prov.prefijo;
        option.textContent = prov.nombre;
        provincia.appendChild(option);
    })

    // Valida provincia y actualiza el estado del campo.
    function comprobarProvincia() {
        return marcarError(provincia, validarProvincia(provincia.value, codigoPostal.value), document.getElementById("error-provincia"));
    }

    // Comprueba que el código de provincia coincide con el prefijo del CP.
    function validarProvincia(provincia, codigoPostal) {
        return provincia !== "" && provincia === codigoPostal.substring(0, 2);
    }

    // --- Función genérica para marcar un campo como válido/inválido ---
    // Controla las clases de error y el mensaje visible.
    function marcarError(campo, esValido, mensajeError) {
        campo.classList.toggle("campo-error", !esValido);
        if (mensajeError) mensajeError.classList.toggle("visible", !esValido);
        return esValido;
    }

    // --- Comprobaciones de cada campo ---
    // Valida nombre y actualiza el estado del campo.
    function comprobarNombre() {
        return marcarError(nombre, validarLongitud(nombre.value, 2, 120), document.getElementById("errorNombre"));
    }
    // Valida direccion y actualiza el estado del campo.
    function comprobarDireccion() {
        return marcarError(direccion, validarLongitud(direccion.value, 4, 120), document.getElementById("errorDireccion"));
    }
    // Valida direccion completa y actualiza el estado del campo.
    function comprobarDireccionCompleta() {
        return marcarError(direccionCompleta, validarLongitud(direccionCompleta.value, 0, 120), document.getElementById("errorDireccionCompleta"));
    }
    // Valida telefono y actualiza el estado del campo.
    function comprobarTelefono() {
        return marcarError(telefono, validarTelefono(telefono.value), document.getElementById("errorTelefono"));
    }
    // Valida codigo postal y actualiza el estado del campo.
    function comprobarCodigoPostal() {
        return marcarError(codigoPostal, validarSoloNumeros(codigoPostal.value, 5), document.getElementById("errorCP"));
    }
    // Valida sexo y actualiza el estado del campo.
    function comprobarSexo() {
        const marcado = validarRadioMarcado("sexo");
        sexo.classList.toggle("campo-valido", marcado);
        document.getElementById("obligatorioSexo").classList.toggle("visible", !marcado);
        return marcado;
    }
    // Valida interes y actualiza el estado del campo.
    function comprobarInteres() {
        const seleccionado = validarSeleccionMultiple(interes);
        interes.classList.toggle("campo-error", !seleccionado);
        return seleccionado;
    }
    // Valida usuario y actualiza el estado del campo.
    function comprobarUsuario() {
        return marcarError(usuario, validarLongitud(usuario.value, 1, 10), document.getElementById("errorUsuario"));
    }
    // Valida contrasena y actualiza el estado del campo.
    function comprobarContrasena() {
        return marcarError(contrasena, validarContrasena(contrasena.value), document.getElementById("errorContrasena"));
    }
    // Valida contrasenas iguales y actualiza el estado del campo.
    function comprobarContrasenasIguales() {
        const iguales = contrasena.value === contrasena2.value;
        return marcarError(contrasena2, iguales, document.getElementById("errorRepiteContrasena"));
    }

    // --- Resaltado visual al entrar/salir del foco (mismo efecto para todos los campos) ---
    const camposConFoco = [nombre, direccion, direccionCompleta, telefono, codigoPostal, ciudad, provincia, interes, usuario, contrasena, contrasena2];
    camposConFoco.forEach((campo) => {
        campo.addEventListener("focus", () => campo.classList.add("foco"));
        campo.addEventListener("blur", () => campo.classList.remove("foco"));
    });

    // --- Conexión de las validaciones a los eventos ---
    nombre.addEventListener("blur", comprobarNombre);
    direccion.addEventListener("blur", comprobarDireccion);
    direccionCompleta.addEventListener("blur", comprobarDireccionCompleta);
    telefono.addEventListener("blur", comprobarTelefono);
    codigoPostal.addEventListener("blur", comprobarCodigoPostal);
    codigoPostal.addEventListener("blur", comprobarProvincia);
    provincia.addEventListener("change", comprobarProvincia);
    interes.addEventListener("change", comprobarInteres);
    usuario.addEventListener("blur", comprobarUsuario);
    contrasena.addEventListener("blur", comprobarContrasena);
    contrasena.addEventListener("change", comprobarContrasenasIguales);
    contrasena2.addEventListener("blur", comprobarContrasenasIguales);

    document.querySelectorAll('input[name="sexo"]').forEach((radio) => {
        radio.addEventListener("change", comprobarSexo);
    });

    // --- Comprueba todos los campos y devuelve una lista con un mensaje por cada error ---
    // --- Comprueba todos los campos y devuelve un texto con un error por línea ---
    // Ejecuta todas las comprobaciones y acumula errores.
    function obtenerErrores() {
        let errores = "";

        if (!comprobarNombre()) {
            errores += "- El nombre y apellidos debe tener entre 2 y 120 caracteres.\n";
        }
        if (!comprobarDireccion()) {
            errores += "- La dirección debe tener entre 4 y 120 caracteres.\n";
        }
        if (!comprobarDireccionCompleta()) {
            errores += "- La dirección completa puede tener como máximo 120 caracteres.\n";
        }
        if (!comprobarTelefono()) {
            errores += "- El teléfono debe tener 9 dígitos y empezar por 6, 7 o 9.\n";
        }
        if (!comprobarCodigoPostal()) {
            errores += "- El código postal debe tener 5 dígitos.\n";
        }
        if (!comprobarProvincia()) {
            errores += "- La provincia debe coincidir con los dos primeros dígitos del CP.\n";
        }
        if (!comprobarSexo()) {
            errores += "- Debe indicar si es hombre o mujer.\n";
        }
        if (!comprobarInteres()) {
            errores += "- Debe seleccionar al menos un interés.\n";
        }
        if (!comprobarUsuario()) {
            errores += "- El usuario es obligatorio (entre 1 y 10 caracteres).\n";
        }
        if (!comprobarContrasena()) {
            errores += "- La contraseña debe tener entre 8 y 16 caracteres, con mayúscula, minúscula y número.\n";
        }
        if (!comprobarContrasenasIguales()) {
            errores += "- Las contraseñas no coinciden.\n";
        }

        return errores;
    }

    // --- Resumen de datos para mostrar al enviar correctamente ---
    // Compone los datos que se muestran al enviar.
    function obtenerResumen() {
        let resumen = "";

        resumen += "- Nombre y apellidos: " + nombre.value + "\n";
        resumen += "- Dirección: " + direccion.value + "\n";
        resumen += "- Dirección completa: " + direccionCompleta.value + "\n";
        resumen += "- Teléfono: " + telefono.value + "\n";
        resumen += "- Código postal: " + codigoPostal.value + "\n";
        resumen += "- Ciudad: " + ciudad.value + "\n";

        // Provincia: solo se muestra si se ha elegido una
        if (provincia.value !== "selecciona") {
            resumen += "- Provincia: " + provincia.options[provincia.selectedIndex].text + "\n";
        } else {
            resumen += "- Provincia: (no indicada)\n";
        }

        // Preferente
        if (preferente.checked) {
            resumen += "- Preferente: Sí\n";
        } else {
            resumen += "- Preferente: No\n";
        }

        // Sexo
        if (document.getElementById("hombre").checked) {
            resumen += "- Sexo: Hombre\n";
        } else {
            resumen += "- Sexo: Mujer\n";
        }

        // Intereses: se van acumulando en una línea separados por comas
        let intereses = "";
        for (let i = 0; i < interes.options.length; i++) {
            if (interes.options[i].selected) {
                if (intereses !== "") {
                    intereses += ", ";
                }
                intereses += interes.options[i].text;
            }
        }
        resumen += "- Intereses: " + intereses + "\n";

        resumen += "- Usuario: " + usuario.value + "\n";

        return resumen;
    }

    // --- Validación general al enviar el formulario ---
    document.getElementById("formulario").addEventListener("submit", (event) => {
        event.preventDefault();

        const errores = obtenerErrores();

        if (errores === "") {
            alert("El formulario se ha enviado correctamente con estos datos:\n\n" + obtenerResumen());
        } else {
            alert("El formulario tiene los siguientes errores:\n\n" + errores);
        }
    });
}
// FIN PRÁCTICA: form_base


/* ----------------------------------------------------------------------------
   Registro W3Schools: contraseñas · iniciarDemo_password()
   Fuente: index_2.html
   Password validation, mayúscula, minúscula, número, mínimo 8, repetir, mostrar/ocultar y reglas verdes/rojas.
   HTML: busca id="demo-password" en index.html.
   CSS: busca data-demo="password" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: password
// HTML: template demo-password. CSS: data-demo="password".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_password() {
    cargarCSS("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"); // iconos externos opcionales
    // Password Validation y Toggle Password Visibility (W3Schools)
    var psw = document.getElementById('psw');
    var repeat = document.getElementById('repeat');
    var message = document.getElementById('message');
    var resultado = document.getElementById('resultado');

    // Alterna input.type entre password y text.
    function mostrarPassword() {
        var tipo = psw.type === 'password' ? 'text' : 'password';
        psw.type = tipo;
        repeat.type = tipo;
    }

    // Pinta cada regla cumplida o incumplida de contraseña.
    function cambiarEstado(id, valido) {
        document.getElementById(id).className = valido ? 'valid' : 'invalid';
    }

    // Comprueba todas las reglas del formulario y devuelve un booleano.
    function validar() {
        var minuscula = /[a-z]/.test(psw.value);
        var mayuscula = /[A-Z]/.test(psw.value);
        var numero = /[0-9]/.test(psw.value);
        var longitud = psw.value.length >= 8;
        var iguales = psw.value !== '' && psw.value === repeat.value;
        cambiarEstado('letter', minuscula);
        cambiarEstado('capital', mayuscula);
        cambiarEstado('number', numero);
        cambiarEstado('length', longitud);
        cambiarEstado('igual', iguales);
        return minuscula && mayuscula && numero && longitud && iguales;
    }

    psw.onfocus = repeat.onfocus = function () {
        message.style.display = 'block';
    };
    psw.oninput = repeat.oninput = validar;
    document.getElementById('registro').onsubmit = function (event) {
        event.preventDefault();
        message.style.display = 'block';
        if (validar()) {
            resultado.style.color = 'green';
            resultado.textContent = 'Formulario correcto';
        } else {
            resultado.style.color = 'red';
            resultado.textContent = 'Revisa las contraseñas';
        }
    };
    window.mostrarPassword = mostrarPassword; // puente para el atributo onclick/onkeyup del HTML original
}
// FIN PRÁCTICA: password


/* ----------------------------------------------------------------------------
   Óptica: formulario Bootstrap · iniciarDemo_optica()
   Fuente: index_6.html
   Campos floating, input-group, CP y provincia, teléfono opcional, fecha desde mañana, radio, select multiple, tooltip, condiciones y modal.
   HTML: busca id="demo-optica" en index.html.
   CSS: busca data-demo="optica" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: optica
// HTML: template demo-optica. CSS: data-demo="optica".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_optica() {
    // Validaciones especificas de la practica de la optica.
    // Valida formato y compara con mañana a las 00:00.
    function validarFechaDeseada(texto) {
        if (!validarFecha(texto)) {
            return false;
        }

        const dia = parseInt(texto.substring(0, 2));
        const mes = parseInt(texto.substring(3, 5));
        const anio = parseInt(texto.substring(6, 10));
        const fecha = new Date(anio, mes - 1, dia);

        const manana = new Date();
        manana.setHours(0, 0, 0, 0);
        manana.setDate(manana.getDate() + 1);

        return fecha >= manana;
    }

    // Valida prefijos y nueve cifras; aquí el teléfono es opcional.
    function validarTelefono(texto) {
        if (texto === "") {
            return true;
        }
        return validarSoloNumeros(texto, 9) &&
            (texto.charAt(0) === "6" || texto.charAt(0) === "7" || texto.charAt(0) === "9");
    }

    // Provincias según los dos primeros dígitos del código postal.
    const provincias = [
        { prefijo: "01", nombre: "Álava" },
        { prefijo: "02", nombre: "Albacete" },
        { prefijo: "03", nombre: "Alicante" },
        { prefijo: "04", nombre: "Almería" },
        { prefijo: "05", nombre: "Ávila" },
        { prefijo: "06", nombre: "Badajoz" },
        { prefijo: "07", nombre: "Illes Balears" },
        { prefijo: "08", nombre: "Barcelona" },
        { prefijo: "09", nombre: "Burgos" },
        { prefijo: "10", nombre: "Cáceres" },
        { prefijo: "11", nombre: "Cádiz" },
        { prefijo: "12", nombre: "Castellón" },
        { prefijo: "13", nombre: "Ciudad Real" },
        { prefijo: "14", nombre: "Córdoba" },
        { prefijo: "15", nombre: "A Coruña" },
        { prefijo: "16", nombre: "Cuenca" },
        { prefijo: "17", nombre: "Girona" },
        { prefijo: "18", nombre: "Granada" },
        { prefijo: "19", nombre: "Guadalajara" },
        { prefijo: "20", nombre: "Guipúzcoa" },
        { prefijo: "21", nombre: "Huelva" },
        { prefijo: "22", nombre: "Huesca" },
        { prefijo: "23", nombre: "Jaén" },
        { prefijo: "24", nombre: "León" },
        { prefijo: "25", nombre: "Lleida" },
        { prefijo: "26", nombre: "La Rioja" },
        { prefijo: "27", nombre: "Lugo" },
        { prefijo: "28", nombre: "Madrid" },
        { prefijo: "29", nombre: "Málaga" },
        { prefijo: "30", nombre: "Murcia" },
        { prefijo: "31", nombre: "Navarra" },
        { prefijo: "32", nombre: "Ourense" },
        { prefijo: "33", nombre: "Asturias" },
        { prefijo: "34", nombre: "Palencia" },
        { prefijo: "35", nombre: "Las Palmas" },
        { prefijo: "36", nombre: "Pontevedra" },
        { prefijo: "37", nombre: "Salamanca" },
        { prefijo: "38", nombre: "Santa Cruz de Tenerife" },
        { prefijo: "39", nombre: "Cantabria" },
        { prefijo: "40", nombre: "Segovia" },
        { prefijo: "41", nombre: "Sevilla" },
        { prefijo: "42", nombre: "Soria" },
        { prefijo: "43", nombre: "Tarragona" },
        { prefijo: "44", nombre: "Teruel" },
        { prefijo: "45", nombre: "Toledo" },
        { prefijo: "46", nombre: "Valencia" },
        { prefijo: "47", nombre: "Valladolid" },
        { prefijo: "48", nombre: "Vizcaya" },
        { prefijo: "49", nombre: "Zamora" },
        { prefijo: "50", nombre: "Zaragoza" },
        { prefijo: "51", nombre: "Ceuta" },
        { prefijo: "52", nombre: "Melilla" }
    ];

    const formulario = document.getElementById("formulario");
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const telefono = document.getElementById("telefono");
    const codigoPostal = document.getElementById("codigoPostal");
    const provincia = document.getElementById("provincia");
    const fechaDeseada = document.getElementById("fechaDeseada");
    const condiciones = document.getElementById("condiciones");
    const dolencias = document.getElementById("dolencias");
    const comentarios = document.getElementById("comentarios");

    // Pinta clases de validación y muestra u oculta el mensaje.
    function marcarCampo(campo, correcto, mensajeError) {
        campo.classList.toggle("is-invalid", !correcto);
        campo.classList.toggle("is-valid", correcto);
        mensajeError.classList.toggle("d-block", !correcto);
        return correcto;
    }

    // Valida nombre y actualiza el estado del campo.
    function comprobarNombre() {
        return marcarCampo(
            nombre,
            validarLongitud(nombre.value.trim(), 2, 100),
            document.getElementById("errorNombre")
        );
    }

    // Valida email y actualiza el estado del campo.
    function comprobarEmail() {
        return marcarCampo(
            email,
            validarLongitud(email.value.trim(), 1, 100) && email.validity.valid,
            document.getElementById("errorEmail")
        );
    }

    // Valida telefono y actualiza el estado del campo.
    function comprobarTelefono() {
        return marcarCampo(
            telefono,
            validarTelefono(telefono.value.trim()),
            document.getElementById("errorTelefono")
        );
    }

    // Busca el prefijo del CP en el array de provincias.
    function rellenarProvincia() {
        provincia.value = "";
        if (codigoPostal.value.length < 2) {
            return;
        }

        const prefijo = codigoPostal.value.substring(0, 2);
        const encontrada = provincias.find(p => p.prefijo === prefijo);
        if (encontrada) {
            provincia.value = encontrada.nombre;
        }
    }

    // Valida codigo postal y actualiza el estado del campo.
    function comprobarCodigoPostal() {
        rellenarProvincia();
        return marcarCampo(
            codigoPostal,
            validarSoloNumeros(codigoPostal.value, 5) && provincia.value !== "",
            document.getElementById("errorCodigoPostal")
        );
    }

    // Valida un grupo de radios y marca todas las opciones.
    function comprobarTipo() {
        const correcto = validarRadioMarcado("isGafas");
        const opciones = document.getElementsByName("isGafas");
        for (let i = 0; i < opciones.length; i++) {
            opciones[i].classList.toggle("is-invalid", !correcto);
            opciones[i].classList.toggle("is-valid", correcto);
        }
        document.getElementById("errorTipo").classList.toggle("d-block", !correcto);
        return correcto;
    }

    // Valida fecha deseada y actualiza el estado del campo.
    function comprobarFechaDeseada() {
        return marcarCampo(
            fechaDeseada,
            validarFechaDeseada(fechaDeseada.value.trim()),
            document.getElementById("errorFecha")
        );
    }

    // Valida condiciones y actualiza el estado del campo.
    function comprobarCondiciones() {
        return marcarCampo(
            condiciones,
            condiciones.checked,
            document.getElementById("errorCondiciones")
        );
    }

    // No pinta errores al escribir hasta que el campo se haya validado.
    function revisarSiValidado(campo, funcionComprobar) {
        if (campo.classList.contains("is-valid") || campo.classList.contains("is-invalid")) {
            funcionComprobar();
        }
    }

    // Validar al salir de un campo y después, si ya se ha validado, al escribir.
    nombre.addEventListener("blur", comprobarNombre);
    nombre.addEventListener("input", function () {
        revisarSiValidado(nombre, comprobarNombre);
    });

    email.addEventListener("blur", comprobarEmail);
    email.addEventListener("input", function () {
        revisarSiValidado(email, comprobarEmail);
    });

    telefono.addEventListener("blur", comprobarTelefono);
    telefono.addEventListener("input", function () {
        revisarSiValidado(telefono, comprobarTelefono);
    });

    codigoPostal.addEventListener("blur", comprobarCodigoPostal);
    codigoPostal.addEventListener("input", function () {
        rellenarProvincia();
        revisarSiValidado(codigoPostal, comprobarCodigoPostal);
    });

    fechaDeseada.addEventListener("blur", comprobarFechaDeseada);
    fechaDeseada.addEventListener("input", function () {
        revisarSiValidado(fechaDeseada, comprobarFechaDeseada);
    });

    document.getElementsByName("isGafas").forEach(function (opcion) {
        opcion.addEventListener("change", comprobarTipo);
    });
    condiciones.addEventListener("change", comprobarCondiciones);

    // Tooltip de la fecha, mediante Bootstrap.
    new bootstrap.Tooltip(fechaDeseada);

    // Compone el resumen a partir de valores y selecciones.
    function obtenerDatosFormulario() {
        const tipoElegido = document.querySelector('input[name="isGafas"]:checked');
        const seleccionadas = [];
        for (let i = 0; i < dolencias.options.length; i++) {
            if (dolencias.options[i].selected) {
                seleccionadas.push(dolencias.options[i].value);
            }
        }

        return "Nombre: " + nombre.value.trim() + "\n" +
            "Email: " + email.value.trim() + "\n" +
            "Teléfono: " + (telefono.value.trim() || "No indicado") + "\n" +
            "Código postal: " + codigoPostal.value + "\n" +
            "Provincia: " + provincia.value + "\n" +
            "Producto: " + (tipoElegido.value === "gafas" ? "Gafas" : "Lentes de contacto") + "\n" +
            "Dolencias: " + (seleccionadas.join(", ") || "Ninguna") + "\n" +
            "Fecha deseada: " + fechaDeseada.value.trim() + "\n" +
            "Comentarios: " + (comentarios.value.trim() || "Sin comentarios") + "\n" +
            "Condiciones aceptadas: Sí";
    }

    // Validación final: mostrar los errores bajo sus campos.
    // No añadimos el modal de errores porque el enunciado lo deja como opcional.
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const resultados = [
            comprobarNombre(),
            comprobarEmail(),
            comprobarTelefono(),
            comprobarCodigoPostal(),
            comprobarTipo(),
            comprobarFechaDeseada(),
            comprobarCondiciones()
        ];

        if (resultados.every(resultado => resultado)) {
            document.getElementById("datosEnviados").textContent = obtenerDatosFormulario();
            const modal = new bootstrap.Modal(document.getElementById("modalEnviado"));
            modal.show();
        }
    });
}
// FIN PRÁCTICA: optica


/* ----------------------------------------------------------------------------
   Leganés: club de jóvenes · iniciarDemo_jovenes()
   Fuente: index_9.html
   DNI, fecha de nacimiento, subida de JPG/PNG, aficiones con check en select, provincias, validar formulario, botón disabled, reset.
   HTML: busca id="demo-jovenes" en index.html.
   CSS: busca data-demo="jovenes" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: jovenes
// HTML: template demo-jovenes. CSS: data-demo="jovenes".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_jovenes() {
    const formulario = document.getElementById("formulario");
    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const dni = document.getElementById("dni");
    const fechaNacimiento = document.getElementById("fechaNacimiento");
    const archivoDni = document.getElementById("archivoDni");
    const aficiones = document.getElementById("aficiones");
    const codigoPostal = document.getElementById("codigoPostal");
    const provincia = document.getElementById("provincia");
    const situacionLaboral = document.getElementById("situacionLaboral");
    const condiciones = document.getElementById("condiciones");
    const submit = document.getElementById("submit");
    const borrar = document.getElementById("borrar");
    const listaAficiones = [];

    const tiposPermitidos = [
        "image/jpeg",
        "image/png"
    ];

    const extensionesPermitidas = [
        ".jpg",
        ".jpeg",
        ".png"
    ];

    const provincias = [
        { prefijo: "01", nombre: "Álava" },
        { prefijo: "02", nombre: "Albacete" },
        { prefijo: "03", nombre: "Alicante" },
        { prefijo: "04", nombre: "Almería" },
        { prefijo: "05", nombre: "Ávila" },
        { prefijo: "06", nombre: "Badajoz" },
        { prefijo: "07", nombre: "Illes Balears" },
        { prefijo: "08", nombre: "Barcelona" },
        { prefijo: "09", nombre: "Burgos" },
        { prefijo: "10", nombre: "Cáceres" },
        { prefijo: "11", nombre: "Cádiz" },
        { prefijo: "12", nombre: "Castellón" },
        { prefijo: "13", nombre: "Ciudad Real" },
        { prefijo: "14", nombre: "Córdoba" },
        { prefijo: "15", nombre: "A Coruña" },
        { prefijo: "16", nombre: "Cuenca" },
        { prefijo: "17", nombre: "Girona" },
        { prefijo: "18", nombre: "Granada" },
        { prefijo: "19", nombre: "Guadalajara" },
        { prefijo: "20", nombre: "Guipúzcoa" },
        { prefijo: "21", nombre: "Huelva" },
        { prefijo: "22", nombre: "Huesca" },
        { prefijo: "23", nombre: "Jaén" },
        { prefijo: "24", nombre: "León" },
        { prefijo: "25", nombre: "Lleida" },
        { prefijo: "26", nombre: "La Rioja" },
        { prefijo: "27", nombre: "Lugo" },
        { prefijo: "28", nombre: "Madrid" },
        { prefijo: "29", nombre: "Málaga" },
        { prefijo: "30", nombre: "Murcia" },
        { prefijo: "31", nombre: "Navarra" },
        { prefijo: "32", nombre: "Ourense" },
        { prefijo: "33", nombre: "Asturias" },
        { prefijo: "34", nombre: "Palencia" },
        { prefijo: "35", nombre: "Las Palmas" },
        { prefijo: "36", nombre: "Pontevedra" },
        { prefijo: "37", nombre: "Salamanca" },
        { prefijo: "38", nombre: "Santa Cruz de Tenerife" },
        { prefijo: "39", nombre: "Cantabria" },
        { prefijo: "40", nombre: "Segovia" },
        { prefijo: "41", nombre: "Sevilla" },
        { prefijo: "42", nombre: "Soria" },
        { prefijo: "43", nombre: "Tarragona" },
        { prefijo: "44", nombre: "Teruel" },
        { prefijo: "45", nombre: "Toledo" },
        { prefijo: "46", nombre: "Valencia" },
        { prefijo: "47", nombre: "Valladolid" },
        { prefijo: "48", nombre: "Vizcaya" },
        { prefijo: "49", nombre: "Zamora" },
        { prefijo: "50", nombre: "Zaragoza" },
        { prefijo: "51", nombre: "Ceuta" },
        { prefijo: "52", nombre: "Melilla" }
    ];


    // ==============================
    // MARCAR CAMPO
    // ==============================

    // Pinta clases de validación y muestra u oculta el mensaje.
    function marcarCampo(grupo, correcto, mensajeError) {

        grupo.classList.toggle("campo-error", !correcto);
        grupo.classList.toggle("campo-valido", correcto);
        mensajeError.classList.toggle("visible", !correcto);

        return correcto;
    }


    // ==============================
    // NOMBRE
    // ==============================

    // Valida nombre y actualiza el estado del campo.
    function comprobarNombre() {

        return marcarCampo(
            document.getElementById("grupoNombre"),
            validarLongitud(nombre.value.trim(), 2, 20),
            document.getElementById("errorNombre")
        );
    }


    // ==============================
    // APELLIDOS
    // ==============================

    // Valida apellidos y actualiza el estado del campo.
    function comprobarApellidos() {

        return marcarCampo(
            document.getElementById("grupoApellidos"),
            validarLongitud(apellidos.value.trim(), 2, 30),
            document.getElementById("errorApellidos")
        );
    }


    // ==============================
    // DNI
    // ==============================

    // Valida dni y actualiza el estado del campo.
    function comprobarDni() {

        return marcarCampo(
            document.getElementById("grupoDni"),
            validarDni(dni.value),
            document.getElementById("errorDni")
        );
    }


    // ==============================
    // FECHA
    // ==============================

    // Valida fecha y actualiza el estado del campo.
    function comprobarFecha() {

        return marcarCampo(
            document.getElementById("grupoFecha"),
            validarFecha(fechaNacimiento.value),
            document.getElementById("errorFecha")
        );
    }


    // ==============================
    // SEXO
    // ==============================

    // Valida sexo y actualiza el estado del campo.
    function comprobarSexo() {

        return marcarCampo(
            document.getElementById("grupoSexo"),
            validarRadioMarcado("sexo"),
            document.getElementById("errorSexo")
        );
    }


    // ==============================
    // ARCHIVO DNI
    // ==============================

    // Valida archivo y actualiza el estado del campo.
    function comprobarArchivo() {

        const correcto = validarArchivo(archivoDni, tiposPermitidos, extensionesPermitidas);

        if (!correcto) {
            archivoDni.value = "";
        }

        return marcarCampo(
            document.getElementById("grupoArchivo"),
            correcto,
            document.getElementById("errorArchivo")
        );
    }


    // ==============================
    // AFICIONES
    // ==============================

    // Añade/quita la afición de un array y marca la opción visualmente.
    function seleccionarAficion() {

        const valor = aficiones.value;

        if (valor === "") {
            return;
        }

        const opcion = aficiones.options[aficiones.selectedIndex];
        const posicion = listaAficiones.indexOf(valor);

        if (posicion === -1) {

            listaAficiones.push(valor);
            opcion.textContent = "✓ " + valor;
            opcion.classList.add("seleccionada");

        } else {

            listaAficiones.splice(posicion, 1);
            opcion.textContent = valor;
            opcion.classList.remove("seleccionada");
        }

        aficiones.value = "";

        comprobarAficiones();
        actualizarBoton();
    }


    // Valida aficiones y actualiza el estado del campo.
    function comprobarAficiones() {

        return marcarCampo(
            document.getElementById("grupoAficiones"),
            listaAficiones.length > 0,
            document.getElementById("errorAficiones")
        );
    }


    // ==============================
    // PROVINCIA
    // ==============================

    // Busca el prefijo del CP en el array de provincias.
    function rellenarProvincia() {

        provincia.value = "";

        if (codigoPostal.value.length < 2) {
            return;
        }

        const prefijo = codigoPostal.value.substring(0, 2);
        const encontrada = provincias.find(p => p.prefijo === prefijo);

        if (encontrada) {
            provincia.value = encontrada.nombre;
        }
    }


    // ==============================
    // CÓDIGO POSTAL
    // ==============================

    // Valida codigo postal y actualiza el estado del campo.
    function comprobarCodigoPostal() {

        const correcto = validarSoloNumeros(codigoPostal.value, 5) && provincia.value !== "";

        return marcarCampo(
            document.getElementById("grupoCp"),
            correcto,
            document.getElementById("errorCp")
        );
    }


    // ==============================
    // SITUACIÓN LABORAL
    // ==============================

    // Valida situacion y actualiza el estado del campo.
    function comprobarSituacion() {

        return marcarCampo(
            document.getElementById("grupoSituacion"),
            validarSeleccion(situacionLaboral.value),
            document.getElementById("errorSituacion")
        );
    }


    // ==============================
    // CONDICIONES
    // ==============================

    // Valida condiciones y actualiza el estado del campo.
    function comprobarCondiciones() {

        return marcarCampo(
            document.getElementById("grupoCondiciones"),
            condiciones.checked,
            document.getElementById("errorCondiciones")
        );
    }


    // ==============================
    // FORMULARIO COMPLETO
    // ==============================

    // Comprueba todos los campos sin pintar el HTML.
    function formularioValido() {

        return validarLongitud(nombre.value.trim(), 2, 20) &&
            validarLongitud(apellidos.value.trim(), 2, 30) &&
            validarDni(dni.value) &&
            validarFecha(fechaNacimiento.value) &&
            validarRadioMarcado("sexo") &&
            validarArchivo(archivoDni, tiposPermitidos, extensionesPermitidas) &&
            listaAficiones.length > 0 &&
            validarSoloNumeros(codigoPostal.value, 5) &&
            provincia.value !== "" &&
            validarSeleccion(situacionLaboral.value) &&
            condiciones.checked;
    }


    // Deshabilita envío mientras el formulario no sea válido.
    function actualizarBoton() {
        submit.disabled = !formularioValido();
    }


    // ==============================
    // DATOS DEL FORMULARIO
    // ==============================

    // Compone el resumen a partir de valores y selecciones.
    function obtenerDatosFormulario() {

        const sexoSeleccionado = document.querySelector('input[name="sexo"]:checked');

        return "Nombre: " + nombre.value.trim() + "\n" +
            "Apellidos: " + apellidos.value.trim() + "\n" +
            "DNI: " + dni.value.trim().toUpperCase() + "\n" +
            "Fecha de nacimiento: " + fechaNacimiento.value + "\n" +
            "Sexo: " + sexoSeleccionado.value + "\n" +
            "Archivo DNI: " + archivoDni.files[0].name + "\n" +
            "Aficiones: " + listaAficiones.join(", ") + "\n" +
            "Código postal: " + codigoPostal.value + "\n" +
            "Provincia: " + provincia.value + "\n" +
            "Situación laboral: " + situacionLaboral.value + "\n" +
            "Condiciones aceptadas: Sí";
    }


    // ==============================
    // BORRAR FORMULARIO
    // ==============================

    // Resetea controles, arrays y clases de validación.
    function borrarFormulario() {

        formulario.reset();

        listaAficiones.length = 0;
        provincia.value = "";

        for (let i = 0; i < aficiones.options.length; i++) {

            const opcion = aficiones.options[i];

            opcion.classList.remove("seleccionada");

            if (opcion.value !== "") {
                opcion.textContent = opcion.value;
            }
        }

        document.querySelectorAll(".grupoCampo").forEach(
            grupo => {
                grupo.classList.remove("campo-error", "campo-valido");
            }
        );

        document.querySelectorAll(".error").forEach(
            error => {
                error.classList.remove("visible");
            }
        );

        actualizarBoton();
    }


    // ==============================
    // OBTENER ERRORES
    // ==============================

    // Ejecuta todas las comprobaciones y acumula errores.
    function obtenerErrores() {

        let errores = "";

        if (!comprobarNombre()) {
            errores += "- El nombre debe tener entre 2 y 20 caracteres.\n";
        }

        if (!comprobarApellidos()) {
            errores += "- Los apellidos deben tener entre 2 y 30 caracteres.\n";
        }

        if (!comprobarDni()) {
            errores += "- El DNI no es válido.\n";
        }

        if (!comprobarFecha()) {
            errores += "- La fecha de nacimiento no es válida.\n";
        }

        if (!comprobarSexo()) {
            errores += "- Debes seleccionar un sexo.\n";
        }

        if (!comprobarArchivo()) {
            errores += "- Debes subir el DNI en formato JPG o PNG.\n";
        }

        if (!comprobarAficiones()) {
            errores += "- Debes seleccionar al menos una afición.\n";
        }

        if (!comprobarCodigoPostal()) {
            errores += "- El código postal no es válido.\n";
        }

        if (!comprobarSituacion()) {
            errores += "- Debes seleccionar una situación laboral.\n";
        }

        if (!comprobarCondiciones()) {
            errores += "- Debes aceptar las condiciones.\n";
        }

        return errores;
    }


    // ==============================
    // EVENTOS
    // ==============================

    nombre.addEventListener("blur", comprobarNombre);
    nombre.addEventListener("input", actualizarBoton);

    apellidos.addEventListener("blur", comprobarApellidos);
    apellidos.addEventListener("input", actualizarBoton);

    dni.addEventListener("blur", comprobarDni);
    dni.addEventListener("input", actualizarBoton);

    fechaNacimiento.addEventListener("blur", comprobarFecha);
    fechaNacimiento.addEventListener("input", actualizarBoton);

    archivoDni.addEventListener(
        "change",
        function () {
            comprobarArchivo();
            actualizarBoton();
        }
    );

    aficiones.addEventListener("change", seleccionarAficion);

    codigoPostal.addEventListener(
        "input",
        function () {
            rellenarProvincia();
            actualizarBoton();
        }
    );

    codigoPostal.addEventListener("blur", comprobarCodigoPostal);

    situacionLaboral.addEventListener("change", comprobarSituacion);
    situacionLaboral.addEventListener("change", actualizarBoton);

    condiciones.addEventListener("change", comprobarCondiciones);
    condiciones.addEventListener("change", actualizarBoton);

    document.querySelectorAll('input[name="sexo"]').forEach(
        opcion => {
            opcion.addEventListener("change", comprobarSexo);
            opcion.addEventListener("change", actualizarBoton);
        }
    );

    borrar.addEventListener("click", borrarFormulario);


    // ==============================
    // ENVÍO
    // ==============================

    formulario.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const errores = obtenerErrores();

            if (errores === "") {

                const datos = obtenerDatosFormulario();

                alert(
                    "¡Inscripción realizada correctamente!\n\n" +
                    "Datos enviados:\n\n" +
                    datos
                );

            } else {

                alert("Hay algunos campos que debes revisar:\n\n" + errores);

            }
        }
    );

    actualizarBoton();
}
// FIN PRÁCTICA: jovenes


/* ----------------------------------------------------------------------------
   Siempre Activos: registro avanzado Bootstrap · iniciarDemo_mayores_bootstrap()
   Fuente: index_10.html
   DNI/NIE, edad, IBAN, contraseña fuerte, validación asíncrona simulada, grupos, resumen de errores, setCustomValidity, FormData, modales, toast, carousel, tabs, acordeón.
   HTML: busca id="demo-mayores_bootstrap" en index.html.
   CSS: busca data-demo="mayores_bootstrap" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: mayores_bootstrap
// HTML: template demo-mayores_bootstrap. CSS: data-demo="mayores_bootstrap".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_mayores_bootstrap() {
    cargarCSS("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"); // iconos externos opcionales
    document.getElementById('btnConfirmarBorrado').addEventListener('click', () => {
        bootstrap.Modal.getInstance('#modalBorrar').hide();
        bootstrap.Toast.getOrCreateInstance('#toastBorrado').show();
    });
    cuandoDOMListo(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
        document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));
    });
    document.getElementById('botonHover').addEventListener('mouseenter', () => {
        new bootstrap.Modal('#modalHover').show();
    });
    /* =====================================================================
1) FUNCIONES DE VALIDACIÓN "EXTERNAS" (puras, reutilizables, sin DOM)
===================================================================== */

    // DNI (8 cifras + letra) o NIE (X/Y/Z + 7 cifras + letra). Letra = número mod 23
    // Verifica DNI/NIE con letra de control (variante de apuntes).
    function validarDNI(valor) {
        const v = valor.toUpperCase().replace(/[\s-]/g, '');
        if (!/^(\d{8}|[XYZ]\d{7})[A-Z]$/.test(v)) return false;
        const numero = v.slice(0, -1).replace('X', '0').replace('Y', '1').replace('Z', '2');
        const letra = 'TRWAGMYFPDXBNJZSQVHLCKE'[parseInt(numero, 10) % 23];
        return letra === v.slice(-1);
    }

    // Edad en años cumplidos a partir de una fecha 'AAAA-MM-DD'
    // Calcula edad cumplida según fecha ISO.
    function calcularEdad(fechaISO) {
        const nac = new Date(fechaISO + 'T00:00:00');
        const hoy = new Date();
        let edad = hoy.getFullYear() - nac.getFullYear();
        const m = hoy.getMonth() - nac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
        return edad;
    }

    // Las 2 primeras cifras del CP son el código de provincia (01-52)
    const PROVINCIAS = ['Álava', 'Albacete', 'Alicante', 'Almería', 'Ávila', 'Badajoz', 'Illes Balears', 'Barcelona',
        'Burgos', 'Cáceres', 'Cádiz', 'Castellón', 'Ciudad Real', 'Córdoba', 'A Coruña', 'Cuenca', 'Girona', 'Granada',
        'Guadalajara', 'Gipuzkoa', 'Huelva', 'Huesca', 'Jaén', 'León', 'Lleida', 'La Rioja', 'Lugo', 'Madrid', 'Málaga',
        'Murcia', 'Navarra', 'Ourense', 'Asturias', 'Palencia', 'Las Palmas', 'Pontevedra', 'Salamanca',
        'Santa Cruz de Tenerife', 'Cantabria', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo',
        'Valencia', 'Valladolid', 'Bizkaia', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla'];
    // Busca la provincia a partir de las dos cifras iniciales.
    function provinciaDeCP(cp) {
        const n = parseInt(cp.slice(0, 2), 10);
        return (n >= 1 && n <= 52) ? PROVINCIAS[n - 1] : null;
    }

    // IBAN: se mueven 4 caracteres al final, letras → números (A=10...) y el resto mod 97 debe ser 1
    // Calcula módulo 97 sin convertir a un número gigante.
    function validarIBAN(valor) {
        const s = valor.replace(/\s+/g, '').toUpperCase();
        if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
        if (s.startsWith('ES') && s.length !== 24) return false;
        const reordenado = s.slice(4) + s.slice(0, 4);
        const numerico = reordenado.replace(/[A-Z]/g, c => (c.charCodeAt(0) - 55).toString());
        let resto = 0;
        for (const cifra of numerico) resto = (resto * 10 + Number(cifra)) % 97;  // evita números gigantes
        return resto === 1;
    }

    // Fortaleza de la contraseña: qué reglas cumple y una puntuación de 0 a 5
    // Devuelve reglas cumplidas y puntuación de fortaleza.
    function analizarPassword(pw) {
        const reglas = {
            longitud: pw.length >= 8,
            mayuscula: /[A-ZÁÉÍÓÚÑ]/.test(pw),
            minuscula: /[a-záéíóúñ]/.test(pw),
            numero: /\d/.test(pw),
            simbolo: /[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/.test(pw)
        };
        const puntos = Object.values(reglas).filter(Boolean).length + (pw.length >= 12 ? 1 : 0);
        return { reglas, puntos: Math.min(puntos, 5) };
    }

    // Simula una petición al servidor (en la vida real: fetch('/api/usuarios/existe?u=...'))
    // Simula respuesta asíncrona; no consulta un servidor real.
    function comprobarUsuarioServidor(usuario) {
        const ocupados = ['admin', 'root', 'usuario', 'test', 'profesor'];
        return new Promise(resolve => setTimeout(() => resolve(!ocupados.includes(usuario)), 900));
    }

    /* =====================================================================
       2) INTEGRACIÓN CON BOOTSTRAP
       ===================================================================== */
    const form = document.getElementById('formRegistro');
    const $ = id => document.getElementById(id);

    // Pinta el estado de un campo: setCustomValidity + clases + mensajes
    function marcar(campo, error, mensajeOk = '') {
        campo.setCustomValidity(error);
        campo.classList.toggle('is-invalid', !!error);
        campo.classList.toggle('is-valid', !error);
        if ($(campo.id + '-error')) $(campo.id + '-error').textContent = error;
        if ($(campo.id + '-ok')) $(campo.id + '-ok').textContent = mensajeOk;
    }

    // Traduce los errores nativos de HTML5 a mensajes claros en español
    function errorNativo(c) {
        const v = c.validity;
        if (v.valueMissing) return 'Este campo es obligatorio';
        if (v.typeMismatch) return c.type === 'email' ? 'Escribe un email válido (nombre@dominio.es)' : 'Formato no válido';
        if (v.tooShort) return `Mínimo ${c.minLength} caracteres (llevas ${c.value.length})`;
        if (v.patternMismatch) return c.dataset.patron || 'Hay caracteres no permitidos';
        return '';
    }

    // Reglas de cada campo: devuelven el mensaje de error ('' si es correcto)
    const reglas = {
        nombre: c => errorNativo(c),
        apellidos: c => errorNativo(c),
        dni: c => errorNativo(c) || (validarDNI(c.value) ? '' :
            (/^(\d{8}|[XYZ]\d{7})[A-Z]$/.test(c.value) ? 'La letra no corresponde al número' : 'Formato: 8 cifras + letra, o X/Y/Z + 7 cifras + letra')),
        fnac: c => {
            const e = errorNativo(c);
            if (e) return e;
            const edad = calcularEdad(c.value);
            if (edad < 0) return 'La fecha no puede ser futura';
            if (edad < 18) return `Debes ser mayor de edad (tendrías ${edad} años)`;
            if (edad > 110) return 'Revisa el año de nacimiento';
            return '';
        },
        email: c => errorNativo(c),
        telefono: c => errorNativo(c),
        cp: c => errorNativo(c) || (provinciaDeCP(c.value) ? '' : 'No existe ninguna provincia con ese código'),
        password: c => {
            if (c.validity.valueMissing) return 'Este campo es obligatorio';
            const { reglas } = analizarPassword(c.value);
            return (reglas.longitud && reglas.mayuscula && reglas.minuscula && reglas.numero)
                ? '' : 'No cumple los requisitos indicados abajo';
        },
        password2: c => errorNativo(c) || (c.value === $('password').value ? '' : 'Las contraseñas no coinciden'),
        iban: c => errorNativo(c) || (validarIBAN(c.value) ? '' : 'IBAN incorrecto: revisa los dígitos de control'),
        terminos: c => c.checked ? '' : 'Debes aceptar las condiciones'
    };

    // Mensajes de acierto con información útil
    const mensajesOk = {
        dni: c => /^[XYZ]/.test(c.value) ? 'NIE correcto' : 'DNI correcto',
        fnac: c => `Edad: ${calcularEdad(c.value)} años`,
        cp: c => `Provincia: ${provinciaDeCP(c.value)}`,
        iban: () => 'IBAN válido'
    };

    // Limpia el error anterior, aplica reglas y actualiza feedback.
    function validarCampo(c) {
        c.setCustomValidity('');                        // limpiar error propio antes de evaluar
        if (c.id === 'telefono' && c.value === '') {    // opcional y vacío: neutro
            c.classList.remove('is-valid', 'is-invalid');
            return;
        }
        const error = reglas[c.id](c);
        marcar(c, error, !error && mensajesOk[c.id] ? mensajesOk[c.id](c) : '');
    }

    // Grupos (checkbox con mínimo/máximo y radios): se marcan todos sus elementos
    // Valida un conjunto de radios/checkbox y pinta el grupo.
    function validarGrupo(nombre, comprobar) {
        const opciones = [...form.querySelectorAll(`[name="${nombre}"]`)];
        opciones.forEach(o => o.setCustomValidity(''));
        const error = comprobar(opciones);
        opciones.forEach(o => {
            o.classList.toggle('is-invalid', !!error);
            o.classList.toggle('is-valid', !error);
        });
        opciones[0].setCustomValidity(error);
        const fb = $(opciones[0].id + '-error');
        fb.textContent = error;
        fb.classList.toggle('d-block', !!error);       // el feedback no es hermano del input: lo mostramos a mano
    }
    const validarIntereses = () => validarGrupo('intereses', ops => {
        const n = ops.filter(o => o.checked).length;
        return n === 0 ? 'Elige al menos un interés' : n > 3 ? `Máximo 3 intereses (has marcado ${n})` : '';
    });
    const validarPlan = () => validarGrupo('plan', ops => ops.some(o => o.checked) ? '' : 'Elige un plan');

    /* ---------- Usuario: validación asíncrona con debounce ---------- */
    let temporizador, peticionActual = 0;
    function estadoUsuario(estado) {
        const iconos = {
            neutro: '<i class="bi bi-person"></i>',
            cargando: '<span class="spinner-border spinner-border-sm text-primary" role="status"></span>',
            ok: '<i class="bi bi-check-circle-fill text-success"></i>',
            error: '<i class="bi bi-x-circle-fill text-danger"></i>'
        };
        $('usuario-estado').innerHTML = iconos[estado];
    }
    // Valida nombre de usuario con simulación de consulta asíncrona.
    async function validarUsuario() {
        const c = $('usuario');
        c.setCustomValidity('');
        const e = errorNativo(c);
        if (e) {
            marcar(c, e);
            estadoUsuario('error');
            return;
        }
        const id = ++peticionActual;
        c.classList.remove('is-valid', 'is-invalid');
        c.setCustomValidity('Comprobando…');           // mientras tanto no se puede enviar
        estadoUsuario('cargando');
        const libre = await comprobarUsuarioServidor(c.value);
        if (id !== peticionActual) return;             // llegó una respuesta antigua: se ignora
        marcar(c, libre ? '' : `"${c.value}" ya está en uso. Prueba con "${c.value}_${new Date().getFullYear()}"`,
            libre ? '¡Nombre de usuario disponible!' : '');
        estadoUsuario(libre ? 'ok' : 'error');
    }

    /* ---------- Contraseña: medidor y lista de requisitos ---------- */
    // Actualiza indicadores de requisitos de contraseña.
    function actualizarFuerza() {
        const { reglas: r, puntos } = analizarPassword($('password').value);
        document.querySelectorAll('#reglasPassword li').forEach(li => {
            const ok = r[li.dataset.regla];
            const opcional = li.dataset.regla === 'simbolo';
            li.querySelector('i').className = ok ? 'bi bi-check-circle-fill text-success'
                : opcional ? 'bi bi-dash-circle text-body-secondary' : 'bi bi-x-circle-fill text-danger';
        });
        const niveles = [['—', ''], ['Muy débil', 'bg-danger'], ['Débil', 'bg-danger'], ['Media', 'bg-warning'], ['Fuerte', 'bg-info'], ['Muy fuerte', 'bg-success']];
        const [texto, color] = niveles[$('password').value ? puntos : 0];
        $('fuerzaBarra').className = 'progress-bar ' + color;
        $('fuerzaBarra').style.width = ($('password').value ? puntos * 20 : 0) + '%';
        $('fuerzaTexto').textContent = 'Fortaleza: ' + texto;
    }

    /* =====================================================================
       3) EVENTOS: cuándo se valida
       ===================================================================== */
    Object.keys(reglas).forEach(id => {
        const c = $(id);
        // Primera validación al salir del campo; después, en cada cambio
        c.addEventListener('blur', () => {
            c.dataset.tocado = '1';
            validarCampo(c);
        });
        c.addEventListener(c.type === 'checkbox' || c.type === 'date' ? 'change' : 'input', () => {
            if (c.id === 'dni') c.value = c.value.toUpperCase();
            if (c.id === 'password') {
                actualizarFuerza();
                if ($('password2').dataset.tocado) validarCampo($('password2'));  // validación cruzada
            }
            if (c.dataset.tocado || c.type === 'checkbox') validarCampo(c);
        });
    });
    // IBAN: formato en bloques de 4 al salir del campo
    $('iban').addEventListener('blur', e => {
        e.target.value = e.target.value.replace(/\s+/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim();
        validarCampo(e.target);
    });
    $('usuario').addEventListener('input', () => {
        clearTimeout(temporizador);
        temporizador = setTimeout(validarUsuario, 500);   // debounce: espera a que deje de escribir
    });
    form.querySelectorAll('[name="intereses"]').forEach(o => o.addEventListener('change', validarIntereses));
    form.querySelectorAll('[name="plan"]').forEach(o => o.addEventListener('change', validarPlan));
    $('verPassword').addEventListener('click', function () {
        const p = $('password'), visible = p.type === 'text';
        p.type = visible ? 'password' : 'text';
        this.innerHTML = visible ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });

    /* ---------- Envío ---------- */
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = $('btnRegistro'), textoBtn = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Validando…';

        Object.keys(reglas).forEach(id => {
            $(id).dataset.tocado = '1';
            validarCampo($(id));
        });
        validarIntereses();
        validarPlan();
        clearTimeout(temporizador);
        await validarUsuario();                          // esperamos al "servidor"

        btn.disabled = false;
        btn.innerHTML = textoBtn;

        // Campos inválidos (un solo elemento por grupo de radios/checks)
        const vistos = new Set();
        const invalidos = [...form.querySelectorAll('input:invalid, select:invalid, textarea:invalid')]
            .filter(c => !vistos.has(c.name) && vistos.add(c.name));

        const resumen = $('resumenErrores');
        if (invalidos.length) {
            $('resumenTitulo').textContent = invalidos.length === 1 ? 'Hay 1 error en el formulario' : `Hay ${invalidos.length} errores en el formulario`;
            $('listaErrores').innerHTML = '';
            invalidos.forEach(c => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#${c.id}" class="alert-link"></a>: <span></span>`;
                li.querySelector('a').textContent = c.dataset.nombre || c.name;
                li.querySelector('span').textContent = c.validationMessage;
                li.querySelector('a').addEventListener('click', ev => {
                    ev.preventDefault();
                    c.focus();
                });
                $('listaErrores').appendChild(li);
            });
            invalidos.forEach(c => {
                c.classList.remove('sacudir');
                void c.offsetWidth;
                c.classList.add('sacudir');
            });  // animación de aviso
            resumen.classList.remove('d-none');
            resumen.scrollIntoView({ behavior: 'smooth', block: 'center' });
            resumen.focus({ preventScroll: true });        // los lectores de pantalla lo anuncian
            return;
        }

        // Todo correcto: mostramos los datos (aquí se haría el fetch al servidor)
        resumen.classList.add('d-none');
        const datos = new FormData(form);
        const filas = [['Nombre', datos.get('nombre') + ' ' + datos.get('apellidos')], ['DNI/NIE', datos.get('dni')],
        ['Email', datos.get('email')], ['Provincia', provinciaDeCP(datos.get('cp'))], ['Usuario', datos.get('usuario')],
        ['IBAN', datos.get('iban')], ['Intereses', datos.getAll('intereses').join(', ')], ['Plan', datos.get('plan')],
        ['Boletín', datos.get('boletin') ? 'Sí' : 'No']];
        $('tablaResumen').innerHTML = '';
        filas.forEach(([k, v]) => {
            const tr = $('tablaResumen').insertRow();
            tr.insertCell().textContent = k;
            tr.cells[0].className = 'fw-semibold';
            tr.insertCell().textContent = v;
        });
        bootstrap.Modal.getOrCreateInstance('#modalRegistro').show();
    });

    /* ---------- Limpiar ---------- */
    form.addEventListener('reset', () => {
        setTimeout(() => {   // esperamos a que el navegador vacíe los campos
            form.querySelectorAll('.is-valid, .is-invalid').forEach(c => c.classList.remove('is-valid', 'is-invalid'));
            form.querySelectorAll('input').forEach(c => {
                c.setCustomValidity('');
                delete c.dataset.tocado;
            });
            form.querySelectorAll('.invalid-feedback.d-block').forEach(f => f.classList.remove('d-block'));
            $('resumenErrores').classList.add('d-none');
            estadoUsuario('neutro');
            actualizarFuerza();
        });
    });
}
// FIN PRÁCTICA: mayores_bootstrap


/* ----------------------------------------------------------------------------
   Tabla dinámica de sucursales · iniciarDemo_tabla_sucursales()
   Fuente: TablasRandom.html
   Crear tabla desde JS, cabecera, tr/th/td, bucles anidados, 12 meses, input por celda, prompt.
   Se añade entrada numérica para no bloquear al abrir y un botón para probar prompt; límite de 200 filas de ejemplo.
   HTML: busca id="demo-tabla_sucursales" en index.html.
   CSS: busca data-demo="tabla_sucursales" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: tabla_sucursales
// HTML: template demo-tabla_sucursales. CSS: data-demo="tabla_sucursales".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_tabla_sucursales() {
    const tabla = porId('TablaSucursales'), campo = porId('nSucursales'), aviso = porId('avisoTabla');
    function generar() {
        if (!validarEntero(campo.value, 0, 200)) {
            aviso.textContent = 'Introduce un entero entre 0 y 200';
            return;
        }
        crearTablaSucursales(tabla, Number(campo.value), 12);
        aviso.textContent = campo.value + ' sucursales';
    }
    porId('generarTabla').addEventListener('click', generar);
    // Prompt del ejercicio original: se convierte el texto después de comprobarlo.
    porId('preguntarTabla').addEventListener('click', () => {
        const valor = prompt('Ingrese el número de sucursales.');
        if (valor !== null) {
            campo.value = valor;
            generar();
        }
    });
    generar();
}
// FIN PRÁCTICA: tabla_sucursales


/* REFERENCIA ORIGINAL · Tabla dinámica de sucursales (no ejecutar; ver versión anterior adaptada)

        const MESES = 12;
        const tabla = document.getElementById("TablaSucursales");

        let cantidadSucursales = parseInt(prompt("Ingrese el numero de sucursales."), 10)
        if(isNaN(cantidadSucursales) || cantidadSucursales <= 0){
            cantidadSucursales = 0;
        }

        const filaCabecera = document.createElement("tr");
        const thSucursal= document.createElement("th");
        thSucursal.textContent = "Sucursal";
        filaCabecera.appendChild(thSucursal);

        for(let i = 1; i <= MESES; i++){
            const th = document.createElement("th");
            th.textContent = `Mes ${i}`;
            filaCabecera.appendChild(th);
        }
        tabla.appendChild(filaCabecera);

        for(let i = 1; i <= cantidadSucursales; i++){
            const fila = document.createElement("tr");
            const tdNombre = document.createElement("td");
            tdNombre.textContent = `Sucu.${i}`;
            fila.appendChild(tdNombre);

            for(let mes = 0; mes < MESES; mes++){
                const td = document.createElement("td");
                const inputMes = document.createElement("input");
                inputMes.type = "text";
                inputMes.value = `${i}-${mes+1}`;
                inputMes.size = 5;
                td.appendChild(inputMes);
                fila.appendChild(td);

            }
            tabla.appendChild(fila);
        }


    
*/

/* ----------------------------------------------------------------------------
   Panadería: cesta de compra · iniciarDemo_panaderia()
   Fuente: index.html
   Productos y precios, cantidad entera, subtotal, añadir, agrupar repetidos con find, eliminar con check y filter, total y ticket.
   HTML: busca id="demo-panaderia" en index.html.
   CSS: busca data-demo="panaderia" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: panaderia
// HTML: template demo-panaderia. CSS: data-demo="panaderia".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_panaderia() {
    const productos = [
        { nombre: "Barra de pan", precio: 0.90 },
        { nombre: "Chapata", precio: 1.20 },
        { nombre: "Croissant", precio: 1.50 },
        { nombre: "Napolitana de chocolate", precio: 1.80 },
        { nombre: "Palmera de chocolate", precio: 1.75 }
    ];

    let pedido = [];

    const selectProducto = document.getElementById("producto");
    const selectPrecio = document.getElementById("precio");
    const inputCantidad = document.getElementById("cantidad");
    const subtotalLinea = document.getElementById("subtotalLinea");
    const botonAnadir = document.getElementById("botonAnadir");
    const botonBorrar = document.getElementById("botonBorrar");
    const botonTicket = document.getElementById("botonTicket");
    const lineasPedido = document.getElementById("lineasPedido");
    const totalPedido = document.getElementById("totalPedido");

    productos.forEach((producto, posicion) => {
        selectProducto.innerHTML += `<option value="${posicion}">${producto.nombre}</option>`;
        selectPrecio.innerHTML += `<option value="${posicion}">${formatearPrecio(producto.precio)}</option>`;
    });

    // Calcula subtotal y habilita Añadir si selección/cantidad son válidas.
    function actualizarLinea() {
        const posicion = selectProducto.value;
        const cantidad = Number(inputCantidad.value);

        selectPrecio.value = posicion;

        if (posicion === "" || !cantidadValida(inputCantidad.value)) {
            subtotalLinea.textContent = "—";
            botonAnadir.disabled = true;
            return;
        }

        const producto = productos[Number(posicion)];
        subtotalLinea.textContent = formatearPrecio(producto.precio * cantidad);
        botonAnadir.disabled = false;
    }

    // Repinta el tbody y calcula el total; los índices sirven para borrar.
    function mostrarPedido() {
        lineasPedido.innerHTML = "";
        let total = 0;

        if (pedido.length === 0) {
            lineasPedido.innerHTML = '<tr><td colspan="5" class="vacio">Tu cestita está vacía. ¡Añade algo rico! ♡</td></tr>';
        }

        pedido.forEach((linea, posicion) => {
            const subtotal = linea.precio * linea.cantidad;
            total += subtotal;

            lineasPedido.innerHTML += `
                <tr>
                    <td>${linea.nombre}</td>
                    <td>${formatearPrecio(linea.precio)}</td>
                    <td>${linea.cantidad}</td>
                    <td>${formatearPrecio(subtotal)}</td>
                    <td><input type="checkbox" class="marcarBorrar" value="${posicion}" aria-label="Borrar ${linea.nombre}"></td>
                </tr>
            `;
        });

        totalPedido.textContent = formatearPrecio(total);
        botonBorrar.disabled = pedido.length === 0;
        botonTicket.disabled = pedido.length === 0;
    }

    selectProducto.addEventListener("change", actualizarLinea);
    inputCantidad.addEventListener("input", actualizarLinea);

    document.getElementById("formulario").addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (selectProducto.value === "" || !cantidadValida(inputCantidad.value)) {
            return;
        }

        const producto = productos[Number(selectProducto.value)];
        const cantidad = Number(inputCantidad.value);
        const existente = pedido.find(linea => linea.nombre === producto.nombre);

        if (existente) {
            existente.cantidad += cantidad;
        } else {
            pedido.push({ nombre: producto.nombre, precio: producto.precio, cantidad: cantidad });
        }

        mostrarPedido();

        selectProducto.value = "";
        inputCantidad.value = 1;
        actualizarLinea();
    });

    botonBorrar.addEventListener("click", function () {
        const marcados = document.querySelectorAll(".marcarBorrar:checked");

        if (marcados.length === 0) {
            alert("Selecciona al menos un producto para borrar.");
            return;
        }

        if (confirm("¿Quieres borrar los productos seleccionados?")) {
            const posiciones = Array.from(marcados).map(check => Number(check.value));
            pedido = pedido.filter((linea, posicion) => !posiciones.includes(posicion));
            mostrarPedido();
        }
    });

    botonTicket.addEventListener("click", function () {
        let ticket = "PANADERÍA\n";
        ticket += "Calle de la Canela, 12 · Madrid\n";
        ticket += "Teléfono: 91 123 45 67\n";
        ticket += "-----------------------------\n";

        pedido.forEach(linea => {
            ticket += `${linea.nombre}\n`;
            ticket += `${linea.cantidad} x ${formatearPrecio(linea.precio)} = ${formatearPrecio(linea.precio * linea.cantidad)}\n`;
        });

        ticket += "-----------------------------\n";
        ticket += `TOTAL: ${totalPedido.textContent}\n`;
        ticket += "¡Gracias por tu compra! ♡";

        alert(ticket);
    });
}
// FIN PRÁCTICA: panaderia


/* ----------------------------------------------------------------------------
   Talleres Vives: factura con IVA · iniciarDemo_talleres()
   Fuente: index_8.html
   NIF/NIE/CIF, captcha, CP y provincia, crear filas dinámicas, IVA 4/10/21, validación decimal coma/punto, redondeo, delegación de eventos y modal resumen.
   HTML: busca id="demo-talleres" en index.html.
   CSS: busca data-demo="talleres" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: talleres
// HTML: template demo-talleres. CSS: data-demo="talleres".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_talleres() {
    // Las funciones de validar.js se pueden llamar directamente.
    // Por ejemplo: validarLongitud(nombre.value, 2, 100).

    // --- Referencias a los elementos del HTML ---
    const columnaFormulario = document.querySelector('main > .col-9');
    const contenedorEnviar = columnaFormulario.querySelector('.d-flex.justify-content-end');

    // --- Crear la sección de factura dentro de la misma columna del formulario ---
    const seccionFactura = crearElemento('section', 'container-fluid py-4');
    const tituloFactura = crearElemento('h2', 'h4 mb-3', 'Líneas de factura');
    const botonAnadir = crearElemento('button', 'btn btn-danger mb-3', 'Añadir fila');
    botonAnadir.type = 'button';

    const contenedorTabla = crearElemento('div', 'table-responsive');
    const tabla = crearElemento('table', 'table table-bordered align-middle');
    const cabecera = crearElemento('thead', 'table-light');
    const encabezado = crearElemento('tr');

    ['Nº', 'Cantidad', 'Descripción', 'Precio', 'IVA %', 'Importe',
        'Importe IVA', 'Total línea', 'Borrar'].forEach(texto => {
            const th = crearElemento('th', '', texto);
            encabezado.appendChild(th);
        });

    cabecera.appendChild(encabezado);
    const cuerpo = crearElemento('tbody');
    cuerpo.id = 'invoiceLines';
    tabla.appendChild(cabecera);
    tabla.appendChild(cuerpo);
    contenedorTabla.appendChild(tabla);

    // --- Crear la tabla con los totales de los tres IVA ---
    const tituloTotales = crearElemento('h3', 'h5 mt-3', 'Totales por IVA');
    const tablaTotales = crearElemento('table', 'table table-bordered w-auto');
    const encabezadoTotales = crearElemento('tr');

    ['IVA', 'Base imponible', 'Cuota IVA'].forEach(texto => {
        encabezadoTotales.appendChild(crearElemento('th', '', texto));
    });

    const cuerpoTotales = crearElemento('tbody');
    const salidasTotales = {};

    [4, 10, 21].forEach(iva => {
        const fila = crearElemento('tr');
        const porcentaje = crearElemento('th', '', iva + '%');
        const base = crearElemento('td', '', formatearMoneda(0));
        const cuota = crearElemento('td', '', formatearMoneda(0));
        fila.appendChild(porcentaje);
        fila.appendChild(base);
        fila.appendChild(cuota);
        cuerpoTotales.appendChild(fila);
        salidasTotales[iva] = { base, cuota };
    });

    tablaTotales.appendChild(encabezadoTotales);
    tablaTotales.appendChild(cuerpoTotales);
    const totalFactura = crearElemento('p', 'fw-bold fs-5', 'TOTAL FACTURA: 0,00 €');

    seccionFactura.appendChild(tituloFactura);
    seccionFactura.appendChild(botonAnadir);
    seccionFactura.appendChild(contenedorTabla);
    seccionFactura.appendChild(tituloTotales);
    seccionFactura.appendChild(tablaTotales);
    seccionFactura.appendChild(totalFactura);

    // El botón Enviar que ya estaba en el HTML permanece debajo de la factura.
    if (contenedorEnviar) {
        contenedorEnviar.insertAdjacentElement('beforebegin', seccionFactura);
    } else {
        columnaFormulario.appendChild(seccionFactura);
    }

    // --- Funciones para construir una línea ---
    // Crea campo de factura y su bloque de error.
    function crearCampoLinea(clase, maximo, mensaje, etiqueta) {
        const contenedor = crearElemento('div');
        const campo = crearElemento('input', 'form-control ' + clase);
        campo.type = 'text';
        campo.maxLength = maximo;
        campo.placeholder = etiqueta;
        campo.setAttribute('aria-label', etiqueta);

        if (clase !== 'description-input') {
            campo.inputMode = 'decimal';
        }

        const error = crearElemento('div', 'invalid-feedback', mensaje);
        contenedor.appendChild(campo);
        contenedor.appendChild(error);
        return { contenedor, campo };
    }

    // Inserta un nodo DOM dentro de una celda td.
    function crearCelda(contenido) {
        const celda = crearElemento('td');
        celda.appendChild(contenido);
        return celda;
    }

    // --- Comprobaciones de los campos de cada línea (estilo del profesor) ---
    // Valida cantidad y actualiza el estado del campo.
    function comprobarCantidad(fila, mostrar = false) {
        const campo = fila.querySelector('.quantity-input');
        const correcto = validarDecimal(campo.value, 3, 2, false);
        if (mostrar || campo.dataset.tocado === 'si') {
            mostrarValidacion(campo, correcto,
                'Cantidad: de 0,01 a 999,99; máximo 2 decimales.');
        }
        return correcto;
    }

    // Valida descripcion y actualiza el estado del campo.
    function comprobarDescripcion(fila, mostrar = false) {
        const campo = fila.querySelector('.description-input');
        const correcto = validarLongitud(campo.value, 1, 50);
        if (mostrar || campo.dataset.tocado === 'si') {
            mostrarValidacion(campo, correcto,
                'Escribe una descripción de 1 a 50 caracteres.');
        }
        return correcto;
    }

    // Valida precio y actualiza el estado del campo.
    function comprobarPrecio(fila, mostrar = false) {
        const campo = fila.querySelector('.price-input');
        const correcto = validarDecimal(campo.value, 3, 2, true);
        if (mostrar || campo.dataset.tocado === 'si') {
            mostrarValidacion(campo, correcto,
                'Precio: de 0 a 999,99; máximo 2 decimales.');
        }
        return correcto;
    }

    // Evalúa las tres comprobaciones de una fila, sin cortocircuito.
    function comprobarLinea(fila, mostrar = false) {
        // Se ejecutan las tres comprobaciones, aunque falle alguna.
        const cantidadCorrecta = comprobarCantidad(fila, mostrar);
        const descripcionCorrecta = comprobarDescripcion(fila, mostrar);
        const precioCorrecto = comprobarPrecio(fila, mostrar);
        return cantidadCorrecta && descripcionCorrecta && precioCorrecto;
    }

    // --- Calcular el importe de una línea ---
    // Calcula base, cuota y total de una fila a partir de cantidad, precio e IVA.
    function calcularImportesLinea(fila) {
        if (!comprobarLinea(fila)) {
            return { base: 0, cuota: 0, total: 0 };
        }

        const cantidad = aNumero(fila.querySelector('.quantity-input').value);
        const precio = aNumero(fila.querySelector('.price-input').value);
        const iva = Number(fila.querySelector('.vat-select').value);
        const base = redondear(cantidad * precio);
        const cuota = redondear(base * iva / 100);
        return { base, cuota, total: redondear(base + cuota) };
    }

    // Pinta los importes calculados en las celdas de la fila.
    function actualizarImportesLinea(fila) {
        const importes = calcularImportesLinea(fila);
        fila.querySelector('.line-amount').textContent = formatearMoneda(importes.base);
        fila.querySelector('.line-vat').textContent = formatearMoneda(importes.cuota);
        fila.querySelector('.line-total').textContent = formatearMoneda(importes.total);
    }

    // --- Calcular los totales de IVA y de la factura ---
    // Acumula importes por IVA en céntimos para evitar errores de redondeo.
    function actualizarTotalesFactura() {
        const acumulados = {
            4: { base: 0, cuota: 0 },
            10: { base: 0, cuota: 0 },
            21: { base: 0, cuota: 0 }
        };

        cuerpo.querySelectorAll('tr').forEach(fila => {
            const iva = Number(fila.querySelector('.vat-select').value);
            const importes = calcularImportesLinea(fila);
            // Los acumulados se guardan en céntimos para evitar errores de decimales.
            acumulados[iva].base += Math.round(importes.base * 100);
            acumulados[iva].cuota += Math.round(importes.cuota * 100);
        });

        let totalCentimos = 0;
        [4, 10, 21].forEach(iva => {
            const base = acumulados[iva].base;
            const cuota = acumulados[iva].cuota;
            salidasTotales[iva].base.textContent = formatearMoneda(base / 100);
            salidasTotales[iva].cuota.textContent = formatearMoneda(cuota / 100);
            totalCentimos += base + cuota;
        });

        totalFactura.textContent = 'TOTAL FACTURA: ' + formatearMoneda(totalCentimos / 100);
    }

    // Renumeración de las filas tras añadir o borrar.
    function actualizarNumerosLineas() {
        cuerpo.querySelectorAll('tr').forEach((fila, indice) => {
            fila.querySelector('.line-number').textContent = indice + 1;
        });
    }

    // --- Añadir y borrar filas ---
    // Crea una nueva línea de factura si la anterior es válida.
    function anadirFila() {
        const filas = cuerpo.querySelectorAll('tr');

        if (filas.length > 0) {
            const ultimaFila = filas[filas.length - 1];
            if (!comprobarLinea(ultimaFila, true)) {
                const primerError = ultimaFila.querySelector('.is-invalid');
                if (primerError) primerError.focus();
                return;
            }
        }

        const fila = crearElemento('tr');
        const numero = crearElemento('span', 'line-number');
        const cantidad = crearCampoLinea('quantity-input', 6,
            'Cantidad: de 0,01 a 999,99; máximo 2 decimales.', 'Cantidad');
        const descripcion = crearCampoLinea('description-input', 50,
            'Descripción obligatoria (máximo 50 caracteres).', 'Descripción');
        const precio = crearCampoLinea('price-input', 6,
            'Precio: de 0 a 999,99; máximo 2 decimales.', 'Precio');

        const iva = crearElemento('select', 'form-select vat-select');
        iva.setAttribute('aria-label', 'Porcentaje de IVA');
        [4, 10, 21].forEach(valor => {
            const opcion = crearElemento('option', '', valor + '%');
            opcion.value = String(valor);
            if (valor === 21) opcion.selected = true;
            iva.appendChild(opcion);
        });

        const base = crearElemento('span', 'line-amount', formatearMoneda(0));
        const cuota = crearElemento('span', 'line-vat', formatearMoneda(0));
        const total = crearElemento('span', 'line-total', formatearMoneda(0));
        const borrar = crearElemento('button', 'btn btn-danger btn-sm borrar-linea', 'Borrar');
        borrar.type = 'button';

        fila.appendChild(crearCelda(numero));
        fila.appendChild(crearCelda(cantidad.contenedor));
        fila.appendChild(crearCelda(descripcion.contenedor));
        fila.appendChild(crearCelda(precio.contenedor));
        fila.appendChild(crearCelda(iva));
        fila.appendChild(crearCelda(base));
        fila.appendChild(crearCelda(cuota));
        fila.appendChild(crearCelda(total));
        fila.appendChild(crearCelda(borrar));
        cuerpo.appendChild(fila);

        actualizarNumerosLineas();
        actualizarTotalesFactura();
        cantidad.campo.focus();
    }

    // Elimina una fila y recalcula totales.
    function borrarFila(fila) {
        fila.remove();
        actualizarNumerosLineas();
        actualizarTotalesFactura();
    }

    // --- Funciones que responden a los eventos ---
    // Delegación de input: el tbody captura cambios de filas creadas después.
    function comprobarCambiosFila(evento) {
        const campo = evento.target;
        if (!campo.matches('.quantity-input, .description-input, .price-input')) return;
        const fila = campo.closest('tr');
        campo.dataset.tocado = 'si';
        comprobarLinea(fila);
        actualizarImportesLinea(fila);
        actualizarTotalesFactura();
    }

    // Delegación focusout para marcar un campo como tocado.
    function comprobarSalidaCampo(evento) {
        const campo = evento.target;
        if (!campo.matches('.quantity-input, .description-input, .price-input')) return;
        campo.dataset.tocado = 'si';
        comprobarLinea(campo.closest('tr'));
    }

    // Recalcula al cambiar el porcentaje de IVA.
    function comprobarCambioIva(evento) {
        if (!evento.target.matches('.vat-select')) return;
        const fila = evento.target.closest('tr');
        actualizarImportesLinea(fila);
        actualizarTotalesFactura();
    }

    // Delegación click: closest localiza el botón y la fila.
    function comprobarBorrado(evento) {
        const boton = evento.target.closest('button.borrar-linea');
        if (!boton || !cuerpo.contains(boton)) return;
        borrarFila(boton.closest('tr'));
    }

    // --- Referencias a los campos del cliente ---
    const nombre = document.getElementById('nombre');
    const direccion = document.getElementById('direccion');
    const codigoPostal = document.getElementById('codigoPostal');
    const provincia = document.getElementById('provincia');
    const ciudad = document.getElementById('ciudad');
    const documento = document.getElementById('documento');
    const email = document.getElementById('email');
    const captcha = document.getElementById('captcha');
    const captchaAleatorio = document.getElementById('captcha-aleatorio');
    const botonEnviar = contenedorEnviar.querySelector('button');

    // --- Mostrar validación con las clases de Bootstrap ---
    function marcarErrorCliente(campo, correcto, idError, mensaje) {
        campo.classList.toggle('is-invalid', !correcto);
        campo.classList.toggle('is-valid', correcto);
        // En tu HTML, los avisos están fuera del input-group.
        const aviso = document.getElementById(idError);
        if (aviso) {
            aviso.textContent = mensaje;
            aviso.classList.toggle('d-block', !correcto);
        }
        return correcto;
    }

    // --- Comprobar cada campo: estilo del ejercicio del profesor ---
    // Valida nombre y actualiza el estado del campo.
    function comprobarNombre() {
        return marcarErrorCliente(nombre, validarLongitud(nombre.value, 2, 100),
            'errorNombre', 'El nombre debe tener entre 2 y 100 caracteres.');
    }

    // Valida direccion y actualiza el estado del campo.
    function comprobarDireccion() {
        return marcarErrorCliente(direccion, validarLongitud(direccion.value, 2, 100),
            'errorDireccion', 'La dirección debe tener entre 2 y 100 caracteres.');
    }

    // Valida codigo postal y actualiza el estado del campo.
    function comprobarCodigoPostal() {
        const correcto = validarCodigoPostal(codigoPostal.value);
        provincia.value = obtenerProvincia(codigoPostal.value);
        provincia.classList.toggle('is-valid', correcto);
        provincia.classList.remove('is-invalid');
        return marcarErrorCliente(codigoPostal, correcto, 'errorCodigoPostal',
            'Introduce cinco dígitos y un prefijo provincial válido (01-52).');
    }

    // Valida ciudad y actualiza el estado del campo.
    function comprobarCiudad() {
        return marcarErrorCliente(ciudad, validarLongitud(ciudad.value, 2, 100),
            'errorCiudad', 'La ciudad debe tener entre 2 y 100 caracteres.');
    }

    // Valida documento y actualiza el estado del campo.
    function comprobarDocumento() {
        return marcarErrorCliente(documento, validarDocumento(documento.value),
            'errorDocumento', 'Introduce un NIF, NIE o CIF con control correcto.');
    }

    // Valida email y actualiza el estado del campo.
    function comprobarEmail() {
        return marcarErrorCliente(email, validarEmail(email.value),
            'errorEmail', 'Introduce una dirección de correo válida.');
    }

    // Captcha: suma de dos dígitos aleatorios, no fija.
    const primerNumero = Math.floor(Math.random() * 10);
    const segundoNumero = Math.floor(Math.random() * 10);
    captchaAleatorio.textContent = ': ' + primerNumero + ' + ' + segundoNumero;

    // Compara el valor del usuario con el resultado de la operación.
    function comprobarCaptcha() {
        const respuesta = captcha.value.trim();
        const correcto = /^\d{1,2}$/.test(respuesta) &&
            Number(respuesta) === primerNumero + segundoNumero;
        return marcarErrorCliente(captcha, correcto, 'errorCaptcha',
            'Resuelve correctamente la suma del captcha.');
    }

    // --- Recoger todos los errores sin detener las comprobaciones ---
    // Ejecuta todas las comprobaciones y acumula errores.
    function obtenerErrores() {
        const errores = [];
        if (!comprobarNombre()) errores.push('Nombre: debe tener entre 2 y 100 caracteres.');
        if (!comprobarDireccion()) errores.push('Dirección: debe tener entre 2 y 100 caracteres.');
        if (!comprobarCodigoPostal()) errores.push('Código postal: introduce uno válido de España.');
        if (!comprobarCiudad()) errores.push('Ciudad: debe tener entre 2 y 100 caracteres.');
        if (!comprobarDocumento()) errores.push('Documento: el NIF, NIE o CIF es incorrecto.');
        if (!comprobarEmail()) errores.push('Email: introduce un correo válido.');
        if (!comprobarCaptcha()) errores.push('Captcha: la suma es incorrecta.');

        const filas = cuerpo.querySelectorAll('tr');
        if (filas.length === 0) errores.push('La factura debe tener al menos una línea.');
        filas.forEach((fila, indice) => {
            if (!comprobarLinea(fila, true)) {
                errores.push('Línea ' + (indice + 1) + ': revisa cantidad, descripción y precio.');
            }
        });
        return errores;
    }

    // --- Modal Bootstrap creado desde el script ---
    const modal = crearElemento('div', 'modal fade');
    modal.id = 'modalFactura';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');
    const dialogo = crearElemento('div', 'modal-dialog modal-lg modal-dialog-scrollable');
    const contenidoModal = crearElemento('div', 'modal-content');
    const cabeceraModal = crearElemento('div', 'modal-header');
    const tituloModal = crearElemento('h2', 'modal-title fs-5');
    tituloModal.id = 'tituloModalFactura';
    modal.setAttribute('aria-labelledby', tituloModal.id);
    const cerrarX = crearElemento('button', 'btn-close');
    cerrarX.type = 'button';
    cerrarX.setAttribute('data-bs-dismiss', 'modal');
    cerrarX.setAttribute('aria-label', 'Cerrar');
    cabeceraModal.append(tituloModal, cerrarX);
    const cuerpoModal = crearElemento('div', 'modal-body');
    const pieModal = crearElemento('div', 'modal-footer');
    const cerrar = crearElemento('button', 'btn btn-danger', 'Cerrar');
    cerrar.type = 'button';
    cerrar.setAttribute('data-bs-dismiss', 'modal');
    pieModal.appendChild(cerrar);
    contenidoModal.append(cabeceraModal, cuerpoModal, pieModal);
    dialogo.appendChild(contenidoModal);
    modal.appendChild(dialogo);
    document.body.appendChild(modal);

    function anadirDato(contenedor, etiqueta, valor) {
        const parrafo = crearElemento('p', 'mb-1');
        const titulo = crearElemento('strong', '', etiqueta + ': ');
        parrafo.append(titulo, document.createTextNode(valor));
        contenedor.appendChild(parrafo);
    }

    // --- Mostrar errores o el resumen de factura en el modal ---
    // Construye el modal con errores o resumen de factura.
    function mostrarModalFactura() {
        const errores = obtenerErrores();
        cuerpoModal.innerHTML = '';

        if (errores.length > 0) {
            tituloModal.textContent = 'Errores en la factura';
            cuerpoModal.appendChild(crearElemento('p', 'text-danger fw-bold',
                'No se puede generar la factura. Corrige lo siguiente:'));
            const lista = crearElemento('ul', 'mb-0');
            errores.forEach(error => lista.appendChild(crearElemento('li', '', error)));
            cuerpoModal.appendChild(lista);
        } else {
            tituloModal.textContent = 'Factura generada correctamente';
            cuerpoModal.appendChild(crearElemento('h3', 'h5', 'Datos del cliente'));
            anadirDato(cuerpoModal, 'Nombre', nombre.value.trim());
            anadirDato(cuerpoModal, 'Dirección', direccion.value.trim());
            anadirDato(cuerpoModal, 'Código postal', codigoPostal.value.trim());
            anadirDato(cuerpoModal, 'Provincia', provincia.value);
            anadirDato(cuerpoModal, 'Ciudad', ciudad.value.trim());
            anadirDato(cuerpoModal, 'NIF / NIE / CIF', documento.value.trim().toUpperCase());
            anadirDato(cuerpoModal, 'Email', email.value.trim());
            cuerpoModal.appendChild(crearElemento('h3', 'h5 mt-3', 'Líneas de factura'));
            const listaLineas = crearElemento('ol', 'ps-3');
            cuerpo.querySelectorAll('tr').forEach(fila => {
                const importes = calcularImportesLinea(fila);
                const cantidad = fila.querySelector('.quantity-input').value;
                const descripcion = fila.querySelector('.description-input').value.trim();
                const precio = fila.querySelector('.price-input').value;
                const iva = fila.querySelector('.vat-select').value;
                const li = crearElemento('li', 'mb-2');
                li.textContent = descripcion + ' — ' + cantidad + ' × ' +
                    formatearMoneda(aNumero(precio)) + ' — IVA ' + iva + '% — ' +
                    formatearMoneda(importes.total);
                listaLineas.appendChild(li);
            });
            cuerpoModal.appendChild(listaLineas);
            cuerpoModal.appendChild(crearElemento('h3', 'h5 mt-3', 'Totales por IVA'));
            [4, 10, 21].forEach(iva => {
                anadirDato(cuerpoModal, 'IVA ' + iva + '%',
                    'Base ' + salidasTotales[iva].base.textContent +
                    ' · Cuota ' + salidasTotales[iva].cuota.textContent);
            });
            cuerpoModal.appendChild(crearElemento('p', 'fw-bold fs-5 mt-3', totalFactura.textContent));
        }
        bootstrap.Modal.getOrCreateInstance(modal).show();
    }

    // --- Conexión de los eventos, como en el ejercicio del profesor ---
    botonAnadir.addEventListener('click', anadirFila);
    // Se usa el tbody porque las filas nuevas se crean después de iniciar la página.
    cuerpo.addEventListener('input', comprobarCambiosFila);
    cuerpo.addEventListener('focusout', comprobarSalidaCampo);
    cuerpo.addEventListener('change', comprobarCambioIva);
    cuerpo.addEventListener('click', comprobarBorrado);

    // --- Validaciones inline y botón Enviar ---
    nombre.addEventListener('input', comprobarNombre);
    direccion.addEventListener('input', comprobarDireccion);
    codigoPostal.addEventListener('input', comprobarCodigoPostal);
    ciudad.addEventListener('input', comprobarCiudad);
    documento.addEventListener('input', comprobarDocumento);
    email.addEventListener('input', comprobarEmail);
    captcha.addEventListener('input', comprobarCaptcha);
    botonEnviar.addEventListener('click', mostrarModalFactura);

    // La factura empieza con una fila vacía.
    anadirFila();
}
// FIN PRÁCTICA: talleres


/* ----------------------------------------------------------------------------
   Copiar al portapapeles W3Schools · iniciarDemo_clipboard()
   Fuente: index_3.html
   navigator.clipboard.writeText, async/await, selección de texto, try/catch y alternativa Ctrl+C.
   HTML: busca id="demo-clipboard" en index.html.
   CSS: busca data-demo="clipboard" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: clipboard
// HTML: template demo-clipboard. CSS: data-demo="clipboard".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_clipboard() {
    // Copia la dirección de un input usando Clipboard API y try/catch.
    async function copiarDireccion() {
        var texto = document.getElementById('direccion');
        texto.select();
        texto.setSelectionRange(0, 99999);
        try {
            await navigator.clipboard.writeText(texto.value);
            document.getElementById('mensaje').textContent = 'Dirección copiada';
        } catch (error) {
            document.getElementById('mensaje').textContent = 'No se pudo copiar automáticamente. Pulsa Ctrl+C.';
        }
    }
    window.copiarDireccion = copiarDireccion; // puente para el atributo onclick/onkeyup del HTML original
}
// FIN PRÁCTICA: clipboard


/* ----------------------------------------------------------------------------
   Países: autocomplete y filtros W3Schools · iniciarDemo_paises()
   Fuente: index_4.html
   Autocompletar con flechas/Enter/Escape, CapsLock, filtro de tabla y de lista, indexOf, startsWith.
   HTML: busca id="demo-paises" en index.html.
   CSS: busca data-demo="paises" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: paises
// HTML: template demo-paises. CSS: data-demo="paises".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_paises() {
    var paises = ['Alemania', 'Argentina', 'Australia', 'Brasil', 'Canadá', 'Chile', 'China', 'Colombia', 'España', 'Estados Unidos', 'Francia', 'Italia', 'Japón', 'México', 'Portugal', 'Reino Unido'];
    var input = document.getElementById('pais');
    var sugerencias = document.getElementById('sugerencias');
    var actual = -1;

    // Autocomplete (W3Schools), adaptado al array de países
    input.addEventListener('input', function () {
        sugerencias.innerHTML = '';
        actual = -1;
        var valor = this.value;
        sugerencias.hidden = true;
        if (!valor) return;
        for (var i = 0; i < paises.length; i++) {
            if (paises[i].toUpperCase().startsWith(valor.toUpperCase())) {
                var opcion = document.createElement('div');
                opcion.textContent = paises[i];
                opcion.onclick = function () {
                    input.value = this.textContent;
                    sugerencias.hidden = true;
                };
                sugerencias.appendChild(opcion);
            }
        }
        sugerencias.hidden = sugerencias.children.length === 0;
    });

    input.addEventListener('keydown', function (event) {
        var opciones = sugerencias.children;
        if (sugerencias.hidden || !opciones.length) return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (event.key === 'ArrowDown') actual = (actual + 1) % opciones.length;
            else actual = actual <= 0 ? opciones.length - 1 : actual - 1;
            for (var i = 0; i < opciones.length; i++) opciones[i].classList.remove('autocomplete-active');
            opciones[actual].classList.add('autocomplete-active');
        } else if (event.key === 'Enter' && actual >= 0) {
            opciones[actual].click();
        } else if (event.key === 'Escape') sugerencias.hidden = true;
    });
    document.addEventListener('click', function (event) {
        if (event.target !== input && !sugerencias.contains(event.target)) sugerencias.hidden = true;
    });

    // Detect Caps Lock (W3Schools)
    // Comprueba getModifierState(CapsLock) del evento de teclado.
    function detectarMayus(event) {
        document.getElementById('caps').style.display = event.getModifierState('CapsLock') ? 'block' : 'none';
    }
    input.addEventListener('keydown', detectarMayus);
    input.addEventListener('keyup', detectarMayus);
    input.onblur = function () {
        document.getElementById('caps').style.display = 'none';
    };

    // Cargar los países en la tabla y la lista
    for (var i = 0; i < paises.length; i++) {
        var fila = document.getElementById('cuerpoTabla').insertRow();
        fila.insertCell().textContent = paises[i];
        var li = document.createElement('li');
        li.textContent = paises[i];
        document.getElementById('lista').appendChild(li);
    }

    // Filter Table (W3Schools)
    // Oculta filas cuyo texto no contiene el filtro.
    function filtrarTabla() {
        var filtro = document.getElementById('filtroTabla').value.toUpperCase();
        var filas = document.getElementById('cuerpoTabla').getElementsByTagName('tr');
        for (var i = 0; i < filas.length; i++) {
            var texto = filas[i].cells[0].textContent;
            filas[i].style.display = texto.toUpperCase().indexOf(filtro) > -1 ? '' : 'none';
        }
    }

    // Filter List (W3Schools)
    // Oculta elementos li que no coinciden con el texto buscado.
    function filtrarLista() {
        var filtro = document.getElementById('filtroLista').value.toUpperCase();
        var elementos = document.getElementById('lista').getElementsByTagName('li');
        for (var i = 0; i < elementos.length; i++) {
            elementos[i].style.display = elementos[i].textContent.toUpperCase().indexOf(filtro) > -1 ? '' : 'none';
        }
    }
    window.filtrarTabla = filtrarTabla; // puente para el atributo onclick/onkeyup del HTML original
    window.filtrarLista = filtrarLista; // puente para el atributo onclick/onkeyup del HTML original
}
// FIN PRÁCTICA: paises


/* ----------------------------------------------------------------------------
   Google Charts: líneas, columnas, área y GeoChart · iniciarDemo_google_charts()
   Fuente: index_5.html
   Gráficas de temperatura, arrayToDataTable, select, mapas de marcadores, callback. Necesita conexión.
   Se conservan los datos del ejercicio; si no carga Google, aparecen los valores de ejemplo y un aviso.
   HTML: busca id="demo-google_charts" en index.html.
   CSS: busca data-demo="google_charts" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: google_charts
// HTML: template demo-google_charts. CSS: data-demo="google_charts".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
async function iniciarDemo_google_charts() {
    porId('error').textContent = 'Cargando Google Charts…';
    try {
        if (!window.google) await cargarScript('https://www.gstatic.com/charts/loader.js', 8000);
        porId('error').textContent = '';
    } catch (error) {
        porId('error').textContent = 'Sin conexión a Google Charts. Consulta los datos y el código.';
        return;
    }

    // Google Charts (W3Schools) y galería de Google Charts
    if (typeof google === 'undefined') {
        document.getElementById('error').textContent = 'No se pudo cargar Google Charts. Comprueba la conexión.';
    } else {
        google.charts.load('current', { packages: ['corechart', 'geochart'] });
        google.charts.setOnLoadCallback(dibujar);
    }
    // Convierte arrays en DataTable y dibuja los gráficos.
    function dibujar() {
        var datos = google.visualization.arrayToDataTable([
            ['Hora', 'Temperatura'],
            ['08:00', 10], ['10:00', 15], ['12:00', 20], ['14:00', 25], ['16:00', 23], ['18:00', 18]
        ]);
        new google.visualization.LineChart(document.getElementById('lineas')).draw(datos, { title: 'Gráfico de líneas', vAxis: { title: 'Temperatura (°C)' } });
        new google.visualization.ColumnChart(document.getElementById('barras')).draw(datos, { title: 'Gráfico de barras', vAxis: { title: 'Temperatura (°C)' } });
        new google.visualization.AreaChart(document.getElementById('area')).draw(datos, { title: 'Gráfico de área', vAxis: { title: 'Temperatura (°C)' } });
        // GeoChart en modo marcadores con coordenadas, sin clave de Maps.
        var ciudades = google.visualization.arrayToDataTable([
            ['Latitud', 'Longitud', 'Temperatura (°C)'],
            [40.4168, -3.7038, 12],
            [41.3874, 2.1686, 18],
            [37.3891, -5.9845, 25],
            [43.2630, -2.9350, 9],
            [39.4699, -0.3763, 20]
        ]);
        var nombres = ['Madrid', 'Barcelona', 'Sevilla', 'Bilbao', 'Valencia'];
        var mapa = new google.visualization.GeoChart(document.getElementById('mapa'));
        google.visualization.events.addListener(mapa, 'select', function () {
            var seleccion = mapa.getSelection();
            if (seleccion.length > 0) {
                var fila = seleccion[0].row;
                document.getElementById('valorMapa').textContent = nombres[fila] + ': ' + ciudades.getValue(fila, 2) + ' °C';
            }
        });
        mapa.draw(ciudades, { region: 'ES', displayMode: 'markers', colorAxis: { colors: ['blue', 'red'] } });
    }
}
// FIN PRÁCTICA: google_charts


/* REFERENCIA ORIGINAL · Leaflet: GeoJSON y temperaturas (no ejecutar; ver versión anterior adaptada)

    let mapa, capaProvincias, capaMarcadores, geojson, original = [], datos = [], modo = 'ambos';
    const porCodigo = {};   // code → dato de temperatura
    const marcadores = {};  // code → marcador

    const TRAMOS = [
        { hasta: 10, color: '#3498db', clase: 'azul' },
        { hasta: 20, color: '#2ecc71', clase: 'verde' },
        { hasta: 25, color: '#f1c40f', clase: 'amarillo' },
        { hasta: 30, color: '#e67e22', clase: 'naranja' },
        { hasta: Infinity, color: '#e74c3c', clase: 'rojo' }
    ];
    
    function crearMapa() {
      // Sin capa de teselas: el fondo lo pone el GeoJSON de provincias
      mapa = L.map('mapa', { zoomSnap: 0.25, attributionControl: true });
      mapa.attributionControl.setPrefix('Leaflet');
      mapa.attributionControl.addAttribution('Límites: IGN vía es-atlas');
      mapa.fitBounds([[35.6, -9.6], [43.9, 4.4]]);
    }
    async function cargarJSON(url) {
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error('No se pudo cargar ' + url + ' (' + respuesta.status + ')');
      return await respuesta.json();
    }

    async function iniciar() {
        crearMapa();

        try {
            [geojson, original] = await Promise.all([
                cargarJSON('data/provincias.geojson'),
                cargarJSON('data/temperaturas.json')
            ]);

            datos = original.map(d => ({ ...d }));

            datos.forEach(d => porCodigo[d.code] = d);

            pintarProvincias();

            // pintarMarcadores();
            // actualizarResumen();

        } catch (error) {
            document.getElementById('datos').textContent =
                'Error: ' + error.message;
        }
    }


    function tramoDe(temperatura) {
      return TRAMOS.find(t => temperatura <= t.hasta);
    }

    function estiloProvincia(feature) {
      const dato = porCodigo[feature.properties.code];
      const colorear = modo !== 'marcadores' && dato;
      return {
        fillColor: colorear ? tramoDe(dato.temperatura).color : '#1f2d63',
        fillOpacity: colorear ? 0.85 : 1,
        color: '#0b1433',   // borde
        weight: 1
      };
    }

    function pintarProvincias() {
      capaProvincias = L.geoJSON(geojson, {
        style: estiloProvincia,
        onEachFeature: (feature, capa) => {
          capa.bindTooltip(() => {
            const dato = porCodigo[feature.properties.code];
            return feature.properties.nombre + (dato ? ' · ' + dato.temperatura + ' °C' : '');
          }, { sticky: true });
          capa.on('mouseover', () => capa.setStyle({ weight: 3, color: '#eef1fb' }));
          capa.on('mouseout', () => capaProvincias.resetStyle(capa));
          capa.on('click', () => irA(feature.properties.code));
        }
      }).addTo(mapa);
    }
    
    fs.writeFileSync('data/provincias.geojson', JSON.stringify(geo));

    iniciar();

  
*/

/* ----------------------------------------------------------------------------
   Maqueta de página completa · iniciarDemo_blog()
   Fuente: Maqueta de página completa.html
   CSS Grid, header, nav, main, aside, footer, áreas y adaptación responsive.
   HTML: busca id="demo-blog" en index.html.
   CSS: busca data-demo="blog" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: blog
// HTML: template demo-blog. CSS: data-demo="blog".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_blog() {
    // Práctica de diseño estática: basta HTML + CSS (y Bootstrap integrado si procede).
}
// FIN PRÁCTICA: blog


/* ----------------------------------------------------------------------------
   Menú responsive W3Schools · iniciarDemo_menu()
   Fuente: MenuReponsive
   topnav, media queries, hamburguesa, className responsive, enlaces y Font Awesome.
   HTML: busca id="demo-menu" en index.html.
   CSS: busca data-demo="menu" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: menu
// HTML: template demo-menu. CSS: data-demo="menu".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_menu() {
    cargarCSS("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"); // iconos externos opcionales
    // Alterna la clase responsive de la barra de navegación.
    function myFunction() {
        var x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }
    window.myFunction = myFunction; // puente para el atributo onclick/onkeyup del HTML original
}
// FIN PRÁCTICA: menu


/* ----------------------------------------------------------------------------
   Panadería Sol: menú accesible · iniciarDemo_panaderia_sol()
   Fuente: Panadería Sol.html
   Media queries 640px, menú hamburguesa, flex, aria-expanded, clase abierto y texto sr.
   HTML: busca id="demo-panaderia_sol" en index.html.
   CSS: busca data-demo="panaderia_sol" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: panaderia_sol
// HTML: template demo-panaderia_sol. CSS: data-demo="panaderia_sol".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_panaderia_sol() {
    const boton = document.querySelector('.menu-boton');
    const menu = document.getElementById('menu');

    boton.addEventListener('click', () => {
        const abierto = menu.classList.toggle('abierto');
        boton.setAttribute('aria-expanded', abierto);
        boton.querySelector('.sr').textContent = abierto ? 'Cerrar menú' : 'Abrir menú';
    });
}
// FIN PRÁCTICA: panaderia_sol


/* ----------------------------------------------------------------------------
   Rutas de senderismo: grid de cards · iniciarDemo_senderismo()
   Fuente: Rutas de senderismo.html
   Grid auto-fit/minmax, tarjetas, distribución flexible, clamp y responsive.
   HTML: busca id="demo-senderismo" en index.html.
   CSS: busca data-demo="senderismo" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: senderismo
// HTML: template demo-senderismo. CSS: data-demo="senderismo".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_senderismo() {
    // Práctica de diseño estática: basta HTML + CSS (y Bootstrap integrado si procede).
}
// FIN PRÁCTICA: senderismo


/* ----------------------------------------------------------------------------
   Tabla responsive que se vuelve fichas · iniciarDemo_tabla_fichas()
   Fuente: Tabla que se vuelve fichas.html
   Tabla semántica, media queries, data-label, pseudoelementos ::before, estado y formato móvil.
   HTML: busca id="demo-tabla_fichas" en index.html.
   CSS: busca data-demo="tabla_fichas" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: tabla_fichas
// HTML: template demo-tabla_fichas. CSS: data-demo="tabla_fichas".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_tabla_fichas() {
    // Práctica de diseño estática: basta HTML + CSS (y Bootstrap integrado si procede).
}
// FIN PRÁCTICA: tabla_fichas


/* ----------------------------------------------------------------------------
   Tarjetas y container queries · iniciarDemo_container_query()
   Fuente: Tarjeta con container query.html
   container-type:inline-size, @container, cambio de tarjeta según ancho del padre (no de la ventana).
   HTML: busca id="demo-container_query" en index.html.
   CSS: busca data-demo="container_query" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: container_query
// HTML: template demo-container_query. CSS: data-demo="container_query".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_container_query() {
    // Práctica de diseño estática: basta HTML + CSS (y Bootstrap integrado si procede).
}
// FIN PRÁCTICA: container_query


/* ----------------------------------------------------------------------------
   Siempre Activos: sitio completo sin Bootstrap · iniciarDemo_mayores_css()
   Fuente: index.html
   Header, menú responsive, carrusel JS, grids, tablas desplazables, secciones, formulario, CSS y reset.
   HTML: busca id="demo-mayores_css" en index.html.
   CSS: busca data-demo="mayores_css" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: mayores_css
// HTML: template demo-mayores_css. CSS: data-demo="mayores_css".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_mayores_css() {
    const botonMenu = document.getElementById("botonMenu");
    const menu = document.getElementById("menu");

    botonMenu.addEventListener("click", function () {
        const abierto = menu.classList.toggle("abierto");
        botonMenu.setAttribute("aria-expanded", abierto);
        botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
        botonMenu.textContent = abierto ? "✕" : "☰";
    });

    document.querySelectorAll(".menu a").forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            menu.classList.remove("abierto");
            botonMenu.setAttribute("aria-expanded", "false");
            botonMenu.setAttribute("aria-label", "Abrir menú");
            botonMenu.textContent = "☰";
        });
    });

    const fotos = document.querySelectorAll(".diapositiva");
    const puntos = document.querySelectorAll(".punto");
    let posicion = 0;

    // Índice circular del carrusel; actualiza slides, puntos y aria-current.
    function mostrarFoto(numero) {
        posicion = (numero + fotos.length) % fotos.length;
        fotos.forEach(function (foto, i) {
            foto.classList.toggle("activa", i === posicion);
            foto.setAttribute("aria-hidden", i !== posicion);
        });
        puntos.forEach(function (punto, i) {
            punto.classList.toggle("activo", i === posicion);
            if (i === posicion) punto.setAttribute("aria-current", "true");
            else punto.removeAttribute("aria-current");
        });
    }

    document.getElementById("anterior").addEventListener("click", function () {
        mostrarFoto(posicion - 1);
    });
    document.getElementById("siguiente").addEventListener("click", function () {
        mostrarFoto(posicion + 1);
    });
    puntos.forEach(function (punto) {
        punto.addEventListener("click", function () {
            mostrarFoto(Number(punto.dataset.foto));
        });
    });
    mostrarFoto(0);


    const formDemo = porId('formulario');
    if (formDemo) formDemo.addEventListener('submit', e => {
        e.preventDefault();
        alert('Inscripción de ejemplo. No se han enviado datos a un servidor.');
    });
}
// FIN PRÁCTICA: mayores_css


/* ----------------------------------------------------------------------------
   Ayuda a la infancia: maquetación · iniciarDemo_infancia()
   Fuente: AyudaInfancia.html
   Página informativa, cajas, encabezados, banners, imágenes, bloques, columnas, responsive.
   HTML: busca id="demo-infancia" en index.html.
   CSS: busca data-demo="infancia" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: infancia
// HTML: template demo-infancia. CSS: data-demo="infancia".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_infancia() {
    // Práctica de diseño estática: basta HTML + CSS (y Bootstrap integrado si procede).
}
// FIN PRÁCTICA: infancia


/* ----------------------------------------------------------------------------
   Base Bootstrap responsive · iniciarDemo_base_bootstrap()
   Fuente: BaseBoostrap.html
   Container-fluid, row, col-12 col-md-8/4/6, anidar columnas, navbar collapse, spacing, utilidades y formulario.
   HTML: busca id="demo-base_bootstrap" en index.html.
   CSS: busca data-demo="base_bootstrap" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: base_bootstrap
// HTML: template demo-base_bootstrap. CSS: data-demo="base_bootstrap".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_base_bootstrap() {
    // Práctica de diseño estática: basta HTML + CSS (y Bootstrap integrado si procede).
}
// FIN PRÁCTICA: base_bootstrap


/* ----------------------------------------------------------------------------
   Guía de fotocopias: columnas responsive · iniciarDemo_fotocopias()
   Fuente: index_11.html
   Grid de 4 bloques, col-12 col-md-6 col-lg-3, img-fluid, align-items-center, cabecera y tarjetas.
   HTML: busca id="demo-fotocopias" en index.html.
   CSS: busca data-demo="fotocopias" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: fotocopias
// HTML: template demo-fotocopias. CSS: data-demo="fotocopias".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_fotocopias() {
    // Práctica de diseño estática: basta HTML + CSS (y Bootstrap integrado si procede).
}
// FIN PRÁCTICA: fotocopias


/* ----------------------------------------------------------------------------
   Hello Kitty / My Melody: Bootstrap · iniciarDemo_sanrio()
   Fuente: index_12.html
   Accordion, toast, columnas ocultas d-none d-md-block, grid anidada, panel lateral, utilidades y CSS propio.
   HTML: busca id="demo-sanrio" en index.html.
   CSS: busca data-demo="sanrio" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: sanrio
// HTML: template demo-sanrio. CSS: data-demo="sanrio".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_sanrio() {
    // Práctica de diseño estática: basta HTML + CSS (y Bootstrap integrado si procede).
}
// FIN PRÁCTICA: sanrio


/* ----------------------------------------------------------------------------
   Apuntes Bootstrap 5.3 del profesor (completos) · iniciarDemo_apuntes_bootstrap()
   Fuente: apuntes-bootstrap.html
   14 capítulos: instalación, breakpoints, grid, responsive, utilidades, tipografía, tablas, todos los componentes, personalización/Sass, formularios, validaciones, recursos y chuleta.
   HTML: busca id="demo-apuntes_bootstrap" en index.html.
   CSS: busca data-demo="apuntes_bootstrap" en styles.css.
   ------------------------------------------------------------------------- */
// INICIO PRÁCTICA: apuntes_bootstrap
// HTML: template demo-apuntes_bootstrap. CSS: data-demo="apuntes_bootstrap".
// Para adaptar: modifica los IDs del HTML y las referencias DOM conjuntamente.
function iniciarDemo_apuntes_bootstrap() {
    cargarCSS("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"); // iconos externos opcionales
    cargarCSS("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"); // iconos externos opcionales
    // Al confirmar: cerramos el modal y mostramos el toast desde JavaScript
    document.getElementById('btnConfirmarBorrado').addEventListener('click', () => {
        bootstrap.Modal.getInstance('#modalBorrar').hide();
        bootstrap.Toast.getOrCreateInstance('#toastBorrado').show();
    });

    // Tooltips y popovers NO se activan solos (por rendimiento): hay que inicializarlos
    cuandoDOMListo(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
        document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));
    });



    document.getElementById('f18ver').addEventListener('click', function () {
        const input = document.getElementById('f18pass');
        const visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        this.innerHTML = visible ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });



    document.querySelectorAll('.needs-validation').forEach(form => {
        form.addEventListener('submit', event => {
            // checkValidity() comprueba TODAS las reglas HTML5 del formulario
            if (!form.checkValidity()) {
                event.preventDefault();      // no enviar
                event.stopPropagation();
            } else {
                event.preventDefault();      // (solo en esta demo, para no recargar la página)
                document.getElementById('v1ok').classList.remove('d-none');
            }
            form.classList.add('was-validated');   // ← activa los estilos verde/rojo
        });
        // Al limpiar, quitamos también los estilos de validación
        form.addEventListener('reset', () => {
            form.classList.remove('was-validated');
            document.getElementById('v1ok').classList.add('d-none');
        });
    });



    /* =====================================================================
       1) FUNCIONES DE VALIDACIÓN "EXTERNAS" (puras, reutilizables, sin DOM)
       ===================================================================== */

    // DNI (8 cifras + letra) o NIE (X/Y/Z + 7 cifras + letra). Letra = número mod 23
    // Verifica DNI/NIE con letra de control (variante de apuntes).
    function validarDNI(valor) {
        const v = valor.toUpperCase().replace(/[\s-]/g, '');
        if (!/^(\d{8}|[XYZ]\d{7})[A-Z]$/.test(v)) return false;
        const numero = v.slice(0, -1).replace('X', '0').replace('Y', '1').replace('Z', '2');
        const letra = 'TRWAGMYFPDXBNJZSQVHLCKE'[parseInt(numero, 10) % 23];
        return letra === v.slice(-1);
    }

    // Edad en años cumplidos a partir de una fecha 'AAAA-MM-DD'
    // Calcula edad cumplida según fecha ISO.
    function calcularEdad(fechaISO) {
        const nac = new Date(fechaISO + 'T00:00:00');
        const hoy = new Date();
        let edad = hoy.getFullYear() - nac.getFullYear();
        const m = hoy.getMonth() - nac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
        return edad;
    }

    // Las 2 primeras cifras del CP son el código de provincia (01-52)
    const PROVINCIAS = ['Álava', 'Albacete', 'Alicante', 'Almería', 'Ávila', 'Badajoz', 'Illes Balears', 'Barcelona',
        'Burgos', 'Cáceres', 'Cádiz', 'Castellón', 'Ciudad Real', 'Córdoba', 'A Coruña', 'Cuenca', 'Girona', 'Granada',
        'Guadalajara', 'Gipuzkoa', 'Huelva', 'Huesca', 'Jaén', 'León', 'Lleida', 'La Rioja', 'Lugo', 'Madrid', 'Málaga',
        'Murcia', 'Navarra', 'Ourense', 'Asturias', 'Palencia', 'Las Palmas', 'Pontevedra', 'Salamanca',
        'Santa Cruz de Tenerife', 'Cantabria', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo',
        'Valencia', 'Valladolid', 'Bizkaia', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla'];
    // Busca la provincia a partir de las dos cifras iniciales.
    function provinciaDeCP(cp) {
        const n = parseInt(cp.slice(0, 2), 10);
        return (n >= 1 && n <= 52) ? PROVINCIAS[n - 1] : null;
    }

    // IBAN: se mueven 4 caracteres al final, letras → números (A=10...) y el resto mod 97 debe ser 1
    // Calcula módulo 97 sin convertir a un número gigante.
    function validarIBAN(valor) {
        const s = valor.replace(/\s+/g, '').toUpperCase();
        if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
        if (s.startsWith('ES') && s.length !== 24) return false;
        const reordenado = s.slice(4) + s.slice(0, 4);
        const numerico = reordenado.replace(/[A-Z]/g, c => (c.charCodeAt(0) - 55).toString());
        let resto = 0;
        for (const cifra of numerico) resto = (resto * 10 + Number(cifra)) % 97;  // evita números gigantes
        return resto === 1;
    }

    // Fortaleza de la contraseña: qué reglas cumple y una puntuación de 0 a 5
    // Devuelve reglas cumplidas y puntuación de fortaleza.
    function analizarPassword(pw) {
        const reglas = {
            longitud: pw.length >= 8,
            mayuscula: /[A-ZÁÉÍÓÚÑ]/.test(pw),
            minuscula: /[a-záéíóúñ]/.test(pw),
            numero: /\d/.test(pw),
            simbolo: /[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/.test(pw)
        };
        const puntos = Object.values(reglas).filter(Boolean).length + (pw.length >= 12 ? 1 : 0);
        return { reglas, puntos: Math.min(puntos, 5) };
    }

    // Simula una petición al servidor (en la vida real: fetch('/api/usuarios/existe?u=...'))
    // Simula respuesta asíncrona; no consulta un servidor real.
    function comprobarUsuarioServidor(usuario) {
        const ocupados = ['admin', 'root', 'usuario', 'test', 'profesor'];
        return new Promise(resolve => setTimeout(() => resolve(!ocupados.includes(usuario)), 900));
    }

    /* =====================================================================
       2) INTEGRACIÓN CON BOOTSTRAP
       ===================================================================== */
    const form = document.getElementById('formRegistro');
    const $ = id => document.getElementById(id);

    // Pinta el estado de un campo: setCustomValidity + clases + mensajes
    function marcar(campo, error, mensajeOk = '') {
        campo.setCustomValidity(error);
        campo.classList.toggle('is-invalid', !!error);
        campo.classList.toggle('is-valid', !error);
        if ($(campo.id + '-error')) $(campo.id + '-error').textContent = error;
        if ($(campo.id + '-ok')) $(campo.id + '-ok').textContent = mensajeOk;
    }

    // Traduce los errores nativos de HTML5 a mensajes claros en español
    function errorNativo(c) {
        const v = c.validity;
        if (v.valueMissing) return 'Este campo es obligatorio';
        if (v.typeMismatch) return c.type === 'email' ? 'Escribe un email válido (nombre@dominio.es)' : 'Formato no válido';
        if (v.tooShort) return `Mínimo ${c.minLength} caracteres (llevas ${c.value.length})`;
        if (v.patternMismatch) return c.dataset.patron || 'Hay caracteres no permitidos';
        return '';
    }

    // Reglas de cada campo: devuelven el mensaje de error ('' si es correcto)
    const reglas = {
        nombre: c => errorNativo(c),
        apellidos: c => errorNativo(c),
        dni: c => errorNativo(c) || (validarDNI(c.value) ? '' :
            (/^(\d{8}|[XYZ]\d{7})[A-Z]$/.test(c.value) ? 'La letra no corresponde al número' : 'Formato: 8 cifras + letra, o X/Y/Z + 7 cifras + letra')),
        fnac: c => {
            const e = errorNativo(c);
            if (e) return e;
            const edad = calcularEdad(c.value);
            if (edad < 0) return 'La fecha no puede ser futura';
            if (edad < 18) return `Debes ser mayor de edad (tendrías ${edad} años)`;
            if (edad > 110) return 'Revisa el año de nacimiento';
            return '';
        },
        email: c => errorNativo(c),
        telefono: c => errorNativo(c),
        cp: c => errorNativo(c) || (provinciaDeCP(c.value) ? '' : 'No existe ninguna provincia con ese código'),
        password: c => {
            if (c.validity.valueMissing) return 'Este campo es obligatorio';
            const { reglas } = analizarPassword(c.value);
            return (reglas.longitud && reglas.mayuscula && reglas.minuscula && reglas.numero)
                ? '' : 'No cumple los requisitos indicados abajo';
        },
        password2: c => errorNativo(c) || (c.value === $('password').value ? '' : 'Las contraseñas no coinciden'),
        iban: c => errorNativo(c) || (validarIBAN(c.value) ? '' : 'IBAN incorrecto: revisa los dígitos de control'),
        terminos: c => c.checked ? '' : 'Debes aceptar las condiciones'
    };

    // Mensajes de acierto con información útil
    const mensajesOk = {
        dni: c => /^[XYZ]/.test(c.value) ? 'NIE correcto' : 'DNI correcto',
        fnac: c => `Edad: ${calcularEdad(c.value)} años`,
        cp: c => `Provincia: ${provinciaDeCP(c.value)}`,
        iban: () => 'IBAN válido'
    };

    // Limpia el error anterior, aplica reglas y actualiza feedback.
    function validarCampo(c) {
        c.setCustomValidity('');                        // limpiar error propio antes de evaluar
        if (c.id === 'telefono' && c.value === '') {    // opcional y vacío: neutro
            c.classList.remove('is-valid', 'is-invalid');
            return;
        }
        const error = reglas[c.id](c);
        marcar(c, error, !error && mensajesOk[c.id] ? mensajesOk[c.id](c) : '');
    }

    // Grupos (checkbox con mínimo/máximo y radios): se marcan todos sus elementos
    // Valida un conjunto de radios/checkbox y pinta el grupo.
    function validarGrupo(nombre, comprobar) {
        const opciones = [...form.querySelectorAll(`[name="${nombre}"]`)];
        opciones.forEach(o => o.setCustomValidity(''));
        const error = comprobar(opciones);
        opciones.forEach(o => {
            o.classList.toggle('is-invalid', !!error);
            o.classList.toggle('is-valid', !error);
        });
        opciones[0].setCustomValidity(error);
        const fb = $(opciones[0].id + '-error');
        fb.textContent = error;
        fb.classList.toggle('d-block', !!error);       // el feedback no es hermano del input: lo mostramos a mano
    }
    const validarIntereses = () => validarGrupo('intereses', ops => {
        const n = ops.filter(o => o.checked).length;
        return n === 0 ? 'Elige al menos un interés' : n > 3 ? `Máximo 3 intereses (has marcado ${n})` : '';
    });
    const validarPlan = () => validarGrupo('plan', ops => ops.some(o => o.checked) ? '' : 'Elige un plan');

    /* ---------- Usuario: validación asíncrona con debounce ---------- */
    let temporizador, peticionActual = 0;
    function estadoUsuario(estado) {
        const iconos = {
            neutro: '<i class="bi bi-person"></i>',
            cargando: '<span class="spinner-border spinner-border-sm text-primary" role="status"></span>',
            ok: '<i class="bi bi-check-circle-fill text-success"></i>',
            error: '<i class="bi bi-x-circle-fill text-danger"></i>'
        };
        $('usuario-estado').innerHTML = iconos[estado];
    }
    // Valida nombre de usuario con simulación de consulta asíncrona.
    async function validarUsuario() {
        const c = $('usuario');
        c.setCustomValidity('');
        const e = errorNativo(c);
        if (e) {
            marcar(c, e);
            estadoUsuario('error');
            return;
        }
        const id = ++peticionActual;
        c.classList.remove('is-valid', 'is-invalid');
        c.setCustomValidity('Comprobando…');           // mientras tanto no se puede enviar
        estadoUsuario('cargando');
        const libre = await comprobarUsuarioServidor(c.value);
        if (id !== peticionActual) return;             // llegó una respuesta antigua: se ignora
        marcar(c, libre ? '' : `"${c.value}" ya está en uso. Prueba con "${c.value}_${new Date().getFullYear()}"`,
            libre ? '¡Nombre de usuario disponible!' : '');
        estadoUsuario(libre ? 'ok' : 'error');
    }

    /* ---------- Contraseña: medidor y lista de requisitos ---------- */
    // Actualiza indicadores de requisitos de contraseña.
    function actualizarFuerza() {
        const { reglas: r, puntos } = analizarPassword($('password').value);
        document.querySelectorAll('#reglasPassword li').forEach(li => {
            const ok = r[li.dataset.regla];
            const opcional = li.dataset.regla === 'simbolo';
            li.querySelector('i').className = ok ? 'bi bi-check-circle-fill text-success'
                : opcional ? 'bi bi-dash-circle text-body-secondary' : 'bi bi-x-circle-fill text-danger';
        });
        const niveles = [['—', ''], ['Muy débil', 'bg-danger'], ['Débil', 'bg-danger'], ['Media', 'bg-warning'], ['Fuerte', 'bg-info'], ['Muy fuerte', 'bg-success']];
        const [texto, color] = niveles[$('password').value ? puntos : 0];
        $('fuerzaBarra').className = 'progress-bar ' + color;
        $('fuerzaBarra').style.width = ($('password').value ? puntos * 20 : 0) + '%';
        $('fuerzaTexto').textContent = 'Fortaleza: ' + texto;
    }

    /* =====================================================================
       3) EVENTOS: cuándo se valida
       ===================================================================== */
    Object.keys(reglas).forEach(id => {
        const c = $(id);
        // Primera validación al salir del campo; después, en cada cambio
        c.addEventListener('blur', () => {
            c.dataset.tocado = '1';
            validarCampo(c);
        });
        c.addEventListener(c.type === 'checkbox' || c.type === 'date' ? 'change' : 'input', () => {
            if (c.id === 'dni') c.value = c.value.toUpperCase();
            if (c.id === 'password') {
                actualizarFuerza();
                if ($('password2').dataset.tocado) validarCampo($('password2'));  // validación cruzada
            }
            if (c.dataset.tocado || c.type === 'checkbox') validarCampo(c);
        });
    });
    // IBAN: formato en bloques de 4 al salir del campo
    $('iban').addEventListener('blur', e => {
        e.target.value = e.target.value.replace(/\s+/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim();
        validarCampo(e.target);
    });
    $('usuario').addEventListener('input', () => {
        clearTimeout(temporizador);
        temporizador = setTimeout(validarUsuario, 500);   // debounce: espera a que deje de escribir
    });
    form.querySelectorAll('[name="intereses"]').forEach(o => o.addEventListener('change', validarIntereses));
    form.querySelectorAll('[name="plan"]').forEach(o => o.addEventListener('change', validarPlan));
    $('verPassword').addEventListener('click', function () {
        const p = $('password'), visible = p.type === 'text';
        p.type = visible ? 'password' : 'text';
        this.innerHTML = visible ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
    });

    /* ---------- Envío ---------- */
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = $('btnRegistro'), textoBtn = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Validando…';

        Object.keys(reglas).forEach(id => {
            $(id).dataset.tocado = '1';
            validarCampo($(id));
        });
        validarIntereses();
        validarPlan();
        clearTimeout(temporizador);
        await validarUsuario();                          // esperamos al "servidor"

        btn.disabled = false;
        btn.innerHTML = textoBtn;

        // Campos inválidos (un solo elemento por grupo de radios/checks)
        const vistos = new Set();
        const invalidos = [...form.querySelectorAll('input:invalid, select:invalid, textarea:invalid')]
            .filter(c => !vistos.has(c.name) && vistos.add(c.name));

        const resumen = $('resumenErrores');
        if (invalidos.length) {
            $('resumenTitulo').textContent = invalidos.length === 1 ? 'Hay 1 error en el formulario' : `Hay ${invalidos.length} errores en el formulario`;
            $('listaErrores').innerHTML = '';
            invalidos.forEach(c => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#${c.id}" class="alert-link"></a>: <span></span>`;
                li.querySelector('a').textContent = c.dataset.nombre || c.name;
                li.querySelector('span').textContent = c.validationMessage;
                li.querySelector('a').addEventListener('click', ev => {
                    ev.preventDefault();
                    c.focus();
                });
                $('listaErrores').appendChild(li);
            });
            invalidos.forEach(c => {
                c.classList.remove('sacudir');
                void c.offsetWidth;
                c.classList.add('sacudir');
            });  // animación de aviso
            resumen.classList.remove('d-none');
            resumen.scrollIntoView({ behavior: 'smooth', block: 'center' });
            resumen.focus({ preventScroll: true });        // los lectores de pantalla lo anuncian
            return;
        }

        // Todo correcto: mostramos los datos (aquí se haría el fetch al servidor)
        resumen.classList.add('d-none');
        const datos = new FormData(form);
        const filas = [['Nombre', datos.get('nombre') + ' ' + datos.get('apellidos')], ['DNI/NIE', datos.get('dni')],
        ['Email', datos.get('email')], ['Provincia', provinciaDeCP(datos.get('cp'))], ['Usuario', datos.get('usuario')],
        ['IBAN', datos.get('iban')], ['Intereses', datos.getAll('intereses').join(', ')], ['Plan', datos.get('plan')],
        ['Boletín', datos.get('boletin') ? 'Sí' : 'No']];
        $('tablaResumen').innerHTML = '';
        filas.forEach(([k, v]) => {
            const tr = $('tablaResumen').insertRow();
            tr.insertCell().textContent = k;
            tr.cells[0].className = 'fw-semibold';
            tr.insertCell().textContent = v;
        });
        bootstrap.Modal.getOrCreateInstance('#modalRegistro').show();
    });

    /* ---------- Limpiar ---------- */
    form.addEventListener('reset', () => {
        setTimeout(() => {   // esperamos a que el navegador vacíe los campos
            form.querySelectorAll('.is-valid, .is-invalid').forEach(c => c.classList.remove('is-valid', 'is-invalid'));
            form.querySelectorAll('input').forEach(c => {
                c.setCustomValidity('');
                delete c.dataset.tocado;
            });
            form.querySelectorAll('.invalid-feedback.d-block').forEach(f => f.classList.remove('d-block'));
            $('resumenErrores').classList.add('d-none');
            estadoUsuario('neutro');
            actualizarFuerza();
        });
    });



    // Genera automáticamente el bloque de código de cada ejemplo a partir de su propio HTML,
    // así el código mostrado es exactamente el que se está ejecutando.
    (function () {
        // Quita la sangría común del código mostrado en los apuntes.
        function desindentar(txt) {
            const lineas = txt.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
            const sangria = Math.min(...lineas.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
            return lineas.map(l => l.slice(sangria)).join('\n');
        }
        // Construye un details con código copiable.
        function crearBloque(codigo, lenguaje, titulo) {
            const det = document.createElement('details');
            det.className = 'codigo';
            det.open = true;
            const sum = document.createElement('summary');
            sum.innerHTML = '<span><i class="bi bi-code-slash"></i> </span>';
            sum.firstChild.append(titulo);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-sm btn-outline-secondary py-0';
            btn.innerHTML = '<i class="bi bi-clipboard"></i> Copiar';
            btn.addEventListener('click', ev => {
                ev.preventDefault();
                navigator.clipboard.writeText(codigo).then(() => {
                    btn.innerHTML = '<i class="bi bi-check2"></i> Copiado';
                    setTimeout(() => btn.innerHTML = '<i class="bi bi-clipboard"></i> Copiar', 1500);
                }).catch(() => { });
            });
            sum.appendChild(btn);
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = 'language-' + lenguaje;
            code.textContent = codigo;
            pre.appendChild(code);
            det.append(sum, pre);
            if (window.hljs) hljs.highlightElement(code);
            return det;
        }
        // 1) Ejemplos en vivo: el HTML del propio .demo
        document.querySelectorAll('.demo').forEach(demo => {
            const html = desindentar(demo.innerHTML).replace(/=""/g, '');
            demo.after(crearBloque(html, 'xml', 'Código HTML'));
        });
        // 2) Scripts y estilos marcados con .show-code
        document.querySelectorAll('script.show-code, style.show-code').forEach(el => {
            const texto = desindentar(el.textContent).replace(/<\\\//g, '</');
            const lenguaje = el.dataset.lang || (el.tagName === 'STYLE' ? 'css' : 'javascript');
            const titulo = el.dataset.titulo || (lenguaje === 'css' ? 'Código CSS' : 'Código JavaScript');
            const bloque = crearBloque(texto, lenguaje, titulo);
            if (!el.closest('.ejemplo')) {
                bloque.classList.add('mb-3', 'border', 'rounded', 'overflow-hidden');
            }
            el.after(bloque);
        });
        // 3) Copiar el índice al offcanvas para móvil
        const indice = document.getElementById('toc').cloneNode(true);
        indice.removeAttribute('id');
        indice.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            const oc = window.bootstrap && bootstrap.Offcanvas.getInstance('#indiceMovil');
            if (oc) oc.hide();
        }));
        document.getElementById('indiceMovilCuerpo').appendChild(indice);
        // 4) Modo oscuro (recordado entre visitas)
        const html = document.documentElement;
        const btnTema = document.getElementById('btnTema');
        function aplicarTema(t) {
            html.setAttribute('data-bs-theme', t);
            btnTema.innerHTML = t === 'dark'
                ? '<i class="bi bi-sun"></i> <span class="d-none d-sm-inline">Modo claro</span>'
                : '<i class="bi bi-moon-stars"></i> <span class="d-none d-sm-inline">Modo oscuro</span>';
        }
        try {
            if (localStorage.getItem('tema') === 'dark') aplicarTema('dark');
        } catch (e) { }
        btnTema.addEventListener('click', () => {
            const nuevo = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            aplicarTema(nuevo);
            try {
                localStorage.setItem('tema', nuevo);
            } catch (e) { }
        });
    })();
}
// FIN PRÁCTICA: apuntes_bootstrap



// ============================================================================
// 09 · NAVEGACIÓN Y VISOR DE CÓDIGO DEL KIT (no se ejecuta en una página nueva)
// ============================================================================
const KIT_DEMOS = {
    "inicio_rapido": {
        "title": "Plantilla rosa lista para el examen",
        "desc": "Base reutilizable: head, Bootstrap offline, grid, formulario, feedback, modal y tabla. Copia el código como punto de partida.",
        "note": "Ejemplo adicional creado para reunir el patrón HTML + CSS + JS.",
        "body_attrs": {},
        "html_attrs": {},
        "external_css": [],
        "has_js": true,
        "source_name": "Adición de síntesis"
    },
    "basicos": {
        "title": "JavaScript básico y arrays",
        "desc": "Variables, const/let, template literals, push, for/of, while, funciones, módulo %, suma, área y perímetro.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {},
        "external_css": [],
        "has_js": true,
        "source_name": "PractivaJS.js"
    },
    "raton": {
        "title": "Eventos del ratón",
        "desc": "click, dblclick, mouseover y mouseout. Caja interactiva y registro de eventos.",
        "note": "Se corrigen las unidades CSS y se sustituye el alert repetitivo por un registro; queda un modo de alertas opcional.",
        "body_attrs": {},
        "html_attrs": {},
        "external_css": [],
        "has_js": true,
        "source_name": "EventoMouse.html"
    },
    "eventos_form": {
        "title": "Eventos del formulario y teclado",
        "desc": "focus, blur, change, input, keyup, event.key, Ctrl, submit y preventDefault.",
        "note": "Registro visible en lugar de ventanas emergentes repetitivas; modo alert opcional.",
        "body_attrs": {},
        "html_attrs": {},
        "external_css": [],
        "has_js": true,
        "source_name": "EventosFormulario.html"
    },
    "contador": {
        "title": "Contadores y fecha actual",
        "desc": "Contador de clics, contador mouseover, reinicio, textContent, new Date, getDay, getMonth.",
        "note": "Se corrigen los días de la semana (domingo es 0) y el elemento Fecha inexistente; se muestran ambos tipos de contador.",
        "body_attrs": {},
        "html_attrs": {},
        "external_css": [],
        "has_js": true,
        "source_name": "PAgina contadora de clics.html"
    },
    "nacimiento": {
        "title": "Selects de fecha de nacimiento",
        "desc": "Crear opciones con for, selected, Date, día/mes/año, bisiestos y número de días del mes.",
        "note": "Se conserva la lógica de opciones y se añade ajuste de días al mes y año.",
        "body_attrs": {},
        "html_attrs": {},
        "external_css": [],
        "has_js": true,
        "source_name": "PagNacimiento.html"
    },
    "selects": {
        "title": "Selects dependientes: comidas",
        "desc": "Objetos anidados, Object.keys, arrays, createElement, opciones dependientes, disabled, change.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "ArraysInteractivos.html"
    },
    "listas": {
        "title": "Listas dobles interactivas",
        "desc": "Añadir, borrar y mover opciones entre select multiple; Array.from, selectedOptions, appendChild, remove, registro log.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "ListasInversas.html"
    },
    "form_simple": {
        "title": "Formulario básico: validación manual",
        "desc": "Obligatorios, longitud, correo, edad, estado civil, checkbox, focus/blur, alert y submit.",
        "note": "Se evita doble alerta y navegación; se conserva la validación por clases sin borrar otras clases del elemento.",
        "body_attrs": {},
        "html_attrs": {
            "lang": "en"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "Form.html"
    },
    "form_pro": {
        "title": "Formulario Pro",
        "desc": "Nombre, dirección, teléfono, código postal 01001–52006, provincias, radio, preferente, errores y resumen.",
        "note": "Se usa validarCodigoPostalRango según el enunciado. El archivo Validar.js original no incluía esa función.",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "Formulario.html"
    },
    "form_base": {
        "title": "Formulario normalizado completo",
        "desc": "Usuario, contraseña 8–16 sin regex, repetir contraseña, radio, select multiple, provincia/CP, resumen y errores.",
        "note": "Se activa también la comprobación de correspondencia provincia–CP, que estaba definida pero no conectada.",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "indexFormularioBase.html"
    },
    "password": {
        "title": "Registro W3Schools: contraseñas",
        "desc": "Password validation, mayúscula, minúscula, número, mínimo 8, repetir, mostrar/ocultar y reglas verdes/rojas.",
        "note": "",
        "body_attrs": {
            "class": [
                "container",
                "mt-4"
            ]
        },
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ],
        "has_js": true,
        "source_name": "index_2.html"
    },
    "optica": {
        "title": "Óptica: formulario Bootstrap",
        "desc": "Campos floating, input-group, CP y provincia, teléfono opcional, fecha desde mañana, radio, select multiple, tooltip, condiciones y modal.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "en"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "index_6.html"
    },
    "jovenes": {
        "title": "Leganés: club de jóvenes",
        "desc": "DNI, fecha de nacimiento, subida de JPG/PNG, aficiones con check en select, provincias, validar formulario, botón disabled, reset.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "index_9.html"
    },
    "mayores_bootstrap": {
        "title": "Siempre Activos: registro avanzado Bootstrap",
        "desc": "DNI/NIE, edad, IBAN, contraseña fuerte, validación asíncrona simulada, grupos, resumen de errores, setCustomValidity, FormData, modales, toast, carousel, tabs, acordeón.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [
            "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        ],
        "has_js": true,
        "source_name": "index_10.html"
    },
    "tabla_sucursales": {
        "title": "Tabla dinámica de sucursales",
        "desc": "Crear tabla desde JS, cabecera, tr/th/td, bucles anidados, 12 meses, input por celda, prompt.",
        "note": "Se añade entrada numérica para no bloquear al abrir y un botón para probar prompt; límite de 200 filas de ejemplo.",
        "body_attrs": {},
        "html_attrs": {},
        "external_css": [],
        "has_js": true,
        "source_name": "TablasRandom.html"
    },
    "panaderia": {
        "title": "Panadería: cesta de compra",
        "desc": "Productos y precios, cantidad entera, subtotal, añadir, agrupar repetidos con find, eliminar con check y filter, total y ticket.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "index.html"
    },
    "talleres": {
        "title": "Talleres Vives: factura con IVA",
        "desc": "NIF/NIE/CIF, captcha, CP y provincia, crear filas dinámicas, IVA 4/10/21, validación decimal coma/punto, redondeo, delegación de eventos y modal resumen.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "en"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "index_8.html"
    },
    "clipboard": {
        "title": "Copiar al portapapeles W3Schools",
        "desc": "navigator.clipboard.writeText, async/await, selección de texto, try/catch y alternativa Ctrl+C.",
        "note": "",
        "body_attrs": {
            "class": [
                "container",
                "mt-4"
            ]
        },
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "index_3.html"
    },
    "paises": {
        "title": "Países: autocomplete y filtros W3Schools",
        "desc": "Autocompletar con flechas/Enter/Escape, CapsLock, filtro de tabla y de lista, indexOf, startsWith.",
        "note": "",
        "body_attrs": {
            "class": [
                "container",
                "mt-4"
            ]
        },
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "index_4.html"
    },
    "google_charts": {
        "title": "Google Charts: líneas, columnas, área y GeoChart",
        "desc": "Gráficas de temperatura, arrayToDataTable, select, mapas de marcadores, callback. Necesita conexión.",
        "note": "Se conservan los datos del ejercicio; si no carga Google, aparecen los valores de ejemplo y un aviso.",
        "body_attrs": {
            "class": [
                "container",
                "mt-4"
            ]
        },
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "index_5.html"
    },
    "leaflet": {
        "title": "Leaflet: GeoJSON y temperaturas",
        "desc": "Fetch JSON, Promise.all, L.geoJSON, estilo por tramos, tooltip, hover, marcadores, click, modo y zoom. Necesita conexión.",
        "note": "No se adjuntaron lib/leaflet ni los dos JSON originales. Se usa CDN y geometría de muestra, no límites reales. Se corrige el fs de Node, el id duplicado y la función irA que faltaba.",
        "body_attrs": {},
        "html_attrs": {},
        "external_css": [],
        "has_js": true,
        "source_name": "index_7.html"
    },
    "blog": {
        "title": "Maqueta de página completa",
        "desc": "CSS Grid, header, nav, main, aside, footer, áreas y adaptación responsive.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": false,
        "source_name": "Maqueta de página completa.html"
    },
    "menu": {
        "title": "Menú responsive W3Schools",
        "desc": "topnav, media queries, hamburguesa, className responsive, enlaces y Font Awesome.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {},
        "external_css": [
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ],
        "has_js": true,
        "source_name": "MenuReponsive"
    },
    "panaderia_sol": {
        "title": "Panadería Sol: menú accesible",
        "desc": "Media queries 640px, menú hamburguesa, flex, aria-expanded, clase abierto y texto sr.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "Panadería Sol.html"
    },
    "senderismo": {
        "title": "Rutas de senderismo: grid de cards",
        "desc": "Grid auto-fit/minmax, tarjetas, distribución flexible, clamp y responsive.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": false,
        "source_name": "Rutas de senderismo.html"
    },
    "tabla_fichas": {
        "title": "Tabla responsive que se vuelve fichas",
        "desc": "Tabla semántica, media queries, data-label, pseudoelementos ::before, estado y formato móvil.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": false,
        "source_name": "Tabla que se vuelve fichas.html"
    },
    "container_query": {
        "title": "Tarjetas y container queries",
        "desc": "container-type:inline-size, @container, cambio de tarjeta según ancho del padre (no de la ventana).",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": false,
        "source_name": "Tarjeta con container query.html"
    },
    "mayores_css": {
        "title": "Siempre Activos: sitio completo sin Bootstrap",
        "desc": "Header, menú responsive, carrusel JS, grids, tablas desplazables, secciones, formulario, CSS y reset.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": true,
        "source_name": "index.html"
    },
    "infancia": {
        "title": "Ayuda a la infancia: maquetación",
        "desc": "Página informativa, cajas, encabezados, banners, imágenes, bloques, columnas, responsive.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": false,
        "source_name": "AyudaInfancia.html"
    },
    "base_bootstrap": {
        "title": "Base Bootstrap responsive",
        "desc": "Container-fluid, row, col-12 col-md-8/4/6, anidar columnas, navbar collapse, spacing, utilidades y formulario.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": false,
        "source_name": "BaseBoostrap.html"
    },
    "fotocopias": {
        "title": "Guía de fotocopias: columnas responsive",
        "desc": "Grid de 4 bloques, col-12 col-md-6 col-lg-3, img-fluid, align-items-center, cabecera y tarjetas.",
        "note": "",
        "body_attrs": {},
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": false,
        "source_name": "index_11.html"
    },
    "sanrio": {
        "title": "Hello Kitty / My Melody: Bootstrap",
        "desc": "Accordion, toast, columnas ocultas d-none d-md-block, grid anidada, panel lateral, utilidades y CSS propio.",
        "note": "",
        "body_attrs": {
            "class": [
                "bg-body",
                "text-body"
            ]
        },
        "html_attrs": {
            "lang": "es"
        },
        "external_css": [],
        "has_js": false,
        "source_name": "index_12.html"
    },
    "apuntes_bootstrap": {
        "title": "Apuntes Bootstrap 5.3 del profesor (completos)",
        "desc": "14 capítulos: instalación, breakpoints, grid, responsive, utilidades, tipografía, tablas, todos los componentes, personalización/Sass, formularios, validaciones, recursos y chuleta.",
        "note": "",
        "body_attrs": {
            "data-bs-spy": "scroll",
            "data-bs-target": "#toc",
            "data-bs-offset": "90",
            "tabindex": "0"
        },
        "html_attrs": {
            "lang": "es",
            "data-bs-theme": "light"
        },
        "external_css": [
            "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
        ],
        "has_js": true,
        "source_name": "apuntes-bootstrap.html"
    }
};

/** Convierte atributos guardados en una etiqueta HTML reutilizable. */
function atributosHTML(attrs) {
    const escape = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return Object.entries(attrs).map(([k, v]) => v === '' ? ` ${k}` : ` ${k}="${escape(Array.isArray(v) ? v.join(' ') : v)}"`).join('');
}
/** Devuelve una página autónoma, que usa los otros dos archivos del kit. */
function htmlCompletoDemo(id, plantilla, meta) {
    const titulo = meta.title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return `<!doctype html>\n<html${atributosHTML({ lang: 'es', 'data-bs-theme': 'light', ...meta.html_attrs, 'data-demo': id })}>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${titulo}</title>\n  <link rel="stylesheet" href="styles.css">\n  <script src="validar.js" defer></script>\n</head>\n<body${atributosHTML(meta.body_attrs)}>\n${plantilla.innerHTML.trim()}\n\n  <!-- Iniciar el ejercicio después de cargar el DOM y validar.js. -->\n  <script>\n    document.addEventListener('DOMContentLoaded', () => iniciarDemo_${id}());\n  </script>\n</body>\n</html>`;
}
/** El visor muestra el CSS aislado si el navegador permite leer CSSOM. */
function cssDeDemo(id) {
    try {
        for (const hoja of document.styleSheets) {
            try {
                for (const regla of hoja.cssRules) {
                    if (regla.cssText.startsWith('@scope') && regla.cssText.includes(`data-demo="${id}"`)) return regla.cssText;
                }
            } catch { /* hoja externa o bloqueada por el navegador */ }
        }
    } catch { /* acceso limitado en file:// */ }
    return `/* El tema rosa y Bootstrap ya están en styles.css.\n   Si la práctica tiene CSS propio, busca data-demo="${id}" en styles.css.\n   Conserva el atributo data-demo en <html> para activar esas reglas. */`;
}
function instalarVisor(id, plantilla, meta) {
    const barra = crearElemento('nav');
    barra.id = 'kit-bar';
    barra.setAttribute('aria-label', 'Navegación de la biblioteca');
    const inicio = crearElemento('a', '', '← Índice');
    inicio.href = location.href.split(/[?#]/)[0];
    const boton = crearElemento('button', '', 'Ver código');
    boton.type = 'button';
    barra.append(inicio, boton);
    document.body.appendChild(barra);
    const dialogo = crearElemento('dialog');
    dialogo.id = 'kit-dialog';
    dialogo.setAttribute('aria-labelledby', 'kit-dialog-titulo');
    boton.addEventListener('click', () => {
        if (!dialogo.children.length) {
            const cabecera = crearElemento('div', 'd-flex justify-content-between align-items-start gap-3');
            const h = crearElemento('h2', '', meta.title);
            h.id = 'kit-dialog-titulo';
            const cerrar = crearElemento('button', 'btn btn-sm btn-outline-primary', 'Cerrar ×');
            cerrar.type = 'button';
            cerrar.addEventListener('click', () => dialogo.close());
            cabecera.append(h, cerrar);
            dialogo.appendChild(cabecera);
            dialogo.appendChild(crearElemento('p', '', meta.desc));
            if (meta.note) dialogo.appendChild(crearElemento('p', 'kit-missing', meta.note));
            dialogo.appendChild(crearElemento('p', 'small', 'Copia el HTML completo en un index.html nuevo junto a styles.css y validar.js. El JavaScript ya existe en validar.js; copia y renombra el inicializador sólo si quieres modificarlo.'));
            const codigoHTML = htmlCompletoDemo(id, plantilla, meta);
            const codigoJS = window['iniciarDemo_' + id]?.toString() || '// Práctica estática.';
            const codigoCSS = cssDeDemo(id);
            for (const [titulo, codigo, abierto] of [['index.html · código completo', codigoHTML, true], ['validar.js · inicializador del ejemplo', codigoJS, false], ['styles.css · reglas propias / referencia', codigoCSS, false]]) {
                const detalle = crearElemento('details');
                detalle.open = abierto;
                const resumen = crearElemento('summary', '', titulo);
                const copiar = crearElemento('button', 'btn btn-sm btn-primary kit-code-copy', 'Copiar código');
                copiar.type = 'button';
                const pre = crearElemento('pre');
                const code = crearElemento('code', '', codigo);
                pre.appendChild(code);
                copiar.addEventListener('click', async () => {
                    const ok = await copiarTexto(codigo);
                    copiar.textContent = ok ? '✓ Copiado' : 'Selecciona el código y pulsa Ctrl+C';
                    setTimeout(() => copiar.textContent = 'Copiar código', 2000);
                });
                detalle.append(resumen, copiar, pre);
                dialogo.appendChild(detalle);
            }
        }
        dialogo.showModal();
    });
    document.body.appendChild(dialogo);
}
/** Carga UNA práctica. No se mezclan IDs ni listeners de otros ejemplos. */
function iniciarKit() {
    const inicio = porId('kit-inicio');
    if (!inicio) return; // validar.js también puede usarse en una página independiente.
    const id = new URLSearchParams(location.search).get('demo');
    const meta = id && Object.hasOwn(KIT_DEMOS, id) ? KIT_DEMOS[id] : null;
    const plantilla = meta ? porId('demo-' + id) : null;
    if (!meta || !plantilla) {
        const buscador = porId('kit-buscar'), tarjetas = Array.from(inicio.querySelectorAll('.kit-card'));
        function buscar() {
            const q = normalizarBusqueda(buscador.value).trim();
            let n = 0;
            tarjetas.forEach(t => {
                const coincide = q.split(/\s+/).every(p => normalizarBusqueda(t.dataset.search).includes(p));
                t.hidden = !coincide;
                if (coincide) n++;
            });
            inicio.querySelectorAll('.kit-section').forEach(s => s.hidden = !s.querySelector('.kit-card:not([hidden])'));
            porId('kit-resultados').textContent = n + ' recursos';
            porId('kit-sin-resultados').hidden = n !== 0;
        }
        buscador.addEventListener('input', buscar);
        buscar();
        return;
    }
    inicio.remove();
    document.querySelector('noscript')?.remove();
    // Aplicar los atributos originales del ejercicio (container, data-bs-spy, etc.).
    Array.from(document.body.attributes).forEach(a => document.body.removeAttribute(a.name));
    for (const [k, v] of Object.entries(meta.body_attrs)) document.body.setAttribute(k, Array.isArray(v) ? v.join(' ') : v);
    document.documentElement.setAttribute('data-demo', id);
    for (const [k, v] of Object.entries(meta.html_attrs)) document.documentElement.setAttribute(k, v);
    document.documentElement.lang = 'es';
    document.title = meta.title + ' · Kit de examen';
    document.body.appendChild(plantilla.content.cloneNode(true));
    // Evita que una práctica sin servidor navegue a una URL inexistente.
    // Los listeners específicos del formulario se siguen ejecutando.
    document.addEventListener('submit', e => e.preventDefault());
    try {
        const resultado = window['iniciarDemo_' + id]();
        if (resultado instanceof Promise) resultado.catch(error => {
            console.error(error);
            document.body.appendChild(crearElemento('p', 'kit-missing', 'No se pudo completar la práctica: ' + error.message));
        });
    } catch (error) {
        console.error(error);
        document.body.appendChild(crearElemento('p', 'kit-missing', 'Error de la práctica: ' + error.message));
    }
    instalarVisor(id, plantilla, meta);
}

// ============================================================================
// 10 · BOOTSTRAP 5.3.6 LOCAL — BUNDLE OFICIAL MIT (incluye Popper)
// No modificar. Este bloque permite modales, collapse, tooltip, carousel, etc.
// sin conexión. Si prefieres el CDN, no cargues dos versiones a la vez.
// ============================================================================

/*!
  * Bootstrap v5.3.6 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).bootstrap=e()}(this,(function(){"use strict";const t=new Map,e={set(e,i,n){t.has(e)||t.set(e,new Map);const s=t.get(e);s.has(i)||0===s.size?s.set(i,n):console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(s.keys())[0]}.`)},get:(e,i)=>t.has(e)&&t.get(e).get(i)||null,remove(e,i){if(!t.has(e))return;const n=t.get(e);n.delete(i),0===n.size&&t.delete(e)}},i="transitionend",n=t=>(t&&window.CSS&&window.CSS.escape&&(t=t.replace(/#([^\s"#']+)/g,((t,e)=>`#${CSS.escape(e)}`))),t),s=t=>{t.dispatchEvent(new Event(i))},o=t=>!(!t||"object"!=typeof t)&&(void 0!==t.jquery&&(t=t[0]),void 0!==t.nodeType),r=t=>o(t)?t.jquery?t[0]:t:"string"==typeof t&&t.length>0?document.querySelector(n(t)):null,a=t=>{if(!o(t)||0===t.getClientRects().length)return!1;const e="visible"===getComputedStyle(t).getPropertyValue("visibility"),i=t.closest("details:not([open])");if(!i)return e;if(i!==t){const e=t.closest("summary");if(e&&e.parentNode!==i)return!1;if(null===e)return!1}return e},l=t=>!t||t.nodeType!==Node.ELEMENT_NODE||!!t.classList.contains("disabled")||(void 0!==t.disabled?t.disabled:t.hasAttribute("disabled")&&"false"!==t.getAttribute("disabled")),c=t=>{if(!document.documentElement.attachShadow)return null;if("function"==typeof t.getRootNode){const e=t.getRootNode();return e instanceof ShadowRoot?e:null}return t instanceof ShadowRoot?t:t.parentNode?c(t.parentNode):null},h=()=>{},d=t=>{t.offsetHeight},u=()=>window.jQuery&&!document.body.hasAttribute("data-bs-no-jquery")?window.jQuery:null,f=[],p=()=>"rtl"===document.documentElement.dir,m=t=>{var e;e=()=>{const e=u();if(e){const i=t.NAME,n=e.fn[i];e.fn[i]=t.jQueryInterface,e.fn[i].Constructor=t,e.fn[i].noConflict=()=>(e.fn[i]=n,t.jQueryInterface)}},"loading"===document.readyState?(f.length||document.addEventListener("DOMContentLoaded",(()=>{for(const t of f)t()})),f.push(e)):e()},g=(t,e=[],i=t)=>"function"==typeof t?t.call(...e):i,_=(t,e,n=!0)=>{if(!n)return void g(t);const o=(t=>{if(!t)return 0;let{transitionDuration:e,transitionDelay:i}=window.getComputedStyle(t);const n=Number.parseFloat(e),s=Number.parseFloat(i);return n||s?(e=e.split(",")[0],i=i.split(",")[0],1e3*(Number.parseFloat(e)+Number.parseFloat(i))):0})(e)+5;let r=!1;const a=({target:n})=>{n===e&&(r=!0,e.removeEventListener(i,a),g(t))};e.addEventListener(i,a),setTimeout((()=>{r||s(e)}),o)},b=(t,e,i,n)=>{const s=t.length;let o=t.indexOf(e);return-1===o?!i&&n?t[s-1]:t[0]:(o+=i?1:-1,n&&(o=(o+s)%s),t[Math.max(0,Math.min(o,s-1))])},v=/[^.]*(?=\..*)\.|.*/,y=/\..*/,w=/::\d+$/,A={};let E=1;const T={mouseenter:"mouseover",mouseleave:"mouseout"},C=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function O(t,e){return e&&`${e}::${E++}`||t.uidEvent||E++}function x(t){const e=O(t);return t.uidEvent=e,A[e]=A[e]||{},A[e]}function k(t,e,i=null){return Object.values(t).find((t=>t.callable===e&&t.delegationSelector===i))}function L(t,e,i){const n="string"==typeof e,s=n?i:e||i;let o=I(t);return C.has(o)||(o=t),[n,s,o]}function S(t,e,i,n,s){if("string"!=typeof e||!t)return;let[o,r,a]=L(e,i,n);if(e in T){const t=t=>function(e){if(!e.relatedTarget||e.relatedTarget!==e.delegateTarget&&!e.delegateTarget.contains(e.relatedTarget))return t.call(this,e)};r=t(r)}const l=x(t),c=l[a]||(l[a]={}),h=k(c,r,o?i:null);if(h)return void(h.oneOff=h.oneOff&&s);const d=O(r,e.replace(v,"")),u=o?function(t,e,i){return function n(s){const o=t.querySelectorAll(e);for(let{target:r}=s;r&&r!==this;r=r.parentNode)for(const a of o)if(a===r)return P(s,{delegateTarget:r}),n.oneOff&&N.off(t,s.type,e,i),i.apply(r,[s])}}(t,i,r):function(t,e){return function i(n){return P(n,{delegateTarget:t}),i.oneOff&&N.off(t,n.type,e),e.apply(t,[n])}}(t,r);u.delegationSelector=o?i:null,u.callable=r,u.oneOff=s,u.uidEvent=d,c[d]=u,t.addEventListener(a,u,o)}function D(t,e,i,n,s){const o=k(e[i],n,s);o&&(t.removeEventListener(i,o,Boolean(s)),delete e[i][o.uidEvent])}function $(t,e,i,n){const s=e[i]||{};for(const[o,r]of Object.entries(s))o.includes(n)&&D(t,e,i,r.callable,r.delegationSelector)}function I(t){return t=t.replace(y,""),T[t]||t}const N={on(t,e,i,n){S(t,e,i,n,!1)},one(t,e,i,n){S(t,e,i,n,!0)},off(t,e,i,n){if("string"!=typeof e||!t)return;const[s,o,r]=L(e,i,n),a=r!==e,l=x(t),c=l[r]||{},h=e.startsWith(".");if(void 0===o){if(h)for(const i of Object.keys(l))$(t,l,i,e.slice(1));for(const[i,n]of Object.entries(c)){const s=i.replace(w,"");a&&!e.includes(s)||D(t,l,r,n.callable,n.delegationSelector)}}else{if(!Object.keys(c).length)return;D(t,l,r,o,s?i:null)}},trigger(t,e,i){if("string"!=typeof e||!t)return null;const n=u();let s=null,o=!0,r=!0,a=!1;e!==I(e)&&n&&(s=n.Event(e,i),n(t).trigger(s),o=!s.isPropagationStopped(),r=!s.isImmediatePropagationStopped(),a=s.isDefaultPrevented());const l=P(new Event(e,{bubbles:o,cancelable:!0}),i);return a&&l.preventDefault(),r&&t.dispatchEvent(l),l.defaultPrevented&&s&&s.preventDefault(),l}};function P(t,e={}){for(const[i,n]of Object.entries(e))try{t[i]=n}catch(e){Object.defineProperty(t,i,{configurable:!0,get:()=>n})}return t}function j(t){if("true"===t)return!0;if("false"===t)return!1;if(t===Number(t).toString())return Number(t);if(""===t||"null"===t)return null;if("string"!=typeof t)return t;try{return JSON.parse(decodeURIComponent(t))}catch(e){return t}}function M(t){return t.replace(/[A-Z]/g,(t=>`-${t.toLowerCase()}`))}const F={setDataAttribute(t,e,i){t.setAttribute(`data-bs-${M(e)}`,i)},removeDataAttribute(t,e){t.removeAttribute(`data-bs-${M(e)}`)},getDataAttributes(t){if(!t)return{};const e={},i=Object.keys(t.dataset).filter((t=>t.startsWith("bs")&&!t.startsWith("bsConfig")));for(const n of i){let i=n.replace(/^bs/,"");i=i.charAt(0).toLowerCase()+i.slice(1),e[i]=j(t.dataset[n])}return e},getDataAttribute:(t,e)=>j(t.getAttribute(`data-bs-${M(e)}`))};class H{static get Default(){return{}}static get DefaultType(){return{}}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}_getConfig(t){return t=this._mergeConfigObj(t),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}_configAfterMerge(t){return t}_mergeConfigObj(t,e){const i=o(e)?F.getDataAttribute(e,"config"):{};return{...this.constructor.Default,..."object"==typeof i?i:{},...o(e)?F.getDataAttributes(e):{},..."object"==typeof t?t:{}}}_typeCheckConfig(t,e=this.constructor.DefaultType){for(const[n,s]of Object.entries(e)){const e=t[n],r=o(e)?"element":null==(i=e)?`${i}`:Object.prototype.toString.call(i).match(/\s([a-z]+)/i)[1].toLowerCase();if(!new RegExp(s).test(r))throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${n}" provided type "${r}" but expected type "${s}".`)}var i}}class W extends H{constructor(t,i){super(),(t=r(t))&&(this._element=t,this._config=this._getConfig(i),e.set(this._element,this.constructor.DATA_KEY,this))}dispose(){e.remove(this._element,this.constructor.DATA_KEY),N.off(this._element,this.constructor.EVENT_KEY);for(const t of Object.getOwnPropertyNames(this))this[t]=null}_queueCallback(t,e,i=!0){_(t,e,i)}_getConfig(t){return t=this._mergeConfigObj(t,this._element),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}static getInstance(t){return e.get(r(t),this.DATA_KEY)}static getOrCreateInstance(t,e={}){return this.getInstance(t)||new this(t,"object"==typeof e?e:null)}static get VERSION(){return"5.3.6"}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}static eventName(t){return`${t}${this.EVENT_KEY}`}}const B=t=>{let e=t.getAttribute("data-bs-target");if(!e||"#"===e){let i=t.getAttribute("href");if(!i||!i.includes("#")&&!i.startsWith("."))return null;i.includes("#")&&!i.startsWith("#")&&(i=`#${i.split("#")[1]}`),e=i&&"#"!==i?i.trim():null}return e?e.split(",").map((t=>n(t))).join(","):null},z={find:(t,e=document.documentElement)=>[].concat(...Element.prototype.querySelectorAll.call(e,t)),findOne:(t,e=document.documentElement)=>Element.prototype.querySelector.call(e,t),children:(t,e)=>[].concat(...t.children).filter((t=>t.matches(e))),parents(t,e){const i=[];let n=t.parentNode.closest(e);for(;n;)i.push(n),n=n.parentNode.closest(e);return i},prev(t,e){let i=t.previousElementSibling;for(;i;){if(i.matches(e))return[i];i=i.previousElementSibling}return[]},next(t,e){let i=t.nextElementSibling;for(;i;){if(i.matches(e))return[i];i=i.nextElementSibling}return[]},focusableChildren(t){const e=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map((t=>`${t}:not([tabindex^="-"])`)).join(",");return this.find(e,t).filter((t=>!l(t)&&a(t)))},getSelectorFromElement(t){const e=B(t);return e&&z.findOne(e)?e:null},getElementFromSelector(t){const e=B(t);return e?z.findOne(e):null},getMultipleElementsFromSelector(t){const e=B(t);return e?z.find(e):[]}},R=(t,e="hide")=>{const i=`click.dismiss${t.EVENT_KEY}`,n=t.NAME;N.on(document,i,`[data-bs-dismiss="${n}"]`,(function(i){if(["A","AREA"].includes(this.tagName)&&i.preventDefault(),l(this))return;const s=z.getElementFromSelector(this)||this.closest(`.${n}`);t.getOrCreateInstance(s)[e]()}))},q=".bs.alert",V=`close${q}`,K=`closed${q}`;class Q extends W{static get NAME(){return"alert"}close(){if(N.trigger(this._element,V).defaultPrevented)return;this._element.classList.remove("show");const t=this._element.classList.contains("fade");this._queueCallback((()=>this._destroyElement()),this._element,t)}_destroyElement(){this._element.remove(),N.trigger(this._element,K),this.dispose()}static jQueryInterface(t){return this.each((function(){const e=Q.getOrCreateInstance(this);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t](this)}}))}}R(Q,"close"),m(Q);const X='[data-bs-toggle="button"]';class Y extends W{static get NAME(){return"button"}toggle(){this._element.setAttribute("aria-pressed",this._element.classList.toggle("active"))}static jQueryInterface(t){return this.each((function(){const e=Y.getOrCreateInstance(this);"toggle"===t&&e[t]()}))}}N.on(document,"click.bs.button.data-api",X,(t=>{t.preventDefault();const e=t.target.closest(X);Y.getOrCreateInstance(e).toggle()})),m(Y);const U=".bs.swipe",G=`touchstart${U}`,J=`touchmove${U}`,Z=`touchend${U}`,tt=`pointerdown${U}`,et=`pointerup${U}`,it={endCallback:null,leftCallback:null,rightCallback:null},nt={endCallback:"(function|null)",leftCallback:"(function|null)",rightCallback:"(function|null)"};class st extends H{constructor(t,e){super(),this._element=t,t&&st.isSupported()&&(this._config=this._getConfig(e),this._deltaX=0,this._supportPointerEvents=Boolean(window.PointerEvent),this._initEvents())}static get Default(){return it}static get DefaultType(){return nt}static get NAME(){return"swipe"}dispose(){N.off(this._element,U)}_start(t){this._supportPointerEvents?this._eventIsPointerPenTouch(t)&&(this._deltaX=t.clientX):this._deltaX=t.touches[0].clientX}_end(t){this._eventIsPointerPenTouch(t)&&(this._deltaX=t.clientX-this._deltaX),this._handleSwipe(),g(this._config.endCallback)}_move(t){this._deltaX=t.touches&&t.touches.length>1?0:t.touches[0].clientX-this._deltaX}_handleSwipe(){const t=Math.abs(this._deltaX);if(t<=40)return;const e=t/this._deltaX;this._deltaX=0,e&&g(e>0?this._config.rightCallback:this._config.leftCallback)}_initEvents(){this._supportPointerEvents?(N.on(this._element,tt,(t=>this._start(t))),N.on(this._element,et,(t=>this._end(t))),this._element.classList.add("pointer-event")):(N.on(this._element,G,(t=>this._start(t))),N.on(this._element,J,(t=>this._move(t))),N.on(this._element,Z,(t=>this._end(t))))}_eventIsPointerPenTouch(t){return this._supportPointerEvents&&("pen"===t.pointerType||"touch"===t.pointerType)}static isSupported(){return"ontouchstart"in document.documentElement||navigator.maxTouchPoints>0}}const ot=".bs.carousel",rt=".data-api",at="ArrowLeft",lt="ArrowRight",ct="next",ht="prev",dt="left",ut="right",ft=`slide${ot}`,pt=`slid${ot}`,mt=`keydown${ot}`,gt=`mouseenter${ot}`,_t=`mouseleave${ot}`,bt=`dragstart${ot}`,vt=`load${ot}${rt}`,yt=`click${ot}${rt}`,wt="carousel",At="active",Et=".active",Tt=".carousel-item",Ct=Et+Tt,Ot={[at]:ut,[lt]:dt},xt={interval:5e3,keyboard:!0,pause:"hover",ride:!1,touch:!0,wrap:!0},kt={interval:"(number|boolean)",keyboard:"boolean",pause:"(string|boolean)",ride:"(boolean|string)",touch:"boolean",wrap:"boolean"};class Lt extends W{constructor(t,e){super(t,e),this._interval=null,this._activeElement=null,this._isSliding=!1,this.touchTimeout=null,this._swipeHelper=null,this._indicatorsElement=z.findOne(".carousel-indicators",this._element),this._addEventListeners(),this._config.ride===wt&&this.cycle()}static get Default(){return xt}static get DefaultType(){return kt}static get NAME(){return"carousel"}next(){this._slide(ct)}nextWhenVisible(){!document.hidden&&a(this._element)&&this.next()}prev(){this._slide(ht)}pause(){this._isSliding&&s(this._element),this._clearInterval()}cycle(){this._clearInterval(),this._updateInterval(),this._interval=setInterval((()=>this.nextWhenVisible()),this._config.interval)}_maybeEnableCycle(){this._config.ride&&(this._isSliding?N.one(this._element,pt,(()=>this.cycle())):this.cycle())}to(t){const e=this._getItems();if(t>e.length-1||t<0)return;if(this._isSliding)return void N.one(this._element,pt,(()=>this.to(t)));const i=this._getItemIndex(this._getActive());if(i===t)return;const n=t>i?ct:ht;this._slide(n,e[t])}dispose(){this._swipeHelper&&this._swipeHelper.dispose(),super.dispose()}_configAfterMerge(t){return t.defaultInterval=t.interval,t}_addEventListeners(){this._config.keyboard&&N.on(this._element,mt,(t=>this._keydown(t))),"hover"===this._config.pause&&(N.on(this._element,gt,(()=>this.pause())),N.on(this._element,_t,(()=>this._maybeEnableCycle()))),this._config.touch&&st.isSupported()&&this._addTouchEventListeners()}_addTouchEventListeners(){for(const t of z.find(".carousel-item img",this._element))N.on(t,bt,(t=>t.preventDefault()));const t={leftCallback:()=>this._slide(this._directionToOrder(dt)),rightCallback:()=>this._slide(this._directionToOrder(ut)),endCallback:()=>{"hover"===this._config.pause&&(this.pause(),this.touchTimeout&&clearTimeout(this.touchTimeout),this.touchTimeout=setTimeout((()=>this._maybeEnableCycle()),500+this._config.interval))}};this._swipeHelper=new st(this._element,t)}_keydown(t){if(/input|textarea/i.test(t.target.tagName))return;const e=Ot[t.key];e&&(t.preventDefault(),this._slide(this._directionToOrder(e)))}_getItemIndex(t){return this._getItems().indexOf(t)}_setActiveIndicatorElement(t){if(!this._indicatorsElement)return;const e=z.findOne(Et,this._indicatorsElement);e.classList.remove(At),e.removeAttribute("aria-current");const i=z.findOne(`[data-bs-slide-to="${t}"]`,this._indicatorsElement);i&&(i.classList.add(At),i.setAttribute("aria-current","true"))}_updateInterval(){const t=this._activeElement||this._getActive();if(!t)return;const e=Number.parseInt(t.getAttribute("data-bs-interval"),10);this._config.interval=e||this._config.defaultInterval}_slide(t,e=null){if(this._isSliding)return;const i=this._getActive(),n=t===ct,s=e||b(this._getItems(),i,n,this._config.wrap);if(s===i)return;const o=this._getItemIndex(s),r=e=>N.trigger(this._element,e,{relatedTarget:s,direction:this._orderToDirection(t),from:this._getItemIndex(i),to:o});if(r(ft).defaultPrevented)return;if(!i||!s)return;const a=Boolean(this._interval);this.pause(),this._isSliding=!0,this._setActiveIndicatorElement(o),this._activeElement=s;const l=n?"carousel-item-start":"carousel-item-end",c=n?"carousel-item-next":"carousel-item-prev";s.classList.add(c),d(s),i.classList.add(l),s.classList.add(l),this._queueCallback((()=>{s.classList.remove(l,c),s.classList.add(At),i.classList.remove(At,c,l),this._isSliding=!1,r(pt)}),i,this._isAnimated()),a&&this.cycle()}_isAnimated(){return this._element.classList.contains("slide")}_getActive(){return z.findOne(Ct,this._element)}_getItems(){return z.find(Tt,this._element)}_clearInterval(){this._interval&&(clearInterval(this._interval),this._interval=null)}_directionToOrder(t){return p()?t===dt?ht:ct:t===dt?ct:ht}_orderToDirection(t){return p()?t===ht?dt:ut:t===ht?ut:dt}static jQueryInterface(t){return this.each((function(){const e=Lt.getOrCreateInstance(this,t);if("number"!=typeof t){if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t]()}}else e.to(t)}))}}N.on(document,yt,"[data-bs-slide], [data-bs-slide-to]",(function(t){const e=z.getElementFromSelector(this);if(!e||!e.classList.contains(wt))return;t.preventDefault();const i=Lt.getOrCreateInstance(e),n=this.getAttribute("data-bs-slide-to");return n?(i.to(n),void i._maybeEnableCycle()):"next"===F.getDataAttribute(this,"slide")?(i.next(),void i._maybeEnableCycle()):(i.prev(),void i._maybeEnableCycle())})),N.on(window,vt,(()=>{const t=z.find('[data-bs-ride="carousel"]');for(const e of t)Lt.getOrCreateInstance(e)})),m(Lt);const St=".bs.collapse",Dt=`show${St}`,$t=`shown${St}`,It=`hide${St}`,Nt=`hidden${St}`,Pt=`click${St}.data-api`,jt="show",Mt="collapse",Ft="collapsing",Ht=`:scope .${Mt} .${Mt}`,Wt='[data-bs-toggle="collapse"]',Bt={parent:null,toggle:!0},zt={parent:"(null|element)",toggle:"boolean"};class Rt extends W{constructor(t,e){super(t,e),this._isTransitioning=!1,this._triggerArray=[];const i=z.find(Wt);for(const t of i){const e=z.getSelectorFromElement(t),i=z.find(e).filter((t=>t===this._element));null!==e&&i.length&&this._triggerArray.push(t)}this._initializeChildren(),this._config.parent||this._addAriaAndCollapsedClass(this._triggerArray,this._isShown()),this._config.toggle&&this.toggle()}static get Default(){return Bt}static get DefaultType(){return zt}static get NAME(){return"collapse"}toggle(){this._isShown()?this.hide():this.show()}show(){if(this._isTransitioning||this._isShown())return;let t=[];if(this._config.parent&&(t=this._getFirstLevelChildren(".collapse.show, .collapse.collapsing").filter((t=>t!==this._element)).map((t=>Rt.getOrCreateInstance(t,{toggle:!1})))),t.length&&t[0]._isTransitioning)return;if(N.trigger(this._element,Dt).defaultPrevented)return;for(const e of t)e.hide();const e=this._getDimension();this._element.classList.remove(Mt),this._element.classList.add(Ft),this._element.style[e]=0,this._addAriaAndCollapsedClass(this._triggerArray,!0),this._isTransitioning=!0;const i=`scroll${e[0].toUpperCase()+e.slice(1)}`;this._queueCallback((()=>{this._isTransitioning=!1,this._element.classList.remove(Ft),this._element.classList.add(Mt,jt),this._element.style[e]="",N.trigger(this._element,$t)}),this._element,!0),this._element.style[e]=`${this._element[i]}px`}hide(){if(this._isTransitioning||!this._isShown())return;if(N.trigger(this._element,It).defaultPrevented)return;const t=this._getDimension();this._element.style[t]=`${this._element.getBoundingClientRect()[t]}px`,d(this._element),this._element.classList.add(Ft),this._element.classList.remove(Mt,jt);for(const t of this._triggerArray){const e=z.getElementFromSelector(t);e&&!this._isShown(e)&&this._addAriaAndCollapsedClass([t],!1)}this._isTransitioning=!0,this._element.style[t]="",this._queueCallback((()=>{this._isTransitioning=!1,this._element.classList.remove(Ft),this._element.classList.add(Mt),N.trigger(this._element,Nt)}),this._element,!0)}_isShown(t=this._element){return t.classList.contains(jt)}_configAfterMerge(t){return t.toggle=Boolean(t.toggle),t.parent=r(t.parent),t}_getDimension(){return this._element.classList.contains("collapse-horizontal")?"width":"height"}_initializeChildren(){if(!this._config.parent)return;const t=this._getFirstLevelChildren(Wt);for(const e of t){const t=z.getElementFromSelector(e);t&&this._addAriaAndCollapsedClass([e],this._isShown(t))}}_getFirstLevelChildren(t){const e=z.find(Ht,this._config.parent);return z.find(t,this._config.parent).filter((t=>!e.includes(t)))}_addAriaAndCollapsedClass(t,e){if(t.length)for(const i of t)i.classList.toggle("collapsed",!e),i.setAttribute("aria-expanded",e)}static jQueryInterface(t){const e={};return"string"==typeof t&&/show|hide/.test(t)&&(e.toggle=!1),this.each((function(){const i=Rt.getOrCreateInstance(this,e);if("string"==typeof t){if(void 0===i[t])throw new TypeError(`No method named "${t}"`);i[t]()}}))}}N.on(document,Pt,Wt,(function(t){("A"===t.target.tagName||t.delegateTarget&&"A"===t.delegateTarget.tagName)&&t.preventDefault();for(const t of z.getMultipleElementsFromSelector(this))Rt.getOrCreateInstance(t,{toggle:!1}).toggle()})),m(Rt);var qt="top",Vt="bottom",Kt="right",Qt="left",Xt="auto",Yt=[qt,Vt,Kt,Qt],Ut="start",Gt="end",Jt="clippingParents",Zt="viewport",te="popper",ee="reference",ie=Yt.reduce((function(t,e){return t.concat([e+"-"+Ut,e+"-"+Gt])}),[]),ne=[].concat(Yt,[Xt]).reduce((function(t,e){return t.concat([e,e+"-"+Ut,e+"-"+Gt])}),[]),se="beforeRead",oe="read",re="afterRead",ae="beforeMain",le="main",ce="afterMain",he="beforeWrite",de="write",ue="afterWrite",fe=[se,oe,re,ae,le,ce,he,de,ue];function pe(t){return t?(t.nodeName||"").toLowerCase():null}function me(t){if(null==t)return window;if("[object Window]"!==t.toString()){var e=t.ownerDocument;return e&&e.defaultView||window}return t}function ge(t){return t instanceof me(t).Element||t instanceof Element}function _e(t){return t instanceof me(t).HTMLElement||t instanceof HTMLElement}function be(t){return"undefined"!=typeof ShadowRoot&&(t instanceof me(t).ShadowRoot||t instanceof ShadowRoot)}const ve={name:"applyStyles",enabled:!0,phase:"write",fn:function(t){var e=t.state;Object.keys(e.elements).forEach((function(t){var i=e.styles[t]||{},n=e.attributes[t]||{},s=e.elements[t];_e(s)&&pe(s)&&(Object.assign(s.style,i),Object.keys(n).forEach((function(t){var e=n[t];!1===e?s.removeAttribute(t):s.setAttribute(t,!0===e?"":e)})))}))},effect:function(t){var e=t.state,i={popper:{position:e.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(e.elements.popper.style,i.popper),e.styles=i,e.elements.arrow&&Object.assign(e.elements.arrow.style,i.arrow),function(){Object.keys(e.elements).forEach((function(t){var n=e.elements[t],s=e.attributes[t]||{},o=Object.keys(e.styles.hasOwnProperty(t)?e.styles[t]:i[t]).reduce((function(t,e){return t[e]="",t}),{});_e(n)&&pe(n)&&(Object.assign(n.style,o),Object.keys(s).forEach((function(t){n.removeAttribute(t)})))}))}},requires:["computeStyles"]};function ye(t){return t.split("-")[0]}var we=Math.max,Ae=Math.min,Ee=Math.round;function Te(){var t=navigator.userAgentData;return null!=t&&t.brands&&Array.isArray(t.brands)?t.brands.map((function(t){return t.brand+"/"+t.version})).join(" "):navigator.userAgent}function Ce(){return!/^((?!chrome|android).)*safari/i.test(Te())}function Oe(t,e,i){void 0===e&&(e=!1),void 0===i&&(i=!1);var n=t.getBoundingClientRect(),s=1,o=1;e&&_e(t)&&(s=t.offsetWidth>0&&Ee(n.width)/t.offsetWidth||1,o=t.offsetHeight>0&&Ee(n.height)/t.offsetHeight||1);var r=(ge(t)?me(t):window).visualViewport,a=!Ce()&&i,l=(n.left+(a&&r?r.offsetLeft:0))/s,c=(n.top+(a&&r?r.offsetTop:0))/o,h=n.width/s,d=n.height/o;return{width:h,height:d,top:c,right:l+h,bottom:c+d,left:l,x:l,y:c}}function xe(t){var e=Oe(t),i=t.offsetWidth,n=t.offsetHeight;return Math.abs(e.width-i)<=1&&(i=e.width),Math.abs(e.height-n)<=1&&(n=e.height),{x:t.offsetLeft,y:t.offsetTop,width:i,height:n}}function ke(t,e){var i=e.getRootNode&&e.getRootNode();if(t.contains(e))return!0;if(i&&be(i)){var n=e;do{if(n&&t.isSameNode(n))return!0;n=n.parentNode||n.host}while(n)}return!1}function Le(t){return me(t).getComputedStyle(t)}function Se(t){return["table","td","th"].indexOf(pe(t))>=0}function De(t){return((ge(t)?t.ownerDocument:t.document)||window.document).documentElement}function $e(t){return"html"===pe(t)?t:t.assignedSlot||t.parentNode||(be(t)?t.host:null)||De(t)}function Ie(t){return _e(t)&&"fixed"!==Le(t).position?t.offsetParent:null}function Ne(t){for(var e=me(t),i=Ie(t);i&&Se(i)&&"static"===Le(i).position;)i=Ie(i);return i&&("html"===pe(i)||"body"===pe(i)&&"static"===Le(i).position)?e:i||function(t){var e=/firefox/i.test(Te());if(/Trident/i.test(Te())&&_e(t)&&"fixed"===Le(t).position)return null;var i=$e(t);for(be(i)&&(i=i.host);_e(i)&&["html","body"].indexOf(pe(i))<0;){var n=Le(i);if("none"!==n.transform||"none"!==n.perspective||"paint"===n.contain||-1!==["transform","perspective"].indexOf(n.willChange)||e&&"filter"===n.willChange||e&&n.filter&&"none"!==n.filter)return i;i=i.parentNode}return null}(t)||e}function Pe(t){return["top","bottom"].indexOf(t)>=0?"x":"y"}function je(t,e,i){return we(t,Ae(e,i))}function Me(t){return Object.assign({},{top:0,right:0,bottom:0,left:0},t)}function Fe(t,e){return e.reduce((function(e,i){return e[i]=t,e}),{})}const He={name:"arrow",enabled:!0,phase:"main",fn:function(t){var e,i=t.state,n=t.name,s=t.options,o=i.elements.arrow,r=i.modifiersData.popperOffsets,a=ye(i.placement),l=Pe(a),c=[Qt,Kt].indexOf(a)>=0?"height":"width";if(o&&r){var h=function(t,e){return Me("number"!=typeof(t="function"==typeof t?t(Object.assign({},e.rects,{placement:e.placement})):t)?t:Fe(t,Yt))}(s.padding,i),d=xe(o),u="y"===l?qt:Qt,f="y"===l?Vt:Kt,p=i.rects.reference[c]+i.rects.reference[l]-r[l]-i.rects.popper[c],m=r[l]-i.rects.reference[l],g=Ne(o),_=g?"y"===l?g.clientHeight||0:g.clientWidth||0:0,b=p/2-m/2,v=h[u],y=_-d[c]-h[f],w=_/2-d[c]/2+b,A=je(v,w,y),E=l;i.modifiersData[n]=((e={})[E]=A,e.centerOffset=A-w,e)}},effect:function(t){var e=t.state,i=t.options.element,n=void 0===i?"[data-popper-arrow]":i;null!=n&&("string"!=typeof n||(n=e.elements.popper.querySelector(n)))&&ke(e.elements.popper,n)&&(e.elements.arrow=n)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function We(t){return t.split("-")[1]}var Be={top:"auto",right:"auto",bottom:"auto",left:"auto"};function ze(t){var e,i=t.popper,n=t.popperRect,s=t.placement,o=t.variation,r=t.offsets,a=t.position,l=t.gpuAcceleration,c=t.adaptive,h=t.roundOffsets,d=t.isFixed,u=r.x,f=void 0===u?0:u,p=r.y,m=void 0===p?0:p,g="function"==typeof h?h({x:f,y:m}):{x:f,y:m};f=g.x,m=g.y;var _=r.hasOwnProperty("x"),b=r.hasOwnProperty("y"),v=Qt,y=qt,w=window;if(c){var A=Ne(i),E="clientHeight",T="clientWidth";A===me(i)&&"static"!==Le(A=De(i)).position&&"absolute"===a&&(E="scrollHeight",T="scrollWidth"),(s===qt||(s===Qt||s===Kt)&&o===Gt)&&(y=Vt,m-=(d&&A===w&&w.visualViewport?w.visualViewport.height:A[E])-n.height,m*=l?1:-1),s!==Qt&&(s!==qt&&s!==Vt||o!==Gt)||(v=Kt,f-=(d&&A===w&&w.visualViewport?w.visualViewport.width:A[T])-n.width,f*=l?1:-1)}var C,O=Object.assign({position:a},c&&Be),x=!0===h?function(t,e){var i=t.x,n=t.y,s=e.devicePixelRatio||1;return{x:Ee(i*s)/s||0,y:Ee(n*s)/s||0}}({x:f,y:m},me(i)):{x:f,y:m};return f=x.x,m=x.y,l?Object.assign({},O,((C={})[y]=b?"0":"",C[v]=_?"0":"",C.transform=(w.devicePixelRatio||1)<=1?"translate("+f+"px, "+m+"px)":"translate3d("+f+"px, "+m+"px, 0)",C)):Object.assign({},O,((e={})[y]=b?m+"px":"",e[v]=_?f+"px":"",e.transform="",e))}const Re={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(t){var e=t.state,i=t.options,n=i.gpuAcceleration,s=void 0===n||n,o=i.adaptive,r=void 0===o||o,a=i.roundOffsets,l=void 0===a||a,c={placement:ye(e.placement),variation:We(e.placement),popper:e.elements.popper,popperRect:e.rects.popper,gpuAcceleration:s,isFixed:"fixed"===e.options.strategy};null!=e.modifiersData.popperOffsets&&(e.styles.popper=Object.assign({},e.styles.popper,ze(Object.assign({},c,{offsets:e.modifiersData.popperOffsets,position:e.options.strategy,adaptive:r,roundOffsets:l})))),null!=e.modifiersData.arrow&&(e.styles.arrow=Object.assign({},e.styles.arrow,ze(Object.assign({},c,{offsets:e.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:l})))),e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-placement":e.placement})},data:{}};var qe={passive:!0};const Ve={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(t){var e=t.state,i=t.instance,n=t.options,s=n.scroll,o=void 0===s||s,r=n.resize,a=void 0===r||r,l=me(e.elements.popper),c=[].concat(e.scrollParents.reference,e.scrollParents.popper);return o&&c.forEach((function(t){t.addEventListener("scroll",i.update,qe)})),a&&l.addEventListener("resize",i.update,qe),function(){o&&c.forEach((function(t){t.removeEventListener("scroll",i.update,qe)})),a&&l.removeEventListener("resize",i.update,qe)}},data:{}};var Ke={left:"right",right:"left",bottom:"top",top:"bottom"};function Qe(t){return t.replace(/left|right|bottom|top/g,(function(t){return Ke[t]}))}var Xe={start:"end",end:"start"};function Ye(t){return t.replace(/start|end/g,(function(t){return Xe[t]}))}function Ue(t){var e=me(t);return{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function Ge(t){return Oe(De(t)).left+Ue(t).scrollLeft}function Je(t){var e=Le(t),i=e.overflow,n=e.overflowX,s=e.overflowY;return/auto|scroll|overlay|hidden/.test(i+s+n)}function Ze(t){return["html","body","#document"].indexOf(pe(t))>=0?t.ownerDocument.body:_e(t)&&Je(t)?t:Ze($e(t))}function ti(t,e){var i;void 0===e&&(e=[]);var n=Ze(t),s=n===(null==(i=t.ownerDocument)?void 0:i.body),o=me(n),r=s?[o].concat(o.visualViewport||[],Je(n)?n:[]):n,a=e.concat(r);return s?a:a.concat(ti($e(r)))}function ei(t){return Object.assign({},t,{left:t.x,top:t.y,right:t.x+t.width,bottom:t.y+t.height})}function ii(t,e,i){return e===Zt?ei(function(t,e){var i=me(t),n=De(t),s=i.visualViewport,o=n.clientWidth,r=n.clientHeight,a=0,l=0;if(s){o=s.width,r=s.height;var c=Ce();(c||!c&&"fixed"===e)&&(a=s.offsetLeft,l=s.offsetTop)}return{width:o,height:r,x:a+Ge(t),y:l}}(t,i)):ge(e)?function(t,e){var i=Oe(t,!1,"fixed"===e);return i.top=i.top+t.clientTop,i.left=i.left+t.clientLeft,i.bottom=i.top+t.clientHeight,i.right=i.left+t.clientWidth,i.width=t.clientWidth,i.height=t.clientHeight,i.x=i.left,i.y=i.top,i}(e,i):ei(function(t){var e,i=De(t),n=Ue(t),s=null==(e=t.ownerDocument)?void 0:e.body,o=we(i.scrollWidth,i.clientWidth,s?s.scrollWidth:0,s?s.clientWidth:0),r=we(i.scrollHeight,i.clientHeight,s?s.scrollHeight:0,s?s.clientHeight:0),a=-n.scrollLeft+Ge(t),l=-n.scrollTop;return"rtl"===Le(s||i).direction&&(a+=we(i.clientWidth,s?s.clientWidth:0)-o),{width:o,height:r,x:a,y:l}}(De(t)))}function ni(t){var e,i=t.reference,n=t.element,s=t.placement,o=s?ye(s):null,r=s?We(s):null,a=i.x+i.width/2-n.width/2,l=i.y+i.height/2-n.height/2;switch(o){case qt:e={x:a,y:i.y-n.height};break;case Vt:e={x:a,y:i.y+i.height};break;case Kt:e={x:i.x+i.width,y:l};break;case Qt:e={x:i.x-n.width,y:l};break;default:e={x:i.x,y:i.y}}var c=o?Pe(o):null;if(null!=c){var h="y"===c?"height":"width";switch(r){case Ut:e[c]=e[c]-(i[h]/2-n[h]/2);break;case Gt:e[c]=e[c]+(i[h]/2-n[h]/2)}}return e}function si(t,e){void 0===e&&(e={});var i=e,n=i.placement,s=void 0===n?t.placement:n,o=i.strategy,r=void 0===o?t.strategy:o,a=i.boundary,l=void 0===a?Jt:a,c=i.rootBoundary,h=void 0===c?Zt:c,d=i.elementContext,u=void 0===d?te:d,f=i.altBoundary,p=void 0!==f&&f,m=i.padding,g=void 0===m?0:m,_=Me("number"!=typeof g?g:Fe(g,Yt)),b=u===te?ee:te,v=t.rects.popper,y=t.elements[p?b:u],w=function(t,e,i,n){var s="clippingParents"===e?function(t){var e=ti($e(t)),i=["absolute","fixed"].indexOf(Le(t).position)>=0&&_e(t)?Ne(t):t;return ge(i)?e.filter((function(t){return ge(t)&&ke(t,i)&&"body"!==pe(t)})):[]}(t):[].concat(e),o=[].concat(s,[i]),r=o[0],a=o.reduce((function(e,i){var s=ii(t,i,n);return e.top=we(s.top,e.top),e.right=Ae(s.right,e.right),e.bottom=Ae(s.bottom,e.bottom),e.left=we(s.left,e.left),e}),ii(t,r,n));return a.width=a.right-a.left,a.height=a.bottom-a.top,a.x=a.left,a.y=a.top,a}(ge(y)?y:y.contextElement||De(t.elements.popper),l,h,r),A=Oe(t.elements.reference),E=ni({reference:A,element:v,placement:s}),T=ei(Object.assign({},v,E)),C=u===te?T:A,O={top:w.top-C.top+_.top,bottom:C.bottom-w.bottom+_.bottom,left:w.left-C.left+_.left,right:C.right-w.right+_.right},x=t.modifiersData.offset;if(u===te&&x){var k=x[s];Object.keys(O).forEach((function(t){var e=[Kt,Vt].indexOf(t)>=0?1:-1,i=[qt,Vt].indexOf(t)>=0?"y":"x";O[t]+=k[i]*e}))}return O}function oi(t,e){void 0===e&&(e={});var i=e,n=i.placement,s=i.boundary,o=i.rootBoundary,r=i.padding,a=i.flipVariations,l=i.allowedAutoPlacements,c=void 0===l?ne:l,h=We(n),d=h?a?ie:ie.filter((function(t){return We(t)===h})):Yt,u=d.filter((function(t){return c.indexOf(t)>=0}));0===u.length&&(u=d);var f=u.reduce((function(e,i){return e[i]=si(t,{placement:i,boundary:s,rootBoundary:o,padding:r})[ye(i)],e}),{});return Object.keys(f).sort((function(t,e){return f[t]-f[e]}))}const ri={name:"flip",enabled:!0,phase:"main",fn:function(t){var e=t.state,i=t.options,n=t.name;if(!e.modifiersData[n]._skip){for(var s=i.mainAxis,o=void 0===s||s,r=i.altAxis,a=void 0===r||r,l=i.fallbackPlacements,c=i.padding,h=i.boundary,d=i.rootBoundary,u=i.altBoundary,f=i.flipVariations,p=void 0===f||f,m=i.allowedAutoPlacements,g=e.options.placement,_=ye(g),b=l||(_!==g&&p?function(t){if(ye(t)===Xt)return[];var e=Qe(t);return[Ye(t),e,Ye(e)]}(g):[Qe(g)]),v=[g].concat(b).reduce((function(t,i){return t.concat(ye(i)===Xt?oi(e,{placement:i,boundary:h,rootBoundary:d,padding:c,flipVariations:p,allowedAutoPlacements:m}):i)}),[]),y=e.rects.reference,w=e.rects.popper,A=new Map,E=!0,T=v[0],C=0;C<v.length;C++){var O=v[C],x=ye(O),k=We(O)===Ut,L=[qt,Vt].indexOf(x)>=0,S=L?"width":"height",D=si(e,{placement:O,boundary:h,rootBoundary:d,altBoundary:u,padding:c}),$=L?k?Kt:Qt:k?Vt:qt;y[S]>w[S]&&($=Qe($));var I=Qe($),N=[];if(o&&N.push(D[x]<=0),a&&N.push(D[$]<=0,D[I]<=0),N.every((function(t){return t}))){T=O,E=!1;break}A.set(O,N)}if(E)for(var P=function(t){var e=v.find((function(e){var i=A.get(e);if(i)return i.slice(0,t).every((function(t){return t}))}));if(e)return T=e,"break"},j=p?3:1;j>0&&"break"!==P(j);j--);e.placement!==T&&(e.modifiersData[n]._skip=!0,e.placement=T,e.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}};function ai(t,e,i){return void 0===i&&(i={x:0,y:0}),{top:t.top-e.height-i.y,right:t.right-e.width+i.x,bottom:t.bottom-e.height+i.y,left:t.left-e.width-i.x}}function li(t){return[qt,Kt,Vt,Qt].some((function(e){return t[e]>=0}))}const ci={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(t){var e=t.state,i=t.name,n=e.rects.reference,s=e.rects.popper,o=e.modifiersData.preventOverflow,r=si(e,{elementContext:"reference"}),a=si(e,{altBoundary:!0}),l=ai(r,n),c=ai(a,s,o),h=li(l),d=li(c);e.modifiersData[i]={referenceClippingOffsets:l,popperEscapeOffsets:c,isReferenceHidden:h,hasPopperEscaped:d},e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-reference-hidden":h,"data-popper-escaped":d})}},hi={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(t){var e=t.state,i=t.options,n=t.name,s=i.offset,o=void 0===s?[0,0]:s,r=ne.reduce((function(t,i){return t[i]=function(t,e,i){var n=ye(t),s=[Qt,qt].indexOf(n)>=0?-1:1,o="function"==typeof i?i(Object.assign({},e,{placement:t})):i,r=o[0],a=o[1];return r=r||0,a=(a||0)*s,[Qt,Kt].indexOf(n)>=0?{x:a,y:r}:{x:r,y:a}}(i,e.rects,o),t}),{}),a=r[e.placement],l=a.x,c=a.y;null!=e.modifiersData.popperOffsets&&(e.modifiersData.popperOffsets.x+=l,e.modifiersData.popperOffsets.y+=c),e.modifiersData[n]=r}},di={name:"popperOffsets",enabled:!0,phase:"read",fn:function(t){var e=t.state,i=t.name;e.modifiersData[i]=ni({reference:e.rects.reference,element:e.rects.popper,placement:e.placement})},data:{}},ui={name:"preventOverflow",enabled:!0,phase:"main",fn:function(t){var e=t.state,i=t.options,n=t.name,s=i.mainAxis,o=void 0===s||s,r=i.altAxis,a=void 0!==r&&r,l=i.boundary,c=i.rootBoundary,h=i.altBoundary,d=i.padding,u=i.tether,f=void 0===u||u,p=i.tetherOffset,m=void 0===p?0:p,g=si(e,{boundary:l,rootBoundary:c,padding:d,altBoundary:h}),_=ye(e.placement),b=We(e.placement),v=!b,y=Pe(_),w="x"===y?"y":"x",A=e.modifiersData.popperOffsets,E=e.rects.reference,T=e.rects.popper,C="function"==typeof m?m(Object.assign({},e.rects,{placement:e.placement})):m,O="number"==typeof C?{mainAxis:C,altAxis:C}:Object.assign({mainAxis:0,altAxis:0},C),x=e.modifiersData.offset?e.modifiersData.offset[e.placement]:null,k={x:0,y:0};if(A){if(o){var L,S="y"===y?qt:Qt,D="y"===y?Vt:Kt,$="y"===y?"height":"width",I=A[y],N=I+g[S],P=I-g[D],j=f?-T[$]/2:0,M=b===Ut?E[$]:T[$],F=b===Ut?-T[$]:-E[$],H=e.elements.arrow,W=f&&H?xe(H):{width:0,height:0},B=e.modifiersData["arrow#persistent"]?e.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},z=B[S],R=B[D],q=je(0,E[$],W[$]),V=v?E[$]/2-j-q-z-O.mainAxis:M-q-z-O.mainAxis,K=v?-E[$]/2+j+q+R+O.mainAxis:F+q+R+O.mainAxis,Q=e.elements.arrow&&Ne(e.elements.arrow),X=Q?"y"===y?Q.clientTop||0:Q.clientLeft||0:0,Y=null!=(L=null==x?void 0:x[y])?L:0,U=I+K-Y,G=je(f?Ae(N,I+V-Y-X):N,I,f?we(P,U):P);A[y]=G,k[y]=G-I}if(a){var J,Z="x"===y?qt:Qt,tt="x"===y?Vt:Kt,et=A[w],it="y"===w?"height":"width",nt=et+g[Z],st=et-g[tt],ot=-1!==[qt,Qt].indexOf(_),rt=null!=(J=null==x?void 0:x[w])?J:0,at=ot?nt:et-E[it]-T[it]-rt+O.altAxis,lt=ot?et+E[it]+T[it]-rt-O.altAxis:st,ct=f&&ot?function(t,e,i){var n=je(t,e,i);return n>i?i:n}(at,et,lt):je(f?at:nt,et,f?lt:st);A[w]=ct,k[w]=ct-et}e.modifiersData[n]=k}},requiresIfExists:["offset"]};function fi(t,e,i){void 0===i&&(i=!1);var n,s,o=_e(e),r=_e(e)&&function(t){var e=t.getBoundingClientRect(),i=Ee(e.width)/t.offsetWidth||1,n=Ee(e.height)/t.offsetHeight||1;return 1!==i||1!==n}(e),a=De(e),l=Oe(t,r,i),c={scrollLeft:0,scrollTop:0},h={x:0,y:0};return(o||!o&&!i)&&(("body"!==pe(e)||Je(a))&&(c=(n=e)!==me(n)&&_e(n)?{scrollLeft:(s=n).scrollLeft,scrollTop:s.scrollTop}:Ue(n)),_e(e)?((h=Oe(e,!0)).x+=e.clientLeft,h.y+=e.clientTop):a&&(h.x=Ge(a))),{x:l.left+c.scrollLeft-h.x,y:l.top+c.scrollTop-h.y,width:l.width,height:l.height}}function pi(t){var e=new Map,i=new Set,n=[];function s(t){i.add(t.name),[].concat(t.requires||[],t.requiresIfExists||[]).forEach((function(t){if(!i.has(t)){var n=e.get(t);n&&s(n)}})),n.push(t)}return t.forEach((function(t){e.set(t.name,t)})),t.forEach((function(t){i.has(t.name)||s(t)})),n}var mi={placement:"bottom",modifiers:[],strategy:"absolute"};function gi(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return!e.some((function(t){return!(t&&"function"==typeof t.getBoundingClientRect)}))}function _i(t){void 0===t&&(t={});var e=t,i=e.defaultModifiers,n=void 0===i?[]:i,s=e.defaultOptions,o=void 0===s?mi:s;return function(t,e,i){void 0===i&&(i=o);var s,r,a={placement:"bottom",orderedModifiers:[],options:Object.assign({},mi,o),modifiersData:{},elements:{reference:t,popper:e},attributes:{},styles:{}},l=[],c=!1,h={state:a,setOptions:function(i){var s="function"==typeof i?i(a.options):i;d(),a.options=Object.assign({},o,a.options,s),a.scrollParents={reference:ge(t)?ti(t):t.contextElement?ti(t.contextElement):[],popper:ti(e)};var r,c,u=function(t){var e=pi(t);return fe.reduce((function(t,i){return t.concat(e.filter((function(t){return t.phase===i})))}),[])}((r=[].concat(n,a.options.modifiers),c=r.reduce((function(t,e){var i=t[e.name];return t[e.name]=i?Object.assign({},i,e,{options:Object.assign({},i.options,e.options),data:Object.assign({},i.data,e.data)}):e,t}),{}),Object.keys(c).map((function(t){return c[t]}))));return a.orderedModifiers=u.filter((function(t){return t.enabled})),a.orderedModifiers.forEach((function(t){var e=t.name,i=t.options,n=void 0===i?{}:i,s=t.effect;if("function"==typeof s){var o=s({state:a,name:e,instance:h,options:n});l.push(o||function(){})}})),h.update()},forceUpdate:function(){if(!c){var t=a.elements,e=t.reference,i=t.popper;if(gi(e,i)){a.rects={reference:fi(e,Ne(i),"fixed"===a.options.strategy),popper:xe(i)},a.reset=!1,a.placement=a.options.placement,a.orderedModifiers.forEach((function(t){return a.modifiersData[t.name]=Object.assign({},t.data)}));for(var n=0;n<a.orderedModifiers.length;n++)if(!0!==a.reset){var s=a.orderedModifiers[n],o=s.fn,r=s.options,l=void 0===r?{}:r,d=s.name;"function"==typeof o&&(a=o({state:a,options:l,name:d,instance:h})||a)}else a.reset=!1,n=-1}}},update:(s=function(){return new Promise((function(t){h.forceUpdate(),t(a)}))},function(){return r||(r=new Promise((function(t){Promise.resolve().then((function(){r=void 0,t(s())}))}))),r}),destroy:function(){d(),c=!0}};if(!gi(t,e))return h;function d(){l.forEach((function(t){return t()})),l=[]}return h.setOptions(i).then((function(t){!c&&i.onFirstUpdate&&i.onFirstUpdate(t)})),h}}var bi=_i(),vi=_i({defaultModifiers:[Ve,di,Re,ve]}),yi=_i({defaultModifiers:[Ve,di,Re,ve,hi,ri,ui,He,ci]});const wi=Object.freeze(Object.defineProperty({__proto__:null,afterMain:ce,afterRead:re,afterWrite:ue,applyStyles:ve,arrow:He,auto:Xt,basePlacements:Yt,beforeMain:ae,beforeRead:se,beforeWrite:he,bottom:Vt,clippingParents:Jt,computeStyles:Re,createPopper:yi,createPopperBase:bi,createPopperLite:vi,detectOverflow:si,end:Gt,eventListeners:Ve,flip:ri,hide:ci,left:Qt,main:le,modifierPhases:fe,offset:hi,placements:ne,popper:te,popperGenerator:_i,popperOffsets:di,preventOverflow:ui,read:oe,reference:ee,right:Kt,start:Ut,top:qt,variationPlacements:ie,viewport:Zt,write:de},Symbol.toStringTag,{value:"Module"})),Ai="dropdown",Ei=".bs.dropdown",Ti=".data-api",Ci="ArrowUp",Oi="ArrowDown",xi=`hide${Ei}`,ki=`hidden${Ei}`,Li=`show${Ei}`,Si=`shown${Ei}`,Di=`click${Ei}${Ti}`,$i=`keydown${Ei}${Ti}`,Ii=`keyup${Ei}${Ti}`,Ni="show",Pi='[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)',ji=`${Pi}.${Ni}`,Mi=".dropdown-menu",Fi=p()?"top-end":"top-start",Hi=p()?"top-start":"top-end",Wi=p()?"bottom-end":"bottom-start",Bi=p()?"bottom-start":"bottom-end",zi=p()?"left-start":"right-start",Ri=p()?"right-start":"left-start",qi={autoClose:!0,boundary:"clippingParents",display:"dynamic",offset:[0,2],popperConfig:null,reference:"toggle"},Vi={autoClose:"(boolean|string)",boundary:"(string|element)",display:"string",offset:"(array|string|function)",popperConfig:"(null|object|function)",reference:"(string|element|object)"};class Ki extends W{constructor(t,e){super(t,e),this._popper=null,this._parent=this._element.parentNode,this._menu=z.next(this._element,Mi)[0]||z.prev(this._element,Mi)[0]||z.findOne(Mi,this._parent),this._inNavbar=this._detectNavbar()}static get Default(){return qi}static get DefaultType(){return Vi}static get NAME(){return Ai}toggle(){return this._isShown()?this.hide():this.show()}show(){if(l(this._element)||this._isShown())return;const t={relatedTarget:this._element};if(!N.trigger(this._element,Li,t).defaultPrevented){if(this._createPopper(),"ontouchstart"in document.documentElement&&!this._parent.closest(".navbar-nav"))for(const t of[].concat(...document.body.children))N.on(t,"mouseover",h);this._element.focus(),this._element.setAttribute("aria-expanded",!0),this._menu.classList.add(Ni),this._element.classList.add(Ni),N.trigger(this._element,Si,t)}}hide(){if(l(this._element)||!this._isShown())return;const t={relatedTarget:this._element};this._completeHide(t)}dispose(){this._popper&&this._popper.destroy(),super.dispose()}update(){this._inNavbar=this._detectNavbar(),this._popper&&this._popper.update()}_completeHide(t){if(!N.trigger(this._element,xi,t).defaultPrevented){if("ontouchstart"in document.documentElement)for(const t of[].concat(...document.body.children))N.off(t,"mouseover",h);this._popper&&this._popper.destroy(),this._menu.classList.remove(Ni),this._element.classList.remove(Ni),this._element.setAttribute("aria-expanded","false"),F.removeDataAttribute(this._menu,"popper"),N.trigger(this._element,ki,t),this._element.focus()}}_getConfig(t){if("object"==typeof(t=super._getConfig(t)).reference&&!o(t.reference)&&"function"!=typeof t.reference.getBoundingClientRect)throw new TypeError(`${Ai.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);return t}_createPopper(){if(void 0===wi)throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org/docs/v2/)");let t=this._element;"parent"===this._config.reference?t=this._parent:o(this._config.reference)?t=r(this._config.reference):"object"==typeof this._config.reference&&(t=this._config.reference);const e=this._getPopperConfig();this._popper=yi(t,this._menu,e)}_isShown(){return this._menu.classList.contains(Ni)}_getPlacement(){const t=this._parent;if(t.classList.contains("dropend"))return zi;if(t.classList.contains("dropstart"))return Ri;if(t.classList.contains("dropup-center"))return"top";if(t.classList.contains("dropdown-center"))return"bottom";const e="end"===getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();return t.classList.contains("dropup")?e?Hi:Fi:e?Bi:Wi}_detectNavbar(){return null!==this._element.closest(".navbar")}_getOffset(){const{offset:t}=this._config;return"string"==typeof t?t.split(",").map((t=>Number.parseInt(t,10))):"function"==typeof t?e=>t(e,this._element):t}_getPopperConfig(){const t={placement:this._getPlacement(),modifiers:[{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"offset",options:{offset:this._getOffset()}}]};return(this._inNavbar||"static"===this._config.display)&&(F.setDataAttribute(this._menu,"popper","static"),t.modifiers=[{name:"applyStyles",enabled:!1}]),{...t,...g(this._config.popperConfig,[void 0,t])}}_selectMenuItem({key:t,target:e}){const i=z.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",this._menu).filter((t=>a(t)));i.length&&b(i,e,t===Oi,!i.includes(e)).focus()}static jQueryInterface(t){return this.each((function(){const e=Ki.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}static clearMenus(t){if(2===t.button||"keyup"===t.type&&"Tab"!==t.key)return;const e=z.find(ji);for(const i of e){const e=Ki.getInstance(i);if(!e||!1===e._config.autoClose)continue;const n=t.composedPath(),s=n.includes(e._menu);if(n.includes(e._element)||"inside"===e._config.autoClose&&!s||"outside"===e._config.autoClose&&s)continue;if(e._menu.contains(t.target)&&("keyup"===t.type&&"Tab"===t.key||/input|select|option|textarea|form/i.test(t.target.tagName)))continue;const o={relatedTarget:e._element};"click"===t.type&&(o.clickEvent=t),e._completeHide(o)}}static dataApiKeydownHandler(t){const e=/input|textarea/i.test(t.target.tagName),i="Escape"===t.key,n=[Ci,Oi].includes(t.key);if(!n&&!i)return;if(e&&!i)return;t.preventDefault();const s=this.matches(Pi)?this:z.prev(this,Pi)[0]||z.next(this,Pi)[0]||z.findOne(Pi,t.delegateTarget.parentNode),o=Ki.getOrCreateInstance(s);if(n)return t.stopPropagation(),o.show(),void o._selectMenuItem(t);o._isShown()&&(t.stopPropagation(),o.hide(),s.focus())}}N.on(document,$i,Pi,Ki.dataApiKeydownHandler),N.on(document,$i,Mi,Ki.dataApiKeydownHandler),N.on(document,Di,Ki.clearMenus),N.on(document,Ii,Ki.clearMenus),N.on(document,Di,Pi,(function(t){t.preventDefault(),Ki.getOrCreateInstance(this).toggle()})),m(Ki);const Qi="backdrop",Xi="show",Yi=`mousedown.bs.${Qi}`,Ui={className:"modal-backdrop",clickCallback:null,isAnimated:!1,isVisible:!0,rootElement:"body"},Gi={className:"string",clickCallback:"(function|null)",isAnimated:"boolean",isVisible:"boolean",rootElement:"(element|string)"};class Ji extends H{constructor(t){super(),this._config=this._getConfig(t),this._isAppended=!1,this._element=null}static get Default(){return Ui}static get DefaultType(){return Gi}static get NAME(){return Qi}show(t){if(!this._config.isVisible)return void g(t);this._append();const e=this._getElement();this._config.isAnimated&&d(e),e.classList.add(Xi),this._emulateAnimation((()=>{g(t)}))}hide(t){this._config.isVisible?(this._getElement().classList.remove(Xi),this._emulateAnimation((()=>{this.dispose(),g(t)}))):g(t)}dispose(){this._isAppended&&(N.off(this._element,Yi),this._element.remove(),this._isAppended=!1)}_getElement(){if(!this._element){const t=document.createElement("div");t.className=this._config.className,this._config.isAnimated&&t.classList.add("fade"),this._element=t}return this._element}_configAfterMerge(t){return t.rootElement=r(t.rootElement),t}_append(){if(this._isAppended)return;const t=this._getElement();this._config.rootElement.append(t),N.on(t,Yi,(()=>{g(this._config.clickCallback)})),this._isAppended=!0}_emulateAnimation(t){_(t,this._getElement(),this._config.isAnimated)}}const Zi=".bs.focustrap",tn=`focusin${Zi}`,en=`keydown.tab${Zi}`,nn="backward",sn={autofocus:!0,trapElement:null},on={autofocus:"boolean",trapElement:"element"};class rn extends H{constructor(t){super(),this._config=this._getConfig(t),this._isActive=!1,this._lastTabNavDirection=null}static get Default(){return sn}static get DefaultType(){return on}static get NAME(){return"focustrap"}activate(){this._isActive||(this._config.autofocus&&this._config.trapElement.focus(),N.off(document,Zi),N.on(document,tn,(t=>this._handleFocusin(t))),N.on(document,en,(t=>this._handleKeydown(t))),this._isActive=!0)}deactivate(){this._isActive&&(this._isActive=!1,N.off(document,Zi))}_handleFocusin(t){const{trapElement:e}=this._config;if(t.target===document||t.target===e||e.contains(t.target))return;const i=z.focusableChildren(e);0===i.length?e.focus():this._lastTabNavDirection===nn?i[i.length-1].focus():i[0].focus()}_handleKeydown(t){"Tab"===t.key&&(this._lastTabNavDirection=t.shiftKey?nn:"forward")}}const an=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",ln=".sticky-top",cn="padding-right",hn="margin-right";class dn{constructor(){this._element=document.body}getWidth(){const t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}hide(){const t=this.getWidth();this._disableOverFlow(),this._setElementAttributes(this._element,cn,(e=>e+t)),this._setElementAttributes(an,cn,(e=>e+t)),this._setElementAttributes(ln,hn,(e=>e-t))}reset(){this._resetElementAttributes(this._element,"overflow"),this._resetElementAttributes(this._element,cn),this._resetElementAttributes(an,cn),this._resetElementAttributes(ln,hn)}isOverflowing(){return this.getWidth()>0}_disableOverFlow(){this._saveInitialAttribute(this._element,"overflow"),this._element.style.overflow="hidden"}_setElementAttributes(t,e,i){const n=this.getWidth();this._applyManipulationCallback(t,(t=>{if(t!==this._element&&window.innerWidth>t.clientWidth+n)return;this._saveInitialAttribute(t,e);const s=window.getComputedStyle(t).getPropertyValue(e);t.style.setProperty(e,`${i(Number.parseFloat(s))}px`)}))}_saveInitialAttribute(t,e){const i=t.style.getPropertyValue(e);i&&F.setDataAttribute(t,e,i)}_resetElementAttributes(t,e){this._applyManipulationCallback(t,(t=>{const i=F.getDataAttribute(t,e);null!==i?(F.removeDataAttribute(t,e),t.style.setProperty(e,i)):t.style.removeProperty(e)}))}_applyManipulationCallback(t,e){if(o(t))e(t);else for(const i of z.find(t,this._element))e(i)}}const un=".bs.modal",fn=`hide${un}`,pn=`hidePrevented${un}`,mn=`hidden${un}`,gn=`show${un}`,_n=`shown${un}`,bn=`resize${un}`,vn=`click.dismiss${un}`,yn=`mousedown.dismiss${un}`,wn=`keydown.dismiss${un}`,An=`click${un}.data-api`,En="modal-open",Tn="show",Cn="modal-static",On={backdrop:!0,focus:!0,keyboard:!0},xn={backdrop:"(boolean|string)",focus:"boolean",keyboard:"boolean"};class kn extends W{constructor(t,e){super(t,e),this._dialog=z.findOne(".modal-dialog",this._element),this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._isShown=!1,this._isTransitioning=!1,this._scrollBar=new dn,this._addEventListeners()}static get Default(){return On}static get DefaultType(){return xn}static get NAME(){return"modal"}toggle(t){return this._isShown?this.hide():this.show(t)}show(t){this._isShown||this._isTransitioning||N.trigger(this._element,gn,{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._isTransitioning=!0,this._scrollBar.hide(),document.body.classList.add(En),this._adjustDialog(),this._backdrop.show((()=>this._showElement(t))))}hide(){this._isShown&&!this._isTransitioning&&(N.trigger(this._element,fn).defaultPrevented||(this._isShown=!1,this._isTransitioning=!0,this._focustrap.deactivate(),this._element.classList.remove(Tn),this._queueCallback((()=>this._hideModal()),this._element,this._isAnimated())))}dispose(){N.off(window,un),N.off(this._dialog,un),this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}handleUpdate(){this._adjustDialog()}_initializeBackDrop(){return new Ji({isVisible:Boolean(this._config.backdrop),isAnimated:this._isAnimated()})}_initializeFocusTrap(){return new rn({trapElement:this._element})}_showElement(t){document.body.contains(this._element)||document.body.append(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.scrollTop=0;const e=z.findOne(".modal-body",this._dialog);e&&(e.scrollTop=0),d(this._element),this._element.classList.add(Tn),this._queueCallback((()=>{this._config.focus&&this._focustrap.activate(),this._isTransitioning=!1,N.trigger(this._element,_n,{relatedTarget:t})}),this._dialog,this._isAnimated())}_addEventListeners(){N.on(this._element,wn,(t=>{"Escape"===t.key&&(this._config.keyboard?this.hide():this._triggerBackdropTransition())})),N.on(window,bn,(()=>{this._isShown&&!this._isTransitioning&&this._adjustDialog()})),N.on(this._element,yn,(t=>{N.one(this._element,vn,(e=>{this._element===t.target&&this._element===e.target&&("static"!==this._config.backdrop?this._config.backdrop&&this.hide():this._triggerBackdropTransition())}))}))}_hideModal(){this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._backdrop.hide((()=>{document.body.classList.remove(En),this._resetAdjustments(),this._scrollBar.reset(),N.trigger(this._element,mn)}))}_isAnimated(){return this._element.classList.contains("fade")}_triggerBackdropTransition(){if(N.trigger(this._element,pn).defaultPrevented)return;const t=this._element.scrollHeight>document.documentElement.clientHeight,e=this._element.style.overflowY;"hidden"===e||this._element.classList.contains(Cn)||(t||(this._element.style.overflowY="hidden"),this._element.classList.add(Cn),this._queueCallback((()=>{this._element.classList.remove(Cn),this._queueCallback((()=>{this._element.style.overflowY=e}),this._dialog)}),this._dialog),this._element.focus())}_adjustDialog(){const t=this._element.scrollHeight>document.documentElement.clientHeight,e=this._scrollBar.getWidth(),i=e>0;if(i&&!t){const t=p()?"paddingLeft":"paddingRight";this._element.style[t]=`${e}px`}if(!i&&t){const t=p()?"paddingRight":"paddingLeft";this._element.style[t]=`${e}px`}}_resetAdjustments(){this._element.style.paddingLeft="",this._element.style.paddingRight=""}static jQueryInterface(t,e){return this.each((function(){const i=kn.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===i[t])throw new TypeError(`No method named "${t}"`);i[t](e)}}))}}N.on(document,An,'[data-bs-toggle="modal"]',(function(t){const e=z.getElementFromSelector(this);["A","AREA"].includes(this.tagName)&&t.preventDefault(),N.one(e,gn,(t=>{t.defaultPrevented||N.one(e,mn,(()=>{a(this)&&this.focus()}))}));const i=z.findOne(".modal.show");i&&kn.getInstance(i).hide(),kn.getOrCreateInstance(e).toggle(this)})),R(kn),m(kn);const Ln=".bs.offcanvas",Sn=".data-api",Dn=`load${Ln}${Sn}`,$n="show",In="showing",Nn="hiding",Pn=".offcanvas.show",jn=`show${Ln}`,Mn=`shown${Ln}`,Fn=`hide${Ln}`,Hn=`hidePrevented${Ln}`,Wn=`hidden${Ln}`,Bn=`resize${Ln}`,zn=`click${Ln}${Sn}`,Rn=`keydown.dismiss${Ln}`,qn={backdrop:!0,keyboard:!0,scroll:!1},Vn={backdrop:"(boolean|string)",keyboard:"boolean",scroll:"boolean"};class Kn extends W{constructor(t,e){super(t,e),this._isShown=!1,this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._addEventListeners()}static get Default(){return qn}static get DefaultType(){return Vn}static get NAME(){return"offcanvas"}toggle(t){return this._isShown?this.hide():this.show(t)}show(t){this._isShown||N.trigger(this._element,jn,{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._backdrop.show(),this._config.scroll||(new dn).hide(),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.classList.add(In),this._queueCallback((()=>{this._config.scroll&&!this._config.backdrop||this._focustrap.activate(),this._element.classList.add($n),this._element.classList.remove(In),N.trigger(this._element,Mn,{relatedTarget:t})}),this._element,!0))}hide(){this._isShown&&(N.trigger(this._element,Fn).defaultPrevented||(this._focustrap.deactivate(),this._element.blur(),this._isShown=!1,this._element.classList.add(Nn),this._backdrop.hide(),this._queueCallback((()=>{this._element.classList.remove($n,Nn),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._config.scroll||(new dn).reset(),N.trigger(this._element,Wn)}),this._element,!0)))}dispose(){this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}_initializeBackDrop(){const t=Boolean(this._config.backdrop);return new Ji({className:"offcanvas-backdrop",isVisible:t,isAnimated:!0,rootElement:this._element.parentNode,clickCallback:t?()=>{"static"!==this._config.backdrop?this.hide():N.trigger(this._element,Hn)}:null})}_initializeFocusTrap(){return new rn({trapElement:this._element})}_addEventListeners(){N.on(this._element,Rn,(t=>{"Escape"===t.key&&(this._config.keyboard?this.hide():N.trigger(this._element,Hn))}))}static jQueryInterface(t){return this.each((function(){const e=Kn.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t](this)}}))}}N.on(document,zn,'[data-bs-toggle="offcanvas"]',(function(t){const e=z.getElementFromSelector(this);if(["A","AREA"].includes(this.tagName)&&t.preventDefault(),l(this))return;N.one(e,Wn,(()=>{a(this)&&this.focus()}));const i=z.findOne(Pn);i&&i!==e&&Kn.getInstance(i).hide(),Kn.getOrCreateInstance(e).toggle(this)})),N.on(window,Dn,(()=>{for(const t of z.find(Pn))Kn.getOrCreateInstance(t).show()})),N.on(window,Bn,(()=>{for(const t of z.find("[aria-modal][class*=show][class*=offcanvas-]"))"fixed"!==getComputedStyle(t).position&&Kn.getOrCreateInstance(t).hide()})),R(Kn),m(Kn);const Qn={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],dd:[],div:[],dl:[],dt:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},Xn=new Set(["background","cite","href","itemtype","longdesc","poster","src","xlink:href"]),Yn=/^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i,Un=(t,e)=>{const i=t.nodeName.toLowerCase();return e.includes(i)?!Xn.has(i)||Boolean(Yn.test(t.nodeValue)):e.filter((t=>t instanceof RegExp)).some((t=>t.test(i)))},Gn={allowList:Qn,content:{},extraClass:"",html:!1,sanitize:!0,sanitizeFn:null,template:"<div></div>"},Jn={allowList:"object",content:"object",extraClass:"(string|function)",html:"boolean",sanitize:"boolean",sanitizeFn:"(null|function)",template:"string"},Zn={entry:"(string|element|function|null)",selector:"(string|element)"};class ts extends H{constructor(t){super(),this._config=this._getConfig(t)}static get Default(){return Gn}static get DefaultType(){return Jn}static get NAME(){return"TemplateFactory"}getContent(){return Object.values(this._config.content).map((t=>this._resolvePossibleFunction(t))).filter(Boolean)}hasContent(){return this.getContent().length>0}changeContent(t){return this._checkContent(t),this._config.content={...this._config.content,...t},this}toHtml(){const t=document.createElement("div");t.innerHTML=this._maybeSanitize(this._config.template);for(const[e,i]of Object.entries(this._config.content))this._setContent(t,i,e);const e=t.children[0],i=this._resolvePossibleFunction(this._config.extraClass);return i&&e.classList.add(...i.split(" ")),e}_typeCheckConfig(t){super._typeCheckConfig(t),this._checkContent(t.content)}_checkContent(t){for(const[e,i]of Object.entries(t))super._typeCheckConfig({selector:e,entry:i},Zn)}_setContent(t,e,i){const n=z.findOne(i,t);n&&((e=this._resolvePossibleFunction(e))?o(e)?this._putElementInTemplate(r(e),n):this._config.html?n.innerHTML=this._maybeSanitize(e):n.textContent=e:n.remove())}_maybeSanitize(t){return this._config.sanitize?function(t,e,i){if(!t.length)return t;if(i&&"function"==typeof i)return i(t);const n=(new window.DOMParser).parseFromString(t,"text/html"),s=[].concat(...n.body.querySelectorAll("*"));for(const t of s){const i=t.nodeName.toLowerCase();if(!Object.keys(e).includes(i)){t.remove();continue}const n=[].concat(...t.attributes),s=[].concat(e["*"]||[],e[i]||[]);for(const e of n)Un(e,s)||t.removeAttribute(e.nodeName)}return n.body.innerHTML}(t,this._config.allowList,this._config.sanitizeFn):t}_resolvePossibleFunction(t){return g(t,[void 0,this])}_putElementInTemplate(t,e){if(this._config.html)return e.innerHTML="",void e.append(t);e.textContent=t.textContent}}const es=new Set(["sanitize","allowList","sanitizeFn"]),is="fade",ns="show",ss=".tooltip-inner",os=".modal",rs="hide.bs.modal",as="hover",ls="focus",cs={AUTO:"auto",TOP:"top",RIGHT:p()?"left":"right",BOTTOM:"bottom",LEFT:p()?"right":"left"},hs={allowList:Qn,animation:!0,boundary:"clippingParents",container:!1,customClass:"",delay:0,fallbackPlacements:["top","right","bottom","left"],html:!1,offset:[0,6],placement:"top",popperConfig:null,sanitize:!0,sanitizeFn:null,selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',title:"",trigger:"hover focus"},ds={allowList:"object",animation:"boolean",boundary:"(string|element)",container:"(string|element|boolean)",customClass:"(string|function)",delay:"(number|object)",fallbackPlacements:"array",html:"boolean",offset:"(array|string|function)",placement:"(string|function)",popperConfig:"(null|object|function)",sanitize:"boolean",sanitizeFn:"(null|function)",selector:"(string|boolean)",template:"string",title:"(string|element|function)",trigger:"string"};class us extends W{constructor(t,e){if(void 0===wi)throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org/docs/v2/)");super(t,e),this._isEnabled=!0,this._timeout=0,this._isHovered=null,this._activeTrigger={},this._popper=null,this._templateFactory=null,this._newContent=null,this.tip=null,this._setListeners(),this._config.selector||this._fixTitle()}static get Default(){return hs}static get DefaultType(){return ds}static get NAME(){return"tooltip"}enable(){this._isEnabled=!0}disable(){this._isEnabled=!1}toggleEnabled(){this._isEnabled=!this._isEnabled}toggle(){this._isEnabled&&(this._isShown()?this._leave():this._enter())}dispose(){clearTimeout(this._timeout),N.off(this._element.closest(os),rs,this._hideModalHandler),this._element.getAttribute("data-bs-original-title")&&this._element.setAttribute("title",this._element.getAttribute("data-bs-original-title")),this._disposePopper(),super.dispose()}show(){if("none"===this._element.style.display)throw new Error("Please use show on visible elements");if(!this._isWithContent()||!this._isEnabled)return;const t=N.trigger(this._element,this.constructor.eventName("show")),e=(c(this._element)||this._element.ownerDocument.documentElement).contains(this._element);if(t.defaultPrevented||!e)return;this._disposePopper();const i=this._getTipElement();this._element.setAttribute("aria-describedby",i.getAttribute("id"));const{container:n}=this._config;if(this._element.ownerDocument.documentElement.contains(this.tip)||(n.append(i),N.trigger(this._element,this.constructor.eventName("inserted"))),this._popper=this._createPopper(i),i.classList.add(ns),"ontouchstart"in document.documentElement)for(const t of[].concat(...document.body.children))N.on(t,"mouseover",h);this._queueCallback((()=>{N.trigger(this._element,this.constructor.eventName("shown")),!1===this._isHovered&&this._leave(),this._isHovered=!1}),this.tip,this._isAnimated())}hide(){if(this._isShown()&&!N.trigger(this._element,this.constructor.eventName("hide")).defaultPrevented){if(this._getTipElement().classList.remove(ns),"ontouchstart"in document.documentElement)for(const t of[].concat(...document.body.children))N.off(t,"mouseover",h);this._activeTrigger.click=!1,this._activeTrigger[ls]=!1,this._activeTrigger[as]=!1,this._isHovered=null,this._queueCallback((()=>{this._isWithActiveTrigger()||(this._isHovered||this._disposePopper(),this._element.removeAttribute("aria-describedby"),N.trigger(this._element,this.constructor.eventName("hidden")))}),this.tip,this._isAnimated())}}update(){this._popper&&this._popper.update()}_isWithContent(){return Boolean(this._getTitle())}_getTipElement(){return this.tip||(this.tip=this._createTipElement(this._newContent||this._getContentForTemplate())),this.tip}_createTipElement(t){const e=this._getTemplateFactory(t).toHtml();if(!e)return null;e.classList.remove(is,ns),e.classList.add(`bs-${this.constructor.NAME}-auto`);const i=(t=>{do{t+=Math.floor(1e6*Math.random())}while(document.getElementById(t));return t})(this.constructor.NAME).toString();return e.setAttribute("id",i),this._isAnimated()&&e.classList.add(is),e}setContent(t){this._newContent=t,this._isShown()&&(this._disposePopper(),this.show())}_getTemplateFactory(t){return this._templateFactory?this._templateFactory.changeContent(t):this._templateFactory=new ts({...this._config,content:t,extraClass:this._resolvePossibleFunction(this._config.customClass)}),this._templateFactory}_getContentForTemplate(){return{[ss]:this._getTitle()}}_getTitle(){return this._resolvePossibleFunction(this._config.title)||this._element.getAttribute("data-bs-original-title")}_initializeOnDelegatedTarget(t){return this.constructor.getOrCreateInstance(t.delegateTarget,this._getDelegateConfig())}_isAnimated(){return this._config.animation||this.tip&&this.tip.classList.contains(is)}_isShown(){return this.tip&&this.tip.classList.contains(ns)}_createPopper(t){const e=g(this._config.placement,[this,t,this._element]),i=cs[e.toUpperCase()];return yi(this._element,t,this._getPopperConfig(i))}_getOffset(){const{offset:t}=this._config;return"string"==typeof t?t.split(",").map((t=>Number.parseInt(t,10))):"function"==typeof t?e=>t(e,this._element):t}_resolvePossibleFunction(t){return g(t,[this._element,this._element])}_getPopperConfig(t){const e={placement:t,modifiers:[{name:"flip",options:{fallbackPlacements:this._config.fallbackPlacements}},{name:"offset",options:{offset:this._getOffset()}},{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"arrow",options:{element:`.${this.constructor.NAME}-arrow`}},{name:"preSetPlacement",enabled:!0,phase:"beforeMain",fn:t=>{this._getTipElement().setAttribute("data-popper-placement",t.state.placement)}}]};return{...e,...g(this._config.popperConfig,[void 0,e])}}_setListeners(){const t=this._config.trigger.split(" ");for(const e of t)if("click"===e)N.on(this._element,this.constructor.eventName("click"),this._config.selector,(t=>{this._initializeOnDelegatedTarget(t).toggle()}));else if("manual"!==e){const t=e===as?this.constructor.eventName("mouseenter"):this.constructor.eventName("focusin"),i=e===as?this.constructor.eventName("mouseleave"):this.constructor.eventName("focusout");N.on(this._element,t,this._config.selector,(t=>{const e=this._initializeOnDelegatedTarget(t);e._activeTrigger["focusin"===t.type?ls:as]=!0,e._enter()})),N.on(this._element,i,this._config.selector,(t=>{const e=this._initializeOnDelegatedTarget(t);e._activeTrigger["focusout"===t.type?ls:as]=e._element.contains(t.relatedTarget),e._leave()}))}this._hideModalHandler=()=>{this._element&&this.hide()},N.on(this._element.closest(os),rs,this._hideModalHandler)}_fixTitle(){const t=this._element.getAttribute("title");t&&(this._element.getAttribute("aria-label")||this._element.textContent.trim()||this._element.setAttribute("aria-label",t),this._element.setAttribute("data-bs-original-title",t),this._element.removeAttribute("title"))}_enter(){this._isShown()||this._isHovered?this._isHovered=!0:(this._isHovered=!0,this._setTimeout((()=>{this._isHovered&&this.show()}),this._config.delay.show))}_leave(){this._isWithActiveTrigger()||(this._isHovered=!1,this._setTimeout((()=>{this._isHovered||this.hide()}),this._config.delay.hide))}_setTimeout(t,e){clearTimeout(this._timeout),this._timeout=setTimeout(t,e)}_isWithActiveTrigger(){return Object.values(this._activeTrigger).includes(!0)}_getConfig(t){const e=F.getDataAttributes(this._element);for(const t of Object.keys(e))es.has(t)&&delete e[t];return t={...e,..."object"==typeof t&&t?t:{}},t=this._mergeConfigObj(t),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}_configAfterMerge(t){return t.container=!1===t.container?document.body:r(t.container),"number"==typeof t.delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),t}_getDelegateConfig(){const t={};for(const[e,i]of Object.entries(this._config))this.constructor.Default[e]!==i&&(t[e]=i);return t.selector=!1,t.trigger="manual",t}_disposePopper(){this._popper&&(this._popper.destroy(),this._popper=null),this.tip&&(this.tip.remove(),this.tip=null)}static jQueryInterface(t){return this.each((function(){const e=us.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}}m(us);const fs=".popover-header",ps=".popover-body",ms={...us.Default,content:"",offset:[0,8],placement:"right",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',trigger:"click"},gs={...us.DefaultType,content:"(null|string|element|function)"};class _s extends us{static get Default(){return ms}static get DefaultType(){return gs}static get NAME(){return"popover"}_isWithContent(){return this._getTitle()||this._getContent()}_getContentForTemplate(){return{[fs]:this._getTitle(),[ps]:this._getContent()}}_getContent(){return this._resolvePossibleFunction(this._config.content)}static jQueryInterface(t){return this.each((function(){const e=_s.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}}m(_s);const bs=".bs.scrollspy",vs=`activate${bs}`,ys=`click${bs}`,ws=`load${bs}.data-api`,As="active",Es="[href]",Ts=".nav-link",Cs=`${Ts}, .nav-item > ${Ts}, .list-group-item`,Os={offset:null,rootMargin:"0px 0px -25%",smoothScroll:!1,target:null,threshold:[.1,.5,1]},xs={offset:"(number|null)",rootMargin:"string",smoothScroll:"boolean",target:"element",threshold:"array"};class ks extends W{constructor(t,e){super(t,e),this._targetLinks=new Map,this._observableSections=new Map,this._rootElement="visible"===getComputedStyle(this._element).overflowY?null:this._element,this._activeTarget=null,this._observer=null,this._previousScrollData={visibleEntryTop:0,parentScrollTop:0},this.refresh()}static get Default(){return Os}static get DefaultType(){return xs}static get NAME(){return"scrollspy"}refresh(){this._initializeTargetsAndObservables(),this._maybeEnableSmoothScroll(),this._observer?this._observer.disconnect():this._observer=this._getNewObserver();for(const t of this._observableSections.values())this._observer.observe(t)}dispose(){this._observer.disconnect(),super.dispose()}_configAfterMerge(t){return t.target=r(t.target)||document.body,t.rootMargin=t.offset?`${t.offset}px 0px -30%`:t.rootMargin,"string"==typeof t.threshold&&(t.threshold=t.threshold.split(",").map((t=>Number.parseFloat(t)))),t}_maybeEnableSmoothScroll(){this._config.smoothScroll&&(N.off(this._config.target,ys),N.on(this._config.target,ys,Es,(t=>{const e=this._observableSections.get(t.target.hash);if(e){t.preventDefault();const i=this._rootElement||window,n=e.offsetTop-this._element.offsetTop;if(i.scrollTo)return void i.scrollTo({top:n,behavior:"smooth"});i.scrollTop=n}})))}_getNewObserver(){const t={root:this._rootElement,threshold:this._config.threshold,rootMargin:this._config.rootMargin};return new IntersectionObserver((t=>this._observerCallback(t)),t)}_observerCallback(t){const e=t=>this._targetLinks.get(`#${t.target.id}`),i=t=>{this._previousScrollData.visibleEntryTop=t.target.offsetTop,this._process(e(t))},n=(this._rootElement||document.documentElement).scrollTop,s=n>=this._previousScrollData.parentScrollTop;this._previousScrollData.parentScrollTop=n;for(const o of t){if(!o.isIntersecting){this._activeTarget=null,this._clearActiveClass(e(o));continue}const t=o.target.offsetTop>=this._previousScrollData.visibleEntryTop;if(s&&t){if(i(o),!n)return}else s||t||i(o)}}_initializeTargetsAndObservables(){this._targetLinks=new Map,this._observableSections=new Map;const t=z.find(Es,this._config.target);for(const e of t){if(!e.hash||l(e))continue;const t=z.findOne(decodeURI(e.hash),this._element);a(t)&&(this._targetLinks.set(decodeURI(e.hash),e),this._observableSections.set(e.hash,t))}}_process(t){this._activeTarget!==t&&(this._clearActiveClass(this._config.target),this._activeTarget=t,t.classList.add(As),this._activateParents(t),N.trigger(this._element,vs,{relatedTarget:t}))}_activateParents(t){if(t.classList.contains("dropdown-item"))z.findOne(".dropdown-toggle",t.closest(".dropdown")).classList.add(As);else for(const e of z.parents(t,".nav, .list-group"))for(const t of z.prev(e,Cs))t.classList.add(As)}_clearActiveClass(t){t.classList.remove(As);const e=z.find(`${Es}.${As}`,t);for(const t of e)t.classList.remove(As)}static jQueryInterface(t){return this.each((function(){const e=ks.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t]()}}))}}N.on(window,ws,(()=>{for(const t of z.find('[data-bs-spy="scroll"]'))ks.getOrCreateInstance(t)})),m(ks);const Ls=".bs.tab",Ss=`hide${Ls}`,Ds=`hidden${Ls}`,$s=`show${Ls}`,Is=`shown${Ls}`,Ns=`click${Ls}`,Ps=`keydown${Ls}`,js=`load${Ls}`,Ms="ArrowLeft",Fs="ArrowRight",Hs="ArrowUp",Ws="ArrowDown",Bs="Home",zs="End",Rs="active",qs="fade",Vs="show",Ks=".dropdown-toggle",Qs=`:not(${Ks})`,Xs='[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',Ys=`.nav-link${Qs}, .list-group-item${Qs}, [role="tab"]${Qs}, ${Xs}`,Us=`.${Rs}[data-bs-toggle="tab"], .${Rs}[data-bs-toggle="pill"], .${Rs}[data-bs-toggle="list"]`;class Gs extends W{constructor(t){super(t),this._parent=this._element.closest('.list-group, .nav, [role="tablist"]'),this._parent&&(this._setInitialAttributes(this._parent,this._getChildren()),N.on(this._element,Ps,(t=>this._keydown(t))))}static get NAME(){return"tab"}show(){const t=this._element;if(this._elemIsActive(t))return;const e=this._getActiveElem(),i=e?N.trigger(e,Ss,{relatedTarget:t}):null;N.trigger(t,$s,{relatedTarget:e}).defaultPrevented||i&&i.defaultPrevented||(this._deactivate(e,t),this._activate(t,e))}_activate(t,e){t&&(t.classList.add(Rs),this._activate(z.getElementFromSelector(t)),this._queueCallback((()=>{"tab"===t.getAttribute("role")?(t.removeAttribute("tabindex"),t.setAttribute("aria-selected",!0),this._toggleDropDown(t,!0),N.trigger(t,Is,{relatedTarget:e})):t.classList.add(Vs)}),t,t.classList.contains(qs)))}_deactivate(t,e){t&&(t.classList.remove(Rs),t.blur(),this._deactivate(z.getElementFromSelector(t)),this._queueCallback((()=>{"tab"===t.getAttribute("role")?(t.setAttribute("aria-selected",!1),t.setAttribute("tabindex","-1"),this._toggleDropDown(t,!1),N.trigger(t,Ds,{relatedTarget:e})):t.classList.remove(Vs)}),t,t.classList.contains(qs)))}_keydown(t){if(![Ms,Fs,Hs,Ws,Bs,zs].includes(t.key))return;t.stopPropagation(),t.preventDefault();const e=this._getChildren().filter((t=>!l(t)));let i;if([Bs,zs].includes(t.key))i=e[t.key===Bs?0:e.length-1];else{const n=[Fs,Ws].includes(t.key);i=b(e,t.target,n,!0)}i&&(i.focus({preventScroll:!0}),Gs.getOrCreateInstance(i).show())}_getChildren(){return z.find(Ys,this._parent)}_getActiveElem(){return this._getChildren().find((t=>this._elemIsActive(t)))||null}_setInitialAttributes(t,e){this._setAttributeIfNotExists(t,"role","tablist");for(const t of e)this._setInitialAttributesOnChild(t)}_setInitialAttributesOnChild(t){t=this._getInnerElement(t);const e=this._elemIsActive(t),i=this._getOuterElement(t);t.setAttribute("aria-selected",e),i!==t&&this._setAttributeIfNotExists(i,"role","presentation"),e||t.setAttribute("tabindex","-1"),this._setAttributeIfNotExists(t,"role","tab"),this._setInitialAttributesOnTargetPanel(t)}_setInitialAttributesOnTargetPanel(t){const e=z.getElementFromSelector(t);e&&(this._setAttributeIfNotExists(e,"role","tabpanel"),t.id&&this._setAttributeIfNotExists(e,"aria-labelledby",`${t.id}`))}_toggleDropDown(t,e){const i=this._getOuterElement(t);if(!i.classList.contains("dropdown"))return;const n=(t,n)=>{const s=z.findOne(t,i);s&&s.classList.toggle(n,e)};n(Ks,Rs),n(".dropdown-menu",Vs),i.setAttribute("aria-expanded",e)}_setAttributeIfNotExists(t,e,i){t.hasAttribute(e)||t.setAttribute(e,i)}_elemIsActive(t){return t.classList.contains(Rs)}_getInnerElement(t){return t.matches(Ys)?t:z.findOne(Ys,t)}_getOuterElement(t){return t.closest(".nav-item, .list-group-item")||t}static jQueryInterface(t){return this.each((function(){const e=Gs.getOrCreateInstance(this);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t]()}}))}}N.on(document,Ns,Xs,(function(t){["A","AREA"].includes(this.tagName)&&t.preventDefault(),l(this)||Gs.getOrCreateInstance(this).show()})),N.on(window,js,(()=>{for(const t of z.find(Us))Gs.getOrCreateInstance(t)})),m(Gs);const Js=".bs.toast",Zs=`mouseover${Js}`,to=`mouseout${Js}`,eo=`focusin${Js}`,io=`focusout${Js}`,no=`hide${Js}`,so=`hidden${Js}`,oo=`show${Js}`,ro=`shown${Js}`,ao="hide",lo="show",co="showing",ho={animation:"boolean",autohide:"boolean",delay:"number"},uo={animation:!0,autohide:!0,delay:5e3};class fo extends W{constructor(t,e){super(t,e),this._timeout=null,this._hasMouseInteraction=!1,this._hasKeyboardInteraction=!1,this._setListeners()}static get Default(){return uo}static get DefaultType(){return ho}static get NAME(){return"toast"}show(){N.trigger(this._element,oo).defaultPrevented||(this._clearTimeout(),this._config.animation&&this._element.classList.add("fade"),this._element.classList.remove(ao),d(this._element),this._element.classList.add(lo,co),this._queueCallback((()=>{this._element.classList.remove(co),N.trigger(this._element,ro),this._maybeScheduleHide()}),this._element,this._config.animation))}hide(){this.isShown()&&(N.trigger(this._element,no).defaultPrevented||(this._element.classList.add(co),this._queueCallback((()=>{this._element.classList.add(ao),this._element.classList.remove(co,lo),N.trigger(this._element,so)}),this._element,this._config.animation)))}dispose(){this._clearTimeout(),this.isShown()&&this._element.classList.remove(lo),super.dispose()}isShown(){return this._element.classList.contains(lo)}_maybeScheduleHide(){this._config.autohide&&(this._hasMouseInteraction||this._hasKeyboardInteraction||(this._timeout=setTimeout((()=>{this.hide()}),this._config.delay)))}_onInteraction(t,e){switch(t.type){case"mouseover":case"mouseout":this._hasMouseInteraction=e;break;case"focusin":case"focusout":this._hasKeyboardInteraction=e}if(e)return void this._clearTimeout();const i=t.relatedTarget;this._element===i||this._element.contains(i)||this._maybeScheduleHide()}_setListeners(){N.on(this._element,Zs,(t=>this._onInteraction(t,!0))),N.on(this._element,to,(t=>this._onInteraction(t,!1))),N.on(this._element,eo,(t=>this._onInteraction(t,!0))),N.on(this._element,io,(t=>this._onInteraction(t,!1)))}_clearTimeout(){clearTimeout(this._timeout),this._timeout=null}static jQueryInterface(t){return this.each((function(){const e=fo.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t](this)}}))}}return R(fo),m(fo),{Alert:Q,Button:Y,Carousel:Lt,Collapse:Rt,Dropdown:Ki,Modal:kn,Offcanvas:Kn,Popover:_s,ScrollSpy:ks,Tab:Gs,Toast:fo,Tooltip:us}}));


// Arranque de la biblioteca; en una página independiente no hace nada.
cuandoDOMListo(iniciarKit);
