
const binID = "6582c619266cfc3fde6bbfa3"
const endpoint = ` https://api.jsonbin.io/v3/b/`

const accsseskey = "$2a$10$BOCd7sUiR1IudA4lkCc8uul23M7caOUpLfMmTJidPh4ZN4C3szMp6"

const leaderboardTable = document.querySelector(".leaderboardTable")

var Leaderboard = []
getLeaderboard()

async function getLeaderboard(){
    return new Promise((resolve, reject) => {
        axios.get(`${endpoint}${binID}/latest`, {headers:{
            "X-Access-Key": accsseskey,
        }}).then((res) => {
            resolve(parseLeaderboard(res.data.record))
        }).catch((err) => {
            reject(err)
        })
    })
}

function parseLeaderboard(rawdata){
    let parsedLeaderboard = []
    for(let user in rawdata){
        console.log(user)
        var data = rawdata[user]
        data.forEach((item) => {
            item.userName = user
        })
        parsedLeaderboard=parsedLeaderboard.concat(data)
    }
    Leaderboard = parsedLeaderboard
}

const dataPerPage = 8
currentPage = 0

function constructLeaderBoard(inverse = false){

        const pagesNumber = Math.ceil(Leaderboard.length/dataPerPage)

        console.log(Leaderboard.length)

        var sortedLeaderboard = [...Leaderboard].sort((a, b) => {
            return a[sortingMethod] - b[sortingMethod]
        })

        if(inverse){sortedLeaderboard.reverse()}

        sortedLeaderboard=sortedLeaderboard.slice(currentPage*dataPerPage,currentPage*dataPerPage+dataPerPage)
    
        leaderboardTable.innerHTML = ""
    
        const header = document.createElement("div")
        header.classList="leaderboardTableHeader"
    
        orderOfLeaderboard.forEach((item) => {
            const cell = document.createElement("div")
            cell.classList="leaderboardCollumn"


            var diplayName = item
            if(item=="player"){
                diplayName="Character"
            }

            cell.innerHTML = formatWord(diplayName)

            if(sortingMethod == item){
                const arrow = document.createElement("div")
                arrow.classList="arrow"
                arrow.innerHTML = inverse?"&nbsp▼":"&nbsp▲"
                cell.appendChild(arrow)
            }

            cell.addEventListener("click",()=>{
                currentPage = 0
                if(sortingMethod == item){constructLeaderBoard(true); return}
                sortingMethod = item; constructLeaderBoard()
            })
            header.appendChild(cell)
        })
    
        leaderboardTable.appendChild(header)
    
        sortedLeaderboard.forEach((data) => {
            const row = document.createElement("div")
            row.classList="leaderboardRow"
    
            orderOfLeaderboard.forEach((item) => {
 
                const cell = document.createElement("div")
                cell.classList="leaderboardCollumn"
                cell.innerHTML = data[item]
                row.appendChild(cell)
            })
            leaderboardTable.appendChild(row)
        })

        const pages = document.createElement("div")
        pages.classList="pages"

        const leftArrow = document.createElement("div")
        leftArrow.classList="arrow"
        leftArrow.innerHTML = "&nbsp◀"
        leftArrow.addEventListener("click",()=>{
            if(currentPage==0){return}
            currentPage--
            constructLeaderBoard(inverse)
        })
        pages.appendChild(leftArrow)

        const pageDisplay = document.createElement("div")
        pageDisplay.innerHTML = `${currentPage+1}/${pagesNumber}`
        pages.appendChild(pageDisplay)

        const rightArrow = document.createElement("div")
        rightArrow.classList="arrow"
        rightArrow.innerHTML = "&nbsp▶"
        rightArrow.addEventListener("click",()=>{
            if(currentPage==pagesNumber-1){return}
            currentPage++
            constructLeaderBoard(inverse)
        })
        pages.appendChild(rightArrow)

        leaderboardTable.appendChild(pages)

}

const orderOfLeaderboard = ["userName","level","player","map","killCount","completed","debugEnabled",]

const formatWord = str => str.split(/(?=[A-Z])/).filter(Boolean).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');


