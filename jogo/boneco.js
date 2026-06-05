class Boneco {
    constructor() {
        // Posição inicial na tela
        this.x = 80;
        this.y = 280;

        // Dimensões do sprite sheet
        this.larguraQuadro = 0;
        this.alturaQuadro = 0;

        // Tamanho de renderização na tela
        this.larguraTela = 64;
        this.alturaTela = 112;

        // Velocidade de movimento
        this.velocidade = 3;

        this.imagem = new Image();

        this.imagem.onload = () => {
            this.larguraQuadro = Math.floor(this.imagem.width / 4);
            this.alturaQuadro = Math.floor(this.imagem.height / 3); 
            console.log(`Boneco carregado com sucesso! Quadro: ${this.larguraQuadro}x${this.alturaQuadro}px`);
        };

        this.imagem.onerror = () => {
            console.error("ERRO CRÍTICO: Não foi possível carregar 'assets/boneco.png'.");
        };

        this.imagem.src = "assets/boneco.png";

        // Estado da animação
        this.quadroAtual = 0;
        this.linhaAtual = 0;     // 0 = baixo, 1 = lado, 2 = cima
        this.totalQuadros = 4;
        this.contadorFrame = 0;

        this.estaAndando = false;
        this.olhandoEsquerda = false;
    }

    atualizar() {
        // Se o jogo não estiver movendo e NÃO houver comandos forçados de cutscene, o boneco para
        if (window.jogoMovendo === false && (!window.inputState || !window.inputState.right)) {
            this.estaAndando = false;
            this.quadroAtual = 0;
            return;
        }

        this.estaAndando = false;
        
        // Processador do sistema de input
        if (window.inputState) {
            const input = window.inputState;

            if (input.down) {
                this.y += this.velocidade;
                this.linhaAtual = 0;
                this.estaAndando = true;
            }

            if (input.up) {
                this.y -= this.velocidade;
                this.linhaAtual = 2;
                this.estaAndando = true;
            }

            if (input.right) {
                this.x += this.velocidade;
                this.linhaAtual = 1;
                this.olhandoEsquerda = false;
                this.estaAndando = true;
            }

            if (input.left) {
                this.x -= this.velocidade;
                this.linhaAtual = 1;
                this.olhandoEsquerda = true;
                this.estaAndando = true;
            }
        }

        // 🏰 LIMITES DE TELA RECALIBRADOS E SEGUROS:
        // Se estiver na cena 3 e a carta já foi aberta, deixa ele passar direto para sumir no horizonte (até 850)
        // Se estiver nas cenas 1 ou 2, liberamos totalmente a ida até 800 para que o cenário detecte a transição!
        let limiteDireito = 800; 
        
        if (window.cenario && window.cenario.cenaAtual === 3) {
            if (window.cenario.gatilhoCartaDisparado) {
                limiteDireito = 850;
            } else {
                limiteDireito = 780; // Segura ele perto do baú até ler a carta
            }
        }
        
        this.x = Math.max(0, Math.min(limiteDireito, this.x)); 
        this.y = Math.max(140, Math.min(450 - this.alturaTela, this.y));

        // Gerenciador da Animação
        if (this.estaAndando) {
            this.contadorFrame++;

            if (this.contadorFrame >= 8) {
                this.quadroAtual = (this.quadroAtual + 1) % this.totalQuadros;
                this.contadorFrame = 0;
            }
        } else {
            this.quadroAtual = 0; 
        }
    }

    desenhar(ctx) {
        if (this.larguraQuadro === 0 || this.alturaQuadro === 0) {
            ctx.fillStyle = "#e74c3c";
            ctx.fillRect(this.x, this.y, this.larguraTela, this.alturaTela);
            return;
        }

        const corteX = this.quadroAtual * this.larguraQuadro;
        const corteY = this.linhaAtual * this.alturaQuadro;

        ctx.save();
        ctx.imageSmoothingEnabled = false;

        if (this.olhandoEsquerda && this.linhaAtual === 1) {
            ctx.translate(this.x + this.larguraTela, this.y);
            ctx.scale(-1, 1); 

            ctx.drawImage(
                this.imagem,
                corteX, corteY,
                this.larguraQuadro, this.alturaQuadro,
                0, 0,
                this.larguraTela, this.alturaTela
            );
        } else {
            ctx.drawImage(
                this.imagem,
                corteX, corteY,
                this.larguraQuadro, this.alturaQuadro,
                Math.round(this.x), Math.round(this.y),
                this.larguraTela, this.alturaTela
            );
        }

        ctx.restore();
    }
}

window.Boneco = Boneco;