

let global_media_height = 480, global_media_width = 640, init_global_height = 480, hideCategoryKey = 0, borderRadius = 35;
var faceModel;
let isCameraON = false;
let camH;
let btnnames = []
  // catenum = [6, 6, 6, 4],
  added_favorite = [],
  session_favorite_list = [],
  buy_list = [];
let settab = 1, w = window.innerWidth, h = window.innerHeight, zoommain, favlistnum = 1, expandKey = 0;
let loadclickdown =  `<img class="clickupdown" viewBox="0 0 32 29.6" id="clickdown" src = "./img/arrow/loaddown.png">`;
let loadclickup =  `<img class="clickupdown" viewBox="0 0 32 29.6" id="clickdown" src = "./img/arrow/loadup.png">`;
var isSafar12 = false;

let globselectedlist = {
  "Earring": null,
  "Necklace": null,
  "NecklaceSet": null,
  // "Mangalsutras": null,
  // "PendantSets": null,
};

let prev_sel_prod;

let mc_ht, mc_wd;

let catenum = []

let cur_prod_id = 1;

function add_tab(){
  let add_tab = $(".nav-tabs")
  let cnt = 1;
  let s = ''
  for (var key in product_arr){
     if(product_arr[key].length != 0 ){
        s = (cnt==1) ? 'class="active"' : '';
        let add_li = '<li '+s+' id="btn'+cnt+'"> <a href="#'+cnt+'" data-toggle="tab" id="tab'+cnt+'"> '+ key +' </a> </li>'
        add_tab.append(add_li)
        btnnames.push(key)
        catenum.push(product_arr[key].length)
        cnt++;
     }
  }
}

let globalPixelRatio = window.devicePixelRatio;
var cntBrowser = checkBrowser();
let initRatioForPopupSize = 0.85;
// smallWords = document.getElementById("small_words");

let isMobileDevice = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

if(isMobileDevice.iOS()) {
  document.getElementById("favlisttitle").style.fontSize = "15px";
  if(w < h) {
    // smallWords.style.marginLeft = "105px";
    // smallWords.style.fontSize = "9px";
  } else {
    // smallWords.style.marginLeft = "6px";
    // smallWords.style.fontSize = "6px";
    document.getElementById("category_title").classList.add("iPhoneCategoryTitle");
  }
}

async function init() {
  $("#camera_div").modal('show')
  add_tab();
  console.log("init")
  for (let i = 0; i < btnnames.length; i++) {
    document.getElementById("btn" + parseInt(i + 1)).addEventListener("click", function () {
          console.log("tab")
          setColorbtn(i + 1);
    });
  }
  setColorbtn(settab);

  createloadmorebtn();

  if (w > ipad_size) {
    let zoomRate = 1, zoommain = (w * initRatioForPopupSize) / 963 * 100;
    if(zoommain * 487 / 100 > h) {
      zoommain = (h * initRatioForPopupSize) / 487 * 100;
    }
    if(cntBrowser == "firefox") {
      let marginleft = ((w - 963) / 2) + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      // document.getElementById("overlay2").style.marginLeft = marginleft;
      let margintop = ((h - 487) / 2) + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.transform = `scale(${(zoommain*zoomRate/100)})`;
    } else {
      let marginleft = ((w - 963 * zoommain * zoomRate / 100) / 2) * (100 / zoommain / zoomRate) + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      // document.getElementById("overlay2").style.marginLeft = marginleft;
      let margintop = ((h - 487 * zoommain * zoomRate / 100) / 2) * (100 / zoommain / zoomRate) + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.zoom = zoommain * zoomRate + "%";
      // document.getElementById("overlay2").style.marginTop = margintop;
      // document.getElementById("overlay2").style.zoom = zoommain * zoomRate + "%";
    }
    document.getElementById("camera_div").style.width = "963px";
    document.getElementById("camera_div").style.height = "520px";

    // document.getElementById("overlay2").style.width = "963px";
    // document.getElementById("overlay2").style.height = "487px";

    // borderRadius
    document.getElementById("tab").classList.remove("borderRadius");
    document.getElementById("category").classList.remove("borderRadius");

    // Capture position change
    document.getElementById("pentagon").style.bottom = "11px";
    document.getElementById("menu").style.bottom = "16px";

    // flipCamera Icon
    document.getElementById("flipCamera").style.bottom = "5px";

    show("loadmorediv");
    hide("loadupdiv");
    show("brandlogo");

  } else {
    zoommain = (w * 0.96) / 642 * 100;
    camH = h * 0.96 / zoommain * 100;
    document.getElementById("camera_div").style.width = "642px";
    document.getElementById("camera_div").style.height = camH + "px";
    document.getElementById("category").style.top = camH - 301 + "px";
    document.getElementById("maincamera").style.height = camH - 101 + borderRadius + "px";
    document.getElementById("category_title").innerHTML = loadclickdown;//"Categories <a style='color:blue'>(-)</a>";
    document.getElementById("category_title").style.display = "none";
    // console.log(camH - 101 + borderRadius,"px")

    // borderRadius
    document.getElementById("tab").classList.add("borderRadius");
    document.getElementById("category").classList.add("borderRadius");

    // Capture position change
    document.getElementById("pentagon").style.bottom = "250px";
    document.getElementById("menu").style.bottom = "250px";

    if(cntBrowser == "firefox") {
      document.getElementById("camera_div").style.marginTop = ((h - camH) / 2) + "px"; //((h - camH) / 2) + "px";
      document.getElementById("camera_div").style.marginLeft = ((w - 642) / 2) + "px"; //((w - 642) / 2) + "px";
      document.getElementById("camera_div").style.transform = `scale(${((zoommain*1.04)/100)})`; //`scale(${(zoommain/100)})`;
    } else {
      document.getElementById("camera_div").style.marginTop = "0%"; //"2%";
      document.getElementById("camera_div").style.marginLeft = "0%"; //"2%";
      document.getElementById("camera_div").style.zoom = zoommain*1.04 + "%";
    }

    document.getElementById("favorite").style.height = camH - 301 + "px";
    document.getElementById("favourities").style.height = camH - 341 + "px";
    global_media_height = init_global_height = camH - 101 + borderRadius;

    // flipCamera Icon
    document.getElementById("flipCamera").style.bottom = "240px";


    // show("small_words");
  }
    // maincamera_ht = document.getElementById("maincamera").offsetHeight;


  if(is_mobile()) {
    // document.getElementById("menu").style.width = "80px";
    // document.getElementById("menu").style.height = "80px";
    show("flipCamera");
    hide("needhelp")
    hide("brandlogo");
    // crop_val = 0
    // crop_val = (((640 - ((camH - 101 + borderRadius)/(16/9)/2))*(4/3)));
    // console.log("crop_val",crop_val)
  }

  if (cntBrowser !== "firefox"){
     await tf.setBackend('wasm');
  }
  // stopStreaming();
  startStreaming(1)//global_media_width, global_media_height);
  // startProcessing();

  faceModel = await facemesh.load({maxFaces: 1});
}

function loadbrowser(value_b, set_int){
  if(value_b && isCameraON){
        clearInterval(set_int);
        startProcessing();
      }
}

function onBackClick()
{
  /*if(isPreviewMode)
  {
    onRetryClick();
    return;
  }*/
  close();
  window.history.back();
}


function onShareClick(){
  console.log("onShareClick entered");
  let URL = window.location;
  if(screen.width < 480){
    URL =  encodeURI("whatsapp://send?text=How is this jewelry? " + URL);
  }else{
    URL = encodeURIComponent(URL);
    var number = "number";
    URL = 'https://api.whatsapp.com/send?phone=' + number + '&text=%20' + URL;
  }
    window.open(URL, '_blank');
}

function createdivfortabbtn(divname, containdiv, index) {
  let btndiv = document.createElement("div");
  btndiv.id = "btn" + index;
  btndiv.style.padding = "13px";
  btndiv.style.cursor = "pointer";
  btndiv.style.textAlign = "center";
  btndiv.style.marginTop = "5px";
  btndiv.style.marginLeft = "15px";
  btndiv.style.marginBottom = "10px";
  btndiv.style.width = btndiv.style.height = "fit-content";
  btndiv.style.borderRadius = "5px";
  btndiv.style.fontSize = "14px";
  let container = document.getElementById(containdiv);
  container.appendChild(btndiv);

  let span = document.createElement("span");
  span.innerHTML = divname;
  let btncontainer = document.getElementById(btndiv.id);
  btncontainer.appendChild(span);
}

function createloadmorebtn() {
  let loadmore = document.createElement("div");
  loadmore.id = "loadmorediv";
  document.getElementById("category").appendChild(loadmore);
  loadmore.classList.add("loadmore");

  let loadmoreimg = document.createElement("img");
  loadmoreimg.id = "loadmoreimg";
  loadmoreimg.style.width = "100%";
  loadmoreimg.style.height = "100%";
  loadmoreimg.src = (window.innerWidth > ipad_size) ? 'img/arrow/loaddown.png' : 'img/arrow/menu2.png';
  document.getElementById(loadmore.id).appendChild(loadmoreimg);

  document.getElementById(loadmore.id).addEventListener("click", function () {
    if (window.innerWidth > ipad_size) {
      scrolldown();
    } else {
      // initialCategories();
      SwipeAnimate(parseInt(document.getElementById("camera_div").offsetHeight) - 300, 301, 1000, "expand-to-init");
      document.getElementById("category_title").innerHTML = loadclickdown //"Categories <a style='color:blue'>(-)</a>";
      loadmore.classList.add("hide");
    }
  });

  let loadup = document.createElement("div");
  loadup.id = "loadupdiv";
  document.getElementById("category").appendChild(loadup);
  loadup.classList.add("loadup");

  let loadupimg = document.createElement("img");
  loadupimg.id = "loadupimg";
  loadupimg.style.width = "100%";
  loadupimg.style.height = "100%";
  loadupimg.src = (window.innerWidth > ipad_size) ? 'img/arrow/loadup.png' : 'img/arrow/menu2.png';
  document.getElementById(loadup.id).appendChild(loadupimg);

  document.getElementById(loadup.id).addEventListener("click", function () {
    if (window.innerWidth > ipad_size) {
      scrollup();
    } else {
      // loadmoreCategories();
      if(hideCategoryKey) return;
      SwipeAnimate(301, parseInt(document.getElementById("camera_div").offsetHeight) - 300, 1000, "init-to-expand");
      document.getElementById("category_title").innerHTML = loadclickdown//"Categories";
    }
  });

}

function loadmoreCategories() {
  if(hideCategoryKey) return;
  expandKey = 1;
  let cate = document.getElementById("category"),
    cates = document.getElementById("categories"),
    parentdiv = document.getElementById("camera_div");
  cate.style.height = parseInt(parentdiv.style.height) - 300 + "px";
  cate.style.zIndex = 10;
  cates.style.height = parseInt(parentdiv.style.height) - 400 + "px";
  cate.style.top = parseInt(parentdiv.style.height) - parseInt(cate.style.height) + "px";
  cates.classList.add("flex-categories");

  if(isMobileDevice.iOS()) {
    // smallWords.style.marginLeft = "145px";
  } else {
    // smallWords.style.marginLeft = "280px";
  }

  cates.onwheel = categoriesScrollWheeling;

  hide("loadupdiv");
  show("loadmorediv");
}

function initialCategories() {
  if(hideCategoryKey) return;
  expandKey = 0;
  let cate = document.getElementById("category"),
    cates = document.getElementById("categories"),
    parentdiv = document.getElementById("camera_div");
  cate.style.height = "301px";
  cates.style.height = "201px";
  cate.style.top = parseInt(parentdiv.style.height) - parseInt(cate.style.height) + "px";
  cates.classList.remove("flex-categories");
  // document.getElementById("maincamera").style.height = parseInt(parentdiv.style.height) - 301 + borderRadius + "px";
  document.getElementById("favorite").style.height = parseInt(parentdiv.style.height) - 301 + "px";
  document.getElementById("favourities").style.height = parseInt(parentdiv.style.height) - 341 + "px";

  if(isMobileDevice.iOS()) {
    // smallWords.style.marginLeft = "105px";
  } else {
    // smallWords.style.marginLeft = "250px";
  }

  cates.onwheel = MouseWheeling;

  hide("loadmorediv");
  show("loadupdiv");
}


function SwipeToggle() {
  if(window.innerWidth > ipad_size || parseInt(document.getElementById("categories").style.height) > ipad_size || globalCapturedStatus) {
    return;
  }

  if(hideCategoryKey) {
    console.log("if")
    SwipeAnimate(101, 301, 1000, "hide-to-init");
    document.getElementById("category_title").innerHTML = loadclickdown//"<a style='color:blue'>(-)</a>";
    document.getElementById("pentagon").style.bottom = "250px";
    document.getElementById("menu").style.bottom = "250px";
    document.getElementById("flipCamera").style.bottom = "240px";
  } else {
    console.log("else")
    SwipeAnimate(301, 101, 1000, "init-to-hide");
    document.getElementById("category_title").innerHTML = loadclickup//"<a style='color:blue'>(+)</a>";
    // Capture position change
    document.getElementById("pentagon").style.bottom = "50px";
    document.getElementById("menu").style.bottom = "50px";
    document.getElementById("flipCamera").style.bottom = "40px";
  }
  document.getElementById("camera_div").style.overflowY = "hidden";
}

function toggleCategory() {
  if(window.innerWidth > ipad_size || parseInt(document.getElementById("categories").style.height) > 201 || globalCapturedStatus) {
    return;
  }

  document.getElementById("categories").style.height = (hideCategoryKey==0) ? "2px" : "201px";
  document.getElementById("categories").style.display = "flex";

  let cntCategoryTop = document.getElementById("category").style.top,
      mainCameraHeight = document.getElementById("maincamera").style.height,
      favoriteHeight = document.getElementById("favorite").style.height,
      favouritiesHeight = document.getElementById("favourities").style.height;

  (hideCategoryKey==0) ? document.getElementById("category").style.top = parseInt(cntCategoryTop) + 200 + "px" :
                         document.getElementById("category").style.top = parseInt(cntCategoryTop) - 200 + "px";
  (hideCategoryKey==0) ? document.getElementById("category").style.height = "100px" :
                         document.getElementById("category").style.height = "301px";
  // (hideCategoryKey==0) ? document.getElementById("maincamera").style.height = parseInt(mainCameraHeight) + 201 + "px" :
  //                        document.getElementById("maincamera").style.height = parseInt(mainCameraHeight) - 201 + "px";
  (hideCategoryKey==0) ? document.getElementById("favorite").style.height = parseInt(favoriteHeight) + 201 + "px" :
                         document.getElementById("favorite").style.height = parseInt(favoriteHeight) - 201 + "px";
  (hideCategoryKey==0) ? document.getElementById("favourities").style.height = parseInt(favouritiesHeight) + 201 + "px" :
                         document.getElementById("favourities").style.height = parseInt(favouritiesHeight) - 201 + "px";
  // global_media_height = parseInt(document.getElementById("maincamera").style.height);

  (hideCategoryKey==0) ? hideCategoryKey = 1 : hideCategoryKey = 0;

  if(hideCategoryKey) {
    hide("loadmorediv");
    show("loadupdiv");
  } else {
    hide("loadmorediv");
    show("loadupdiv");
  }
}

let enablescrolldown, enablescrollup, enablescrollright, enablescrollleft;

function scrolldown() {
  if (window.innerWidth > ipad_size) {
    let scrollHeight = document.getElementById("categories").scrollHeight,
      scrollTop = document.getElementById("categories").scrollTop,
      clientHeight = document.getElementById("categories").clientHeight,
      top = scrollTop + 300;

    document.getElementById("categories").scroll({
      top: top,
      left: 0,
      behavior: 'smooth'
    });

    enablescrollup = (top > 0);
    enablescrolldown = scrollHeight - top - clientHeight > 10;

    // console.log(scrollHeight - top - clientHeight, enablescrolldown, enablescrollup);
    if(!enablescrolldown) {
      hide("loadmorediv");
    } else {
      show("loadmorediv");
    }
    if(!enablescrollup) {
      hide("loadupdiv");
    } else {
      show("loadupdiv");
    }
  } else {
    let scrollWidth = document.getElementById("categories").scrollWidth,
      scrollLeft = document.getElementById("categories").scrollLeft,
      clientWidth = document.getElementById("categories").clientWidth,
      left = scrollLeft + 500;

    document.getElementById("categories").scroll({
      top: 0,
      left: left,
      behavior: 'smooth'
    });

    enablescrollleft = (left > 0);
    enablescrollright = scrollWidth - left - clientWidth > 10;

    console.log(scrollWidth - left - clientWidth, enablescrollleft, enablescrollright);
  }
}

function scrollup() {
  if (window.innerWidth > ipad_size) {
    let scrollHeight = document.getElementById("categories").scrollHeight,
      scrollTop = document.getElementById("categories").scrollTop,
      clientHeight = document.getElementById("categories").clientHeight,
      top = scrollTop - 300;

    document.getElementById("categories").scroll({
      top: top,
      left: 0,
      behavior: 'smooth'
    });

    enablescrollup = (top > 10);
    enablescrolldown = scrollHeight - top - clientHeight > 10;

    console.log(scrollHeight - top - clientHeight, enablescrolldown, enablescrollup);
    if(!enablescrolldown) {
      hide("loadmorediv");
    } else {
      show("loadmorediv");
    }
    if(!enablescrollup) {
      hide("loadupdiv");
    } else {
      show("loadupdiv");
    }
  } else {
    let scrollWidth = document.getElementById("categories").scrollWidth,
      scrollLeft = document.getElementById("categories").scrollLeft,
      clientWidth = document.getElementById("categories").clientWidth,
      left = scrollLeft - 500;

    document.getElementById("categories").scroll({
      top: 0,
      left: left,
      behavior: 'smooth'
    });

    enablescrollleft = (left > 0);
    enablescrollright = scrollWidth - left - clientWidth > 10;

    console.log(scrollWidth - left - clientWidth, enablescrollleft, enablescrollright);
  }
}

ListeningMouseWheeling();

function ListeningMouseWheeling() {
  document.getElementById('categories').addEventListener('mousewheel', MouseWheeling);
}

function MouseWheeling() {
  // console.log("MouseWheeling\n");
  if (window.innerWidth > 640) {
    let scrollHeight = document.getElementById("categories").scrollHeight,
      scrollTop = document.getElementById("categories").scrollTop,
      clientHeight = document.getElementById("categories").clientHeight;

    enablescrollup = (scrollTop > 10);
    enablescrolldown = scrollHeight - scrollTop > clientHeight + 10;

    // console.log(enablescrolldown, enablescrollup);
    // console.log(scrollHeight, scrollTop, clientHeight, scrollHeight - scrollTop);

    if(!enablescrolldown) {
      hide("loadmorediv");
    } else {
      show("loadmorediv");
    }
    if(!enablescrollup) {
      hide("loadupdiv");
    } else {
      show("loadupdiv");
    }
  } else {
    const slider = document.getElementById("categories"), e = window.event;
    slider.scrollLeft += e.deltaY / Math.abs(e.deltaY) * 100;
  }
}

(function () {
  function scrollHorizontally(e) {
    console.log("scrollHorizontally")
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    document.getElementById('tabbtn').scrollLeft -= (delta * 40); // Multiplied by 40
    e.preventDefault();
  }

  if (document.getElementById('tabbtn').addEventListener) {
    document.getElementById('tabbtn').addEventListener("mousewheel", scrollHorizontally, false);
    document.getElementById('tabbtn').addEventListener("DOMMouseScroll", scrollHorizontally, false);
  } else {
    document.getElementById('tabbtn').attachEvent("onmousewheel", scrollHorizontally);
  }
})();

(function () {
  function scrollHorizontally(e) {
    if (window.innerWidth > ipad_size) {
      return;
    }
    console.log("scrollHorizontally")
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    document.getElementById('categories').scrollLeft -= (delta * 40);
    e.preventDefault();
  }

  if (document.getElementById('categories').addEventListener) {
    document.getElementById('categories').addEventListener("mousewheel", scrollHorizontally, false);
    // Firefox
    document.getElementById('categories').addEventListener("DOMMouseScroll", scrollHorizontally, false);
  } else {
    // IE 6/7/8
    document.getElementById('categories').attachEvent("onmousewheel", scrollHorizontally);
  }
})();

function CloseCustomModal() {
  // console.log("adASD")
  document.getElementById("viewdetail_modal").style.display = "none";
}

function createdivforcategory(divname, containdiv, index) {
  // console.log("ASYNC EEEEEEEEEEEEEEEEEEE");
  let catediv = document.createElement('div');
  catediv.id = "category_" + index;
  document.getElementById(containdiv).appendChild(catediv);
  document.getElementById(catediv.id).classList.add("category_div");
  document.getElementById(catediv.id).classList.add("image");

  let titlediv = document.createElement('div');
  titlediv.id = "title" + index;
  // titlediv.innerHTML = divname + " " + index;
  document.getElementById(catediv.id).appendChild(titlediv);
  document.getElementById(titlediv.id).classList.add("cattitle_div");

  let imgdiv = document.createElement('div'), imgsrc;
  imgdiv.id = catediv.id + "_image_" + settab;

  // switch (settab) {
  //   case 1:
  imgsrc = IMG_URL + product_arr[btnnames[settab-1]][index-1];
  imgdiv.innerHTML = "<img  class='lazy-image' src=./img/arrow/loading2.gif data-src="+ imgsrc +" style='height: 55%;'>";

  document.getElementById(catediv.id).appendChild(imgdiv);
  document.getElementById(imgdiv.id).classList.add("catimg_div");
  // document.getElementById(imgdiv.id).classList.add("lazy-image");

  // Add Button Here
  let addfavdiv = document.createElement("div");
  addfavdiv.id = "addfavbtn" + index;
  let heartsvg =  `<img class="heart" viewBox="0 0 32 29.6" id="${btnnames[settab-1]}_addfavbtn_${index}" src = "./img/arrow/Wishlist-Fill-white.svg">`;
  // `<svg class="heart" viewBox="0 0 32 29.6" id="${btnnames[settab-1]}_addfavbtn_${index}">
  //                     <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
  //                     c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
  //                 </svg>`;
  document.getElementById(catediv.id).appendChild(addfavdiv);
  document.getElementById(addfavdiv.id).innerHTML = heartsvg;
  document.getElementById(addfavdiv.id).classList.add("cataddfavbtn_div");
  if(isMobileDevice.iOS()) {
    document.getElementById(addfavdiv.id).classList.add("iPhoneAddBtn");
  }

  document.getElementById(addfavdiv.id).addEventListener("click", function () {
    let a , b ;
    a = document.getElementById("favourities").children.length;
    for(let i=0 ; i<a ; i++){
      let c = document.getElementById("favourities").children[i].id;
      if ( imgsrc === $("#"+c).find('img').attr('src')){
          b = document.getElementById("favourities").children[i].id;
      }
    }
    for (let i = 0; i < added_favorite.length; i++) {
      if (added_favorite[i].type == btnnames[settab - 1] && added_favorite[i].index == index) {
          added_favorite = added_favorite.filter(function (item) {
            if (item.type == btnnames[settab - 1] && item.index == index){
                document.getElementById(btnnames[settab-1] + "_addfavbtn_" + index).src = "./img/arrow/Wishlist-Fill-white.svg"
            }else{
              return item;
            }
          });
            session_favorite_list = session_favorite_list.filter(function(item) {
            if(item.favname != btnnames[settab - 1] + index) {
              return item;
            }
          });

          window.localStorage.setItem("added_favorite", JSON.stringify(added_favorite));
          window.localStorage.setItem("session_favorite_list", JSON.stringify(session_favorite_list));
          document.getElementById(b).remove();
          console.log("added_favorite: ", added_favorite, "\nsession_favorite_list", session_favorite_list);
        return;
      }
    }

    let value = {"type": btnnames[settab - 1], "index": index};
    added_favorite.push(value);
    $("#"+addfavdiv.id).find('img').attr('src', "./img/arrow/Wishlist-Fill-red.svg")

    let session_value = {"imagesrc": imgsrc, "favname": divname + index, "setindex": settab, "index": index};
    session_favorite_list.push(session_value);

    window.localStorage.setItem("added_favorite", JSON.stringify(added_favorite));
    window.localStorage.setItem("session_favorite_list", JSON.stringify(session_favorite_list));

    console.log("added_favorite: ", added_favorite, "\nsession_favorite_list", session_favorite_list);
    createfavlist(imgsrc, divname + index, settab, index);
  });

  // View Detail Button
  let viewbtndiv = document.createElement("div");
  viewbtndiv.id = "viewbtndiv" + index;
  document.getElementById(catediv.id).appendChild(viewbtndiv);
  document.getElementById(viewbtndiv.id).classList.add("viewbtndiv");
  if(isMobileDevice.iOS()) {
    document.getElementById(viewbtndiv.id).classList.add("iPhoneViewBtn");
  }
  let span1 = document.createElement("span");
  span1.innerHTML = "View";
  document.getElementById(viewbtndiv.id).appendChild(span1);

  //if (w > ipad_size){
    hide(viewbtndiv.id);
  //}

  document.getElementById(viewbtndiv.id).addEventListener("click", function () {
    document.getElementById("viewdetail_modal").style.display = "block";
    // document.getElementById("viewdetailtitle_modal").innerHTML = btnnames[settab - 1] + " " + index;
    // document.getElementById("viewdetailtext_modal").innerHTML = '<b>Description:</b> Write about "<b>' + btnnames[settab - 1] + index + '"</b>.';
    document.getElementById("viewdetailimage_modal").src = imgsrc;
  });

  // Buy Now Button
  let buybtndiv = document.createElement("div");
  buybtndiv.id = "buybtndiv" + index;
  document.getElementById(catediv.id).appendChild(buybtndiv);
  document.getElementById(buybtndiv.id).classList.add("buybtndiv");
  if(isMobileDevice.iOS()) {
    document.getElementById(buybtndiv.id).classList.add("iPhoneBuyBtn");
  }
  let span2 = document.createElement("span");
  span2.innerHTML = "Buy Now";
  document.getElementById(buybtndiv.id).appendChild(span2);

  document.getElementById(buybtndiv.id).addEventListener("click", function () {
    buy_list.push({"type": btnnames[settab - 1], "index": index});
    // console.log("buy:", {"type": btnnames[settab - 1], "index": index});
  });

  document.getElementById(imgdiv.id).addEventListener("click", function () {
    setNull(globselectedlist)
    cur_prod_id = index
    prev_sel_prod = imgdiv.id;
    globselectedlist[btnnames[settab - 1]] = imgsrc;
    // console.log("", catediv.id);
    // console.log("Newly globselectedlist", globselectedlist);
    setSpectsImgName(prodImagePaths[index-1]);
    selectedCategory(catediv.id);
    selectedfavCategory();
    // document.getElementById(catediv.id).scrollIntoView();
  });
}


function setAll(obj, val) {
    Object.keys(obj).forEach(function(index) {
        obj[index] = val
    });
}

function setNull(obj) {
    setAll(obj, null);
}

function selectedCategory(id ) {

  let catnum = catenum[settab - 1];
  for (let i = 1; i <= catnum; i++) {
    // console.log("category" + i)
    if (id == "category_" + i) {
      document.getElementById(id).classList.add("selectedCategory");
    } else {
      document.getElementById( "category_" + i).classList.remove("selectedCategory");
    }
  }
}

function selectedfavCategory(id ) {

  let catnum = document.getElementById("favourities").children.length;
  // console.log("selectedfavCategory",catnum)

  for (let i = 1; i <= catnum; i++) {
    // try{
      document.getElementById("favourities").children[i-1].classList.remove("selectedCategory");
    // }catch(e){}
  }
    try{document.getElementById(id).classList.add("selectedCategory");}
    catch(e){}
}



// function selectedCategory(id, ) {
//   let catnum = catenum[settab - 1];
//   console.log(id,"category1" )
//   for (let i = 1; i <= catnum; i++) {
//     // console.log("category" + i)
//     if (id == "category" + i) {
//       document.getElementById(id).classList.add("selectedCategory");
//     } else {
//       document.getElementById("category" + i).classList.remove("selectedCategory");
//     }
//   }
// }

function createfavlist(imagesrc, favname, setindex, index) {
  // console.log(imagesrc, favname, setindex, index)
  let favdiv = document.createElement('div');
  favdiv.id = "favlist" + "_" + setindex + "_" + favlistnum;
  favdiv.style.width = "273px";
  favdiv.style.height = "130px";
  favdiv.style.borderRadius = "10px";
  favdiv.style.marginLeft = "20px";
  favdiv.style.cursor = "pointer";
  favdiv.style.marginTop = "15px";
  favdiv.style.backgroundColor = "white";
  favdiv.style.border = "1px solid rgba(0,0,0,0.1)";

  let container = document.getElementById("favourities");
  container.appendChild(favdiv);

  // console.log("asds",document.getElementById("favourities").children.length)

  let titlediv = document.createElement('div');
  // titlediv.id = "title"+ favlistnum;
  titlediv.style.width = "100%";
  titlediv.style.height = "15px";
  titlediv.style.marginLeft = "15px";
  titlediv.style.marginTop = "10px";
  titlediv.style.fontSize = "12px";
  // titlediv.innerHTML = favname;
  titlediv.style.textAlign = "left";
  document.getElementById(favdiv.id).appendChild(titlediv);

  let imgdiv = document.createElement('div');
  imgdiv.style.width = "100%";
  imgdiv.style.height = "115px";
  imgdiv.style.marginTop = "10px";
  imgdiv.innerHTML = "<img src=" + imagesrc + " style='height: 55%;'>";
  imgdiv.style.textAlign = "center";
  document.getElementById(favdiv.id).appendChild(imgdiv);

  //onclick
  document.getElementById(favdiv.id).addEventListener("click",function(){
      setNull(globselectedlist)
      globselectedlist[btnnames[setindex - 1]] = $("#"+favdiv.id).find('img').attr('src');
      setSpectsImgName(prodImagePaths[index-1]);
      selectedCategory()
      selectedfavCategory(favdiv.id)


  });


  // Remove Fav Btn
  let removefavdiv = document.createElement("div");
  removefavdiv.id = "removefavbtn" + favlistnum;
  removefavdiv.style.marginLeft = isMobileDevice.iOS() ? "200px" : "220px";
  removefavdiv.classList.add("removebtndiv");

  // let removebtn = `<button type="button" class="btn btn-danger" id = "removefavbtn"${favlistnum} >Remove</button> `
  // $("#"+removefavdiv.id).append(removefavdiv);

  document.getElementById(favdiv.id).appendChild(removefavdiv);

  let span = document.createElement("span");
  span.innerHTML = "Remove";
  document.getElementById(removefavdiv.id).appendChild(span);

  document.getElementById(removefavdiv.id).addEventListener("click", function () {
    let value = {"type": btnnames[setindex - 1], "index": index};
    added_favorite = added_favorite.filter(function (item) {
      if (item.type == value.type && item.index == value.index) {
        // console.log("remove item", value);
        if(settab == setindex) {
          console.log("remove")

          document.getElementById(item.type + "_addfavbtn_" + item.index).src = "./img/arrow/Wishlist-Fill-white.svg"
        }
      } else {
        return item;
      }
    });

    session_favorite_list = session_favorite_list.filter(function(item) {
      if(item.favname != value.type + value.index) {
        return item;
      }
    });

    window.localStorage.setItem("added_favorite", JSON.stringify(added_favorite));
    window.localStorage.setItem("session_favorite_list", JSON.stringify(session_favorite_list));

    document.getElementById(favdiv.id).remove();

    // console.log(added_favorite);
    console.log("added_favorite: ", added_favorite, "\nsession_favorite_list", session_favorite_list);

  });

  // View Detail Fav Button
  let viewbtnfavdiv = document.createElement("div");
  viewbtnfavdiv.id = "viewbtnfavdiv" + favlistnum;

  document.getElementById(favdiv.id).appendChild(viewbtnfavdiv);
  document.getElementById(viewbtnfavdiv.id).classList.add("viewbtnfavdiv");
  viewbtnfavdiv.style.marginLeft = isMobileDevice.iOS() ? "165px" : "185px";
  let span1 = document.createElement("span");
  span1.innerHTML = "View";
  document.getElementById(viewbtnfavdiv.id).appendChild(span1);
  //if (w > ipad_size){
    hide(viewbtnfavdiv.id);
  //}
  document.getElementById(viewbtnfavdiv.id).addEventListener("click", function () {
    document.getElementById("viewdetail_modal").style.display = "block";
    // document.getElementById("viewdetailtitle_modal").innerHTML = favname;
    // document.getElementById("viewdetailtext_modal").innerHTML = '<b>Description:</b> Write about "<b>' + favname + '"</b>.';
    document.getElementById("viewdetailimage_modal").src = imagesrc;
  });

  // Buy Now Fav Button
  let buybtnfavdiv = document.createElement("div");
  buybtnfavdiv.id = "buybtnfavdiv" + favlistnum;
  document.getElementById(favdiv.id).appendChild(buybtnfavdiv);
  document.getElementById(buybtnfavdiv.id).classList.add("buybtnfavdiv");
  buybtnfavdiv.style.marginLeft = isMobileDevice.iOS() ? "180px" : "200px";
  let span2 = document.createElement("span");
  span2.innerHTML = "Buy Now";
  document.getElementById(buybtnfavdiv.id).appendChild(span2);

  document.getElementById(buybtnfavdiv.id).addEventListener("click", function () {
    buy_list.push({"type": btnnames[setindex - 1], "index": index});
    console.log("buy:", {"type": btnnames[setindex - 1], "index": index});
  });

  favlistnum++;
}

checkSession();

function checkSession() {
  added_favorite = JSON.parse(window.localStorage.getItem("added_favorite")) || [];
  session_favorite_list = JSON.parse(window.localStorage.getItem("session_favorite_list")) || [];

  // console.log("Current_Session: \n", added_favorite, session_favorite_list);

  if(session_favorite_list.length) {
    for(let i = 0; i < session_favorite_list.length; i++) {
      let imagesrc = session_favorite_list[i].imagesrc,
          favname = session_favorite_list[i].favname,
          setindex = session_favorite_list[i].setindex,
          index = session_favorite_list[i].index;
      createfavlist(imagesrc, favname, setindex, index);
    }
  }

}

function setColorbtn(index) {
  // cur_cat_id = index;
  settab = index;
  for (let i = 1; i <= btnnames.length; i++) {
    if (i == index) {
      document.getElementById("btn" + i).classList.add("active");
      document.getElementById("tab" + i).style.color = "red";
    } else {
      document.getElementById("btn" + i).classList.remove("active");
      document.getElementById("tab" + i).style.color = "dimgrey";
    }
  }
  document.getElementById("btn" + index).scrollIntoView(window.innerWidth > ipad_size ? {inline: "center"} : '');
  document.getElementById("categories").innerHTML = "";
  // createdivforcategory(btnnames[settab - 1], "categories", j);
  for (let j = 1; j <= catenum[settab - 1]; j++) {

    createdivforcategory(btnnames[settab - 1], "categories", j);
    document.getElementById(btnnames[settab - 1] + "_addfavbtn_" + j).src = "./img/arrow/Wishlist-Fill-white.svg"
    // classList.remove("heart_added_favourite");
    for (let k = 0; k < added_favorite.length; k++) {
      let item = added_favorite[k];
      if (item.type == btnnames[settab - 1] && item.index == j) {
        document.getElementById(item.type + "_addfavbtn_" + item.index).src = "./img/arrow/Wishlist-Fill-red.svg"
        // classList.add("heart_added_favourite");
      }
    }
  }
  if (prev_sel_prod){
    try{document.getElementById(prev_sel_prod).click();}catch(e){}
  }
  //lazy laoding call
  mainLazyChange();
  // lazyChange();
}

function is_mobile() {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return true;
   }
  return false;
}

function consoleTest(zoomRate, cntW, cntH, margintop, marginleft, cntZm) {
  console.log("zoomRate", zoomRate);
  console.log("cntW",cntW,"\ncntH",cntH);
  console.log("margin", marginleft, margintop);
  console.log("cntZm", cntZm);
}

$(window).resize(function () {
  console.log("hwew")
  let cntW = window.innerWidth,
    cntH = window.innerHeight;
  zoomRate = (is_mobile()) ? 1 : window.devicePixelRatio / globalPixelRatio;

  let imgsrc = (cntW > ipad_size) ? 'img/arrow/loaddown.png' : 'img/arrow/menu2.png';
  document.getElementById("loadmorediv").innerHTML = "<img src=" + imgsrc + " style='width: 100%; height: 100%;'>";
  imgsrc = (cntW > ipad_size) ? 'img/arrow/loadup.png' : 'img/arrow/menu2.png';
  document.getElementById("loadupdiv").innerHTML = "<img src=" + imgsrc + " style='width: 100%; height: 100%;'>";

  if (cntW > ipad_size) {
    let cntZm = (cntW * initRatioForPopupSize) / 963 * 100;
    if(cntZm * 487 / 100 > cntH) {
      cntZm = (cntH *initRatioForPopupSize) / 487 * 100;
    }
    initialCategories();
    show("loadmorediv");
    show("loadupdiv");

    document.getElementById("camera_div").style.width = "963px";
    document.getElementById("camera_div").style.height = "520px";
    document.getElementById("category").style.top = "0px";
    document.getElementById("category").style.height = "480px";
    document.getElementById("categories").style.height = "380px";
    document.getElementById("maincamera").style.height = "480px";
    document.getElementById("favorite").style.height = "480px"
    document.getElementById("favourities").style.height = "438px";
    // document.getElementById("category_title").innerHTML = "Categories";

    if(cntBrowser == "firefox") {
      let marginleft = ((cntW - 963) / 2) + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      let margintop = ((cntH - 487) / 2) + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.transform = `scale(${(cntZm*zoomRate/100)})`;
    } else {
      let margintop = ((cntH - 487 * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      let marginleft = ((cntW - 963 * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      document.getElementById("camera_div").style.zoom = cntZm * zoomRate + "%";
    }

    document.getElementById("categories").style.display = "block";

    // borderRadius
    document.getElementById("tab").classList.remove("borderRadius");
    document.getElementById("category").classList.remove("borderRadius");

    // Capture position change
    document.getElementById("pentagon").style.bottom = "11px";
    document.getElementById("menu").style.bottom = "16px";

    // flipCamera Icon
    document.getElementById("flipCamera").style.bottom = "5px";

    global_media_height = 480;

    // show("small_words");

    if(isMobileDevice.iOS()) {
      // smallWords.style.marginLeft = "6px";
      // smallWords.style.fontSize = "6px";
      document.getElementById("category_title").classList.add("iPhoneCategoryTitle");
    } else {
      // smallWords.style.marginLeft = "6px";
    }

    // consoleTest(zoomRate, cntW, cntH, margintop, marginleft, cntZm);
  } else {
    let cntZm = (cntW * 0.96) / 642 * 100,
      camH = cntH * 0.96 / cntZm * 100;

    document.getElementById("camera_div").style.width = "642px";
    document.getElementById("camera_div").style.height = camH + "px";
    document.getElementById("category").style.top = (hideCategoryKey==0) ? camH - 301 + "px" : camH - 101 + "px";
    document.getElementById("category").style.height = (hideCategoryKey==0) ? "301px" : "100px";

    document.getElementById("categories").style.height = (hideCategoryKey==0) ? "201px" : "2px";
    document.getElementById("categories").style.display = "flex";

    document.getElementById("maincamera").style.height = camH - 101 + borderRadius + "px";
    document.getElementById("favorite").style.height = (hideCategoryKey==0) ? camH - 301 + "px" : camH - 101 + "px";
    document.getElementById("favourities").style.height = (hideCategoryKey==0) ? camH - 341 + "px" : camH - 141 + "px";
    document.getElementById("category_title").innerHTML = (hideCategoryKey==0) ? loadclickdown : loadclickup;

    // borderRadius
    document.getElementById("tab").classList.add("borderRadius");
    document.getElementById("category").classList.add("borderRadius");

    // Capture position change

    if(parseInt(document.getElementById("category").style.height) > 300) {
      hide("loadmorediv");
      show("loadupdiv");
      document.getElementById("pentagon").style.bottom = "250px";
      document.getElementById("menu").style.bottom = "250px";
      document.getElementById("flipCamera").style.bottom = "240px";
    }
    if(parseInt(document.getElementById("category").style.height) < 300) {
      hide("loadmorediv");
      show("loadupdiv");
      document.getElementById("pentagon").style.bottom = "250px";
      document.getElementById("menu").style.bottom = "250px";
      document.getElementById("flipCamera").style.bottom = "240px";
    }


    if(cntBrowser == "firefox") {
      // let marginleft = ((cntW - 642) / 2) + "px";
      let marginleft = 0+"px"
      document.getElementById("camera_div").style.marginLeft = marginleft;
      // let margintop = ((cntH - camH) / 2) + "px";
      let margintop = 0+"px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.transform = `scale(${((cntZm*zoomRate*1.04)/100)})`; //`scale(${(cntZm*zoomRate/100)})`;
    } else {
      // let margintop = ((cntH - camH * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
      let margintop = 0+"px";
      document.getElementById("camera_div").style.marginTop = margintop;
      // let marginleft = ((cntW - 642 * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
      let marginleft = 0+"px"
      document.getElementById("camera_div").style.marginLeft = marginleft;
      document.getElementById("camera_div").style.zoom = cntZm * zoomRate*1.04 + "%";
    }

    global_media_height = camH - 101 + borderRadius;

    // show("small_words");

    if(isMobileDevice.iOS()) {
      // smallWords.style.marginLeft = "105px";
      // smallWords.style.fontSize = "9px";
      document.getElementById("category_title").classList.remove("iPhoneCategoryTitle");
    } else {
      // smallWords.style.marginLeft = "250px";
    }
  }

});


function hidefavorite() {
  hide("favorite");
  document.getElementById("flipCamera").style.left = "22px";
}

function showfavorite() {
  show("favorite");
  document.getElementById("flipCamera").style.left = "335px";
}

function showPentagon() {
  show("pentagon");
  hide("menu");
  captureSnapshot();
}

function hidePentagon() {
  hide("pentagon");
  show("menu");
  removeSnapshot();
}

function onNextClick(){
    console.log("onNextClick")
    if (cur_prod_id == catenum[settab-1]){
      cur_prod_id = 1;
    }else{
      cur_prod_id = cur_prod_id + 1;
    }

    let change_prod = document.getElementById("category"+cur_prod_id + "_image_"+settab)
    change_prod.click();

  }

  function onPrevClick(){
    console.log("onprevClick")

    if (cur_prod_id == 1){
        cur_prod_id = catenum[settab-1];
    }else{
        cur_prod_id = cur_prod_id - 1;
    }

    let change_prod = document.getElementById("category"+cur_prod_id + "_image_"+settab)
    change_prod.click();
}


let sliders = ["categories", "tabbtn", "favourities"];

for (let i = 0; i < 3; i++) {
  const slider = document.getElementById(sliders[i]);
  let isDown = false;
  let startX, startY;
  let scrollLeft, scrollTop;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    startY = e.pageY - slider.offsetTop;
    scrollTop = slider.scrollTop;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 100;
    slider.scrollLeft = scrollLeft - walk;
    if((i == 2 || window.innerWidth > ipad_size || expandKey) && (i != 1)) {
      const y = e.pageY - slider.offsetTop;
      const walkY = (y - startY) * 100;
      slider.scrollTop = scrollTop - walkY;
      if(slider.scrollTop < 10) {
        hide("loadupdiv");
      } else {
        show("loadupdiv");
      }
      if(slider.scrollHeight - slider.scrollTop > slider.clientHeight + 10) {
        show("loadmorediv");
      } else {
        hide("loadmorediv");
      }
    }
  });
}

function categoriesScrollWheeling(e) {
  e.preventDefault();

  const slider = document.getElementById("categories");
  slider.scrollTop += e.deltaY / Math.abs(e.deltaY) * 100;
  slider.scrollLeft += e.deltaY / Math.abs(e.deltaY) * 100;
}

for (let i = 0; i < 3; i++) {
  let slider = document.getElementById(sliders[i]), isTouch = false, startX, scrollLeft, startY, scrollTop;
  slider.addEventListener('touchstart', (e) => {
    // console.log("touch start", e.changedTouches[0].pageX);
    isTouch = true;
    slider.classList.add('active');
    startX = e.changedTouches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;

    startY = e.changedTouches[0].pageY - slider.offsetTop;
    scrollTop = slider.scrollTop;
  });
  slider.addEventListener('touchcancel', () => {
    // console.log("touch cancel");
    isTouch = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('touchmove', (e) => {
    // console.log("touch move");
    if (!isTouch) return;
    e.preventDefault();
    const x = e.changedTouches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;

    if((i == 2 || window.innerWidth > ipad_size || expandKey) && (i != 1)) {
      const y = e.changedTouches[0].pageY - slider.offsetTop;
      const walkY = (y - startY) * 100;
      slider.scrollTop = scrollTop - walkY;

      if(slider.scrollTop < 10) {
        hide("loadupdiv");
      } else {
        show("loadupdiv");
      }
      if(slider.scrollHeight - slider.scrollTop > slider.clientHeight + 10) {
        show("loadmorediv");
      } else {
        hide("loadmorediv");
      }
    }
  });
}

function checkBrowser() {
  // Opera
	var sBrowser, sUsrAg = navigator.userAgent;


  // Firefox
	if (sUsrAg.indexOf("Firefox") > -1) {
	  sBrowser = "firefox";
	} else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
	  sBrowser = "Samsung Internet";
	} else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
	  sBrowser = "opera";
	} else if (sUsrAg.indexOf("Trident") > -1) {
	  sBrowser = "IE";
	} else if (sUsrAg.indexOf("Edge") > -1) {
	  sBrowser = "Edge";
	} else if (sUsrAg.indexOf("Chrome") > -1) {
	  sBrowser = "chrome";
	} else if (sUsrAg.indexOf("Safari") > -1) {
	  sBrowser = "safari";
  // Safari
			let navUserAgent = navigator.userAgent;
			let browserName  = navigator.appName;
			var safariVersion  = ''+parseFloat(navigator.appVersion);
			let tempVersionOffset,tempVersion;

			if ((tempVersionOffset=navUserAgent.indexOf("Safari"))!=-1) {
    safariVersion = navUserAgent.substring(tempVersionOffset+7);
			 if ((tempVersionOffset=navUserAgent.indexOf("Version"))!=-1)
      safariVersion = navUserAgent.substring(tempVersionOffset+8);
			}
			if ((tempVersion=safariVersion.indexOf(";"))!=-1)
			   safariVersion=safariVersion.substring(0,tempVersion);
			if ((tempVersion=safariVersion.indexOf(" "))!=-1)
			   safariVersion=safariVersion.substring(0,tempVersion);
			if(parseFloat(safariVersion) < 13){
        isSafar12 = true;
      }
			//alert("isSafar12 = " + isSafar12);

	} else {
	  sBrowser = "unknown";
  }

  // Internet Explorer
	if(sBrowser != null && sBrowser != "unknown"){
  // Edge 20+
		return sBrowser;
  // Chrome
	}else{
  // Edge (based on chromium) detection

  // Blink engine detection

  return "noneBrowser";
	}
}

init();
var instructionInterval;

$(document).ready(function() {
  // console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")

  pro_arr=["Please Wait..", "Please maintain good light..", "You are one step away!!"];
  var i = 0;
  instructionInterval = setInterval(function()
  {
    // console.log("dddddddddddddddddddd")
    var txt = pro_arr[i++];
    $("#process_txt").text(txt);
    $("#process_txt").hide(txt);
    $("#process_txt").fadeIn("slow");
    if(i >= pro_arr.length) i = 0;
  }, 5000);
});
