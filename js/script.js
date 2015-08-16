(function(){
    var player = document.querySelector("#player");
    var playButton = document.querySelector(".play");
    var stopButton = document.querySelector(".stop");
    var statusText = document.querySelector(".status");
    var volumeSlider = document.querySelector('input');

    var url = player.dataset['sound'];
    var upload_list = document.querySelector('.upload_list');
    var audio_item = document.createElement('p');

    var context = new AudioContext();
    var source = context.createBufferSource();
    var volume = context.createGain();


    //var request = new XMLHttpRequest();
    //request.open('GET', url, true);
    //request.responseType = 'arraybuffer';
    //
    //request.onload = function () {
    //    console.log('audio loaded');
    //    statusText.innerHTML = 'Decoding audio, please wait...';
    //    context.decodeAudioData(request.response, function (buffer) {
    //        console.log('audio decoded.');
    //        statusText.innerHTML = 'Click play to start.';
    //        source.buffer = buffer;
    //        source.connect(volume);
    //        volume.connect(context.destination);
    //    });
    //};
    //request.send();
    //console.log('start loading audio from ' + url);

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
                audio_item.title = file.name;
                audio_item.innerHTML = file.name;
                statusText.innerHTML = 'Decoding audio, please wait...';

                context.decodeAudioData(event.target.result, function (buffer) {
                    console.log('audio decoded.');

                    statusText.innerHTML = 'Click play to start.';
                    source.buffer = buffer;
                    source.connect(volume);
                    volume.connect(context.destination);
                });

            });

            reader.readAsArrayBuffer(file);
        }
        else {
            alert("это не музыкальный файл");
        }
    }



    playButton.addEventListener("click", function(){
        source.start(0);
    });

    stopButton.addEventListener("click", function(){
        source.stop(0);
    });

    volumeSlider.addEventListener("change", function(){
       console.log(volumeSlider.value);
        volume.gain.value = volumeSlider.value;

    });

    audio_item.addEventListener("click", function(){
       source.dataset['sound'] = this.dataset['sound'];
    });

})();