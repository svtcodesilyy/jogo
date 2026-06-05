const ehCelular = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

const textosIntroducao = [
    "Bem-vindo(a) a esta pequena e sincera jornada.",
    ehCelular 
        ? "Toque nos botões direcionais na tela para movimentar seu personagem." 
        : "Use as setas do teclado (or W, A, S, D) para se movimentar.",
    "Siga sempre avançando para a direita. Algo muito especial te espera no fim do caminho..."
];

let indiceIntroducao = 0;

function executarIntroducao() {
    const hudTexto = document.getElementById('hud-texto');
    const textoCaixa = document.getElementById('texto-caixa');
    const btnProximo = document.getElementById('btn-proximo');

    if (!hudTexto || !textoCaixa || !btnProximo) {
        finalizarIntroducao();
        return;
    }

    window.jogoMovendo = false;
    indiceIntroducao = 0;

    if (window.boneco) {
        window.boneco.velocidade = 0; 
    }

    hudTexto.style.display = 'block';
    textoCaixa.textContent = textosIntroducao[indiceIntroducao];

    btnProximo.onclick = () => {
        indiceIntroducao++;

        if (indiceIntroducao < textosIntroducao.length) {
            textoCaixa.textContent = textosIntroducao[indiceIntroducao];
        } else {
            finalizarIntroducao();
        }
    };
}

function finalizarIntroducao() {
    const hudTexto = document.getElementById('hud-texto');
    if (hudTexto) {
        hudTexto.style.display = 'none';
    }

    if (window.boneco) {
        window.boneco.velocidade = 3; 
    }

    window.jogoMovendo = true;
    window.jogoIniciado = true;
    if (typeof window.mostrarControlesMobile === 'function') {
        window.mostrarControlesMobile();
    }
}

// ==========================================================================
// 🎬 CUTSCENE FINAL: MOVIMENTO AUTOMÁTICO E TEXTO DIGITADO
// ==========================================================================

function iniciarCutsceneFinal() {
    // 1. Trava os controles normais do jogador para sempre
    window.jogoMovendo = false;
    if (typeof zerarMovimento === 'function') zerarMovimento();

    // 2. Faz o boneco andar em direção ao horizonte sozinho
    if (window.boneco) {
        window.boneco.velocidade = 2; // Velocidade de caminhada mais calma e dramática
        window.inputState.right = true; // Força o input para a direita no motor do jogo
    }

    // 3. Aguarda o tempo do boneco sair de cena e ativa a tela preta com a mensagem
    setTimeout(() => {
        if (window.inputState) {
            window.inputState.right = false; // Desliga o andar automático nos bastidores
        }
        
        const telaCreditos = document.getElementById('tela-final-creditos');
        const btnReiniciar = document.getElementById('btn-reiniciar');
        if (btnReiniciar) {
            btnReiniciar.style.opacity = '0';
            btnReiniciar.style.pointerEvents = 'none';
        }
        if (telaCreditos) {
            telaCreditos.style.display = 'flex';
            
            // Mensagem especial de agradecimento (o \n serve para pular linha)
            const mensagemFinal = "Obrigado por jogar!\n\nEsta jornada foi feita com muito carinho para agradecer por ser essa amiga tão incrível.\n\nSua amizade é o maior tesouro de todos!";
            
            // Pequena pausa dramática antes de começar a digitar sozinho
            setTimeout(() => {
                efeitoMaquinaEscrever(mensagemFinal, 'texto-agradecimento', 60, () => {
                    if (btnReiniciar) {
                        btnReiniciar.style.pointerEvents = 'auto';
                        btnReiniciar.style.opacity = '1';
                    }
                });
            }, 1000);
        }
    }, 2500); // 2.5 segundos é ideal para ele cruzar o resto do canvas
}

function efeitoMaquinaEscrever(texto, idElemento, velocidade, onComplete) {
    let i = 0;
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    
    elemento.innerHTML = ""; 

    function digitar() {
        if (i < texto.length) {
            if (texto.charAt(i) === '\n') {
                elemento.innerHTML += '<br>';
            } else {
                elemento.innerHTML += texto.charAt(i);
                // 🔊 Toca o som de digitação a cada caractere
                if (window.somDigitacao) {
                    window.somDigitacao.currentTime = 0;
                    window.somDigitacao.play().catch(() => {});
                }
            }
            i++;
            setTimeout(digitar, velocidade);
        } else if (typeof onComplete === 'function') {
            onComplete();
        }
    }
    digitar();
}