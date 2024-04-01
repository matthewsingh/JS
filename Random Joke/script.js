

async function joke() {
        /*const response = await fetch("https://official-joke-api.appspot.com/random_joke");
        const jsonResult = await response.json();
        result.innerText = jsonResult;
        console.log(joke);
      }

      joke();*/
      
      fetch("https://official-joke-api.appspot.com/random_joke")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("NETWORK RESPONSE ERROR");
    }
  })
  .then(data => {
    console.log(data);
    display(data)
  })
  .catch((error) => console.error("FETCH ERROR:", error));
    
}
console.log("hello");   
joke();

function display(data){
  const result = document.querySelector("#result");

  result.innerHTML = data.setup + "<br>" + data.punchline;
  console.log(data.setup);
}

display();