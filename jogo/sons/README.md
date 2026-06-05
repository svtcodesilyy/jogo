# 🎵 Pasta de Sons - Instruções

Para que o sistema de áudio funcione corretamente, coloque os seguintes arquivos nesta pasta:

## Arquivos Necessários:

1. **musica_fundo.mp3** - Música calma tocando em loop na tela de jogo
   - Recomendação: Use uma música de fundo suave e relaxante
   - Formato: MP3 (ou OGG/WAV)
   - Duração: 2-5 minutos (vai fazer loop)

2. **passos.mp3** - Som dos passos do personagem
   - Recomendação: Um som curto e sutil de passos
   - Formato: MP3 (ou OGG/WAV)
   - Duração: 0.3-0.5 segundos (vai fazer loop continuamente)

3. **abrir_bau.mp3** - Efeito de madeira abrindo
   - Recomendação: Som de baú/caixa de madeira abrindo
   - Formato: MP3 (ou OGG/WAV)
   - Duração: 1-2 segundos

4. **musica_bau.mp3** - Música especial que toca quando o baú é aberto ⭐
   - Recomendação: Uma música mais épica, emocionante ou especial
   - Formato: MP3 (ou OGG/WAV)
   - Duração: 2-5 minutos (vai fazer loop)
   - **Nota:** Quando o baú abre, a música de fundo pausa e esta música começa a tocar!

5. **digitacao.mp3** - Som de digitação para a tela de créditos finais 💫
   - Recomendação: Um som curto de tecla sendo pressionada
   - Formato: MP3 (ou OGG/WAV)
   - Duração: 0.1-0.3 segundos (som curto!)
   - **Nota:** Toca a cada letra digitada na tela final

6. **click.mp3** - Som de clique do botão INICIAR JORNADA 🔘
   - Recomendação: Um som curto e satisfatório de clique
   - Formato: MP3 (ou OGG/WAV)
   - Duração: 0.2-0.4 segundos (som curto!)
   - **Nota:** Toca quando o botão "INICIAR JORNADA" é clicado

## Como Obter Efeitos Sonoros Gratuitos:

- **Freesound.org** (https://freesound.org/) - Grande biblioteca de sons
- **Zapsplat** (https://www.zapsplat.com/) - Sons gratuitos em alta qualidade
- **Pixabay Music** (https://pixabay.com/music/) - Músicas gratuitas
- **OpenGameArt.org** - Recursos para jogos

## Dicas:

✅ Use sempre arquivos comprimidos (MP3/OGG) para melhor performance
✅ Teste o volume de cada som em relação aos outros
✅ Certifique-se de que os nomes dos arquivos correspondem EXATAMENTE aos nomes no script
✅ Os volumes já estão configurados em `script.js`:
   - Música de fundo: 40% (0.4)
   - Som de passos: 50% (0.5)
   - Som do baú: 70% (0.7)
   - Som de digitação: 30% (0.3)
   - Som de clique: 60% (0.6)

## Estrutura de Diretórios:

```
jogo/
├── index.html
├── script.js
├── cenario.js
├── boneco.js
├── introdução.js
├── style.css
├── assets/
└── sons/
    ├── musica_fundo.mp3     ← Música do jogo (normal)
    ├── passos.mp3            ← Som dos passos
    ├── abrir_bau.mp3         ← Efeito de abertura
    ├── musica_bau.mp3        ← Música especial (quando baú abre!) ⭐
    ├── digitacao.mp3         ← Som de digitação (tela final) 💫
    ├── click.mp3             ← Som do botão de clique 🔘
    └── README.md (este arquivo)
```

## 🎬 Como Usar as Legendas:

No seu código, você pode exibir legendas com:

```javascript
window.exibirLegenda("Sua legenda aqui", 3000); // Mostra por 3 segundos
```

Assim que você adicionar os arquivos de áudio, o jogo estará completo com trilha sonora profissional! 🎮✨
