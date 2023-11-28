var loadedScripts = 0;

const characterContainer = document.getElementById('characterContainer');

loader.characters().then(chars=>{
        var sortedCharPaths = {}
        chars.forEach(char => {
            
            charName = char.toString().split("\\")[3]
            console.log(charName)
            if(!sortedCharPaths[charName]){
                sortedCharPaths[charName] = [char]
            }else{
                sortedCharPaths[charName].push(char)
            }
        });

        console.log(sortedCharPaths)

        for(const charName of Object.keys(sortedCharPaths)){
            console.log(charName)
            const imgContainer = document.createElement("div")
            imgContainer.id=charName
            imgContainer.style.display="none"
    
            sortedCharPaths[charName].forEach((char) => {
                const img = document.createElement("img")
                img.id = char.split("\\")[4].split(".")[0]
                img.src = char
                imgContainer.appendChild(img)
            })
    
            characterContainer.appendChild(imgContainer)
        }
})

const mapsContainer = document.getElementById("mapsContainer")

loader.maps().then((maps) => {
    maps.forEach((map) =>{
        const element = document.createElement("img")
        element.style.display = "none"
        
        element.src=map
        const seperated = map.split("\\")
        element.id=seperated[seperated.length-1].split(".")[0]
        mapsContainer.appendChild(element)
    })

})

const mobsContainer = document.getElementById("mobsContainer")

loader.mobs().then(mobs => {
    var sortedMobPaths = {}
    mobs.forEach(mob => {
        mobName = mob.toString().split("\\")[3]
        if(!sortedMobPaths[mobName]){
            sortedMobPaths[mobName] = [mob]
        }else{
            sortedMobPaths[mobName].push(mob)
        }
    });


    for(const mobName of Object.keys(sortedMobPaths)){
        const imgContainer = document.createElement("div")
        imgContainer.id=mobName
        imgContainer.style.display="none"

        sortedMobPaths[mobName].forEach((mob) => {
            const img = document.createElement("img")
            img.id = mob.split("\\")[4].split(".")[0]
            img.src=mob
            imgContainer.appendChild(img)
        })

        mobsContainer.appendChild(imgContainer)
    }
})


loader.scripts().then(paths => {
    var mainContainer = document.querySelector(".mainContainer");
    var canvas = document.createElement('canvas');
    mainContainer.appendChild(canvas);

    // Set canvas dimensions
    canvas.width = 1400;
    canvas.height = 1000;

    // Get the 2d context of the canvas
    var ctx = canvas.getContext('2d');

    // Variables for loading animation
    var loadedScripts = 0;
    var totalScripts = paths.length;
    var startAngle = 0;
    var endAngle = 0;

    // Function to draw the loading bar
    function drawLoadingBar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the loading bar background
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, 0, 2 * Math.PI);
        ctx.strokeStyle = '#932921';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Draw the loading bar progress
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, startAngle, endAngle);
        ctx.strokeStyle = '#3498db'; // You can change the color as needed
        ctx.lineWidth = 10;
        ctx.stroke();
    }


    paths.forEach(path => {
        var script = document.createElement('script');
        script.src = path;
        document.body.appendChild(script);

        script.addEventListener('load', updateLoadingProgress);
    });
    // Function to update the loading bar progress


    function updateLoadingProgress() {
        loadedScripts++;
        endAngle = (loadedScripts / totalScripts) * 2 * Math.PI;
        drawLoadingBar();

        // Check if all scripts are loaded
        if (loadedScripts === totalScripts) {
            setTimeout(() => {
                // Remove the canvas once all scripts are loaded
                mainContainer.removeChild(canvas);

                // Call the startGame function
                startGame();
            }, 500);
        }
    }
})
