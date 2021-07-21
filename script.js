/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';

// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
    console.log('stream', stream)
  const video = document.querySelector('video');
  const videoTracks = stream.getVideoTracks();
  const audioTracks = stream.getAudioTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;

  const audioContext = new AudioContext;
  const audioInput = audioContext.createMediaStreamSource(stream)
  console.log('audioInput', audioInput)
  const rec = new Recorder(audioInput);
  rec.record()

  setTimeout(function () {
      console.log('apple')
    // 然後在 10 秒後結束錄製，並產生個語音控制項與下載連結。
    rec.stop();
    createAudioController(rec);
    createDownloadLink(rec);
    }, 5000);
}

function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    const v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
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

document.querySelector('#showVideo').addEventListener('click', e => init(e));
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
    rec && rec.exportWAV((blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;

        root.appendChild(audio);
    });
}

function createAudioController(rec) {
    rec && rec.exportWAV((blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = url;

        root.appendChild(audio);
    });
}