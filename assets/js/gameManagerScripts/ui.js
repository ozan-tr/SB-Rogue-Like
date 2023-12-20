const uiContainer = document.querySelector('.uiContainer');
const levelUpMenu = document.querySelector('.levelUpMenu');
const levelUpMenuBody = document.querySelector('.levelUpMenuBody');

const statsList = document.getElementById('statsList');
const calculatedStatsList = document.getElementsByClassName('calculatedStatsList')[0];

const mapContainer = document.querySelector('.mapContainer');
const mapCanvas = document.querySelector('#mapCanvas');
const mapCtx = mapCanvas.getContext('2d');


document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
        uiActive = !uiActive;
        if (uiActive) {
            activateUI();
        } else {
            deactivateUI();
        }
    }
});

function activateUI() {
    if(gameActive){
        gamePaused = true;
        uiContainer.classList.add('activateUi');
        updateStats();
        updateMap();
    }
}

function deactivateUI() {
    gamePaused = false;
    uiContainer.classList.remove('activateUi');
    document.querySelector('.settingsContainer').style.display = 'none';
}


function updateMap() {
    mapCanvas.width = mapContainer.clientWidth;
    mapCanvas.height = mapContainer.clientHeight;

    mapCanvas.style.top = `${mapCanvas.height/2}px`;

    mapCtx.fillStyle = 'black';

    mapCtx.setTransform(1,0,0,1,mapCanvas.width/2,mapCanvas.height/2)

    mapCtx.clearRect(-mapCanvas.width/2,-mapCanvas.height/2,mapCanvas.width,mapCanvas.height)

    mapCtx.drawImage(player.img,-player.size.width/4,-player.size.height/4,player.size.width/2,player.size.height/2)

    const mapItems = [...renderedItems].filter((item)=>item.displayOnMap)

    const threshold = 5000;

    mapItems.forEach((item) => {

        const pos = {
            x:item.pos.x+player.pos.x,
            y:item.pos.y+player.pos.y
        }

        if(pos.x > threshold/2){
            pos.x = threshold/2
        }
        if(pos.x < -threshold/2){
            pos.x = -threshold/2
        }
        if(pos.y > threshold/2){
            pos.y = threshold/2
        }
        if(pos.y < -threshold/2){
            pos.y = -threshold/2
        }

        const relX = mapNumRange(pos.x,-threshold/2,threshold/2, -mapCanvas.width*0.45, mapCanvas.width*0.45)
        const relY = mapNumRange(pos.y,-threshold/2,threshold/2, -mapCanvas.height*0.45, mapCanvas.height*0.45)

        mapCtx.drawImage(item.img, relX - item.img.width / 4, relY - item.img.height / 4, item.size.width / 2, item.size.height / 2);
    })

}

function updateStats() {
    const stats = player.getStats();
    statsList.innerHTML = '';

    player.inventory.data.items.forEach((item) => {
        document.getElementById(item.constructor.name+"Level").innerHTML = item.level + 1
    })

    for (const stat in stats) {
        if (stats.hasOwnProperty(stat)) {
            const value = stats[stat];
            const formattedStatName = formatStatName(stat);
            const statElement = document.createElement('li');
            statElement.innerHTML = `<b>${formattedStatName}:</b> ${value}`;
            statElement.classList.add('statsListItem');
            statElement.style.listStyleImage = `url(assets/img/UI/statIcon/${stat}.png)`;
            statsList.appendChild(statElement);
        }
    }
}



function createItemSelector(item) {

    gamePaused = true;

    const stats = getItemStats(item)

    const itemDiv = document.createElement('div');
    itemDiv.className = 'levelUpMenuItem';

    const itemThumbnail = document.createElement('div');
    itemThumbnail.className = 'levelUpMenuItemThumbnail';

    const itemImg = document.createElement('img');
    itemImg.src=`assets/img/weapons/${item.constructor.name}.png`
    itemImg.className = 'levelUpMenuItemImg';
    itemImg.style.borderColor=rarity[item.rarity].color

    const itemName = document.createElement('span');
    itemName.innerHTML = item.name;
    itemName.className = 'levelUpMenuItemName';

    itemThumbnail.appendChild(itemImg);
    itemThumbnail.appendChild(itemName);

    const itemInfo = document.createElement('div');
    itemInfo.className = 'levelUpMenuItemInfo';

    const itemDescription = document.createElement('div');
    itemDescription.innerHTML = item.description;
    itemDescription.className = 'levelUpMenuItemDescription';

    const itemStats = document.createElement('div');
    itemStats.className = 'levelUpMenuItemStats';
    itemStats.innerHTML = stats[0];

    if(stats[1]){
        itemDiv.classList.add('newItem')
    }else{
        itemDiv.classList.add('existingItem')
    }


    itemInfo.appendChild(itemDescription);
    itemInfo.appendChild(itemStats);

    itemDiv.appendChild(itemThumbnail);
    itemDiv.appendChild(itemInfo);

    itemDiv.onclick = () => {
        player.inventory.addItem(item.constructor.name)
        closeLevelUpMenu()
        updateStats();

    };
    return itemDiv;
}

function closeLevelUpMenu(){
    player.levelUpQueue-=1;
    levelUpMenu.style.display = 'none';
    deactivateUI()
    uiActive = false;
    if(player.levelUpQueue > 0){
        openLevelUpMenu()
    }else{
        gamePaused = false;
    }

}

function openLevelUpMenu() {
    uiActive = true;
    levelUpMenu.style.display = 'flex';
    levelUpMenuBody.innerHTML = '';
    const maxItemNo = 3; //!değiştir
    const items = player.inventory.getAvailableItems();
    const pickedItems = items.length > maxItemNo ? getRandomItems(items,maxItemNo) : items;
    pickedItems.forEach((item) => {
        const itemDiv = createItemSelector(item);
        levelUpMenuBody.appendChild(itemDiv);
    });
}

function getRandomItems(arr, count) {
    if (arr.length === 0 || count <= 0 || count > arr.length) {
      return [];
    }
    const shuffledArray = arr.slice().sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, count);
  }

  function existsInInventory(item){
        return !player.inventory.data.items.some((w) => w.name === item.name)
   }

  function getItemStats(item){
      let weaponStats = document.createElement('div')
      const statsToDisplay = existsInInventory(item) ? item.getStats() : item.improvementInfo();

      for(const stat in statsToDisplay) {                                         
          const value = statsToDisplay[stat]

          const statElement = document.createElement('div')
          const statSymbol = document.createElement('img')
          const statValue = document.createElement('span')

          statElement.classList.add('levelUpMenuItemStats')

          statSymbol.src=`assets/img/UI/statIcon/${stat}.png`
          statValue.innerHTML = value

          statElement.appendChild(statSymbol)
          statElement.appendChild(statValue)

          weaponStats.appendChild(statElement)
      }
      return [weaponStats.innerHTML,existsInInventory(item)]
  }
