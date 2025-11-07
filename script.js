document.addEventListener('DOMContentLoaded', function () {
    // --- LÓGICA DO TYPING EFFECT (MÁQUINA DE ESCREVER) ---

    const typingTextElement = document.getElementById('typing-text');
    const textArray = [
        "Learning Python 🐍",
        "Studying Java ☕",
        "Aspiring Developer 🚀",
    ];
    const typingSpeed = 100;
    const erasingSpeed = 70;
    const newTextDelay = 1500;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typingTextElement.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typingTextElement.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed);
        }
    }

    type();


    // --- LÓGICA DO ÁUDIO DE FUNDO (PLAYLIST ALEATÓRIA) ---

    // 1. LISTA DE MÚSICAS: USE OS NOMES EXATOS DAS SUAS 3 MÚSICAS AQUI
    const originalPlaylist = [
        "mp3/musica1.mp3",
        "mp3/musica2.mp3", // ADICIONADO
        "mp3/musica3.mp3"  // ADICIONADO
        // Adicione mais se houver!
    ];

    const audio = document.getElementById('background-audio');
    const playButton = document.getElementById('play-button');
    const volume = 0.05; // Volume baixo
    let shuffledPlaylist = [];
    let currentTrackIndex = 0;
    let isInitialized = false; // Flag para garantir que o embaralhamento só ocorra uma vez

    // Função para embaralhar o array (Fisher-Yates)
    function shuffleArray(array) {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Função para atualizar o ícone do botão (adiciona/remove a classe CSS)
    function updateButtonIcon() {
        if (audio.paused) {
            playButton.classList.remove('is-playing'); // Mostra ícone PLAY
        } else {
            playButton.classList.add('is-playing'); // Mostra ícone PAUSE
        }
    }

    // Função para carregar e tocar a próxima música da playlist embaralhada
    function playNextTrack() {
        if (currentTrackIndex >= shuffledPlaylist.length) {
            // Se chegou ao fim da playlist embaralhada, embaralha de novo (loopar)
            shuffledPlaylist = shuffleArray(originalPlaylist);
            currentTrackIndex = 0;
        }

        const trackPath = shuffledPlaylist[currentTrackIndex];
        audio.src = trackPath;
        audio.volume = volume;

        audio.play().catch(error => {
            console.error(`Erro ao tentar reproduzir áudio (${trackPath}):`, error);
            // Se der erro, tenta a próxima música se houver
            if (currentTrackIndex < shuffledPlaylist.length - 1) {
                currentTrackIndex++;
                playNextTrack();
            } else {
                updateButtonIcon(); // Se for a última, mantém ícone Pause
            }
        });

        currentTrackIndex++;
        updateButtonIcon();
    }


    // Função principal de Toggle Play/Pause
    function togglePlayPause() {
        if (!isInitialized) {
            // Primeira vez: inicializa a playlist, embaralha, e começa a tocar
            shuffledPlaylist = shuffleArray(originalPlaylist);
            // Configura o evento 'ended' para tocar a próxima música
            audio.addEventListener('ended', playNextTrack);
            isInitialized = true;

            // Tenta tocar a primeira música
            audio.src = shuffledPlaylist[currentTrackIndex];
            audio.volume = volume;

            audio.play().then(() => {
                currentTrackIndex++;
                updateButtonIcon();
            }).catch(error => {
                console.error("Falha ao iniciar a playlist:", error);
                updateButtonIcon();
            });

        } else {
            // Depois da primeira vez: apenas pausa ou retoma
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
            updateButtonIcon();
        }
    }


    // Adiciona o evento de clique ao botão
    playButton.addEventListener('click', togglePlayPause);

    // Atualiza o ícone sempre que o áudio muda de estado por qualquer motivo
    audio.addEventListener('pause', updateButtonIcon);
    audio.addEventListener('play', updateButtonIcon);

    // Garante que o ícone inicial seja o de Play
    updateButtonIcon();
});