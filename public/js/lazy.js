var image_map = new Map();


///////////////////////////////////////////////////////////////////

function mainLazyChange() {
  let images = [...document.querySelectorAll('.lazy-image')];

  const interactSettings = {
    root: document.querySelector('.categories'),
    rootMargin: '10px'
    // rootMargin: '0px -130px -135px 0px'
    // rootMargin: '0px -300px -300px 0px'
  }

  function onIntersection(imageEntites) {
    imageEntites.forEach(image => {
      if (image.isIntersecting) {
        observer.unobserve(image.target)
        image.target.src = image.target.dataset.src
        image.target.onload = () => image.target.classList.add('loaded')
		    console.log("========async ================",image.target.dataset.src);

        let tempArr = image.target.src.split("/");
        let imgName = tempArr[tempArr.length-1];
               // image_map.set(imgName, base64image);
                   // console.log("lazyImage src: ", lazyImage.src);
        if(image_map.get(imgName) == undefined){
          getBase64Image_util(image.target.src, function(base64image){
             image_map.set(imgName, base64image);
             console.log("======== ASYNC Freshly loaded new base64 image================",imgName);
             // observer.unobserve(image.target)
          });
        }else{
          // observer.unobserve(image.target)
        }
      }
    })
  }

  let observer = new IntersectionObserver(onIntersection, interactSettings)

  images.forEach(image => observer.observe(image))
}


//////////////////////////////////////////////////////////////////
//Not using this below function at this moment

function lazyChange() {
  let lazyImages = [].slice.call(document.querySelectorAll("img.lazy-image"));

  const interactSettings = {
    root: document.querySelector('.categories'),
    rootMargin: '0px -130px -135px 0px'
  }

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.onload = () => lazyImage.classList.add('loaded');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    }, interactSettings);

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to a more compatible method here
  }
}

///////////////////////////////////////////////////////////////



async function getBase64Image_util(img_src, callback){
  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  try{
    fetch(img_src,
    {

    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    //redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then(response => {
    if (!response.ok) {
      console.log('Get Image Locally: Network response was not ok');
    }
    //console.log('It was good==');
    return response.blob();
    })
    .then(myBlob => {
    // myImage.src = URL.createObjectURL(myBlob);
    // callback(myBlob);

    //if its aws image url
    // callback(URL.createObjectURL(myBlob));

    // new way to convert for imges in same folder of pkg
    let fr = new FileReader();
    fr.onload = () => {
      var b64 = fr.result;
      // console.log(b64);
      // console.log("base64 size: ", b64.length);
      // $iframe.src = b64;
      callback(b64);
    }
    fr.readAsDataURL(myBlob);


    })
    .catch(error => {
    console.error('Get Image Locally:: There has been a problem with your fetch operation:', error);
    });
  }catch(e){
    console.log("Hnadle IMG DBG",e);
  }

}
