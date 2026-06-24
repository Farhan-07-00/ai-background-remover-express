let addCard = document.getElementById("addCard");
let displayCard = document.getElementById("displayCard");
let downloadCard = document.getElementById("downloadCard");
let fileInput = document.getElementById("fileInput");
let imageBefore = document.getElementById("display-img");
let startBtn = document.getElementById("startBtn");
let imageAfter = document.querySelector(".image-after");
let imageBeforeSM = document.querySelector(".image-before");
let downloadHref = document.getElementById("downloadHref");
const dropZone = document.getElementById("dropZone");

const reader = new FileReader();

const API_URL = "https://api.remove.bg/v1.0/removebg";
const API_KEY = "REMOVE_BG_API_KEY"; // Replace with your actual API key

let file = null;

const activeScreen = (screen) => {
    addCard.style.display = "none";
    displayCard.style.display = "none";
    downloadCard.style.display = "none";
    screen.style.display = "flex";
};

activeScreen(addCard);


fileInput.addEventListener("input", () => {

    file = fileInput.files[0];

    const maxSize = 15 * 1024 * 1024;

     if(file.size > maxSize){
       alert("File size must be less than 15 MB.");
       fileInput.value = "";
       return;
    }

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg"
    ];

    if(!allowedTypes.includes(file.type)){
        alert("Only PNG, JPG and JPEG files are allowed.");
        fileInput.value = "";
        return;
    }

    reader.readAsDataURL(file);

    reader.onloadend = () => {
        imageBefore.src = reader.result;
        imageBeforeSM.src = reader.result;
    };

    activeScreen(displayCard);

});

startBtn.addEventListener("click", () => {
    const formData = new FormData();
    formData.append("image_file", file);
    
    startBtn.innerHTML = "⏳ Processing...";
    startBtn.classList.add("processing");
    startBtn.disabled = true;
    
    fetch("https://ai-background-remover-express.onrender.com/", {
        method: "POST",
        body: formData,
    })
.then((res)=>{

    if(!res.ok){
        throw new Error("Failed to remove background");
    }

    return res.blob();

})
.then((blob)=>{
    console.log("Blob size:", blob.size);
    console.log("Blob type:", blob.type);

    reader.readAsDataURL(blob);

    reader.onloadend=()=>{

        imageAfter.src = reader.result;

        downloadHref.setAttribute(
            "href",
            reader.result
        );

    };

    startBtn.classList.remove("processing");

    startBtn.innerHTML = "Remove Background";

    startBtn.disabled = false;

    activeScreen(downloadCard);

})
.catch((error)=>{

    console.error(error);

    alert(
        "Something went wrong. Please try again."
    );

    startBtn.classList.remove("processing");

    startBtn.innerHTML = "Remove Background";

    startBtn.disabled = false;

});

});

dropZone.addEventListener("dragover",(e)=>{
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave",()=>{
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop",(e)=>{
    e.preventDefault();

    dropZone.classList.remove("dragover");

    file = e.dataTransfer.files[0];

    reader.readAsDataURL(file);

    reader.onloadend = ()=>{
        imageBefore.src = reader.result;
        imageBeforeSM.src = reader.result;
    };

    activeScreen(displayCard);
});