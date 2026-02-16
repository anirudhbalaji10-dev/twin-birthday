/* ---------- ROCKET FUNCTION ---------- */
function launchRocket(){

    const rocket = document.createElement("div");
    rocket.classList.add("rocket");

    const x = Math.random() * window.innerWidth;

    rocket.style.left = x + "px";
    rocket.style.bottom = "0px";

    document.body.appendChild(rocket);

    setTimeout(()=>{

        const y = window.innerHeight * (0.15 + Math.random()*0.25);

        const colors = [
            "#ffffff", "#ff8ad8", "#8ad8ff",
            "#ffd36e", "#b58aff", "#ff9a9a"
        ];

        for(let i=0;i<28;i++){

            const e = document.createElement("div");
            e.classList.add("explosion");

            e.style.left = x + "px";
            e.style.top = y + "px";

            const angle = Math.random()*Math.PI*2;
            const distance = 80 + Math.random()*140;

            e.style.setProperty("--dx",
                Math.cos(angle)*distance + "px");
            e.style.setProperty("--dy",
                Math.sin(angle)*distance + "px");

            const color = colors[Math.floor(Math.random()*colors.length)];
            e.style.background = color;
            e.style.boxShadow = `0 0 18px ${color}`;

            document.body.appendChild(e);

            setTimeout(()=>e.remove(),1200);
        }

        rocket.remove();

    },1400);
}

/* ---------- CENTER BURST ---------- */
function createBurst(){

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.45;

    for(let i=0;i<60;i++){

        const b = document.createElement("div");
        b.classList.add("burst");

        b.style.left = centerX + "px";
        b.style.top = centerY + "px";

        const angle = Math.random()*Math.PI*2;
        const distance = 100 + Math.random()*200;

        b.style.setProperty("--dx",
            Math.cos(angle)*distance + "px");
        b.style.setProperty("--dy",
            Math.sin(angle)*distance + "px");

        document.body.appendChild(b);

        setTimeout(()=>b.remove(),1200);
    }
}

/* ---------- START EVERYTHING ---------- */
window.onload = function(){

    /* rockets START IMMEDIATELY */
    setInterval(launchRocket, 700);

    /* burst after handwriting finishes */
    setTimeout(()=>{
        createBurst();
    },3500);

    /* move to photos page */
    setTimeout(()=>{
        window.location.href = "photos.html";
    },8000);
};
