class Cenario {
    constructor() {
        this.cenaAtual = 1; 
        this.bauFoiAberto = false;
        this.gatilhoCartaDisparado = false;
        this.tempo = 0;

        this.flores = [];
        this.particulas = [];

        // Escala perfeita para Pixel Art
        this.escalaBau = 2.0;

        // Posição fixa centralizada no gramado útil
        this.bauX = 520;
        this.bauBaseY = 340;

        // Valores calculados dinamicamente com base nas imagens
        this.LARGURA_FECHADO = 0;
        this.ALTURA_FECHADO = 0;
        this.LARGURA_ABERTO = 0;
        this.ALTURA_ABERTO = 0;

        this.bauLargura = 0;   
        this.bauAltura = 0;    

        this._carregarImagens();
        this._gerarElementosCenicos();
        this.criarParticulas();
        this.atualizarPainelObjetivos();
    }

    _carregarImagens() {
        this.imagens = {
            bauFechado: new Image(),
            bauAberto: new Image()
        };

        this.imagens.bauFechado.onload = () => {
            const natW = this.imagens.bauFechado.naturalWidth;
            const natH = this.imagens.bauFechado.naturalHeight;

            let calcW = Math.round(natW * this.escalaBau);
            let calcH = Math.round(natH * this.escalaBau);

            const canvasEl = document.getElementById('gameCanvas');
            const maxAllowed = canvasEl ? Math.round(canvasEl.width * 0.35) : 280;
            if (calcW > maxAllowed) {
                const fitScale = maxAllowed / natW;
                calcW = Math.round(natW * fitScale);
                calcH = Math.round(natH * fitScale);
            }

            this.LARGURA_FECHADO = calcW;
            this.ALTURA_FECHADO = calcH;

            if (!this.bauLargura) this.bauLargura = this.LARGURA_FECHADO;
            if (!this.bauAltura) this.bauAltura = this.ALTURA_FECHADO;
        };

        this.imagens.bauAberto.onload = () => {
            const natW = this.imagens.bauAberto.naturalWidth;
            const natH = this.imagens.bauAberto.naturalHeight;

            let calcW = Math.round(natW * this.escalaBau);
            let calcH = Math.round(natH * this.escalaBau);

            const canvasEl = document.getElementById('gameCanvas');
            const maxAllowed = canvasEl ? Math.round(canvasEl.width * 0.35) : 280;
            if (calcW > maxAllowed) {
                const fitScale = maxAllowed / natW;
                calcW = Math.round(natW * fitScale);
                calcH = Math.round(natH * fitScale);
            }

            this.LARGURA_ABERTO = calcW;
            this.ALTURA_ABERTO = calcH;

            if (!this.bauLargura) this.bauLargura = this.LARGURA_ABERTO;
            if (!this.bauAltura) this.bauAltura = this.ALTURA_ABERTO;
        };

        this.imagens.bauFechado.src = 'assets/baufechado.png';
        this.imagens.bauAberto.src = 'assets/bauaberto.png';
    }

    _gerarElementosCenicos() {
        this.flores = [];
        const coresFlores = ['#ff80ab', '#b388ff', '#80deea', '#ffffff'];
        for (let i = 0; i < 45; i++) {
            this.flores.push({
                x: Math.random() * 760 + 20,
                y: 160 + Math.random() * 240,
                corPala: coresFlores[Math.floor(Math.random() * coresFlores.length)],
                raio: Math.random() * 2 + 2
            });
        }
    }

    criarParticulas() {
        this.particulas = [];
        for (let i = 0; i < 35; i++) {
            this.particulas.push({
                x: this.bauX + (this.bauLargura / 2) + (Math.random() * 30 - 15),
                y: this.bauBaseY - 15,
                vx: (Math.random() - 0.5) * 1.2,
                vy: -Math.random() * 1.5 - 0.6,
                tamanho: Math.random() * 2.5 + 1,
                alpha: Math.random()
            });
        }
    }

    atualizarPainelObjetivos() {
        const localObjetivo = document.getElementById('texto-objetivo');
        if (!localObjetivo) return;

        if (this.cenaAtual === 1) {
            localObjetivo.innerText = "Objetivo: Explore o campo de flores inicial.";
        } else if (this.cenaAtual === 2) {
            localObjetivo.innerText = "Objetivo: Continue avançando pelo caminho.";
        } else if (this.cenaAtual === 3 && !this.bauFoiAberto) {
            localObjetivo.innerText = "Objetivo: Encontre o tesouro oculto no fim do jardim!";
        } else if (this.bauFoiAberto && !this.gatilhoCartaDisparado) {
            localObjetivo.innerText = "Objetivo: Abra a carta encontrada.";
        } else {
            localObjetivo.innerText = "Objetivo: Guarde essa mensagem com carinho.";
        }
    }

    _distancia(personagem, elemento) {
        const larguraBoneco = personagem.largura || 50;
        const alturaBoneco = personagem.altura || 65;

        const persCx = personagem.x + (larguraBoneco / 2);
        const persCy = personagem.y + (alturaBoneco / 2);
        const elemCx = elemento.x + (this.bauLargura / 2);
        const elemCy = elemento.y + (this.bauAltura / 2);
        
        return Math.sqrt(Math.pow(persCx - elemCx, 2) + Math.pow(persCy - elemCy, 2));
    }

    atualizar() {
        this.tempo++;
        if (this.cenaAtual === 3 && this.bauFoiAberto) {
            for (const p of this.particulas) {
                p.y += p.vy;
                p.x += p.vx;
                p.alpha -= 0.008;

                if (p.y < this.bauBaseY - this.bauAltura - 15 || p.alpha <= 0) {
                    p.x = this.bauX + (this.bauLargura / 2) + (Math.random() * 30 - 15);
                    p.y = this.bauBaseY - 15;
                    p.alpha = 1;
                }
            }
        }
    }

    desenhar(ctx) {
        ctx.imageSmoothingEnabled = false;
        this.atualizar();

        for (const f of this.flores) {
            ctx.fillStyle = f.corPala;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.raio, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffeb3b';
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.raio * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.cenaAtual === 3) {
            this._desenharBau(ctx);
        }
    }

    _desenharBau(ctx) {
        const imgAtual = this.bauFoiAberto ? this.imagens.bauAberto : this.imagens.bauFechado;

        if (!imgAtual.complete || imgAtual.naturalWidth === 0) {
            return;
        }

        if (!this.bauFoiAberto) {
            this.bauLargura = this.LARGURA_FECHADO;
            this.bauAltura = this.ALTURA_FECHADO;
        } else {
            this.bauLargura = this.LARGURA_ABERTO;
            this.bauAltura = this.ALTURA_ABERTO;
        }

        const renderY = Math.round(this.bauBaseY - this.bauAltura);
        ctx.imageSmoothingEnabled = false;

        const drawX = Math.round(this.bauX);
        const drawW = Math.round(this.bauLargura);
        const drawH = Math.round(this.bauAltura);

        if (!this.bauFoiAberto) {
            ctx.save();
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 12 + Math.sin(this.tempo * 0.1) * 4;
            ctx.drawImage(imgAtual, drawX, renderY, drawW, drawH);
            ctx.restore();
        } else {
            ctx.drawImage(imgAtual, drawX, renderY, drawW, drawH);

            for (const p of this.particulas) {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = '#fff59d';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }

    verificarProgresso(personagem, pararJogoCallback) {
        if (this.cenaAtual === 1 && personagem.x > 780) {
            this.cenaAtual = 2;
            personagem.x = 20;
            this._gerarElementosCenicos();
            this.atualizarPainelObjetivos();
            return;
        }

        if (this.cenaAtual === 2 && personagem.x > 780) {
            this.cenaAtual = 3;
            personagem.x = 20;
            this._gerarElementosCenicos();
            this.atualizarPainelObjetivos();
            return;
        }

        if (this.cenaAtual === 3 && !this.bauFoiAberto) {
            const caixaBau = { x: this.bauX, y: this.bauBaseY - this.bauAltura };
            const distancia = this._distancia(personagem, caixaBau);

            if (distancia < 80) {
                this.bauFoiAberto = true; 
                this.atualizarPainelObjetivos();
                
                // 🔊 Toca o som do baú abrindo!
                if (window.somBau) {
                    window.somBau.play().catch(() => {});
                }
                
                // Para a música de fundo e toca a música do baú
                if (window.somFundo) {
                    window.somFundo.pause();
                }
                if (window.somMusicaBau) {
                    window.somMusicaBau.currentTime = 0;
                    window.somMusicaBau.play().catch(() => {});
                }
                
                // Para o som de passos imediatamente
                if (window.somPassos) {
                    window.somPassos.pause();
                }

                if (pararJogoCallback) pararJogoCallback();

                setTimeout(() => {
                    if (typeof window.abrirCartaNaTela === 'function') {
                        window.abrirCartaNaTela();
                    }
                }, 500);
            }
        }
    }
}

window.Cenario = Cenario;