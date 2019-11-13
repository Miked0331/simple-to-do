function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
         </li>`
}

//Initial Page Load Render
let ourHTML = items.map(function (item) {
    return itemTemplate(item)
}).join('')
document.getElementById('item-list').insertAdjacentHTML("beforeend", ourHTML)

//CREATE FEATURE
let createField = document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit", function (e) {
    e.preventDefault()
    axios.post('/create-item', { text: createField.value }).then(function (response) {
        // Create the HTML for a new item
        // insertAdjacentHTML adds item on the fly to html and beforeend creates element at the end on submit
        document.getElementById('item-list').insertAdjacentHTML("beforeend", itemTemplate(response.data))
        createField.value = ""
        createField.focus()
    }).catch(function () {
        console.log("error on delete operation")
    })
})

document.addEventListener("click", function (e) {
    //DELETE FEATURE
    if (e.target.classList.contains("delete-me")) {
        if (confirm("Do you really want to delete this item permanenently?")) {
            console.log("initiating delet for:" + e.target.getAttribute("data-id"));
            axios.post('/delete-item', { id: e.target.getAttribute("data-id") }).then(function () {
                e.target.parentElement.parentElement.remove();
                console.log("item deleted successfully")
            }).catch(function () {
                console.log("error on delete operation")
            })

        }
    }

    //UPDATE FEATURE
    //only if the button with a class name of edit me will use this funciton when clicked
    // target allows us to grab an html elemenmt that 'contains' that class name
    if (e.target.classList.contains("edit-me")) {
        // targeting the input field to pre populate what the text is already = to
        let userInput = prompt("enter your new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)

        //created if statement so that if the userInput is set to True(if something typed in edit ) the function will run
        if (userInput) {
            // adding any url to post method then setting a property we named text to the user input
            // we are updating the text using the user input variable and we are able to target the HTML element through e.target
            // last, we set the buttons = to their id's in the database, then we are able to target the specific record according to the button with e.tar.get. ("data-id"), which refers back to the HTML edit button
            axios.post('/update-item', { text: userInput, id: e.target.getAttribute("data-id") }).then(function () {
                //searching for html ancestor element of the target that is being edited
                // going throught 2 parent elements because level one is the button level two is the whole item to update
                // then searching for item-text which is the HTML element that holds the text in the list and setting it to the userInput
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput
            }).catch(function () {
                console.log('please tryagain later')
            })
        }
    }
})