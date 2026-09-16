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
