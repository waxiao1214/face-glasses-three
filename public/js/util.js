var winSize;
var criteria;
var maxLevel;
var DIST_VAL;
var p_lm,st,err,c_lm;
var srcMat,c_gray,p_gray;
var framesPerSec = 30;
var current_LM = [];
var previous_LM = [];
var arr = [];
var flag = -1;
var canvasInput = null;
var canvasInputCtx = null;
var imageData;
let video,videoWidth,videoHeight;

async function startProcessing(){

  winSize = new cv.Size(11,11);
  criteria = new cv.TermCriteria(cv.TERM_CRITERIA_EPS | cv.TERM_CRITERIA_COUNT, 10, 0.03);
  maxLevel = 2;
  DIST_VAL = 3;

  p_lm = new cv.Mat();
  st = new cv.Mat();
  err = new cv.Mat();
  c_lm = new cv.Mat();

  video = $('#inputVideo').get(0);
  let overlayVideo = $('#overlayVideo').get(0);
  videoWidth = video.videoWidth;
  videoHeight = video.videoHeight;
  canvasInput = document.createElement('canvas');
  canvasInput.width = videoWidth;
  canvasInput.height = videoHeight;
  canvasInputCtx = canvasInput.getContext('2d');

  srcMat = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);
  c_gray = new cv.Mat(videoHeight,  videoWidth, cv.CV_8UC4);
  p_gray = new cv.Mat(videoHeight,  videoWidth, cv.CV_8UC4);

  src_tmp = new cv.Mat();
  faceMat = new cv.Mat();
  dsize = new cv.Size();

  if(cntBrowser == "safari"){
    $('#overlayVideo').get(0).style.webkitTransform = "rotateY(180deg)";
  }
  startVideo()
  }//end of startprocessing

function startVideo(){
  setInterval(function () {
          onPlay()
          clearInterval(instructionInterval);
      }, 1000/framesPerSec);
}


async function onPlay(){
  // console.log(window.innerWidth, window.innerHeight)
try{
  canvasInputCtx.drawImage(video, 0, 0);

  imageData = canvasInputCtx.getImageData(0, 0, videoWidth, videoHeight);

  srcMat.data.set(imageData.data);

  var predictions = await faceModel.estimateFaces(imageData);

  if (predictions.length>0){
    var keypoints_sil = predictions[0].annotations.silhouette;
    var keypoints_luo = predictions[0].annotations.lipsUpperOuter;
    var keypoints_llo = predictions[0].annotations.lipsLowerOuter;

    var keypoints_lebu = predictions[0].annotations.leftEyebrowUpper;
    var keypoints_rebu = predictions[0].annotations.rightEyebrowUpper;

    var keypoints_rel = predictions[0].annotations.rightEyeLower2;
    var keypoints_lel = predictions[0].annotations.leftEyeLower2;

    var keypoints_nrc = predictions[0].annotations.noseRightCorner;
    var keypoints_nlc = predictions[0].annotations.noseLeftCorner;
    var keypoints_mid = predictions[0].annotations.midwayBetweenEyes;
    var keypoints=[];

    keypoints.push(keypoints_rebu[1]);
    keypoints.push(keypoints_rebu[6]);
    keypoints.push(keypoints_lebu[6]);
    keypoints.push(keypoints_lebu[1]);
    keypoints.push(keypoints_rel[0]);
    keypoints.push(keypoints_rel[8]);
    keypoints.push(keypoints_lel[8]);
    keypoints.push(keypoints_lel[0]);
    keypoints.push(keypoints_nrc[0]);
    keypoints.push(keypoints_nlc[0]);
    keypoints.push(keypoints_luo[0]);
    keypoints.push(keypoints_llo[9]);
    keypoints.push(keypoints_llo[4]);
    keypoints.push(keypoints_sil[18]);
    keypoints.push(keypoints_sil[29]);
    keypoints.push(keypoints_sil[7]);
    keypoints.push(keypoints_mid[0])

    //let pose = headpose(keypoints);
    let pose;
    pose = euler_ang_3(keypoints[14],keypoints[15],keypoints[13]);
    if(!globalCapturedStatus){
      if (screen.width<1024){
        render3DSpectaclesThMethod(pose[0], pose[1], pose[2], keypoints);
        // drawLandmarks(keypoints);
      }else{

         //drawLandmarks(keypoints);
        render3DSpectaclesThMethod(pose[0], pose[1], pose[2], keypoints);
      }
    }//end of globalcapture

    }
    else{
      if (!globalCapturedStatus){
        clear3DCanvas();
      }
    }
  }
  catch(exception){
    console.log("exception: ",exception);
  }

}



function euclidean_dts(currPoints, oldPoints){
    let sum = 0.0
    let mean = 0.0
    let variance = 0.0
    let diffs = new Array();

    if (currPoints.length == oldPoints.length){
      for(i= 0; i < currPoints.length; i+=2){
        dist =  Math.sqrt( Math.pow((currPoints[i]-oldPoints[i]), 2) + Math.pow((currPoints[i+1]-oldPoints[i+1]), 2) );
        sum += dist;
        diffs.push(dist);
      }
       mean = sum / diffs.length;
       return mean;
    }
    return variance;
}


//Drawing


function drawPoint(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

function drawLandmarks(keypointsArray){
    var canvasOverlay = document.getElementById("overlay");
    // console.log("aca",canvasOverlay.height)
    canvasOverlay.style.zIndex = "5";
    canvasOverlay.width = stream.videoWidth;
    canvasOverlay.height = stream.videoHeight;

    var ctx = canvasOverlay.getContext("2d");
    ctx.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
    ctx.beginPath();
    var lineWidth = 4;
    var ptOffset = lineWidth / 2;
    ctx.fillStyle = 'yellow';
    var num = 0;
    // if(cameraSelected == FRONT_CAM){
    for (let i = 0; i < keypointsArray.length; i++) {
        const x = keypointsArray[i][0];
        const y = keypointsArray[i][1];
        //drawPoint(ctx, canvasOverlay.width - (x - 2), y - 2, 3);
        ctx.fillText(i.toString(),  canvasOverlay.width - x, y);
      }
    // }
    // else{
    //     for (let i = 0; i < keypointsArray.length; i++) {
    //         const x = keypointsArray[i][0];
    //         const y = keypointsArray[i][1];
    //         drawPoint(ctx, (x - 2), y - 2, 3);
    //         ctx.fillText(i.toString(), x, y);
    //       }
    // }

    drawVideo();
}

function drawVideo() {
    // canvasVideo.style.filter = "contrast(120%)"
    ctxVideo.putImageData(imageData, 0,0);
    // ctxVideo.drawImage(v, 0,0);
    // ctxVideo.drawImage(video, crop_val, 0, videoWidth-(2*crop_val), videoHeight, 0, 0, videoWidth, videoHeight)
}

function drawFaceNotFound(){
    //clear canvasOverlay and display face not found image
    // clearCanvas("Earrings");
    leftctx.clearRect(0, 0, midcanvas.width, midcanvas.height);
    rightctx.clearRect(0, 0, midcanvas.width, midcanvas.height);

    var frameImage=new Image();
    frameImage.src="./img/arrow/face_shape2.png";
    frameImage.onload=function(){
      let s2vRatio =  screen.width/midcanvas.width;
      midctx.clearRect(0, 0, midcanvas.width, midcanvas.height);
      var faceWidth2 = midcanvas.width/3 + s2vRatio * midcanvas.width/3;
      var faceHeight = 1.2 * faceWidth2;
      if(screen.width < 1024){
          faceWidth2 = faceWidth2 * 1.5;
          faceHeight = faceHeight * 2.2;
      }
      var faceX = (midcanvas.width - faceWidth2)/2;
      var faceY = midcanvas.height/15;
      if (screen.width<1024){
        midctx.drawImage(frameImage,  0, 0, frameImage.width, frameImage.height, -faceX*6, faceY*2, faceWidth2*0.5, faceHeight*0.5);
      }
      else{
        midctx.drawImage(frameImage,  0, 0, frameImage.width, frameImage.height, faceX*2, faceY*2, faceWidth2*0.5, faceHeight*0.5);
      }
    }
}
