const constraints = { audio: true, video: true }
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    // stream 就是咱們的聲音與影像
    const audioContext = new AudioContext;
    const audioInput = audioContext.createMediaStreamSource(stream);

    const rec = new Recorder(audioInput);
    // 這個聲音串流一開時，就開始進行錄製。
    rec.record()

    setTimeout(function () {
    // 然後在 10 秒後結束錄製，並產生個語音控制項與下載連結。
    rec.stop();
    createAudioController(rec);
    createDownloadLink(rec);
    }, 10000);
})
.catch((err) => {
    console.log('err', err)
})

function createAudioController(rec) {
    rec && rec.exportWAV((blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;

        main.appendChild(audio);
    });
}

function createAudioController(rec) {
    rec && rec.exportWAV((blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;

        main.appendChild(audio);
    });
}