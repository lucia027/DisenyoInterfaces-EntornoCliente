function cantidadValida(valor) {
    const cantidad = Number(valor);
    return valor !== "" && Number.isInteger(cantidad) && cantidad > 0;
}

function formatearPrecio(precio) {
    return precio.toFixed(2).replace(".", ",") + " €";
}