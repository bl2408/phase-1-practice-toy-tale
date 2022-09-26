let addToy = false;
const url = "http://localhost:3000/toys";
let toyCollection, toyForm, toyFormContainer;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  toyFormContainer = document.querySelector(".container");
  toyCollection = document.querySelector("#toy-collection");
  toyForm = document.querySelector(".add-toy-form");
  
  toyForm.addEventListener("submit", e=>formSubmit(e));

  renderToys();

  addBtn.addEventListener("click", () => toggleForm(addToy) );

  document.body.addEventListener("click", e=>{
    if(e.target.tagName === "BUTTON" && e.target.classList.contains("like-btn")){
      // console.log(e.target.id);
      const pEl = e.target.parentElement.querySelector("p");

      //fetch current likes
      fetch(`${url}/${e.target.id}`)
      .then(res=>res.json())
      .then(data=>{

        const jsonObj = {
          "likes": ++data.likes
        };
      
        const initObj = {
          method: "PATCH",
          headers:{
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(jsonObj),
        }
        //update new likes
        fetch(`${url}/${e.target.id}`, initObj)
        .then(res2=>res2.json())
        .then(data2=>{
          pEl.innerHTML = `${data2.likes} Likes`;
        })


      });

      

    }
  });
});

function toggleForm(togBool){
  // hide & seek with the form
  addToy = !togBool;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  }
}

function formSubmit(e){
  e.preventDefault();

  if(!toyName.value || !toyImage.value){ return; }

  const jsonObj = {
    "name": toyName.value,
    "image": toyImage.value,
    "likes": 0
  };

  const initObj = {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(jsonObj),
  }
  
  fetch(url,initObj)
  .then(res=>res.json())
  .then(data=>{
    if(Object.keys(data).length === 0){
      return;
    }else{
      toyCollection.innerHTML += createCard(data);
      toggleForm(true);
      const newToyEl = document.querySelector(`#toy-${data.id}`);
      newToyEl.scrollIntoView({behavior:"smooth"});
      newToyEl.classList.add('highlight');
      toyForm.reset();
    }
  })
}

function renderToys(){
  fetch(url)
  .then(res=>res.json())
  .then(data=>{
    toyCollection.innerHTML = "";
    data.forEach(item=>{
      toyCollection.innerHTML += createCard(item);
    })
  });
}

function createCard({name, image, likes, id}){
  return `
  <div class="card" id="toy-${id}">
    <h2>${name}</h2>
    <img src="${image}" class="toy-avatar" />
    <p>${likes} Likes</p>
    <button class="like-btn" id="${id}">Like ❤️</button>
  </div>`;
}
