/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';

// Put variables in global scope to make them available to the browser console.
const selectCamera = document.getElementById('selectCamera');

let constraints = null;
let DEVICES = [];
let final = null;
let cameraString = '';
navigator.mediaDevices.enumerateDevices().then(function (devices) {
    var arrayLength = devices.length;
    for (var i = 0; i < arrayLength; i++) // console.log('devices', devices)
    {
        var tempDevice = devices[i];
        //FOR EACH DEVICE, PUSH TO DEVICES LIST THOSE OF KIND VIDEOINPUT (cameras)
        //AND IF THE CAMERA HAS THE RIGHT FACEMODE ASSING IT TO "final"
        if (tempDevice.kind == 'videoinput') {
            console.log('tempDevice', tempDevice);
            DEVICES.push(tempDevice);
            if (tempDevice.facingMode == 'environment' || tempDevice.label.indexOf('facing back') >= 0) {
                final = tempDevice;
            }
        }
    }
    if (final == null) {
        final = DEVICES[0];
    }
    console.log('DEVICES', DEVICES);
    DEVICES.forEach(function (row) {
        cameraString += `<option value=${row.deviceId}>${row.label}</option>`;
    });
    selectCamera.innerHTML = cameraString;
    constraints = {
        audio: false,
        video: {
            deviceId: { exact: final.deviceId },
        },
    };
    selectCamera.addEventListener('change', function (e) {
        constraints = {
            audio: false,
            video: {
                deviceId: { exact: e.target.value },
            },
        };
    });
});

// selectCamera.addEventListener('change', function(e) {
//     if(DEVICES.length > 2 ) {
//         constraints = {
//             audio: false,
//             video: {
//                 deviceId: {exact: e.target.value}
//                 }
//             };
//     }
// })
selectCamera.addEventListener('change', async function (e) {
    constraints = {
        audio: false,
        video: {
            deviceId: { exact: e.target.value },
        },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const video = document.getElementById('gum-local');
    const video2 = document.getElementById('gum-local2');
    video2.srcObject = stream;
    if (video2.srcObject !== '') {
        video.classList.add('fix');
    }
});

function handleSuccess(stream) {
    console.log('stream', stream);
    const video = document.getElementById('gum-local');
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();
    console.log('Got stream with constraints:', constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    window.stream = stream; // make variable available to browser console
    console.log('stream', stream);
    video.srcObject = stream;

    document.getElementById('videoTracks').textContent = videoTracks[0] !== undefined ? videoTracks[0].kind : '無裝置';
    document.getElementById('audioTracks').textContent = audioTracks[0] !== undefined ? audioTracks[0].kind : '無裝置';
    // const audioCtx = new AudioContext();
    // const source = audioCtx.createMediaStreamSource(stream);

    // const biquadFilter = audioCtx.createBiquadFilter();
    // biquadFilter.type = "lowshelf";
    // biquadFilter.frequency.value = 1000;
    // biquadFilter.gain.value = range.value;
    // source.connect(biquadFilter);
    // biquadFilter.connect(audioCtx.destination);
}

function handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
        const v = constraints.video;
        errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
        errorMsg(
            'Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.'
        );
    }
    errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
        console.error(error);
    }
}

async function init(e) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
        e.target.disabled = true;
    } catch (e) {
        handleError(e);
    }
}

document.querySelector('#showVideo').addEventListener('click', (e) => init(e));
// const constraints = { audio: true, video: true }
// navigator.mediaDevices.getUserMedia(constraints)
// .then((stream) => {
//     // stream 就是咱們的聲音與影像
//     const audioContext = new AudioContext;
//     const audioInput = audioContext.createMediaStreamSource(stream);

//     const rec = new Recorder(audioInput);
//     // 這個聲音串流一開時，就開始進行錄製。
//     rec.record()

//     setTimeout(function () {
//     // 然後在 10 秒後結束錄製，並產生個語音控制項與下載連結。
//     rec.stop();
//     createAudioController(rec);
//     createDownloadLink(rec);
//     alert('rec', rec)
//     }, 10000);
// })
// .catch((err) => {
//     alert('err', err)
//     console.log('err', err)
// })

function createAudioController(rec) {
    rec &&
        rec.exportWAV((blob) => {
            const url = URL.createObjectURL(blob);
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = url;

            root.appendChild(audio);
        });
}

function createAudioController(rec) {
    rec &&
        rec.exportWAV((blob) => {
            const url = URL.createObjectURL(blob);
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = url;

            root.appendChild(audio);
        });
}

// const frontBtn = document.getElementById('front');
// const backBtn = document.getElementById('back');
// frontBtn.addEventListener('click', () => changeCamera("user"))
// backBtn.addEventListener('click', () => changeCamera("environment"))

// function changeCamera(exact) {
//     constraints = {...constraints, facingMode: { exact }}
// }
