

var occluderObj;
var glassMat;
var stickLMat, stickRMat;
var frameMat;
var glassName;
var frameName;
var stickLName, stickRName;
var opacity;
var reflection;
var spectsX, spectsY, spectsZ;
var prevSpectsX = 0, prevSpectsY = 0, prevSpectsZ = 0;
var faceLm1X, faceLm1Y;
var prevFaceLm1X = 0, prevFaceLm1Y = 0;
var prevPoseX = 0, prevPoseY = 0, prevPoseZ = 0;
var prevFaceLm = [];
var objName;
var noOfFaceNotFound = 0;
var specsObj;
var numLoaded = 0;
var angleThresh = 1;
// var mesh;

function create_threejsOccluder(occluderURL){
    //loads face json file
    const occluderMesh=new THREE.Mesh();
    new THREE.BufferGeometryLoader().load(occluderURL, function(occluderGeometry){
        const mat=new THREE.ShaderMaterial({
            vertexShader: THREE.ShaderLib.basic.vertexShader,
            fragmentShader: "precision lowp float;\n void main(void){\n gl_FragColor=vec4(1.,0.,0.,1.);\n }",
            uniforms: THREE.ShaderLib.basic.uniforms,
            colorWrite: false
        });
        //occluderGeometry.computeVertexNormals(); mat=new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
        occluderMesh.renderOrder=-1; //render first
        occluderMesh.material=mat;
        occluderMesh.geometry=occluderGeometry;
        if (typeof(callback)!=='undefined' && callback) callback(occluderMesh);
    });
    return occluderMesh;
}

function degToRad(x){
   return x*(Math.PI/180)
}

function init3DSpectacles(){
    console.log("init3DSpectacles entered");
    // console.log(THREE.Cache.enabled , "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")
    THREE.Cache.clear()
    var refCube = new THREE.CubeTextureLoader()
                    .setPath( 'models/reflection/' )
                    .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );

    // var env = [];
    // for (let i = 0; i < 6; i++) {
    //      env.push("models/reflection/a1.jpg");
    //   }
    // var refCube = new THREE.CubeTextureLoader().load( env );

    imgName = prodImagePaths[0];
    var fName = imgName.substring(0, imgName.length-4);
    glassName = fName + "-glass.png";
    frameName = fName + "-frame.png";
    stickLName = fName + "-stickL.png";
    stickRName = fName + "-stickR.png";
    opacity = 1;
    reflection = 0.55;

    //drawing necklace 3D image using three js
    glassMat = new THREE.MeshBasicMaterial( {
            side:THREE.DoubleSide,
            combine: THREE.MixOperation,
            envMap:refCube,
            reflectivity: reflection,
            opacity:opacity,
            transparent:true,
            // specular: 0xBABABA,
            depthWrite:false,
            // color: 0x000066
        });
     glassMat.precision = "mediump";

    frameMat = new THREE.MeshBasicMaterial( {
            side:THREE.DoubleSide,
            combine: THREE.MixOperation,
            transparent:true,
            // shininess: 100,
            color: 0xcccccc
    });

    frameMat.precision = "mediump";

    //mirroring texture
    let textureStickLT = new THREE.TextureLoader().load( "models/"+stickLName);
    textureStickLT.wrapS = THREE.RepeatWrapping;
    textureStickLT.repeat.x = - 1;

    stickLMat = new THREE.MeshBasicMaterial( {
                side:THREE.DoubleSide,
                combine: THREE.MixOperation,
                transparent:true,
                precision: "mediump",
                color: 0xcccccc
        });

    let textureStickRT = new THREE.TextureLoader().load( "models/"+stickRName);
    textureStickRT.wrapS = THREE.RepeatWrapping;
    textureStickRT.repeat.x = - 1;

    stickRMat = new THREE.MeshBasicMaterial( {
                side:THREE.DoubleSide,
                combine: THREE.MixOperation,
                transparent:true,
                precision: "mediump",
                color: 0xcccccc
        });

    let textureframe = new THREE.TextureLoader().load( "models/"+frameName);
    textureframe.wrapS = THREE.RepeatWrapping;
    textureframe.repeat.x = - 1;

    let textureglass = new THREE.TextureLoader().load( "models/"+glassName);
    textureglass.wrapS = THREE.RepeatWrapping;
    textureglass.repeat.x = - 1;


    frameMat.map = textureframe;
    glassMat.map = textureglass;
    stickRMat.map = textureStickRT;
    stickLMat.map = textureStickLT;

    let overlay3d = document.getElementById('overlay3');
    const aspecRatio= overlay3d.width / overlay3d.height;
    camera = new THREE.PerspectiveCamera(40, aspecRatio, 0.1, 100);
    scene = new THREE.Scene();

    // const ambient = new THREE.AmbientLight( 0xcccccc, 0.5);

    // const cubeSize = 1;
    // const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);

    var geo1 = new THREE.PlaneBufferGeometry( 1, 1 );
    var meshG = new THREE.Mesh( geo1, glassMat);
    var meshF = new THREE.Mesh(geo1, frameMat);
    var meshL = new THREE.Mesh(geo1, stickLMat);
    var meshR = new THREE.Mesh(geo1, stickRMat);

    meshF.position.set(0,-0.1,0);
    meshG.position.set(0,-0.1,0);

    meshL.rotation.y = degToRad(-90);
    meshL.position.set(0.5,-0.1,-0.49);

    // meshR.rotation.y = degToRad(90);
    // meshR.position.set(-0.5,-0.09,-0.49);

    meshR.rotation.y = degToRad(90);
    meshR.position.set(-0.5,-0.1,-0.49);


    cubeMat = [
    stickLMat,
    stickRMat,
    null,
    null,
    null,
    null,
    ];

    // specsObj = new THREE.Mesh(cubeGeo, cubeMat);
    specsObj = new THREE.Object3D();
    // specsObj.position.z = -10;
    specsObj.add(meshF);
    specsObj.add(meshG);
    specsObj.add(meshR);
    specsObj.add(meshL);

    scene.add(specsObj)
    specsObj.scale.set(1.2,0.6,1.7);

    // console.log(camera.position)
    renderer = new THREE.WebGLRenderer({canvas: overlay3d, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.sortObjects = true;

    //adding occluder in JSON
    occluderObj = create_threejsOccluder("models/mask.json");
    occluderObj.position.z = -10;
    if(screen.width < winsize){
      //mobile
      occluderObj.scale.set(0.56,0.6,0.5);
    }
    else{
      occluderObj.scale.set(0.56,0.6,0.5);
    }
    scene.add(occluderObj);
    // // setSpectsImgName(imgName);
    document.getElementById("category_1"+ "_image_" + settab).click();
}

function render3DSpectacles(poseX, poseY, poseZ, face_lm){
    if (poseX > (prevPoseX-degToRad(angleThresh)) && poseX < (prevPoseX+degToRad(angleThresh))){
      poseX = prevPoseX;
    }else{
      prevPoseX = poseX;
    }

    if (poseY > (prevPoseY-degToRad(angleThresh)) && poseY < (prevPoseY+degToRad(angleThresh))){
      poseY = prevPoseY;
    }else{
      prevPoseY = poseY;
    }

    if (poseZ > (prevPoseZ-degToRad(angleThresh)) && poseZ < (prevPoseZ+degToRad(angleThresh))){
      poseZ = prevPoseZ;
    }else{
      prevPoseZ = poseZ;
    }

    if(numLoaded < 2){
      document.getElementById("loadingAnim").style.display = "none";
    }

    let faceW = Math.abs(face_lm[15][0] - face_lm[14][0]);

    let face2ScreenRatio = faceW/videoWidth;
    if(screen.width > 720 && face2ScreenRatio > 0.25){
      faceW = faceW + face2ScreenRatio * faceW * 0.5;
    }
    else if(screen.width < 720 && face2ScreenRatio > 0.55){
      faceW = faceW + face2ScreenRatio/5 * faceW;
    }
    let canvas2d = document.getElementById('overlay2');
    let ctx2d = canvas2d.getContext("2d");
    ctx2d.clearRect(canvas2d.width/8, 0, canvas2d.width * 0.75, canvas2d.height * 0.9);
    let poseYDeg = poseY * 57.29;
    if(flipMethod == BACK_CAM){
        poseYDeg = -poseYDeg;
    }
    let poseZDeg = poseZ * 57.29;
    let poseXDeg = poseX * 57.29;
    faceLm1X = face_lm[16][0];
    faceLm1Y = face_lm[16][1] +  0.025 * faceW;
    //using new values
    let tanFOV = Math.tan(camera.aspect * camera.fov * Math.PI / 360); // tan(FOV/2), in radians
    let W = faceW/canvas2d.width;
    let D = 1 / (2 * W * tanFOV); // distance between the front face of the cube and the camera
    let xv = 0;
    if(flipMethod == FRONT_CAM){
        xv = canvas2d.width - faceLm1X;
    }
    else{
        xv = faceLm1X;
    }
    let yv = faceLm1Y;

    //adjustX
    let diffX = videoWidth/2 - faceLm1X;
    let adjY = 0;
    let adjX = videoWidth/2 - faceLm1X;
    let adjPose = 0;
    if(adjX < 0){
        //left side
        if(screen.width > winsize){
          adjX = adjX/videoWidth/2 * faceW * 1.25;
          adjPose = -5/videoWidth *  faceLm1X;
        }
        else{
          adjX = adjX/videoWidth/2 * faceW * 1;
          adjPose = 5/videoWidth *  faceLm1X;
        }
    }
    else{
        //right side
        if(screen.width > winsize){
          adjX = adjX/videoWidth/2 * faceW * 1;
          adjPose = 5/videoWidth *  faceLm1X;
        }
        else{
          adjX = adjX/videoWidth/2 * faceW * 1;
          adjPose = -5/videoWidth *  faceLm1X;
        }

    }

    poseYDeg = poseYDeg - adjPose;

    if(flipMethod == BACK_CAM){
        adjX = -adjX;
    }

    if(poseYDeg > 0){
        xv = xv + poseYDeg/30 * faceW * 0.02 + adjX;
    }
    else{
        xv = xv + poseYDeg/30 * faceW * 0.02 + adjX;
    }

    if(screen.width < winsize){
        adjY = videoHeight/2 - faceLm1Y;
        if(adjY > 0){
            adjY = adjY/videoHeight/2 * faceW * 0.75;
        }
        else{
            adjY = adjY/videoHeight/2 * faceW * 0.5;
        }
       yv = yv - 2 * adjY;
    }
    else{

     adjY = videoHeight/2 - faceLm1Y;
      adjY = adjY/videoHeight/2 * faceW * 0.25;
      yv = yv - 2 * adjY;
    }

    xv = ( xv / canvas2d.width ) * 2 - 1;
    yv = ( yv / canvas2d.height ) * 2 - 1;

    spectsZ = -D-0.8;
    spectsX = xv*D*tanFOV;
    spectsY = (yv*D*tanFOV/camera.aspect);
    //new values
    specsObj.position.set(spectsX, -spectsY, spectsZ);
    // mesh.position.set(spectsX, -spectsY, spectsZ);

    poseY = poseYDeg/57.29;
    poseX = (poseXDeg - 5) / 57.29;
    //if((poseYDeg < -15 && poseZDeg < -2) || poseYDeg > 25){
    /*if(poseYDeg < -10 && Math.abs(poseZDeg) < 5){
         specsObj.rotation.set(poseX, poseY, -3/57.29, "ZXY");
         // mesh.rotation.set(poseX, poseY, -3/57.29, "ZXY");
     }
     else if(poseYDeg > 10 && Math.abs(poseZDeg) < 5){
        specsObj.rotation.set(poseX, poseY, 0, "ZXY");
        // mesh.rotation.set(poseX, poseY, 0, "ZXY");
     }
     else{
        specsObj.rotation.set(poseX, poseY, poseZ, "ZXY");
        // mesh.rotation.set(poseX, poseY, poseZ, "ZXY");
    }*/
    if((poseYDeg < -15 && poseZDeg < -2) || (poseYDeg > 15 && poseZDeg > 2)){
         specsObj.rotation.set(poseX, poseY, 0, "ZXY");
     }
     else{
        specsObj.rotation.set(poseX, poseY, poseZ, "ZXY");
    }

    occluderObj.position.set(spectsX, -spectsY, spectsZ-0.3);
    occluderObj.rotation.set(poseX, poseY, poseZ, "ZXY");

    renderer.render(scene, camera);
    isFaceNotFoundDrawn = false;
    drawVideo();
}

function setSpectsImgName(imgName){
    // console.log("setSpectsImgName imgName:", imgName);
    let fName = imgName.substring(0, imgName.length-4);
    glassName = fName + "-glass.png";
    frameName = fName + "-frame.png";
    stickLName = fName + "-stickL.png";
    stickRName = fName + "-stickR.png";

    var manager = new THREE.LoadingManager();
      manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
        document.getElementById("loadingAnim").style.display = "block";
        specsObj.visible = false;
      };

    manager.onLoad = function ( ) {
      console.log( 'Loading complete!');
      if(numLoaded != 0){
        document.getElementById("loadingAnim").style.display = "none";
      }
      clearInterval(instructionInterval);
      specsObj.visible = true;
      numLoaded++;
    };

    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };

    manager.onError = function ( url ) {

      console.log( 'There was an error loading ' + url );

    };

    glassMat.map = new THREE.TextureLoader(manager).load("models/"+glassName);
    glassMat.opacity = opacity;
    glassMat.reflectivity = reflection;
    glassMat.needsUpdate = true;
    let textureStickLT = new THREE.TextureLoader(manager).load( "models/"+stickLName);
    textureStickLT.wrapS = THREE.RepeatWrapping;
    textureStickLT.repeat.x = - 1;
    stickLMat.map = textureStickLT;
    stickLMat.needsUpdate = true;
    let textureStickRT = new THREE.TextureLoader(manager).load( "models/"+stickRName);
    textureStickRT.wrapS = THREE.RepeatWrapping;
    textureStickRT.repeat.x = - 1;
    stickRMat.map = textureStickRT;
    stickRMat.needsUpdate = true;
    frameMat.map = new THREE.TextureLoader(manager).load("models/"+frameName);
    frameMat.needsUpdate = true;

}

function clear3DCanvas(){
    specsObj.position.set(0, 0, -1000);
    renderer.state.reset();
    renderer.render(scene, camera);
    //drawFaceNotFound();
    drawVideo();
}

function takeScreenshot3D(){
    isScreenshot = false;
    isPreviewMode = true;
    var canvas2d = document.getElementById('overlay2');
    var canvas3d = document.getElementById('overlay3');
    var dataURL = canvas3d.toDataURL();
    var videoEl = document.getElementById("inputVideo");
    canvas2d.width = videoEl.videoWidth;
    canvas2d.height = videoEl.videoHeight;
    var ctx2d = canvas2d.getContext("2d");
    var canvasScreenshot = document.createElement('canvas');
    canvasScreenshot.width = videoEl.videoWidth;
    canvasScreenshot.height = videoEl.videoHeight;
    var contextScreenshot =  canvasScreenshot.getContext("2d");
    var img = new Image;
    var ua = navigator.userAgent.toLowerCase();
    var isSafari = false;
    var logoWidth = 0;
    var logoHeight = 0;
    if (ua.indexOf('safari') != -1) {
      if (ua.indexOf('chrome') > -1) {
      }else {
        isSafari = true;
      }
    }
    img.onload = function(){

          var onLogoLoaded = function(){

            if(isSafari){
                logoWidth =  canvasScreenshot.width/5;
                logoHeight = imageLogo.height/imageLogo.width * logoWidth;
                contextScreenshot.clearRect(0, 0, canvasScreenshot.width, canvasScreenshot.height);
                contextScreenshot.drawImage(videoEl, 0, 0, canvasScreenshot.width, canvasScreenshot.height);
              if(flipMethod == FRONT_CAM){
                contextScreenshot.save();
                contextScreenshot.scale(-1,1);
                contextScreenshot.drawImage(img, 0, 0, -canvasScreenshot.width, canvasScreenshot.height);
                contextScreenshot.restore();
                //drawing logo
                contextScreenshot.drawImage(imageLogo, canvasScreenshot.width - logoWidth, 0, logoWidth, logoHeight);

              }else{
                contextScreenshot.drawImage(img, 0, 0, canvasScreenshot.width, canvasScreenshot.height);
                contextScreenshot.save();
                contextScreenshot.scale(-1,1);
                //drawing logo
                contextScreenshot.drawImage(imageLogo, canvasScreenshot.width - logoWidth, 0, -logoWidth, logoHeight);
                contextScreenshot.restore();

              }
              ctx2d.clearRect(0, 0, canvasScreenshot.width, canvasScreenshot.height);
              ctx2d.drawImage(canvasScreenshot, 0, 0, canvasScreenshot.width, canvasScreenshot.height);
              switchPreviewUI(true);
              //uploadImageToServer(canvasScreenshot);

            }else{
                 logoWidth =  canvasScreenshot.width/5;
                logoHeight = imageLogo.height/imageLogo.width * logoWidth;
                contextScreenshot.clearRect(0, 0, canvasScreenshot.width, canvasScreenshot.height);
              if(flipMethod == FRONT_CAM){
                  contextScreenshot.save();
                  contextScreenshot.scale(-1,1);
                  contextScreenshot.drawImage(videoEl, 0, 0, -canvasScreenshot.width, canvasScreenshot.height);
                  contextScreenshot.restore();

              }else{
                  contextScreenshot.drawImage(videoEl, 0, 0, canvasScreenshot.width, canvasScreenshot.height);
              }
              contextScreenshot.drawImage(img, 0, 0, canvasScreenshot.width, canvasScreenshot.height);
              //drawing logo
              contextScreenshot.drawImage(imageLogo, canvasScreenshot.width - logoWidth, 0, logoWidth, logoHeight);
              ctx2d.clearRect(0, 0, canvasScreenshot.width, canvasScreenshot.height);
              ctx2d.drawImage(canvasScreenshot, 0, 0, canvasScreenshot.width, canvasScreenshot.height);
              switchPreviewUI(true);
              //uploadImageToServer(canvasScreenshot);

            }//end of else isSafari

          }//end of onLogoLoaded

          var onerrorCallback = function(){
            console.log("logo loading error");
          }

         var imageLogo = new Image();
         imageLogo.onload = onLogoLoaded;
         imageLogo.src = "./images/logo.png";
         imageLogo.onerror = onerrorCallback;

    };
    img.src = dataURL;
}


function init3DSpectaclesThMethod(){
    console.log("init3DSpectaclesThMethod entered");

    var refCube = new THREE.CubeTextureLoader()
                    .setPath( 'models/reflection/' )
                    .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );

    imgName = prodImagePaths[0];
    var fName = imgName.substring(0, imgName.length-4);
    glassName = fName + "-glass.png";
    frameName = fName + "-frame.png";
    stickLName = fName + "-stickL.png";
    stickRName = fName + "-stickR.png";
    opacity = 1;
    reflection = 0.35;

    //drawing necklace 3D image using three js
    glassMat = new THREE.MeshPhongMaterial( {
            side:THREE.DoubleSide,
            combine: THREE.MixOperation,
            envMap:refCube,
            reflectivity: reflection,
            opacity:opacity,
            transparent:true,
            specular: 0xBABABA,
            // shininess: 1,
            depthWrite:false
        });
     glassMat.precision = "mediump";

      frameMat = new THREE.MeshPhongMaterial( {
            side:THREE.DoubleSide,
            combine: THREE.MixOperation,
            envMap:refCube,
            reflectivity: 0.1,
            transparent:true,
            specular: 0xBABABA,
            // shininess: 3
        });

       frameMat.precision = "mediump";

    //mirroring texture
    let textureStickLT = new THREE.TextureLoader().load( "models/"+stickLName);
    textureStickLT.wrapS = THREE.RepeatWrapping;
    textureStickLT.repeat.x = - 1;

    stickLMat = new THREE.MeshPhongMaterial( {
                side:THREE.DoubleSide,
                combine: THREE.MixOperation,
                transparent:true,
                specular: 0xBABABA,
                shininess: 3
        });
    stickLMat.precision = "highp";

    let textureStickRT = new THREE.TextureLoader().load( "models/"+stickRName);
    textureStickRT.wrapS = THREE.RepeatWrapping;
    textureStickRT.repeat.x = - 1;

    stickRMat = new THREE.MeshPhongMaterial( {
                side:THREE.DoubleSide,
                combine: THREE.MixOperation,
                transparent:true,
                specular: 0xBABABA,
                shininess: 3
        });
    stickRMat.precision = "highp";

    let overlay3d = document.getElementById('overlay3');
    const aspecRatio= overlay3d.width / overlay3d.height;
    camera = new THREE.PerspectiveCamera(40, aspecRatio, 0.1, 100);
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({canvas: overlay3d, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.sortObjects = true;


    const cubeSize = 2;
    const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize,2,2,2);

    cubeMat = [
    null,
    frameMat,//new THREE.MeshBasicMaterial({map: texture}),
    null,
    frameMat,//new THREE.MeshBasicMaterial({map: texture}),
    null,
    // new THREE.MeshBasicMaterial({map: texture}),
    frameMat,
    ];

    // scene.remove(RingObj);

    specsObj = new THREE.Mesh(cubeGeo, cubeMat);

    scene.add(specsObj)
    /*renderer.setSize(overlay3d.width, overlay3d.height);*/

    // specsObj = new THREE.Object3D();
    //     let objLoader = new THREE.OBJLoader();
    //     objLoader.setPath( 'models/' );
    //      objLoader.load( 'specs35.obj', function ( object ) {
    //         object.traverse(function (child) {
    //             if (child instanceof THREE.Mesh) {
    //                 let names = child.name;
    //                 if(names.includes("glass")){
    //                     child.material = glassMat;
    //                 }
    //                 else if (names.includes("frame")){
    //                     child.material = frameMat;
    //                 }
    //                 else if (names.includes("stickR")){
    //                     child.material = stickRMat;
    //                 }
    //                 else if (names.includes("stickL")){
    //                     child.material = stickLMat;
    //                 }

    //             }
    //         });
    //         specsObj.add(object);

    //     },function ( xhr ) {
    //         console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    //     },
    //     // called when loading has errors
    //     function ( error ) {
    //         console.log( 'An error happened' );
    //     });

    // specsObj.position.set(0, 0, -50);
    // if(screen.width > winsize){
    //     specsObj.scale.set(1.15, 1.15, 1.15);
    // }
    // else{
    //     specsObj.scale.set(1.17, 1.17, 1.17);
    // }
    // scene.add(specsObj);

    // const ambient       = new THREE.AmbientLight( 0xffffff, 1.15);      ambient.name = "light_ambient"
    // const light_front   = new THREE.DirectionalLight( 0xffffff, 0.15);  light_front.name = "light_front"

    // light_front.position.set(0, 0, -1000)
    // light_front.lookAt(0, 0, 0)
    // specsObj.add(ambient);
    // specsObj.add(light_front);
    // scene.add( specsObj );

    // //adding occluder in JSON
    // occluderObj = create_threejsOccluder("models/mask_2.json");
    // occluderObj.position.z = -10;
    // if(screen.width < winsize){
    //   //mobile
    //   occluderObj.scale.set(0.5,0.5,0.4);
    // }
    // else{
    //   occluderObj.scale.set(0.56,0.6,0.5);
    // }
    // scene.add(occluderObj);
    // // setSpectsImgName(imgName);
    // document.getElementById("category1"+ "_image_" + settab).click();
}

function render3DSpectaclesThMethod(poseX, poseY, poseZ, face_lm){

    if (poseX > (prevPoseX-degToRad(3)) && poseX < (prevPoseX+degToRad(3))){
      poseX = prevPoseX;
    }else{
      prevPoseX = poseX;
    }

    if (poseY > (prevPoseY-degToRad(2)) && poseY < (prevPoseY+degToRad(2))){
      poseY = prevPoseY;
    }else{
      prevPoseY = poseY;
    }

    if (poseZ > (prevPoseZ-degToRad(3)) && poseZ < (prevPoseZ+degToRad(3))){
      poseZ = prevPoseZ;
    }else{
      prevPoseZ = poseZ;
    }

    if(numLoaded < 2){
      document.getElementById("loadingAnim").style.display = "none";
    }

    let faceW = Math.abs(face_lm[15][0] - face_lm[14][0]);

    let face2ScreenRatio = faceW/videoWidth;

    if(screen.width > 720 && face2ScreenRatio > 0.25){
      faceW = faceW + face2ScreenRatio * faceW * 0.5;
    }
    else if(screen.width < 720 && face2ScreenRatio > 0.55){
      faceW = faceW + face2ScreenRatio/5 * faceW;
    }

    let canvas2d = document.getElementById('overlay2');
    let ctx2d = canvas2d.getContext("2d");
    ctx2d.clearRect(canvas2d.width/8, 0, canvas2d.width * 0.75, canvas2d.height * 0.9);
    let poseYDeg = poseY * 57.29;
    if(flipMethod == BACK_CAM){
        poseYDeg = -poseYDeg;
    }
    let poseZDeg = poseZ * 57.29;
    let poseXDeg = poseX * 57.29;

    // drawangles(poseXDeg,poseYDeg,poseZDeg);

    faceLm1X = face_lm[16][0];
    faceLm1Y = face_lm[16][1] +  0.025 * faceW;
    //using new values
    let tanFOV = Math.tan(camera.aspect * camera.fov * Math.PI / 360); // tan(FOV/2), in radians
    let W = faceW/canvas2d.width;
    let D = 1 / (2 * W * tanFOV); // distance between the front face of the cube and the camera
    let xv = 0;
    if(flipMethod == FRONT_CAM){
        xv = canvas2d.width - faceLm1X;
    }
    else{
        xv = faceLm1X;
    }
    let yv = faceLm1Y;

    //adjustX
    let diffX = videoWidth/2 - faceLm1X;
    let adjY = 0;
    let adjX = videoWidth/2 - faceLm1X;
    let adjPose = 0;
    if(adjX < 0){
        //left side
        if(screen.width > winsize){
          adjX = adjX/videoWidth/2 * faceW * 1.6;
          adjPose = -5/videoWidth *  faceLm1X;
        }
        else{
          adjX = adjX/videoWidth/2 * faceW * 1;
          adjPose = 5/videoWidth *  faceLm1X;
        }
    }
    else{
        //right side
        if(screen.width > winsize){
          adjX = adjX/videoWidth/2 * faceW * 1;
          adjPose = 5/videoWidth *  faceLm1X;
        }
        else{
          adjX = adjX/videoWidth/2 * faceW * 1;
          adjPose = -5/videoWidth *  faceLm1X;
        }

    }
    if(flipMethod == BACK_CAM){
        adjX = -adjX;
    }

    adjY = videoHeight/2 - faceLm1Y;
    adjY = adjY/videoHeight/2 * faceW * 0.5;

    if(poseYDeg > 0){
        xv = xv + poseYDeg/30 * faceW * 0.02 + adjX;
    }
    else{
        xv = xv + poseYDeg/30 * faceW * 0.02 + adjX;
    }

    if(screen.width < winsize){
       yv = yv - 2 * adjY;
    }
    else{
      yv = yv - 2 * adjY;
    }

    xv = ( xv / canvas2d.width ) * 2 - 1;
    yv = ( yv / canvas2d.height ) * 2 - 1;

    spectsZ = -D-0.8;
    spectsX = xv*D*tanFOV;
    spectsY = (yv*D*tanFOV/camera.aspect);
    //new values
    specsObj.position.set(spectsX, -spectsY, spectsZ);
    occluderObj.position.set(spectsX, -spectsY, spectsZ-0.3);

    // if (face2ScreenRatio < 0.14){
    //     specsObj.scale.set(1, 1, 0.75);
    // }
    // else{
    //     specsObj.scale.set(1, 1, 1);
    // }

    poseY = (poseYDeg)/57.29;
    poseX = (poseXDeg+10) / 57.29;

    let a = 1.5;
    if (is_mobile()){
        a = 1;
        poseX = (poseXDeg+20) / 57.29
    }

    if(poseYDeg < -15 || poseYDeg > 15){
        specsObj.rotation.set(poseX, poseY*a, 0, "ZXY");
        occluderObj.rotation.set(poseX, poseY*a,  0, "ZXY");
     }
     else{
        specsObj.rotation.set(poseX, poseY*(a+0.5), poseZ*1.2, "ZXY");
        occluderObj.rotation.set(poseX, poseY*(a+0.5),  poseZ*1.2, "ZXY");
    }

    // specsObj.rotation.set(poseX, poseY, poseZ, "ZXY");
    // occluderObj.rotation.set(poseX, poseY,  poseZ, "ZXY");

    renderer.render(scene, camera);
    isFaceNotFoundDrawn = false;
    drawVideo();
}
