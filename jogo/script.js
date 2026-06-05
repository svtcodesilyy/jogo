const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// 🌎 VARIÁVEL GLOBAL DE ESTADO
window.jogoMovendo = false; 

// ⌨️ SISTEMA DE INPUT UNIFICADO
window.inputState = { up: false, down: false, left: false, right: false };

const mapeamentoTeclado = {
    'ArrowUp': 'up',    'w': 'up', 'W': 'up',
    'ArrowDown': 'down',  's': 'down', 'S': 'down',
    'ArrowLeft': 'left',  'a': 'left', 'A': 'left',
    'ArrowRight': 'right','d': 'right', 'D': 'right'
};

window.addEventListener('keydown', (e) => { 
    if (!window.jogoMovendo) return; 
    const direcao = mapeamentoTeclado[e.key];
    if (direcao) window.inputState[direcao] = true; 
});

window.addEventListener('keyup', (e) => { 
    const direcao = mapeamentoTeclado[e.key];
    if (direcao) window.inputState[direcao] = false; 
});

// 📱 CONTROLES MOBILE
const botoesMobile = { 'touch-up': 'up', 'touch-down': 'down', 'touch-left': 'left', 'touch-right': 'right' };

Object.keys(botoesMobile).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); if (window.jogoMovendo) window.inputState[botoesMobile[id]] = true; });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); window.inputState[botoesMobile[id]] = false; });
        btn.addEventListener('mousedown', () => { if (window.jogoMovendo) window.inputState[botoesMobile[id]] = true; });
        btn.addEventListener('mouseup', () => { window.inputState[botoesMobile[id]] = false; });
    }
});

function zerarMovimento() {
    window.inputState = { up: false, down: false, left: false, right: false };
}

// 🖼️ CARREGAMENTO DE RECURSOS
const fundo = new Image();
fundo.src = 'assets/planoverdechao.jpg';

// 🎵 GERENCIAMENTO DE ÁUDIO
window.somFundo = new Audio('sons/musica_fundo.mp3');
window.somFundo.loop = true;
window.somFundo.volume = 0.4; 

window.somPassos = new Audio('sons/passos.mp3');
window.somPassos.loop = true; 
window.somPassos.volume = 0.5;

window.somBau = new Audio('sons/abrir_bau.mp3');
window.somBau.volume = 0.7;

window.somMusicaBau = new Audio('sons/musica_bau.mp3');
window.somMusicaBau.volume = 0.4;

window.somDigitacao = new Audio('sons/digitacao.mp3');
window.somDigitacao.volume = 0.3;

window.somClick = new Audio('sons/click.mp3');
window.somClick.volume = 0.6;

// 🌟 CONFIGURAÇÃO DE ESCOPO GLOBAL
window.boneco = new Boneco();
window.cenario = new Cenario();

let personagem = window.boneco;
let cenario = window.cenario;

// Atalho de debug
window.forcarCena3 = function() {
    if (window.cenario) {
        window.cenario.cenaAtual = 3;
        window.cenario.atualizarPainelObjetivos();
        window.jogoMovendo = true;
        console.log('Cena 3 forçada — verifique o baú.');
    }
};

// Função reutilizável para exibir diálogos genéricos
function exibirMensagem(texto, textoBotao, acaoAoFechar) {
    window.jogoMovendo = false;
    zerarMovimento();
    
    const textoCaixa = document.getElementById('texto-caixa');
    const btnProximo = document.getElementById('btn-proximo');
    const hudTexto = document.getElementById('hud-texto');

    if (textoCaixa) textoCaixa.innerHTML = texto.replace(/\n/g, '<br>');
    if (btnProximo) {
        btnProximo.innerText = textoBotao;
        btnProximo.style.display = 'block';
        
        btnProximo.onclick = () => {
            if (hudTexto) hudTexto.style.display = 'none';
            if (textoBotao !== "Guardar no Coração") {
                window.jogoMovendo = true;
            }
            if (typeof acaoAoFechar === 'function') {
                acaoAoFechar();
            }
        };
    }
    if (hudTexto) hudTexto.style.display = 'block';
}

// 💬 FUNÇÃO PARA EXIBIR LEGENDAS
window.exibirLegenda = function(texto, duracao = 3000) {
    const legendasContainer = document.getElementById('legendas-container');
    const textoLegenda = document.getElementById('texto-legenda');
    
    if (textoLegenda) textoLegenda.innerHTML = texto;
    if (legendasContainer) {
        legendasContainer.style.display = 'block';
        setTimeout(() => {
            if (legendasContainer) legendasContainer.style.display = 'none';
        }, duracao);
    }
};

// 🔄 FUNÇÃO PARA REINICIAR O JOGO
window.reiniciarJogo = function() {
    zerarMovimento();
    
    window.somPassos.pause();
    window.somFundo.currentTime = 0;
    window.somFundo.play().catch(() => {});
    
    const telaInicio = document.getElementById('tela-inicio');
    if (telaInicio) {
        telaInicio.style.display = 'flex';
        telaInicio.style.opacity = '1';
    }
    const telaCreditos = document.getElementById('tela-final-creditos');
    if (telaCreditos) {
        telaCreditos.style.display = 'none';
    }

    window.boneco.x = 80;
    window.boneco.y = 280;
    window.boneco.velocidade = 0; 
    window.boneco.olhandoEsquerda = false;
    window.boneco.linhaAtual = 0;

    window.cenario.cenaAtual = 1;
    window.cenario.bauFoiAberto = false;
    window.cenario.gatilhoCartaDisparado = false;
    
    window.cenario.bauLargura = 0;
    window.cenario.bauAltura = 0;
    
    window.cenario._gerarElementosCenicos();
    window.cenario.atualizarPainelObjetivos();
};

// Chamado pelo cenário ao tocar no baú aberto
window.abrirCartaNaTela = function () {
    window.jogoMovendo = false;
    zerarMovimento();

    const hudCarta = document.getElementById('hud-carta');
    const pergaminhoContainer = document.getElementById('pergaminho-container');
    const cartaAberta = document.getElementById('carta-aberta');

    if (hudCarta) hudCarta.style.display = 'flex';
    if (pergaminhoContainer) pergaminhoContainer.style.display = 'flex';
    if (cartaAberta) cartaAberta.style.display = 'none';
};

// Configura os cliques assim que a página terminar de carregar por completo
window.addEventListener('DOMContentLoaded', () => {
    const papelFechado = document.getElementById('papel-fechado');
    const pergaminhoContainer = document.getElementById('pergaminho-container');
    const cartaAberta = document.getElementById('carta-aberta');
    const textoCartaConteudo = document.getElementById('texto-carta-conteudo');
    const btnFecharCarta = document.getElementById('btn-fechar-carta');
    const hudCarta = document.getElementById('hud-carta');

    const telaInicio = document.getElementById('tela-inicio');
    const btnIniciar = document.getElementById('btn-iniciar');

    if (btnIniciar && telaInicio) {
        btnIniciar.onclick = () => {
            if (window.somClick) window.somClick.play().catch(() => {});
            window.somFundo.play().catch(e => console.log("Áudio bloqueado:", e));

            telaInicio.style.opacity = '0';
            setTimeout(() => {
                telaInicio.style.display = 'none';
                if (typeof executarIntroducao === 'function') {
                    executarIntroducao();
                } else {
                    window.jogoMovendo = true;
                }
            }, 500);
        };
    }

    const btnReiniciar = document.getElementById('btn-reiniciar');
    if (btnReiniciar) {
        btnReiniciar.onclick = () => {
            if (window.somClick) window.somClick.play().catch(() => {});
            if (typeof reiniciarJogo === 'function') {
                reiniciarJogo();
            }
        };
    }

    // Quando o usuário clica no pergaminho fechado
    if (papelFechado) {
        papelFechado.onclick = () => {
            if (pergaminhoContainer) pergaminhoContainer.style.display = 'none';
            if (cartaAberta) {
                cartaAberta.style.display = 'flex';
                // 🎨 Garante que a folha da carta mantenha proporções lindas e crie rolagem interna
                cartaAberta.style.maxHeight = '75vh';
                cartaAberta.style.flexDirection = 'column';
            }

            if (textoCartaConteudo) {
                // Estilização injetada para criar a caixinha de texto rolável perfeita
                textoCartaConteudo.style.maxHeight = '280px';
                textoCartaConteudo.style.overflowY = 'auto';
                textoCartaConteudo.style.paddingRight = '10px';
                textoCartaConteudo.style.textAlign = 'justify';
                
                textoCartaConteudo.innerHTML = `
                    <h3 style="margin-top: 0; font-size: 22px; color: #5d4037; text-align: center; margin-bottom: 15px;">Querida Amiga,</h3>
                    
                    <p style="margin-bottom: 12px; line-height: 1.5;">Ver você jogar este jogo me lembrou de como você enfrenta a vida: com força, inteligência e um coração gigante. Mas, além de celebrar a sua vitória aqui, eu criei tudo isso para te dizer o quanto você é essencial para mim.</p>
                    
                    <p style="margin-bottom: 12px; line-height: 1.5;">A verdade é que a vida real também é cheia de fases difíceis, caminhos incertos e desafios que parecem impossíveis. Mas a minha jornada é infinitamente mais bonita e segura porque eu tenho você como minha melhor amiga. Você é o meu porto seguro, a pessoa que segura a minha mão nos momentos difíceis.</p>
                    
                    <p style="margin-bottom: 12px; line-height: 1.5;">Nada nesse mundo conseguiria criar um prêmio à altura do que a nossa amizade significa para mim. O meu maior prêmio é ter você na minha vida.</p>
                    
                    <p style="margin-bottom: 15px; line-height: 1.5;">Obrigado por ser minha irmã de alma, por nunca me deixar caminhar sozinha e por ser exatamente quem você é. Eu amo você e estarei sempre aqui, em cada nova fase da sua vida.</p>
                    
                    <hr style="border: 0; border-top: 1px dashed #8d6e63; margin: 15px 0;">
                    
                    <p style="text-align: center; font-style: italic; color: #5d4037; margin-bottom: 10px;">
                        Os melhores tesouros não ficam escondidos em baús...<br>
                        Eles ficam para sempre guardados no coração.
                    </p>
                    
                    <p style="text-align: right; margin-top: 15px; margin-bottom: 0; font-size: 19px; color: #d32f2f;">
                        Com amor, <strong>Keffy ❤️</strong>
                    </p>
                `;
            }
        };
    }

    // Quando clica no botão "Guardar no Coração" dentro da carta aberta
    if (btnFecharCarta) {
        btnFecharCarta.onclick = () => {
            if (hudCarta) hudCarta.style.display = 'none';
            if (cartaAberta) cartaAberta.style.display = 'none';

            setTimeout(() => {
                exibirMensagem(
                    "Os melhores tesouros não são encontrados.\nEles são construídos através da amizade.",
                    "Guardar no Coração",
                    () => {
                        if (window.cenario) {
                            window.cenario.gatilhoCartaDisparado = true;
                            window.cenario.atualizarPainelObjetivos();
                        }
                        if (typeof iniciarCutsceneFinal === 'function') {
                            iniciarCutsceneFinal();
                        }
                    }
                );
            }, 300);
        };
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (fundo.complete) ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);
    
    window.boneco.atualizar();
    
    // 🔊 CONTROLE DO SOM DE PASSOS
    if (window.boneco.estaAndando && window.jogoMovendo) {
        if (window.somPassos.paused) {
            window.somPassos.play().catch(() => {});
        }
    } else {
        window.somPassos.pause();
    }
    
    window.cenario.verificarProgresso(
        window.boneco, 
        (() => { window.jogoMovendo = false; zerarMovimento(); })
    );
    
    window.cenario.desenhar(ctx);
    window.boneco.desenhar(ctx);
    
    requestAnimationFrame(gameLoop);
}

// 🎨 ESTILIZAÇÃO PERSONALIZADA DA BARRA DE ROLAGEM
const estiloScroll = document.createElement('style');
estiloScroll.innerHTML = `
    /* Define a largura da barra de rolagem */
    #texto-carta-conteudo::-webkit-scrollbar {
        width: 8px;
    }
    
    /* O fundo da barra (onde o indicador desliza) */
    #texto-carta-conteudo::-webkit-scrollbar-track {
        background: rgba(93, 64, 55, 0.1); /* Um marrom bem clarinho e transparente */
        border-radius: 4px;
    }
    
    /* O indicador que mexe (o "boguinho" da rolagem) */
    #texto-carta-conteudo::-webkit-scrollbar-thumb {
        background: #8d6e63; /* Marrom tom de pergaminho/madeira */
        border-radius: 4px;
    }
    
    /* Cor do indicador quando você passa o mouse por cima */
    #texto-carta-conteudo::-webkit-scrollbar-thumb:hover {
        background: #5d4037; /* Marrom mais escuro */
    }
`;
document.head.appendChild(estiloScroll);

gameLoop();