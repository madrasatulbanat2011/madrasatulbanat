// =======================================
// Barbakpur Madrasatul Banat Official v2.0
// =======================================

// Current Year

const year = document.getElementById("year");

if(year){
year.innerHTML = new Date().getFullYear();
}

// Back To Top Button

const topBtn = document.getElementById("topBtn");

window.onscroll = function(){

if(document.body.scrollTop > 300 ||
document.documentElement.scrollTop > 300){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

};

function topFunction(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}

// Hero Slider

const heroImage=document.querySelector(".hero-image");

const heroImages=[

"images/IMG20260307075737.jpg",

"images/IMG20260307075814.jpg",

"images/IMG20260307075802.jpg"

];

let current=0;

if(heroImage){

setInterval(()=>{

current++;

if(current>=heroImages.length){

current=0;

}

heroImage.src=heroImages[current];

},4000);

}

// Fade Animation

const cards=document.querySelectorAll(".card");

const observer=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0px)";

}

});

});

cards.forEach(card=>{

card.style.opacity="0";

card.style.transform="translateY(40px)";

card.style.transition=".6s";

observer.observe(card);

});

// Console

console.log("Barbakpur Madrasatul Banat Website Loaded");
