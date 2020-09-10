// *
// * Copyright 2020 Modaka Technologies ( https://modakatech.com )
// *
// * you are not use this file except in compliance with the License.
// * This file is used only for testing and none else can use any part of this code without agreement from Modaka Technologies.  
// * Unless required by applicable law or agreed to in writing, software
// * See the License for the specific language governing permissions and
// * limitations under the License.

let stream = document.getElementById("inputVideo"),
  capture = document.createElement("canvas"),
  snapshot = document.createElement("div"),
  img = new Image(),
  globalCapturedStatus = false,
  flipMethod = 1;
// var capture = false;
let FRONT_CAM = 1, BACK_CAM = 2;
let ipad_size = 1024;
let winsize = 640;

var canvasVideo,ctxVideo;

snapshot.id = "snapshot";
snapshot.style.position = "absolute";
snapshot.style.overflow = "hidden";
snapshot.style.zIndex = 0;
snapshot.classList.add("hide");
document.getElementById("maincamera").appendChild(snapshot);

let cameraStream = null, global_random_qr_key;

function startStreaming(method) {
  let mediaSupport = 'mediaDevices' in navigator;
  if (mediaSupport && null == cameraStream) {
    navigator.mediaDevices.getUserMedia({
      video: {  
        width:  (screen.width>640) ? 1280 : {ideal: 640 }, 
        height: (screen.width>640) ? 720 : { ideal: 480 },
        facingMode: (method == 1) ? 'user' : {exact: 'environment'}
      }
    })
    .then(camSuccess)
      // .then(function (mediaStream) {
      //   cameraStream = mediaStream;
      //   // stream.srcObject = mediaStream;
      //   // stream.play(); 
      //   camSuccess()
      // })
      .catch(function (err) {
        show("nonecamera");
        console.log("Unable to access camera: " + err);
      });
  } else {
    alert('Your browser does not support media devices.');
    return;
  }
  // setCanvasSize(stream, $('#overlay').get(0), $('#overlay2').get(0), $('#overlay3').get(0), 
  // $('#overlayVideo').get(0));
  // try{
  //   startProcessing()
  //   }
  // catch(e){
  //   console.log(e)
  // }

}

function stopStreaming() {
  if (null != cameraStream) {
    let track = cameraStream.getTracks()[0];
    track.stop();
    stream.load();
    cameraStream = null;
  }
}

function flipCamera() { 
  console.log("flipCamera");  
  stopStreaming() 
  if(flipMethod == FRONT_CAM) { 
    startStreaming(BACK_CAM);  
    // startProcessing();
    var inputVideo = document.getElementById('inputVideo');
    inputVideo.style.webkitTransform = 'rotateY('+0+'deg)';
    inputVideo.style.mozTransform    = 'rotateY('+0+'deg)';
    inputVideo.style.transform       = 'rotateY('+0+'deg)';
    flipMethod = BACK_CAM; 
  } else {  
    startStreaming(FRONT_CAM);  
    flipMethod = FRONT_CAM; 
    // startProcessing();
    var inputVideo = document.getElementById('inputVideo');
    inputVideo.style.webkitTransform = 'rotateY('+180+'deg)';
    inputVideo.style.mozTransform    = 'rotateY('+180+'deg)';
    inputVideo.style.transform       = 'rotateY('+180+'deg)';
  } 
}

function camSuccess( stream ) {
    cameraStream = stream;
    const videoEl = $('#inputVideo').get(0);
    if ("srcObject" in videoEl) {
        videoEl.srcObject = stream;
        currentStream = stream;
    } else {
        console.log("srcObject doesn't exist in videoEl");
        videoEl.src = (window.URL && window.URL.createObjectURL(stream));
    }
    videoEl.onloadedmetadata = function() {
        videoEl.play();
        if (isCameraON) {
            //switch camera called
            setCanvasSize(videoEl, $('#overlay').get(0), $('#overlay2').get(0), $('#overlay3').get(0), 
            $('#overlayVideo').get(0));
            setSwipeListeners();
            return;
        }
        document.getElementById("loadingAnim").style.display = "block";
        setCanvasSize(videoEl, $('#overlay').get(0), $('#overlay2').get(0), $('#overlay3').get(0), 
        $('#overlayVideo').get(0));
        if(isSafar12){
          init3DSpectaclesThMethod();
        }
        else{
          init3DSpectacles();
        }
        
        isCameraON = true;       

    }
}

function captureSnapshot() {
  let overlay3d = document.getElementById("overlay3");
  globalCapturedStatus = true;
  global_random_qr_key = cameraStream ?
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) :
    "Nonecamera";
  
  if (null != cameraStream) {

    let ctx = capture.getContext('2d'), wh, ht, ratio;
    ratio = stream.videoWidth / stream.videoHeight ;
    wh = global_media_width;
    ht = global_media_height;
    let delta = (ht * ratio - wh) / 2;
    if(ht * ratio >= wh) {
        capture.width = ht * ratio;
        capture.height = ht;
        if (flipMethod == FRONT_CAM){
          ctx.save();
          ctx.scale(-1,1);
          ctx.drawImage(canvasVideo, -ht * ratio, 0, ht * ratio, ht); 
          ctx.restore();  
        }else{
          ctx.drawImage(canvasVideo, 0, 0, ht * ratio, ht);
        }
        
        ctx.drawImage(overlay3d, 0, 0, ht * ratio, ht);

        snapshot.innerHTML = '';
        snapshot.appendChild(capture);
        snapshot.style.left = -delta + "px";
        snapshot.style.top = "0px";
        snapshot.style.width = ht * ratio + "px";
        snapshot.style.height = "100%";
        snapshot.style.visibility = "hidden"

    } else {
        capture.width = wh;
        capture.height = wh / ratio;
        delta = (wh / ratio - ht) / 2;

        if (flipMethod == FRONT_CAM){
          ctx.save();
          ctx.scale(-1,1);
          ctx.drawImage(canvasVideo, -capture.width, 0, capture.width, capture.height); 
          ctx.restore();
        }else{
          ctx.drawImage(canvasVideo, 0, 0, capture.width, capture.height);
        }
        ctx.drawImage(overlay3d, 0, 0, capture.width, capture.height);

        snapshot.innerHTML = '';
        snapshot.appendChild(capture);
        snapshot.style.left = "0px";
        snapshot.style.top = -delta + "px";
        snapshot.style.width = wh + "px";
        snapshot.style.height = capture.height - delta + "px";
    }
    show("snapshot");
    show("logo");
  }
}

function show(id) {
  document.getElementById(id).classList.remove("hide");
  document.getElementById(id).classList.add("show");
}

function hide(id) {
  document.getElementById(id).classList.remove("show");
  document.getElementById(id).classList.add("hide");
}

function removeSnapshot() {
  globalCapturedStatus = false;
  hide("snapshot");
  hide("logo");
}

function downSnapshot() {
  console.log("downSnapshot")
  if(!cameraStream) {
    console.log("downSnapshot")
    return;
  }
  let a = document.createElement('a'), ctx = capture.getContext('2d');

  ctx.drawImage(document.getElementById("logoimg"), capture.width - 130, 10, 120, 50);

  a.href = capture.toDataURL('image/jpg');
  a.download = "snapshot.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function setCanvasSize(videoEl, canvas, canvas2, canvas3, canvas4){
    console.log("setCanvasSize",videoEl.videoWidth,videoEl.videoHeight)
    
    width = videoEl.videoWidth //* faceWidthCropRatio;
    height = videoEl.videoHeight //* faceHeightCropRatio;

    // console.log("set",document.getElementById("maincamera").style.width)

    // console.log(width,height)
    canvas.width = width;
    canvas.height = height;
    canvas2.width = width;
    canvas2.height = height;
    canvas3.width = width;
    canvas3.height = height;
    canvas4.width = width;
    canvas4.height = height;
    canvasVideo = document.getElementById("overlayVideo");
    if (flipMethod == 1){
      console.log("qqqq",flipMethod)
      stream.style.transform = 'rotateY(' + 180 + 'deg)';
      canvasVideo.style.transform = 'rotateY(' + 180 + 'deg)';
    }else{
      console.log("flip",flipMethod)
      stream.style.transform = 'rotateY(' + 0 + 'deg)';
      canvasVideo.style.transform = 'rotateY(' + 0+ 'deg)';
    }
    ctxVideo = canvasVideo.getContext("2d");
    canvasVideoWidth = canvasVideo.width;
    canvasVideoHeight = canvasVideo.height;
    // if(screen.width < 640){
    //   s2vRatio =  screen.width/width ;

    //   console.log("s2vRatio",s2vRatio)
    //   var centerContent = document.getElementById("maincamera");
    //   centerContent.style.transform = "scale("+s2vRatio+","+s2vRatio+")";
    //   centerContent.style.webkitTransform = "scale("+s2vRatio+","+s2vRatio+")";
    //   centerContent.style.mozTransform = "scale("+s2vRatio+","+s2vRatio+")";
    //   var newHeightCanvas = s2vRatio * height;
    //   // var logoHeight = 40.59;
    //   // var distTop = newHeightCanvas + logoHeight;
    //   // var totalheight = distTop + 42 + 50 + 13;
    //   // if(totalheight > $(window).height()){
    //   //   distTop = $(window).height() - 105;
    //   // }
    //   // else{
    //   //   var space = $(window).height() - (distTop+105);
    //   //   distTop = distTop + space/2;
    //   //   }
    // }
}
