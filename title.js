const starField = document.getElementById("starField");

const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const t3 = document.getElementById("t3");

/* ---------- STAR ---------- */
function createStar(x,y){
    const s = document.createElement("div");
    s.classList.add("star-particle");

    s.style.left = x + "px";
    s.style.top = y + "px";

    starField.appendChild(s);
    setTimeout(()=>s.remove(),900);
}

function showerAround(el){
    const rect = el.getBoundingClientRect();

    for(let i=0;i<25;i++){
        const x = rect.left + Math.random()*rect.width;
        const y = rect.top + Math.random()*rect.height;
        createStar(x,y);
    }
}

/* ---------- ROCKET ---------- */
function launchRocket(){

    const rocket = document.createElement("div");
    rocket.classList.add("rocket");

    const x = Math.random()*window.innerWidth;

    rocket.style.left = x+"px";
    rocket.style.bottom = "0px";

    document.body.appendChild(rocket);

    setTimeout(()=>{

        const y = window.innerHeight * (0.15 + Math.random()*0.25);

        const colors = [
            "#ffffff","#ff8ad8","#8ad8ff",
            "#ffd36e","#b58aff","#ff9a9a"
        ];

        for(let i=0;i<30;i++){

            const e = document.createElement("div");
            e.classList.add("explosion");

            e.style.left = x+"px";
            e.style.top = y+"px";

            const angle = Math.random()*Math.PI*2;
            const dist = 80 + Math.random()*140;

            e.style.setProperty("--dx",Math.cos(angle)*dist+"px");
            e.style.setProperty("--dy",Math.sin(angle)*dist+"px");

            const color = colors[Math.floor(Math.random()*colors.length)];
            e.style.background = color;
            e.style.boxShadow = `0 0 18px ${color}`;

            document.body.appendChild(e);

            setTimeout(()=>e.remove(),1200);
        }

        rocket.remove();

    },1400);
}

/* ---------- BIG CENTER BURST ---------- */
function createBurst(){

    const cx = window.innerWidth/2;
    const cy = window.innerHeight*0.45;

    for(let i=0;i<70;i++){

        const b = document.createElement("div");
        b.classList.add("burst");

        b.style.left = cx+"px";
        b.style.top = cy+"px";

        const angle = Math.random()*Math.PI*2;
        const dist = 100 + Math.random()*200;

        b.style.setProperty("--dx",Math.cos(angle)*dist+"px");
        b.style.setProperty("--dy",Math.sin(angle)*dist+"px");

        document.body.appendChild(b);

        setTimeout(()=>b.remove(),1200);
    }
}

/* ---------- CINEMATIC FLOW ---------- */

window.onload = function(){

    /* word 1 */
    setTimeout(()=>{
        t1.classList.add("active");
        showerAround(t1);
    },500);

    /* word 2 */
    setTimeout(()=>{
        t2.classList.add("active");
        showerAround(t2);
    },1300);

    /* word 3 */
    setTimeout(()=>{
        t3.classList.add("active");
        showerAround(t3);
    },2100);

    /* rockets start AFTER text appears */
    setTimeout(()=>{
        setInterval(launchRocket,700);
    },2500);

    /* final burst */
    setTimeout(()=>{
        createBurst();
    },4200);

    /* move page */
    setTimeout(()=>{
        window.location.href="photos.html";
    },7500);
};
