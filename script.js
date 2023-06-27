window.onload = function() {
    const progressBar = document.getElementById('progress-bar');
    const focoTimeInput = document.getElementById('foco-time');
    const descansoTimeInput = document.getElementById('descanso-time');
    const focoColorInput = document.getElementById('foco-color');
    const descansoColorInput = document.getElementById('descanso-color');
    const tempoTotalInput = document.getElementById('tempo-total');
    const startButton = document.getElementById('start-button');
    const barContainer = document.getElementById('bar-container');
  
    let timerInterval;
    let currentWidth = 0;

    // 2 booleanos para  os 4 estados do botão
    let isRunning = false; // quando verdadeiro o programa estará contando o tempo do foco ou descanço
    let modeFlipper = true; // quando verdadeiro está no modo foco e quando falso no modo  descanso 

    // music timeoutcalback
    let playnMusic = false;
  
    function startTimer(color, innerTime, totalt) {

        const intervalDuration = 100; // Intervalo de atualização da barra (em milissegundos)
        progressBar.style.display = 'block'; // Exibir a barra de progresso
        progressBar.style.backgroundColor = color;
        document.title = 'appFoco - Foco';

      
        const containerWidth = parseFloat(getComputedStyle(barContainer).width);
        const targetWidth = containerWidth;
        const numberOfIncrements = innerTime / intervalDuration;
        const incrementFloat = targetWidth / numberOfIncrements;

        const increment = parseFloat(incrementFloat.toFixed(4));
      
        timerInterval = setInterval(function() {    
          currentWidth += increment;
          updateTitle(currentWidth / targetWidth);

          if (!isRunning) {
            return;    
          }

          function updateTitle(progress) {
            const progressPercent = Math.round(progress * 100);
            if(modeFlipper) {document.title = `(${progressPercent}%) appFoco - Foco`}
            else {document.title = `(${progressPercent}%) appFoco - Descanso`}
          }

          if (currentWidth >= targetWidth) {
            document.title = 'appFoco';
            if (modeFlipper) {modeFlipper = false; currentWidth = 0; clearInterval(timerInterval); 
              if (totalt > 0) {totalt = totalt - innerTime; tempoTotalInput.value = totalt/60000; startDescanso(); return;} else return; }
            if (!modeFlipper) {modeFlipper = true; currentWidth = 0; clearInterval(timerInterval); 
              if (totalt > 0 ) {totalt = totalt - innerTime; tempoTotalInput.value = totalt/60000; startFoco(); return;} else return; }
          }
        
          progressBar.style.width = currentWidth + 'px';
        }, intervalDuration);
      }

    function startFoco() {
      const focoSoundInput = document.getElementById('foco-sound');
      if (focoSoundInput) {
        startFocoMusic();
      }

      const focoTime = parseInt(focoTimeInput.value, 10) * 60 * 1000; // Tempo de foco em milissegundos
      let tempoTotal = parseInt(tempoTotalInput.value, 10) * 60 * 1000; // Tempo total em minutos
      const focoColor = focoColorInput.value;
      
      if (tempoTotal <= 0) {startButton.innerText = 'Start appFoco'; isRunning = false; modeFlipper = true; clearInterval(timerInterval); 
                            progressBar.style.width = 0 + 'px'; console.log("O TEMPO DE FOCO TERMINOU"); return;}  
      startTimer(focoColor, focoTime, tempoTotal);
      if (!isRunning){return;}
      
      setTimeout(function() {
        clearInterval(timerInterval);
          
          startDescanso();   
      }, focoTime);
    }
  
    function startDescanso() {
      const focoSoundInput = document.getElementById('descanso-sound');
      if (focoSoundInput) {
        startDescansoMusic();
      }

      console.log("START DESCANSO");
      const descansoTime = parseInt(descansoTimeInput.value, 10) * 60 * 1000; // Tempo de descanso em milissegundos
      let tempoTotal = parseInt(tempoTotalInput.value, 10) * 60 * 1000; // Tempo total em minutos
      const descansoColor = descansoColorInput.value;
      
      if (tempoTotal <= 0) {startButton.innerText = 'Start appFoco'; isRunning = false; modeFlipper = true; clearInterval(timerInterval); 
                            progressBar.style.width = 0 + 'px'; console.log("O TEMPO DE FOCO TERMINOU");  return;} 
      startTimer(descansoColor, descansoTime, tempoTotal);
      if (!isRunning) {return;}
  
      setTimeout(function() {
        clearInterval(timerInterval);
          startFoco();
      }, descansoTime);
    }
  
    startButton.addEventListener('click', function() {
      if      (!isRunning && modeFlipper)       {   startButton.innerText = 'Pause appFoco'; startFoco(); isRunning = true;} 
      else if (isRunning && modeFlipper)   {   startButton.innerText = 'Start appFoco'; isRunning = false; clearInterval(timerInterval);}
      else if (!isRunning && !modeFlipper) {   startButton.innerText = 'Pause appFoco'; startDescanso(); isRunning = true}
      else if (isRunning && !modeFlipper)  {   startButton.innerText = 'Start appFoco'; isRunning = false; clearInterval(timerInterval);} 
      }

    );

// ---------------------------------------------------------------------------------------------------------------------------------------//
                                            // REFERÊNCIA DA PARTE MUSICAL //

    function startFocoMusic() {
      const focoSoundInput = document.getElementById('foco-sound');
      let timeOut = document.getElementById('foco-sound-time');
      let calback = parseInt(timeOut.value);
      const focoSound = new Audio();
      playnMusic = true;
      console.log(playnMusic);
    
      function playFocoSound() {
        const file = focoSoundInput.files[0];
        const fileURL = URL.createObjectURL(file);
        focoSound.src = fileURL;
        focoSound.currentTime = 0; // Reiniciar o áudio para o início
        focoSound.play();
    
        if (playnMusic) {
          function prepareReturn() {
            calback--;
            console.log(calback);
            if (calback <= 0) {
              clearInterval(intervalId); // Parar o intervalo quando o calback atingir zero
              playnMusic = false;
              focoSound.pause(); // Parar a reprodução do áudio
              focoSound.currentTime = 0; // Reiniciar o tempo do áudio
            }
          }
    
          const intervalId = setInterval(prepareReturn, 1000);
        }
      }
    
      focoSoundInput.addEventListener('change', playFocoSound);
      if (focoSoundInput.files.length === 0) {
        return; // Retorna se nenhum arquivo de música foi carregado
      }
      playFocoSound(); // Chamar a função diretamente para reproduzir o áudio
    }
    
    function startDescansoMusic() {
      const descansoSoundInput = document.getElementById('descanso-sound');
      let timeOut = document.getElementById('descanso-sound-time');
      const descansoSound = new Audio();
      playnMusic = true;
      let calback = parseInt(timeOut.value);
      playnMusic = true;
      console.log(playnMusic);
    
      function playDescansoSound() {
        const file = descansoSoundInput.files[0];
        const fileURL = URL.createObjectURL(file);
        descansoSound.src = fileURL;
        descansoSound.currentTime = 0; // Reiniciar o áudio para o início
        descansoSound.play();
    
        if (playnMusic) {
          function prepareReturn() {
            calback--;
            console.log(calback);
            if (calback <= 0) {
              clearInterval(intervalId); // Parar o intervalo quando o calback atingir zero
              playnMusic = false;
              descansoSound.pause(); // Parar a reprodução do áudio
              descansoSound.currentTime = 0; // Reiniciar o tempo do áudio
            }
          }
    
          const intervalId = setInterval(prepareReturn, 1000);
        }
      }
    
      descansoSoundInput.addEventListener('change', playDescansoSound);
      if (descansoSoundInput.files.length === 0) {
        return; // Retorna se nenhum arquivo de música foi carregado
      }
      playDescansoSound(); // Chamar a função diretamente para reproduzir o áudio
    }    
  };
