/* Star */
const count     = 50;  
const blurCount = 8;
const stage = document.querySelector(".stage");
const offstar = 0;

for (let i = 0; i < count; i++) {
    setTimeout(() => {
    makeLight(i);
  }, 5 * i);}


const repeatlight =  function(){
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const removespan = document.querySelector("span");
      removespan.parentNode.removeChild(removespan);
      makeLight(i);
    }, 5 * i);
  }
}

let timer = setInterval(repeatlight,5000);
const wallpaper1 = document.querySelector('.home_wrap');
let display_cnt = 1;

const __checkposition = function(){
  wallpaper1bot = wallpaper1.getBoundingClientRect().bottom;
  if(wallpaper1bot < 0){
    clearInterval(timer);
    display_cnt = 0;
    
  }
  else if((wallpaper1bot > 0) && (display_cnt == 0)){
    repeatlight();
    timer = setInterval(repeatlight, 5000);
    display_cnt = 1;
  }
};

function scrollfinder() {
  window.addEventListener("scroll", __checkposition);
};

scrollfinder();


function makeLight(i) {
  let span = document.createElement("span");
  if (i < blurCount) {
    span.classList.add("blur");
  }
  stage.appendChild(span);

  gsap.set(span, {
    left: gsap.utils.random(0, stage.offsetWidth),
    top: gsap.utils.random(0, stage.offsetHeight),
    scale: gsap.utils.random(0.2, 1.2, 0.1),
    opacity: 0
  });

  let tl = gsap.timeline({
    paused: true,          
    onComplate: () => {    
                           
      span.remove();     
      makeLight(i);        
    }
  })

  if (i < blurCount) {
    tl.to(span, {
      opacity: gsap.utils.random(0.1, 0),
      duration: 2.8
    })

    tl.to(span, {
      y: gsap.utils.random(-80, 80),
      x: gsap.utils.random(-80, 80),
      duration: gsap.utils.random(8, 4, 4),
      ease: Power0.easeNone
    }, -0.3)

    tl.to(span, {
      opacity: 0,
      duration: 1.6
    }, ">-1.6")
                  
    tl.play();

  } else {
    tl.to(span, {
      opacity: gsap.utils.random(1, 1),
      duration: .6
    })

    tl.to(span, {
      x: gsap.utils.random(-100, 100),
      y: gsap.utils.random(-100, 100),
      duration: gsap.utils.random(8, 4, 10),
      ease: Power0.easeNone
    }, -0.6)

    tl.to(span, {
      opacity:  .3,
      duration: .6
    }, ">-0.6")

    tl.play();
  }
}

/*Main image Slide*/

// 0
var ul = document.querySelectorAll('.slide_wrap');
var slidebox = document.querySelectorAll('.slide_box');

function move(){
 
    window.addEventListener('resize', function resize(){ 
        let slideLen = slidebox[0].clientWidth;
        ul[0].style.transform = "translate3d(-"+slideLen*(curIndex)+"px, 0px, 0px)"
    });

    var curIndex = 0;
    let = slide_timer = setInterval(function callback(){

        let slideLen = slidebox[0].clientWidth;
        ul[0].style.transition = '0.2s';
        ul[0].style.transform = "translate3d(-"+slideLen*(curIndex+1)+"px, 0px, 0px)";

        curIndex++;

},4000); 

    setInterval(function (){
        if(curIndex === 3){
            setTimeout(function last2(){
            ul[0].style.transition = '0s';
            ul[0].style.transform = "translate3d(0px, 0px, 0px)"; },201)
            curIndex = 0;
        }
    })
  }

  document.addEventListener("DOMContentLoaded",function(){move();});

  // 4
function move3(){
 
    window.addEventListener('resize', function resize(){ 
        let slideLen = slidebox[3].clientWidth;
        ul[3].style.transform = "translate3d(-"+slideLen*(curIndex)+"px, 0px, 0px)"
    });

    var curIndex = 0;
    let = slide_timer = setInterval(function callback(){

        let slideLen = slidebox[3].clientWidth;
        ul[3].style.transition = '0.2s';
        ul[3].style.transform = "translate3d(-"+slideLen*(curIndex+1)+"px, 0px, 0px)";

        curIndex++;

},4000); 

    setInterval(function (){
        if(curIndex === 3){
            setTimeout(function last2(){
            ul[3].style.transition = '0s';
            ul[3].style.transform = "translate3d(0px, 0px, 0px)"; },201)
            curIndex = 0;
        }
    })
  }

document.addEventListener("DOMContentLoaded",function(){move3();});

  // 6
  function move6(){
 
    window.addEventListener('resize', function resize(){ 
        let slideLen = slidebox[6].clientWidth;
        ul[6].style.transform = "translate3d(-"+slideLen*(curIndex)+"px, 0px, 0px)"
    });

    var curIndex = 0;
    let = slide_timer = setInterval(function callback(){

        let slideLen = slidebox[6].clientWidth;
        ul[6].style.transition = '0.2s';
        ul[6].style.transform = "translate3d(-"+slideLen*(curIndex+1)+"px, 0px, 0px)";

        curIndex++;

},4000); 

    setInterval(function (){
        if(curIndex === 3){
            setTimeout(function last2(){
            ul[6].style.transition = '0s';
            ul[6].style.transform = "translate3d(0px, 0px, 0px)"; },201)
            curIndex = 0;
        }
    })
  }

document.addEventListener("DOMContentLoaded",function(){move6();});

  // 1

  function move1(){
 
    window.addEventListener('resize', function resize(){ 
        let slideLen = slidebox[1].clientWidth;
        ul[1].style.transform = "translate3d(-"+slideLen*(curIndex)+"px, 0px, 0px)"
    });

    var curIndex = 0;
    let = slide_timer = setInterval(function callback(){

        let slideLen = slidebox[1].clientWidth;
        ul[1].style.transition = '0.2s';
        ul[1].style.transform = "translate3d(-"+slideLen*(curIndex+1)+"px, 0px, 0px)";

        curIndex++;

},4000); 

    setInterval(function (){
        if(curIndex === 3){
            setTimeout(function last2(){
            ul[1].style.transition = '0s';
            ul[1].style.transform = "translate3d(0px, 0px, 0px)"; },201)
            curIndex = 0;
        }
    })
  }

document.addEventListener("DOMContentLoaded",function(){move1();});

  // 4
  function move4(){
 
    window.addEventListener('resize', function resize(){ 
        let slideLen = slidebox[4].clientWidth;
        ul[4].style.transform = "translate3d(-"+slideLen*(curIndex)+"px, 0px, 0px)"
    });

    var curIndex = 0;
    let = slide_timer = setInterval(function callback(){

        let slideLen = slidebox[4].clientWidth;
        ul[4].style.transition = '0.2s';
        ul[4].style.transform = "translate3d(-"+slideLen*(curIndex+1)+"px, 0px, 0px)";

        curIndex++;

},4000); 

    setInterval(function (){
        if(curIndex === 3){
            setTimeout(function last2(){
            ul[4].style.transition = '0s';
            ul[4].style.transform = "translate3d(0px, 0px, 0px)"; },201)
            curIndex = 0;
        }
    })
  }

document.addEventListener("DOMContentLoaded",function(){move4();});

  // 7
  function move7(){
 
    window.addEventListener('resize', function resize(){ 
        let slideLen = slidebox[7].clientWidth;
        ul[7].style.transform = "translate3d(-"+slideLen*(curIndex)+"px, 0px, 0px)"
    });

    var curIndex = 0;
    let = slide_timer = setInterval(function callback(){

        let slideLen = slidebox[7].clientWidth;
        ul[7].style.transition = '0.2s';
        ul[7].style.transform = "translate3d(-"+slideLen*(curIndex+1)+"px, 0px, 0px)";

        curIndex++;

},4000); 

    setInterval(function (){
        if(curIndex === 3){
            setTimeout(function last2(){
            ul[7].style.transition = '0s';
            ul[7].style.transform = "translate3d(0px, 0px, 0px)"; },201)
            curIndex = 0;
        }
    })
  }

document.addEventListener("DOMContentLoaded",function(){move7();});

  // 8
  function move8(){
 
    window.addEventListener('resize', function resize(){ 
        let slideLen = slidebox[8].clientWidth;
        ul[8].style.transform = "translate3d(-"+slideLen*(curIndex)+"px, 0px, 0px)"
    });

    var curIndex = 0;
    let = slide_timer = setInterval(function callback(){

        let slideLen = slidebox[8].clientWidth;
        ul[8].style.transition = '0.2s';
        ul[8].style.transform = "translate3d(-"+slideLen*(curIndex+1)+"px, 0px, 0px)";

        curIndex++;

},4000); 

    setInterval(function (){
        if(curIndex === 3){
            setTimeout(function last2(){
            ul[8].style.transition = '0s';
            ul[8].style.transform = "translate3d(0px, 0px, 0px)"; },201)
            curIndex = 0;
        }
    })
  }

document.addEventListener("DOMContentLoaded",function(){move8();});

  // 2
  function move2(){
 
    window.addEventListener('resize', function resize(){ 
        let slideLen = slidebox[2].clientWidth;
        ul[2].style.transform = "translate3d(-"+slideLen*(curIndex)+"px, 0px, 0px)"
    });

    var curIndex = 0;
    let = slide_timer = setInterval(function callback(){

        let slideLen = slidebox[2].clientWidth;
        ul[2].style.transition = '0.2s';
        ul[2].style.transform = "translate3d(-"+slideLen*(curIndex+1)+"px, 0px, 0px)";

        curIndex++;

},4000); 

    setInterval(function (){
        if(curIndex === 3){
            setTimeout(function last2(){
            ul[2].style.transition = '0s';
            ul[2].style.transform = "translate3d(0px, 0px, 0px)"; },201)
            curIndex = 0;
        }
    })
  }

document.addEventListener("DOMContentLoaded",function(){move2();});

  // 5
  function move5(){
 
    window.addEventListener('resize', function resize(){ 
        let slideLen = slidebox[5].clientWidth;
        ul[5].style.transform = "translate3d(-"+slideLen*(curIndex)+"px, 0px, 0px)"
    });

    var curIndex = 0;
    let = slide_timer = setInterval(function callback(){

        let slideLen = slidebox[5].clientWidth;
        ul[5].style.transition = '0.2s';
        ul[5].style.transform = "translate3d(-"+slideLen*(curIndex+1)+"px, 0px, 0px)";

        curIndex++;

},4000); 

    setInterval(function (){
        if(curIndex === 3){
            setTimeout(function last2(){
            ul[5].style.transition = '0s';
            ul[5].style.transform = "translate3d(0px, 0px, 0px)"; },201)
            curIndex = 0;
        }
    })
  }

document.addEventListener("DOMContentLoaded",function(){move5();});


/*About2 Typing*/
let target = document.querySelector("#dynamic");

function randomString(){
    let stringArr = ["#slowly-but-surely", "#cross-chain-galaxy", "#@*_* -> ???", "#Solana NFT"];
    let selectString = stringArr[Math.floor(Math.random()*stringArr.length)];
    let selectStringArr = selectString.split("");

    return selectStringArr;
}

function resetTyping(){
    target.textContent = "";
    dynamic(randomString());
}

function dynamic(randomArr){
    if(randomArr.length>0){
        target.textContent += randomArr.shift();
        setTimeout(function(){
            dynamic(randomArr);
        }, 80); 
    }else{
        setTimeout(resetTyping, 3000);
    }
}

dynamic(randomString());

function blink(){
    target.classList.toggle("active");
}
setInterval(blink,500);

/*FAQ Button*/
const items = document.querySelectorAll(".accordion button");

function toggleAccordion() {
  const itemToggle = this.getAttribute('aria-expanded');
  
  for (i = 0; i < items.length; i++) {
    items[i].setAttribute('aria-expanded', 'false');
  }
  
  if (itemToggle == 'false') {
    this.setAttribute('aria-expanded', 'true');
  }
}

items.forEach(item => item.addEventListener('click', toggleAccordion));