document.addEventListener("click", function (e) {
    //only if the button with a class name of edit me will use this funciton when clicked
    // target allows us to grab an html elemenmt that 'contains' that class name
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("enter your new text")
        // adding any url to post method then setting a property we named text to the user input
        axios.post('/update-item', { text: userInput }).then(function () {
            // do something intgeresting in next video
        }).catch(function () {
            console.log('please tryagain later')
        })
    }
})