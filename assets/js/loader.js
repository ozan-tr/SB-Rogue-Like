const characterContainer = document.getElementById('characterContainer');
const mapsContainer = document.getElementById('mapsContainer');
const mobsContainer = document.getElementById('mobsContainer');
const mainContainer = document.querySelector('.mainContainer');

function createImageElement(id, src) {
    const element = document.createElement('img');
    element.style.display = 'none';
    element.src = src;
    element.id = id;
    return element;
}

function createDivContainer(id) {
    const container = document.createElement('div');
    container.id = id;
    container.style.display = 'none';
    return container;
}

function loadImages(container, paths) {
    paths.forEach((path) => {
        const separated = path.split('\\');
        const id = separated[separated.length - 1].split('.')[0];
        const img = createImageElement(id, path);
        container.appendChild(img);
    });
}

function sortAndLoad(container, paths) {
    const sortedPaths = {};
    paths.forEach((item) => {
        const itemName = item.toString().split('\\')[3];
        if (!sortedPaths[itemName]) {
            sortedPaths[itemName] = [item];
        } else {
            sortedPaths[itemName].push(item);
        }
    });

    for (const itemName of Object.keys(sortedPaths)) {
        const imgContainer = createDivContainer(itemName);
        loadImages(imgContainer, sortedPaths[itemName]);
        container.appendChild(imgContainer);
    }
}

var loadedScripts = 0;
var totalScripts = 0;

function drawLoadingBar(ctx, startAngle, endAngle,canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, 0, 2 * Math.PI);
    ctx.strokeStyle = '#932921';
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, startAngle, endAngle);
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 10;
    ctx.stroke();
}

function updateLoadingProgress(ctx,canvas) {
    loadedScripts++;
    endAngle = (loadedScripts / totalScripts) * 2 * Math.PI;
    drawLoadingBar(ctx, 0, endAngle,canvas);

    if (loadedScripts === totalScripts) {
        setTimeout(() => {
            mainContainer.removeChild(canvas);
        }, 500);
    }
}

document.addEventListener("drag",(e)=>{e.preventDefault();});


// Your existing code...

loader.characters().then(chars => {
    sortAndLoad(characterContainer, chars);
});

loader.maps().then(maps => {
    loadImages(mapsContainer, maps);
});

loader.mobs().then(mobs => {
    sortAndLoad(mobsContainer, mobs);
});

loader.scripts().then(paths => {
    totalScripts=paths.length;
    const canvas = document.createElement('canvas');
    mainContainer.appendChild(canvas);
    
    canvas.width = 700;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    paths.forEach(path => {
        const script = document.createElement('script');
        script.src = path;
        document.body.appendChild(script);
        script.addEventListener('load', updateLoadingProgress(ctx,canvas));
    });
});
