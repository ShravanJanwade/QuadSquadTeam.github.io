const menu = document.querySelector(".container");
const closeBtn = document.querySelector(".closebtn");

window.onscroll = function () {
  myFunction();
};

// Get the header
var header = document.getElementById("myHeader");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

menu.addEventListener("click", function (e) {
  e.preventDefault();
  menu.classList.toggle("change");
  console.log("Hello World");
});

function openNav() {
  menu.classList.toggle("ham-disable");
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}
menu.addEventListener("click", openNav);
closeBtn.addEventListener("click", function (e) {
  menu.classList.toggle("change");
  menu.classList.toggle("ham-disable");
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
});

const imgs = document.getElementById("imgs");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");

const img = document.querySelectorAll("#imgs img");
console.log(rightBtn);
let idx = 0;
let interval = setInterval(run, 2000);

function run() {
  idx++;
  changeImg();
}
function changeImg() {
  if (idx > img.length - 1) {
    idx = 0;
  } else if (idx < 0) {
    idx = img.length - 1;
  }
  imgs.style.transform = `translateX(${-idx * 1550}px)`;
}

function resetInterval() {
  clearInterval(interval);
  interval = setInterval(run, 3000);
}

//#region - start of - number counter animation
const counterAnim = (qSelector, start = 0, end, duration = 1000) => {
  const target = document.querySelector(qSelector);
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    target.innerText = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};
//#endregion - end of - number counter animation

document
  .querySelector(".secondary-container")
  .addEventListener("mouseover", () => {
    counterAnim("#count1", 10, 300, 1000);
    counterAnim("#count2", 5000, 250, 1500);
    counterAnim("#count3", 1000, 150, 2000);
    counterAnim("#count4", 500, 100, 2500);
  });
