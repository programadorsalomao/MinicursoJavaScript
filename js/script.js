var larguraFundo = document.querySelector(".fundo").offsetWidth;
var larguraBase = document.querySelector(".base").offsetWidth;
var itens = document.querySelectorAll(".fundo").length;
var posicaoPassaroY = document.getElementById("passaro").offsetTop;
var posicaoPassaroX = document.getElementById("passaro").offsetLeft;
var pxArrayFundo = new Array();
var pxArrayBase = new Array();
var pxArrayObstaculoBase = new Array();
var pxArrayObstaculoTopo = new Array();
var pontos = 0;

// popula a posição inicial dos elementos
for (let i = 0; i <= (itens - 1); i++) {

    pxArrayFundo.unshift(larguraFundo * (i - 1));
    pxArrayBase.unshift(larguraBase * (i - 1));
    pxArrayObstaculoBase.unshift(larguraFundo * (i - 1));
    pxArrayObstaculoTopo.unshift(larguraFundo * (i - 1));

}

// move o elemento no eixo X e Y
function moveElementoX(posicaoX, id, largura) {

    posicaoX--;
    document.getElementById(id).style.left = posicaoX + "px";

    if (posicaoX <= -largura) {

        posicaoX = largura * (itens - 1);
        posicaoX -= 1;

        // atualiza os pontos
        pontos++;

    }

    return posicaoX;

}

// função de colisão
function isColisao(idElementoA, idElementoB) {

    const rectA = document.getElementById(idElementoA).getBoundingClientRect();
    const rectB = document.getElementById(idElementoB).getBoundingClientRect();

    return rectA.left < rectB.right
        && rectA.right > rectB.left
        && rectA.top < rectB.bottom
        && rectA.bottom > rectB.top;

}

// evento para mover personagem no cenário
document.body.addEventListener("keydown", function (event) {

    switch (event.key) {

        case "ArrowUp":
            posicaoPassaroY -= 15;
            break;

        case "ArrowDown":
            posicaoPassaroY += 15;
            break;

    }

    document.getElementById("passaro").style.top = posicaoPassaroY + "px";
    document.getElementById("passaro").style.left = posicaoPassaroX + "px";

});

function sobeDesce(elemento, numero) {

    // posição do elemento
    let posicaoX = (elemento.offsetLeft + elemento.offsetWidth);

    // aqui já estourou o limite da borda
    if (posicaoX <= 0) {

        for (let i = 0; i <= (itens - 1); i++) {

            switch (elemento.id) {

                case "cano-topo" + i:
                    elemento.style.top = (numero - 380) + "px";
                    break;

                case "cano-rodape" + i:
                    elemento.style.top = numero + "px";
                    break;

            }

        }

    }

}

// timer para mover elementos de forma automática
let timerElementos = setInterval(function () {

    for (let i = 0; i <= (itens - 1); i++) {

        pxArrayFundo[i] = moveElementoX(pxArrayFundo[i], "fundo" + i, larguraFundo);
        pxArrayBase[i] = moveElementoX(pxArrayBase[i], "base" + i, larguraBase);
        pxArrayObstaculoBase[i] = moveElementoX(pxArrayObstaculoBase[i], "cano-rodape" + i, larguraFundo);
        pxArrayObstaculoTopo[i] = moveElementoX(pxArrayObstaculoTopo[i], "cano-topo" + i, larguraFundo);

    }

}, 10);

// timer para mover os elementos de forma randomica
let timeMoveElementos = setInterval(function () {

    for (let i = 0; i <= (itens - 1); i++) {

        let numero = Math.floor(Math.random() * (380 - 80 + 1)) + 80;
        let elementoTopo = document.getElementById("cano-topo" + i);
        let elementoRodape = document.getElementById("cano-rodape" + i);

        sobeDesce(elementoTopo, numero);
        sobeDesce(elementoRodape, numero);

    }

}, 1000);

/*
 Atualiza o score do jogo
*/
function updateScore(number) {

    var scoreDiv = document.getElementById("score");
    scoreDiv.innerHTML = "";

    number.toString().split("").forEach(function (digit) {

        var img = document.createElement("img");
        img.src = "img/" + digit + ".png";
        scoreDiv.appendChild(img);

    });

}

// timer de colisão
let timerColisao = setInterval(function () {

    for (let i = 0; i <= (itens - 1); i++) {

        if (isColisao("passaro", "cano-topo" + i) || isColisao("passaro", "cano-rodape" + i)) {

            document.getElementById("gameover").style.visibility = "visible";
            clearInterval(timerElementos);
            clearInterval(timeMoveElementos);
            clearInterval(timerColisao);

        } else {

            // exibe os pontos
            let pontosCalculados = Math.round(pontos / itens);
            updateScore(pontosCalculados);

        }

    }

}, 1000);
