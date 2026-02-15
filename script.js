const pairs = [
    ["images/1L.jpeg","images/1R.jpeg"],
    ["images/2L.jpeg","images/2R.jpeg"],
    ["images/3L.jpeg","images/3R.jpeg"],
    ["images/4L.jpeg","images/4R.jpeg"],
    ["images/5L.jpeg","images/5R.jpeg"],
    ["images/6L.jpeg","images/6R.jpeg"],
    ["images/7L.jpeg","images/7R.jpeg"],
    ["images/8L.jpeg","images/8R.jpeg"]
];

let index = 0;

const leftPhoto = document.getElementById("leftPhoto");
const rightPhoto = document.getElementById("rightPhoto");
const flash = document.getElementById("flash");

/* SHOW PHOTOS */
function showPair(i){

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
        window.location.href = "wishes.html";
        return;
    }

    showPair(index);
});
