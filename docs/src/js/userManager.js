const userOpt = document.querySelector(".userOpt")
const userData = JSON.parse(localStorage.getItem("userData"))

const loginEmail = loginPage.querySelector(".email")
const loginPassword = loginPage.querySelector(".password")

const signupEmail = signupPage.querySelector(".email")
const signupPassword = signupPage.querySelector(".password")
const signupPasswordConfirm = signupPage.querySelector(".passwordConfirm")
const signupUsername = signupPage.querySelector(".username")

const usernameInfo = document.querySelector("#usernameInfo")
const emailInfo = document.querySelector("#emailInfo")
const idInfo = document.querySelector("#idInfo")

const processIndicator = document.querySelector(".process");

const dataid="65840f7edc7465401886c09e"
const masterKey = "$2a$10$LaGLyqtL0K26RV5JCsk0yuo4jgy3I788InSgqfiv.w6nE74ltaFLy"


window.addEventListener("load", () => {
    if(userData != undefined){
        userOpt.innerHTML=""
    
        const profileButton = document.createElement("div")
        profileButton.classList= "userOptItem mark"
        profileButton.innerHTML=userData.username
        profileButton.addEventListener("click",()=>{profile()})

        idInfo.innerHTML = userData.id
        usernameInfo.innerHTML = userData.username
        emailInfo.innerHTML = userData.email

        userOpt.appendChild(profileButton)
    }
})

axios.interceptors.request.use(function (config) {
  processIndicator.style.display = "block";
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  processIndicator.style.display = "none";
  return response;
}, function (error) {
  processIndicator.style.display = "none";
  return Promise.reject(error);
});

function showIndicator() {
  processIndicator.style.display = "block";
}

// Function to hide the rotating indicator
function hideIndicator() {
  processIndicator.style.display = "none";
}

function logoutUser(){
    localStorage.removeItem("userData")
    location.reload()
}

function signUpUser(){
  const email = signupEmail.value
  const password = signupPassword.value
  const passwordConfirm = signupPasswordConfirm.value
  const username = signupUsername.value

  if(password != passwordConfirm){
    return alert("Passwords do not match")
  }
  showIndicator();
  axios.get(`${endpoint}${dataid}/latest`,{headers:{
    "X-Master-Key": masterKey
  }}).then((res) => {
    console.log(res)
    const data = res.data.record

    const ID = crypto.getRandomValues(new Uint32Array(1))[0]

    for(let id in data){
      const user = data[id]
      if(user.email == email){
        hideIndicator();
        return alert("Email already in use")
      }
      else if(user.username == username){
        hideIndicator();
        return alert("Username already in use")
      }
    }
    console.log("Adding user")

    data[ID] = {
      "email": email,
      "password": password,
      "username": username
    }


    axios.put(`${endpoint}${dataid}`,data,{headers:{
      "X-Master-Key": masterKey,
      "Content-Type": "application/json"
    }}).then((res) => {
      console.log(res)
      console.log("User added")
      console.log(ID)
      alert("User added")
      localStorage.setItem("userData",JSON.stringify({
        "id": ID,
        "email": email,
        "username": username
      }))
      hideIndicator();
      profile()
    }).catch((err) => {
      hideIndicator();
      console.log(err)
    })
  }).catch((err) => {
    hideIndicator();
    console.log(err)
  })

}

function loginUser(){
  const email = loginEmail.value
  const password = loginPassword.value

  showIndicator();

  axios.get(`${endpoint}${dataid}/latest`,{headers:{
    "X-Master-Key": masterKey
  }}).then((res) => {
    console.log(res)
    const data = res.data.record

    for(let id in data){
      const user = data[id]
      if(user.email == email && user.password == password){
        console.log("User logged in")
        localStorage.setItem("userData",JSON.stringify({
          "id": id,
          "email": email,
          "username": user.username
        }))
        location.reload()
        hideIndicator();
        return
      }
    }
    alert("Email or password incorrect")
  }).catch((err) => {
    console.log(err)
    hideIndicator();
  })
}


