let segundos = 0;
let intervalo;

function iniciarJuego() {

    const nombre =
        document.getElementById("nombre").value;

    if (nombre.trim() === "") {
        alert("Ingresa tu nombre");
        return;
    }

    document.getElementById("inicio").style.display = "none";

    document.getElementById("juego").style.display = "block";

    document.getElementById("jugador").innerHTML =
        "Jugador: " + nombre;

    generarTablero();

    iniciarCronometro();
}

function generarTablero() {

    const tablero =
        document.getElementById("tablero");

    tablero.innerHTML = "";

    let numeros = [];

    for (let i = 1; i <= 50; i++) {
        numeros.push(i);
    }

    numeros.sort(() => Math.random() - 0.5);

    const seleccionadas =
        numeros.slice(0, 16);

    seleccionadas.forEach(numero => {

        const img =
            document.createElement("img");

        img.src =
            "tableros/" + numero + ".png";

        img.classList.add("cartaTablero");

        img.dataset.numero = numero;

        img.onclick = function () {

            img.classList.toggle("marcada");

        };

        tablero.appendChild(img);

    });

}

function iniciarCronometro() {

    intervalo = setInterval(() => {

        segundos++;

        let minutos =
            Math.floor(segundos / 60);

        let seg =
            segundos % 60;

        minutos =
            minutos.toString().padStart(2, "0");

        seg =
            seg.toString().padStart(2, "0");

        document.getElementById("cronometro").innerHTML =
            minutos + ":" + seg;

    }, 1000);

}
const cartasCantadas = [];
let cartasDisponibles = [];

for(let i=1;i<=50;i++){
    cartasDisponibles.push(i);
}

setTimeout(() => {
    iniciarSorteo();
}, 1000);

function iniciarSorteo(){

    setInterval(() => {

        if(cartasDisponibles.length === 0){
            return;
        }

        const indice =
            Math.floor(
                Math.random() *
                cartasDisponibles.length
            );

        const carta =
            cartasDisponibles[indice];

        cartasDisponibles.splice(indice,1);

        cartasCantadas.push(carta);

        document.getElementById("imagenCarta").src =
            "cartas/" + carta + ".png";

        console.log(
            "Carta:",
            carta
        );

    },5000);

}