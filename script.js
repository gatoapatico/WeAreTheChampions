import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://wearethechampions-b830f-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");

const textfieldEl = document.getElementById("textfield-el");
const inputFromEl = document.getElementById("inputFrom-el");
const inputToEl = document.getElementById("inputTo-el");
const btnEl = document.getElementById("btn-el");
const endorsementsEl = document.getElementById("endorsements");

onValue(endorsementsInDB, function(snapshot){
    if(snapshot.exists()){
        let endorsements = Object.entries(snapshot.val());

        clearEndorsements();

        for(let i = 0; i < endorsements.length; i++){
            let currentItem = endorsements[i];
            addHtmlData(currentItem);
        }

    } else{
        endorsementsEl.innerHTML = "There is no endorsements... yet";
    }
})

btnEl.addEventListener("click", function(){
    if(!isEmpty(textfieldEl) && !isEmpty(inputFromEl) && !isEmpty(inputToEl)){
        let newEndor = {
            to: inputToEl.value,
            from: inputFromEl.value,
            text: textfieldEl.value,
            likes: 0
        }
        push(endorsementsInDB, newEndor);
        clearFields();

    } else{
        alert("Hey! ¿olvidaste escribir de quién o para quién es el mensaje?\nDedícaselo a alguien ps");
    }
})

function isEmpty(field) {
    return field.value == "";
}

function clearFields() {
    textfieldEl.value = "";
    inputFromEl.value = "";
    inputToEl.value = "";
}

function clearEndorsements() {
    endorsementsEl.innerHTML = "";
}

function addHtmlData(item) {
    let itemKey = item[0];
    let itemValues = item[1];

    let newEl = document.createElement("div");
    newEl.classList.add("endorsement");
    newEl.innerHTML = `
        <h3>To ${itemValues.to}</h3>
        <p>${itemValues.text}</p>
        <div class="footer-endorsement">
            <h3>From ${itemValues.from}</h3>
            <div class="footer-likes">
                <h3 class="heart">♥</h3>
                <h3 class="numLikes">${itemValues.likes}</h3>
            </div>
        </div>
    `;

    let heartEl = newEl.getElementsByClassName("heart")[0];

    heartEl.addEventListener("click", function(){
        let likePath = ref(database,`endorsements/${itemKey}/likes`)
        set(likePath,itemValues.likes + 1);
    })

    endorsementsEl.append(newEl);
}