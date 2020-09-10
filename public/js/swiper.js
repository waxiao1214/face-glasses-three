let globalSwipalAvailableKey = false, xDown, yDown;

// For mobile touch swiper  .

function swipingMobile() {
    let swipeListner = ["maincamera", "tab", "loadmorediv", "loadupdiv"],
        category, categoryHeight, categoryTop,
        categories, categoriesHeight,
        menu, pentagon, flip;
    var swipedir,startX,startY,distX,distY,
    threshold = 50, //required min distance traveled to be considered swipe
    allowedTime = 500, // maximum time allowed to travel that distance
    elapsedTime,
    startTime;
    // handleswipe = callback || function(swipedir){}

    for (let i = 0; i < 4; i++) {
        
        if (i == 0){
            document.getElementById(swipeListner[i]).addEventListener('touchstart', (evt) => {
                var touchobj = evt.changedTouches[0]
                swipedir = 'none'
                dist = 0
                startX = touchobj.pageX
                startY = touchobj.pageY
                startTime = new Date().getTime() // record time when finger first makes contact with surface
                // e.preventDefault()
            });
          
            document.getElementById(swipeListner[i]).addEventListener('touchmove', (evt) => {
                // e.preventDefault() // prevent scrolling when inside DIV
            });
          
            document.getElementById(swipeListner[i]).addEventListener('touchend', (evt) => {
                var touchobj = evt.changedTouches[0]
                distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
                console.log("swipe distX: "+distX);
                elapsedTime = new Date().getTime() - startTime // get time elapsed
                if (elapsedTime <= allowedTime){ // first condition for awipe met
                    if (Math.abs(distX) >= threshold){ 
                        console.log("here")
                        swipedir = (distX < 0)? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
                    }
                }
                console.log("swipedir",swipedir)
                if (swipedir == 'left') onNextClick();
                else if (swipedir == 'right') onPrevClick();
                // handleswipe(swipedir);
            });
        }
        document.getElementById(swipeListner[i]).addEventListener('touchstart', (evt) => {
            if(!globalSwipalAvailableKey || globalCapturedStatus) {
                return;
            }
            xDown = evt.touches[0].clientX;
            yDown = evt.touches[0].clientY;
            // console.log("touch")
            category = document.getElementById("category"),
            categoryHeight = category.style.height || "301px",
            categoryTop = category.style.top || parseInt(document.getElementById("camera_div").style.height) - 301 + "px",
            categories = document.getElementById("categories"),
            categoriesHeight = categories.style.height || "201px",
            menu = document.getElementById("menu"),
            pentagon = document.getElementById("pentagon"),
            flip = document.getElementById("flipCamera"),
            favoriteHeight = document.getElementById("favorite").style.height,
            favouritiesHeight = document.getElementById("favourities").style.height;
        });
        document.getElementById(swipeListner[i]).addEventListener('touchmove', (evt) => {
            if ( ! xDown || ! yDown || !globalSwipalAvailableKey || globalCapturedStatus) {
                return;
            }
            let xUp = evt.touches[0].clientX,
                yUp = evt.touches[0].clientY,
                xDiff = xDown - xUp,
                yDiff = yDown - yUp;

            if ( Math.abs( xDiff ) < Math.abs( yDiff ) ) {
                if(parseInt(categoryHeight) + yDiff < 102 || parseInt(categoryHeight) + yDiff > parseInt(document.getElementById("camera_div").style.height) - 200) {
                    return;
                }
                category.style.height = parseInt(categoryHeight) + yDiff + "px";
                category.style.zIndex = 10;
                category.style.top = parseInt(categoryTop) - yDiff + "px";
                categories.style.height = parseInt(categoriesHeight) + yDiff + "px";
                (parseInt(categories.style.height) > 250) ? categories.classList.add("flex-categories") : categories.classList.remove("flex-categories");
                if(parseInt(category.style.height) < 301) {
                    menu.style.bottom = 250 - (301 - parseInt(category.style.height)) + "px";
                    flip.style.bottom = 240 - (301 - parseInt(category.style.height)) + "px";
                } else {
                    menu.style.bottom = "250px";
                    flip.style.bottom = "240px";
                }
                document.getElementById("favorite").style.height = (parseInt(category.style.height) < 301) ? parseInt(category.style.top) + "px" :
                                          parseInt(document.getElementById("camera_div").style.height) - 301 + "px";
                document.getElementById("favourities").style.height = (parseInt(category.style.height) < 301) ? parseInt(category.style.top) - 40 + "px" :
                                          parseInt(document.getElementById("camera_div").style.height) - 341 + "px";
            }
        });
        document.getElementById(swipeListner[i]).addEventListener('touchend', (evt) => {
            if(!globalSwipalAvailableKey || globalCapturedStatus) {
                return;
            }
            let changeHeight = parseInt(categoryTop) - parseInt(category.style.top),
                startPoint = parseInt(category.style.height),
                endPoint;
            if(hideCategoryKey == 0) {
                if(expandKey) {
                    if(changeHeight > -70) {

                        loadmoreCategories();
                        document.getElementById("category_title").innerHTML = loadclickdown//"Categories"
                        menu.style.bottom = "250px";
                        pentagon.style.bottom = "250px";
                        flip.style.bottom = "240px";
                    } else {
                        endPoint = 301;
                        SwipeAnimate(startPoint, endPoint, 1000, "expand-to-init");
                        document.getElementById("category_title").innerHTML = loadclickdown//"Categories <a style='color:blue'>(-)</a>";
                        menu.style.bottom = "250px";
                        pentagon.style.bottom = "250px";
                        flip.style.bottom = "240px";
                    }
                } else {
                    if(Math.abs(changeHeight) < 70) {
                        initialCategories();
                        document.getElementById("category_title").innerHTML = loadclickdown//"Categories <a style='color:blue'>(-)</a>";
                        menu.style.bottom = "250px";
                        pentagon.style.bottom = "250px";
                        flip.style.bottom = "240px";
                    } else {
                        if (changeHeight > 0) {
                            endPoint = parseInt(document.getElementById("camera_div").style.height) - 300;
                            SwipeAnimate(startPoint, endPoint, 1000, "init-to-expand");
                            document.getElementById("category_title").innerHTML = loadclickdown//"Categories";
                            menu.style.bottom = "250px";
                            pentagon.style.bottom = "250px";
                            flip.style.bottom = "240px";
                        } else {
                            endPoint = 101;
                            SwipeAnimate(startPoint, endPoint, 1000, "init-to-hide");
                            document.getElementById("category_title").innerHTML = loadclickup//"Categories <a style='color:blue'>(+)</a>";
                            menu.style.bottom = "50px";
                            pentagon.style.bottom = "50px";
                            flip.style.bottom = "40px";
                        }
                    }
                }
            } else {
                if(changeHeight > 70) {
                    endPoint = 301;
                    SwipeAnimate(startPoint, endPoint, 1000, "hide-to-init");
                    document.getElementById("category_title").innerHTML = loadclickdown//"Categories <a style='color:blue'>(-)</a>";
                    menu.style.bottom = "250px";
                    pentagon.style.bottom = "250px";
                    flip.style.bottom = "240px";
                } else {
                    hideCategoryKey = 0;
                    initialCategories();
                    toggleCategory();
                    document.getElementById("category_title").innerHTML = loadclickup//"Categories <a style='color:blue'>(+)</a>";
                    menu.style.bottom = "50px";
                    pentagon.style.bottom = "50px";
                    flip.style.bottom = "40px";
                }
            }
            xDown = null;
            yDown = null;
        });
    }

}

// This function is for Swiping Animation.
function SwipeAnimate(startPoint, endPoint, delayTime, nextStep) {
    console.log("delayTime",startPoint, endPoint, delayTime, nextStep)
    let dy = (endPoint - startPoint) / 50, delayStep = 50;
    let category, categoryHeight, categoryTop,
        categories, categoriesHeight,
        cntW = window.innerWidth,
        cntH = window.innerHeight,
        cntZm = (cntW * 0.96) / 642 * 100,
        camH = cntH * 0.96 / cntZm * 100;

    category = document.getElementById("category"),
    categoryHeight = category.style.height || "301px",
    categoryTop = category.style.top || parseInt(document.getElementById("camera_div").style.height) - 301 + "px",
    categories = document.getElementById("categories"),
    categoriesHeight = categories.style.height || "201px",
    menu = document.getElementById("menu"),
    pentagon = document.getElementById("pentagon"),
    flip = document.getElementById("flipCamera"),
    favoriteHeight = document.getElementById("favorite").style.height,
    favouritiesHeight = document.getElementById("favourities").style.height;

    let swipeAnimation = setInterval(function() {
        if(delayStep > 50) {
            clearInterval(swipeAnimation);
            global_media_height = camH - 101 + borderRadius;
            if(nextStep == "init-to-expand") {
                loadmoreCategories();
                hideCategoryKey = 0;
                expandKey = 1;
                return;
            }
            if(nextStep == "init-to-hide") {
                initialCategories();
                toggleCategory();
                hideCategoryKey = 1;
                expandKey = 0;
                global_media_height = camH - 101 + borderRadius;
                return;
            }
            if("expand-to-init") {
                initialCategories();
                hideCategoryKey = 0;
                expandKey = 0;
                return;
            }
            if("hide-to-init") {
                toggleCategory();
                hideCategoryKey = 0;
                expandKey = 0;
                return;
            }
            return;
        }
        let yDiff = dy * delayStep;
        category.style.height = parseInt(categoryHeight) + yDiff + "px";
        category.style.zIndex = 10;
        category.style.top = parseInt(categoryTop) - yDiff + "px";
        categories.style.height = parseInt(categoriesHeight) + yDiff + "px";
        (parseInt(categories.style.height) > 250) ? categories.classList.add("flex-categories") : categories.classList.remove("flex-categories");
        if(parseInt(category.style.height) < 301) {
            menu.style.bottom = 250 - (301 - parseInt(category.style.height)) + "px";
            flip.style.bottom = 240 - (301 - parseInt(category.style.height)) + "px";
        } else {
            menu.style.bottom = "250px";
            flip.style.bottom = "240px";
        }
        document.getElementById("favorite").style.height = (parseInt(category.style.height) < 301) ? parseInt(category.style.top) + "px" :
                                    parseInt(document.getElementById("camera_div").style.height) - 301 + "px";
        document.getElementById("favourities").style.height = (parseInt(category.style.height) < 301) ? parseInt(category.style.top) - 40 + "px" :
                                    parseInt(document.getElementById("camera_div").style.height) - 341 + "px";
        // delayStep += 10;
        delayStep += 1;
    }, delayTime / 50);
}

// For mobile swipper
// This function is not used in this project. But can be used later.
function SwipeAvailable_mobile() {

    let swipeListner = ["overlay","overlay2","overlay3","overlayVideo", "tab"];

    for (let i = 0; i < 2; i++) {
        document.getElementById(swipeListner[i]).addEventListener('touchstart', (evt) => {
            if(!globalSwipalAvailableKey) {
                return;
            }
            xDown = evt.touches[0].clientX;
            yDown = evt.touches[0].clientY;
        });
        document.getElementById(swipeListner[i]).addEventListener('touchmove', (evt) => {
            if ( ! xDown || ! yDown || !globalSwipalAvailableKey) {
                return;
            }
            let xUp = evt.touches[0].clientX;
            let yUp = evt.touches[0].clientY;
            let xDiff = xDown - xUp;
            let yDiff = yDown - yUp;

            if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
                if ( xDiff > 0 ) {
                    /* left swipe */
                    return;
                } else {
                    /* right swipe */
                    return;
                }
            } else {
                if ( yDiff > 0 ) {
                    /* up swipe */
                    console.log(expandKey, hideCategoryKey);
                    if(!expandKey && !hideCategoryKey) {
                        loadmoreCategories();
                    } else if (!expandKey && hideCategoryKey) {
                        toggleCategory();
                    } else {
                        return;
                    }
                } else {
                    /* down swipe */
                    if (expandKey) {
                        initialCategories();
                    } else if (!hideCategoryKey) {
                        toggleCategory();
                    } else {
                        return;
                    }
                }
            }
            /* reset values */
            xDown = null;
            yDown = null;
        });
    }

}

// For desktop swipper
// This function is not used in this project. But can be used later.
function SwipeAvailable_Desktop() {

    let isMouseDown = false, xUp, yUp;
    document.getElementById("overlay").addEventListener('mousedown', (evt) => {
        if(!globalSwipalAvailableKey) {
            return;
        }
        xDown = evt.pageX;
        yDown = evt.pageY;
        isMouseDown = true;
    });
    document.getElementById("overlay").addEventListener('mouseleave', () => {
        isMouseDown = false;
        xDown = null;
        yDown = null;
    });
    document.getElementById("overlay").addEventListener('mouseup', (evt) => {
        if ( ! xDown || ! yDown || !globalSwipalAvailableKey || !isMouseDown) {
            return;
        }
        isMouseDown = false;
        xUp = evt.pageX;
        yUp = evt.pageY;
        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;

        if ( Math.abs( xDiff ) < Math.abs( yDiff ) ) {
            if ( yDiff > 0 ) {
                /* up swipe */
                console.log(expandKey, hideCategoryKey);
                if(!expandKey && !hideCategoryKey) {
                    loadmoreCategories();
                } else if (!expandKey && hideCategoryKey) {
                    toggleCategory();
                } else {
                    return;
                }
            }
            if ( yDiff < 0 ) {
                /* down swipe */
                if (expandKey) {
                    initialCategories();
                } else if (!hideCategoryKey) {
                    toggleCategory();
                } else {
                    return;
                }
            }
        }
        xDown = null;
        yDown = null;
    });

}

if (window.innerWidth < 640) {
    globalSwipalAvailableKey = true;
} else {
    globalSwipalAvailableKey = false;
}

swipingMobile();

$(window).resize(function () {
    let cntW = window.innerWidth
    if(cntW < 640) {
        globalSwipalAvailableKey = true;
    } else {
        globalSwipalAvailableKey = false;
    }
});
