let addToy = false;
let toysLoaded = false;
let renderCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  console.log("Initial DOM")
  console.log(document)
  getToysAndConfigureListeners();
  console.log("DOM After getToys()");
  console.log(document)
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  // toyFormContainer.style.display = "block";
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    debugger
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  console.log("addSubmitButtonListener");
  let submitButton = document.querySelector("form")
  debugger
  console.log(submitButton)
  submitButton.addEventListener("submit", (e) => {
    e.preventDefault();
    debugger
    addNewToyToServer(e)
  })
//  submitButton.addEventListener("submit", (e) => {
//    debugger
//    e.preventDefault();
//    debugger;
//
//  })
   

})

function submitData(toy, toyImage) {
  const formData = {
    name : `${toy}`,
    image :`${toyImage}`,
    likes : 0,
  };

  const configurationObject = {
    method: "POST",
    headers: {
      'Content-Type': ['application/json'],
      'Accept': ['application/json'],
    },
    body: JSON.stringify(formData),
  };
    
  fetch("http://localhost:3000/toys", configurationObject)

  .then(function (response) {
    return response.json()
  })
  .then(function (object) {
    // console.log(object)
    debugger
    renderOneToy(object)
  })
  .catch(err => console.log(err))
}

function addNewToyToDOM(object)
{
  let eventElements = document.querySelectorAll(".like-btn")
  
  eventElements.forEach((individualElement) => {
    individualElement.addEventListener("click", (event) => {
      processLikeButtonClick(event)
    })
  }).
  console.log(object);
}


function addNewToyToServer(e) {
  debugger
  let toyName;
  let toyImage;
  e.target.querySelectorAll("input.input-text").forEach((child) => {
    // One child is named "name" and the other "image"
    if (child.name === "name") {
      toyName = child.value;
    } else {
      toyImage = child.value;
    }
  })

  submitData(toyName, toyImage)
}

function processLikeButtonClick(parentNode) {
  // Get the number of likes from the innerText of the paragraph.  This is a fellow child of the button,
  // so access the paragraph through the parent node.
  let likesButton = parentNode.querySelector(".like-btn");
  likesButton.addEventListener("click", (event) => {
    debugger
    // The event.target is the like button.  We want the parent to search for the paragraph that shows the likes.
    let likesParagraph = event.target.parentNode.querySelector("p");
    // Cut off the preceding "toy_" from the id
    let cardId = event.target.id.slice(4)
    let updatedClicks = parseInt(likesParagraph.innerText) + 1;
    const bodyData = {
      name: event.target.parentNode.querySelector("h2").innerText,
      image:  event.target.parentNode.querySelector(".toy-avatar").currentSrc,
      likes: updatedClicks
    }
    fetch(`http://localhost:3000/toys/${cardId}`, {
      method: "PATCH",
      headers: {
        'Content-Type': "application/json"
       },
      body: JSON.stringify(bodyData)
    })
    .then(res => res.json())
    .then(updatedRes => console.log(updatedRes))
    .catch(err => console.log(err))

    likesParagraph.innerText = updatedClicks.toString();
    
  })
}

let renderOneToy = (toy) => {
    
  let toyCollection = document.getElementById("toy-collection");
 

  // Create a new toy card. 
  let toyDiv = document.createElement("div");
  toyDiv.className = "card";

  // Create the h2 heading
  let h2Tag = document.createElement("h2");
  h2Tag.innerText = toy.name;
  toyDiv.appendChild(h2Tag);

  // Create the img node
  let image = document.createElement("img")
  image.className = "toy-avatar"
  image.src = toy.image;
  toyDiv.appendChild(image);

  // Create the "likes" paragraph
  let likes = document.createElement("p");
  likes.innerText = toy.likes;
  toyDiv.appendChild(likes);

  // Create the like button
  let likeButton = document.createElement("button");
  likeButton.className = "like-btn";
  likeButton.id = `toy_${toy.id}`;
  likeButton.innerText = "Like ❤️";
  toyDiv.appendChild(likeButton);

  // Now append the card div node to the to collection
  toyCollection.appendChild(toyDiv);
  debugger
  processLikeButtonClick(toyDiv)

  renderCount++;
  console.log(renderCount)

}
async function getToysAndConfigureListeners()
{
  console.log("Here in get toys")
  fetch( "http://localhost:3000/toys")
  .then (res => res.json())
  .then ( (toyData) => {
    toyData.forEach(toy => renderOneToy(toy))
    toysLoaded = true;
    console.log("Just before like button listeners");
    console.log(document)
    debugger
//    addLikeButtonListeners( );
    debugger
   

  })
  .catch(err => console.log(err))
}
