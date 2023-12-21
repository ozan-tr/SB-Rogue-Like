
async function postScore(score) {

    getLeaderboard().then((leaderboard) => {
        console.log(leaderboard)
        if(typeof leaderboard[userName] !== "undefined" ){
            leaderboard[userName].push(score)
        }else{
            leaderboard[userName] = [score]
        }
        axios.put(`${endpoint}6582c619266cfc3fde6bbfa3`, leaderboard, {
            headers:{
                "X-Master-Key": masterkey,
            }
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    })
}


async function getLeaderboard() {
    return new Promise((resolve, reject) => {
        axios.get(`${endpoint}6582c619266cfc3fde6bbfa3/latest`, {
            headers:{
                "X-Master-Key": masterkey,
            }
        }).then((res) => {
            resolve(res.data.record)
        }).catch((err) => {
            reject(err)
        })
    })
}

getLeaderboard().then((res)=>{console.log(res)})

