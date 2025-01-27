/*
Cada accierto vale 2 puntos
vidas: 10
*/

//Variables del dom
let $cardParent = $('#cards');
let $buttonNuevo = $('#btn-nuevo');
let $resetModal = $('#reset-game');
let $vidas = $('#vidas');
let $rachas = $('#rachas');
let $records = $('#records');
let $puntos = $('#puntos');

//Varibles
let imagenes = [
    'coin.png',
    'flor.png',
    'goomba.png',
    'hongo-rojo.png',
    'estrella.png',
    'hoja.png',
    'koopa.png',
    'campana.png'
];

//Variables del juego
let jugador = {
    rachas: 0,
    puntos: 0,
    vidas: 10,
    winner: false,
    reiniciar: function () {
        this.rachas = 0;
        this.puntos = 0;
        this.vidas = 10;

        this.rellenarVidas();
        this.refreshScreenValue();
    },
    upRachas: function () {
        this.rachas += 1;
        this.refreshScreenValue();
    },
    upPuntos: function () {
        this.puntos += 2;
        this.refreshScreenValue();
    },
    takeVidas: function () {
        if (this.vidas > 0) {
            this.vidas--; //Quitar
            this.rachas = 0;

            $vidas.children().last().remove(); //Remover corazon
            this.refreshScreenValue();
        }
    },
    rellenarVidas: function () {

        if (this.vidas > 0) $vidas.children().remove();

        for (let i = 0; i < 10; i++) {
            $vidas.append('<span class="fa fa-heart text-danger"></span>')
        }

    },
    refreshScreenValue: function () {
        $rachas.text(this.rachas);
        $puntos.text(this.puntos);
        $records.text(getRecordSessionStorage());
    }

}
//Cartas seleccionadas
let cardsSelecionadas = [];

//Sonidos
let aciertoSound = new Audio('../moneda.mp3');
aciertoSound.volume = 1;
let failSound = new Audio('../bowsers.mp3');
failSound.volume = 1;


eventListeners();

//Listeners
function eventListeners() {

    //Cargar cartas
    $(document).ready(inicio)

    //Evento click padre de las cartas
    $cardParent.click(seleccionarCard);

    //Evento boton nuevo juego
    $buttonNuevo.click(reiniciarJuego);

    //Evento modal button
    $resetModal.click(reiniciarJuego);


}

//Funciones
//Configuracion inicial
function inicio() {
    jugador.rellenarVidas(); //Rellenar vidas
    jugador.refreshScreenValue(); //Refrescar los valores en pantalla

    printCards(); //Imprimir las cartas

    $cardParent.children().addClass('card-active');

    setTimeout(() => {

        $cardParent.children().removeClass('card-active');

    }, 4000);
}

//Desordenar imagenes
function getImagenesAleatorias() {

    let copiaImagenes = imagenes.concat(imagenes); //Doble imagenes
    return copiaImagenes.sort(() => Math.random() - 0.5);

}

//Reiniciar juego
function reiniciarJuego() {
    location.reload();
}

function loserOrWinner() {

    //Perdio
    if (jugador.vidas === 0 && jugador.winner === false) {
        $cardParent.off('click');

        upRecordSessionStorage();

        $('#mensaje').text('Perdiste!!');
        $('#modal-center').modal('show');
        $('#aciertos').text(jugador.puntos);
        $('#fallos').text((10 - jugador.vidas));
    }

    //Gano
    if (jugador.vidas > 0 && $cardParent.children(':not(.card-active)').length === 0) {

        $cardParent.off('click');

        upRecordSessionStorage();

        $('#mensaje').text('Ganaste!!');
        $('#modal-center').modal('show');
        $('#aciertos').text(jugador.puntos);
        $('#fallos').text((10 - jugador.vidas));
    }

}

function getRecordSessionStorage() {

    //Obtener record si existe
    let record;

    if (sessionStorage.getItem('record') === null) {
        record = 0;
    } else {
        record = JSON.parse(sessionStorage.getItem('record'));
    }

    return record;

}

function upRecordSessionStorage() {

    let record = getRecordSessionStorage();

    //Aumentar record
    record = record + 1;

    //Modificar Record
    sessionStorage.setItem('record', record);

}

function verificarCardsSeleccionadas() {


    let cards = cardsSelecionadas;

    if (cards.length === 2) {

        if (cards[0].attr('data-image') === cards[1].attr('data-image')) {

            aciertoSound.play();
            jugador.upPuntos();
            jugador.upRachas();

            cardsSelecionadas = [];

        } else {

            failSound.play();
            jugador.takeVidas()
            //console.log(cards);
            setTimeout(() => {

                cards[0].removeClass('card-active');
                cards[1].removeClass('card-active');

            }, 800);

            cardsSelecionadas = [];
        }

    }

}


//Efecto rotar imagen
function seleccionarCard(e) {


    let cardSeleccionada = $(e.target).parent();

    if (cardsSelecionadas.length < 2) {

        if (cardSeleccionada.hasClass('card-item')) {

            cardSeleccionada.addClass('card-active');
            cardsSelecionadas.push(cardSeleccionada);

        }

    }

    verificarCardsSeleccionadas();

    loserOrWinner();

}

//Imprimir las cartas
function printCards() {

    let imagenes = getImagenesAleatorias();

    imagenes.forEach(function (imagenName) {

        //Card wrapper
        let card = $('<div></div>')
            .addClass(['card-item', 'shadow-sm'])
            .attr('data-image', imagenName.replace('.png', ''));

        //Parte de atras
        let cardAtras = $('<div></div>').addClass('card-atras');

        cardAtras.append(
            $('<img/>')
            .attr({
                'class': 'imagen',
                'src': 'img/' + imagenName
            })
        );

        //Parte de adelante
        let cardDelante = $('<div></div>')
            .addClass('card-delante');

        //Agregar
        card.append(cardAtras);
        card.append(cardDelante);

        $cardParent.append(card);

    });

}
