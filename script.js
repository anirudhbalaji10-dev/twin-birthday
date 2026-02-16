console.log("NEW VERSION LOADED");

const pairs = [
    ["1L.jpeg","1R.jpeg"],
    ["2L.jpeg","2R.jpeg"],
    ["3L.jpeg","3R.jpeg"],
    ["4L.jpeg","4R.jpeg"],
    ["5L.jpeg","5R.jpeg"],
    ["6L.jpeg","6R.jpeg"],
    ["7L.jpeg","7R.jpeg"],
    ["8L.jpeg","8R.jpeg"]
];

let index = 0;
let followStars = false;
let followTimeout;

const starLayer = document.getElementById("starLayer");
const leftPhoto = document.getElementById("leftPhoto");
const rightPhoto = document.getElementById("rightPhoto");
const flash = document.getElementById("flash");

/* create one star */
function createStar(x,y){
    const s = document.createElement("div");
    s.classList.add("magic-star");

    s.style.left = x + "px";
    s.style.top = y + "px";

    starLayer.appendChild(s);

    setTimeout(()=>s.remove(),1400);
}
function createFollowStar(x, y){

    if(!followStars) return;

    const s = document.createElement("div");
    s.classList.add("magic-star");

    s.style.left = x + "px";
    s.style.top = y + "px";

    starLayer.appendChild(s);

    setTimeout(()=>s.remove(),1200);
}
/* desktop mouse */
document.addEventListener("mousemove", (e)=>{
    createFollowStar(e.clientX, e.clientY);
});

/* mobile touch */
document.addEventListener("touchmove", (e)=>{
    const t = e.touches[0];
    createFollowStar(t.clientX, t.clientY);
});

/*b1*/
function starBurst(){
    const cx = window.innerWidth/2;
    const cy = window.innerHeight/2;

    for(let i=0;i<35;i++){
        createStar(
            cx + (Math.random()*200 -100),
            cy + (Math.random()*200 -100)
        );
    }
}
/*b2*/
function shootingStars(){
    for(let i=0;i<20;i++){

        const x = Math.random()*window.innerWidth;
        const y = Math.random()*100;

        createStar(x,y);
    }
}

/*b3*/
function photoStars(){
    for(let i=0;i<25;i++){
        createStar(
            Math.random()*window.innerWidth,
            window.innerHeight*0.3 + Math.random()*250
        );
    }
}

/*b4*/
function finalStarBurst(){
    for(let i=0;i<60;i++){
        createStar(
            Math.random()*window.innerWidth,
            Math.random()*window.innerHeight
        );
    }
}

/* SHOW PHOTOS */
function showPair(i){
    console.log(i);
    document.body.classList.remove(
        "scene-stars",
        "scene-glow",
        "scene-float",
        "scene-final"
    );

    if(i <= 1){
        document.body.classList.add("scene-stars");
    }
    else if(i <= 3){
        document.body.classList.add("scene-glow");
    }
    else if(i <= 5){
        document.body.classList.add("scene-float");
    }
    else{
        document.body.classList.add("scene-final");
    }
     
    if(i <= 1){
      starBurst();
    }
    else if(i <= 3){
      shootingStars();
    }
    else if(i <= 5){
      photoStars();
    }
    else{
      finalStarBurst();
    }

    leftPhoto.classList.remove("show-left","float");
    rightPhoto.classList.remove("show-right","float");

    leftPhoto.style.opacity = "0";
    rightPhoto.style.opacity = "0";

    setTimeout(()=>{

        leftPhoto.src = pairs[i][0];
        rightPhoto.src = pairs[i][1];

        const leftTilt = -2 - Math.random()*4;
        const rightTilt = 2 + Math.random()*4;

        leftPhoto.style.transform =
            `translateY(-50%) rotate(${leftTilt}deg)`;

        rightPhoto.style.transform =
            `translateY(-50%) rotate(${rightTilt}deg)`;

        leftPhoto.style.opacity = "1";
        rightPhoto.style.opacity = "1";

        leftPhoto.classList.add("show-left","float");
        rightPhoto.classList.add("show-right","float");

        /* START FOLLOW-STARS (1.5 sec) */
followStars = true;

clearTimeout(followTimeout);

followTimeout = setTimeout(()=>{
    followStars = false;
},1500);


    },250);
}

/* first pair */
showPair(index);

/* tap for next */
document.body.addEventListener("click", ()=>{

    if(flash){
        flash.classList.add("show");
        setTimeout(()=>flash.classList.remove("show"),600);
    }

    index++;
if(index >= pairs.length){

    const pause = document.getElementById("pauseScreen");
    pause.classList.add("show");

    setTimeout(()=>{
        window.location.href = "wishes.html";
    },2000);

    return;
}


    showPair(index);
});


