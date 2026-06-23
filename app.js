let unsubscribeSala = null;
let ultimaCartaCantada = 0;

let cronometroIniciado = false;
let sorteoIniciado = false;

let intervaloSorteo = null;


import {
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  getDocs
} from "./firebase.js";


console.log("db =", db);
console.log("setDoc =", setDoc);
console.log("doc =", doc);

console.log("Firebase conectado");
console.log(db);


let salaActual = "";
let jugadorActual = "";

let soyCreador = false;


function generarCodigoSala() {

    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let codigo = "";

    for(let i = 0; i < 6; i++){

        codigo += caracteres.charAt(
            Math.floor(
                Math.random() * caracteres.length
            )
        );

    }

    return codigo;

}



const nombresCartas = {

    1: "Azul, Verde",
    2: "Amarillo, Azul",
    3: "Rojo, Verde",
    4: "Verde, Amarillo",
    5: "Cafe, Negro",
    6: "Azul Claro",
    7: "Blanco, Azul",
    8: "Violeta, Rojo",
    9: "Gris, Amarillo",
    10: "Azul, Gris",

    11: "Verde, Azul",
    12: "Azul, Amarillo",
    13: "Verde, Rojo",
    14: "Amarillo, Verde",
    15: "Negro, Cafe",
    16: "Verde Claro",
    17: "Azul, Blanco",
    18: "Rojo, Violeta",
    19: "Amarillo, Gris",
    20: "Gris, Azul",

    21: "Azul, Violeta",
    22: "Negro, Verde Claro",
    23: "Blanco, Verde",
    24: "Rojo, Amarillo",
    25: "Azul, Negro",
    26: "Cafe, Blanco",
    27: "Amarillo, Violeta",
    28: "Negro, Blanco",
    29: "Negro, Amarillo",
    30: "Verde, Azul claro",

    31: "Violeta, Azul",
    32: "Verde Claro, Negro",
    33: "Verde, Blanco",
    34: "Amarillo, Rojo",
    35: "Negro, Azul",
    36: "Blanco, Cafe",
    37: "Violeta, Amarillo",
    38: "Blanco, Negro",
    39: "Amarillo, Negro",
    40: "Azul Claro, Verde",

    41: "Negro, Violeta",
    42: "Amarillo, Cafe",
    43: "Verde, Cafe",
    44: "Cafe, Azul",
    45: "Negro, Verde",
    46: "Violeta, Negro",
    47: "Cafe, Amarillo",
    48: "Cafe, Verde",
    49: "Azul, Cafe",
    50: "Verde, Negro"
};

let segundos = 0;
let intervalo;

function resetJuegoLocal(){
    cronometroIniciado = false;
    sorteoIniciado = false;
    ultimaCartaCantada = 0;
    segundos = 0;
}

function iniciarJuego() {

    const nombre = jugadorActual;

    if (nombre.trim() === "") {
        alert("Ingresa tu nombre");
        return;
    }

    document.getElementById("inicio").style.display = "none";

    document.getElementById("juego").style.display = "block";

    document.getElementById("jugador").innerHTML =
        "Jugador: " + nombre;

    generarTablero();

    escucharSala();

    mostrarJugadores();

    resetJuegoLocal();

    console.log("Soy creador:", soyCreador);
    console.log("Sala:", salaActual);

if (soyCreador) {

    const btn =
        document.getElementById(
            "btnIniciar"
        );

    btn.style.display = "block";

    btn.onclick = iniciarPartida;

    console.log(
        "Botón iniciar visible"
    );
}
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

function iniciarSorteo(){

    console.log(
        "SORTEO INICIADO"
    );

    if (intervaloSorteo) return;

intervaloSorteo = setInterval(async () => {
    

        if(cartasDisponibles.length === 0){
    clearInterval(intervaloSorteo);
    intervaloSorteo = null;
    return;
}

        const indice =
            Math.floor(
                Math.random() *
                cartasDisponibles.length
            );

        const carta =
            cartasDisponibles[indice];

        cartasDisponibles.splice(
            indice,
            1
        );

        cartasCantadas.push(carta);

        console.log(
            "ENVIANDO CARTA:",
            carta
        );

        try{

            await updateDoc(
                doc(
                    db,
                    "partidas",
                    salaActual
                ),
                {
                    cartaActual: carta,
                    cartasCantadas:
                        cartasCantadas,
                    estado: "jugando"
                }
            );

            console.log(
                "CARTA GUARDADA"
            );

        }catch(error){

            console.error(
                error
            );

        }

    }, 8000);

}
async function verificarLoteria(){

    const partidaRef = doc(db, "partidas", salaActual);
    const partidaSnap = await getDoc(partidaRef);

    const datos = partidaSnap.data();
    const cartasCantadas = datos.cartasCantadas || [];

    const cartasTablero =
        document.querySelectorAll(".cartaTablero");

    let errores = 0;

    for (let carta of cartasTablero) {

        const numero = parseInt(carta.dataset.numero);
        const marcada = carta.classList.contains("marcada");
        const salio = cartasCantadas.includes(numero);

        // limpiar estilos anteriores
        carta.classList.remove("ok", "error", "warn");

        if (marcada && salio) {

            carta.classList.add("ok");

        } else if (marcada && !salio) {

            carta.classList.add("error");
            errores++;

        } else if (!marcada && salio) {

            carta.classList.add("warn");
            errores++;

        }
    }

    if (errores > 0) {

        alert("❌ Lotería incorrecta. Revisa las cartas en rojo/amarillo.");

        return;
    }

    clearInterval(intervalo);

    alert(
        "🎉 ¡FELICIDADES! 🎉\n\nHas ganado la partida.\n\nTiempo: " +
        document.getElementById("cronometro").innerText
    );

    guardarResultado();
}
async function crearSala(nombreJugador){

    const codigo =
        generarCodigoSala();

    await setDoc(
        doc(db, "partidas", codigo),
        {
    estado: "esperando",
    iniciada: false,
    creador: nombreJugador,
    creada: new Date().toISOString(),
    cartaActual: 0,
    cartasCantadas: []
}
    );

    await setDoc(
        doc(
            db,
            "partidas",
            codigo,
            "jugadores",
            nombreJugador
        ),
        {
            nombre: nombreJugador,
            conectado: true
        }
    );

    alert(
        "Sala creada\n\nCódigo: " +
        codigo
    );

    return codigo;

}

async function crearSalaUI(){

    const nombre =
        document.getElementById("nombre").value;

    if(nombre.trim() === ""){
        alert("Ingresa tu nombre");
        return;
    }

    jugadorActual = nombre;

salaActual =
    await crearSala(nombre);

soyCreador = true;

iniciarJuego();

    document.getElementById(
        "codigoSala"
    ).value = salaActual;

}

async function unirseSalaUI(){

    const nombre =
        document.getElementById("nombre").value;

    const codigo =
        document.getElementById("codigoSala").value
        .toUpperCase();

    if(nombre.trim() === ""){
        alert("Ingresa tu nombre");
        return;
    }

    const salaRef =
        doc(db,"partidas",codigo);

    const sala =
        await getDoc(salaRef);

    if(!sala.exists()){

        alert(
            "La sala no existe"
        );

        return;
    }

    await setDoc(
        doc(
            db,
            "partidas",
            codigo,
            "jugadores",
            nombre
        ),
        {
            nombre:nombre,
            conectado:true
        }
    );

    jugadorActual = nombre;
    salaActual = codigo;

    iniciarJuego();

}

window.crearSalaUI = crearSalaUI;
window.unirseSalaUI = unirseSalaUI;
window.iniciarJuego = iniciarJuego;
window.verificarLoteria = verificarLoteria;


function escucharSala(){

    if(unsubscribeSala){
        unsubscribeSala();
    }

    unsubscribeSala = onSnapshot(
        doc(db, "partidas", salaActual),
        (snapshot) => {

            const datos = snapshot.data();

            if(!datos) return;

            console.log(
                "Estado iniciada:",
                datos.iniciada
            );

            console.log(
                "Carta actual:",
                datos.cartaActual
            );

            if(
                datos.estado === "jugando" &&
                !cronometroIniciado
            ){
                cronometroIniciado = true;
                iniciarCronometro();
            }

            if(
                datos.iniciada &&
                soyCreador &&
                !sorteoIniciado
            ){
                sorteoIniciado = true;

                console.log(
                    "VOY A INICIAR SORTEO"
                );

                let intervaloSorteo = null;

                iniciarSorteo();
            }

            console.log(
                "Carta recibida:",
                datos.cartaActual,
                new Date().toLocaleTimeString()
            );

            if(
                datos.cartaActual > 0 &&
                datos.cartaActual !== ultimaCartaCantada
            ){

                document.getElementById(
                    "imagenCarta"
                ).src =
                    "cartas/" +
                    datos.cartaActual +
                    ".png";

                const nombreCarta =
                    nombresCartas[
                        datos.cartaActual
                    ];

                speechSynthesis.cancel();

                const voz =
                    new SpeechSynthesisUtterance(
                        nombreCarta
                    );

                voz.lang = "es-MX";
                voz.rate = 1.3;

                speechSynthesis.speak(voz);

                ultimaCartaCantada =
                    datos.cartaActual;
            }

        }
    );

    onSnapshot(

        collection(
            db,
            "partidas",
            salaActual,
            "ganadores"
        ),

        () => {

            mostrarRanking();

        }

    );

}
async function mostrarJugadores(){

    const lista =
        document.getElementById(
            "listaJugadores"
        );

    lista.innerHTML = "";

    const jugadoresRef =
        collection(
            db,
            "partidas",
            salaActual,
            "jugadores"
        );

    const snapshot =
        await getDocs(jugadoresRef);

    snapshot.forEach(docu => {

        const datos =
            docu.data();

        lista.innerHTML += `
            <li>
                🟢 ${datos.nombre}
            </li>
        `;

    });

}

async function iniciarPartida(){

    console.log("BOTON PRESIONADO");

    try{

        await updateDoc(
    doc(db, "partidas", salaActual),
    {
        iniciada: true,
        estado: "jugando"
    }
);

        console.log("PARTIDA ACTUALIZADA");

    }catch(error){

        console.error(
            "ERROR AL INICIAR:",
            error
        );

    }

}

async function guardarResultado(){

    await setDoc(

        doc(
            db,
            "partidas",
            salaActual,
            "ganadores",
            jugadorActual
        ),

        {
            nombre:
                jugadorActual,

            tiempo:
                document
                .getElementById(
                    "cronometro"
                )
                .innerText,

            fecha:
                Date.now()
        }

    );

}

async function mostrarRanking(){

    const tabla =
        document.getElementById(
            "tablaRanking"
        );

    tabla.innerHTML = "";

    const snapshot =
        await getDocs(
            collection(
                db,
                "partidas",
                salaActual,
                "ganadores"
            )
        );

    const resultados = [];

    snapshot.forEach(docu => {

        resultados.push(
            docu.data()
        );

    });

    resultados.sort(
        (a,b)=>
        a.fecha-b.fecha
    );

    resultados.forEach(
        (j,index)=>{
            tabla.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${j.nombre}</td>
                <td>${j.tiempo}</td>
            </tr>
            `;
        }
    );

}


