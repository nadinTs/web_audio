(function(){


    var player = document.querySelector("#player");
    var playButton = document.querySelector(".play");
    var stopButton = document.querySelector(".stop");
    var statusText = document.querySelector(".status");
    var volumeSlider = document.querySelector('input');

    var url = player.dataset['sound'];
    var upload_list = document.querySelector('.upload_list');
    var file_name = '';

    var audioCtx = new AudioContext();
    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    var source = null;
    var volume = audioCtx.createGain();


    player.querySelector('#upload_audio').addEventListener('change', function(){
       var files = this.files;

        for (var i = 0; i < files.length; i++){
            loadFile(files[i]);
        }
    });

    function loadFile(file) {
        if (file.type.match(/audio.*/ )) {
            var reader = new FileReader();
            console.log("start loading audio file " + file.name);

            reader.addEventListener('load', function(event) {
                console.log('audio file loaded, decoding...');
                statusText.innerHTML = 'Decoding audio, please wait...';

                audioCtx.decodeAudioData(event.target.result, function (buffer) {
                    console.log('audio decoded.');
                    file_name = file.name;
                    statusText.innerHTML = 'Click play to start.';
                    source = audioCtx.createBufferSource();
                    source.buffer = buffer;
                    source.connect(analyser);
                    analyser.connect(volume);
                    volume.connect(audioCtx.destination);
                });

            });

            reader.readAsArrayBuffer(file);
        }
        else {
            alert("это не музыкальный файл");
        }
    }

    var canvas = document.querySelector('#visual');
    var canvasCtx = canvas.getContext('2d');
    var WIDTH = 300;
    var HEIGHT = 150;

    function draw() {
        drawVisual = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

            x += barWidth + 1;
        }
    }

    playButton.addEventListener("click", function(){
        draw();
        if (source) {
            source.start(0);
            statusText.innerHTML = file_name;
        }
    });

    stopButton.addEventListener("click", function(){
        if (source) {
            source.stop(0);
            statusText.innerHTML = "Please select file to play";
            source = null;
        }
    });

    volumeSlider.addEventListener("change", function(){
        console.log(volumeSlider.value);
        volume.gain.value = volumeSlider.value;

    });

})();