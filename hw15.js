let userList = null
let currentUser = null
function getCookies () {
    var res = document.cookie
        .split ( "; " )
        .map (
            x =>  {
                var tmp = x.split ( "=" )
                var elem = {}
                elem [ tmp [0] ] = tmp [1]
                return elem
            }
        )
    return Object.assign ( {}, ...res )
}
window.onload = (event) => {
    class StateData {
        constructor(url) {
            let state
            fetch(url)
                .then(response => response.json())
                .then(response => state = response)
            this.getState = () => state
        }
    }
    userList = new StateData('https://fea-15-andry.glitch.me/users/all')
    let userCookie = getCookies()
    if (userCookie['userPass'] && userCookie['userPass'] === userList[userCookie.login]['pass-hash'])
    console.log('user identifier: ok')
    else console.log('cookies is empty!!!')

}

showuser.onclick = (event) => {
    showuser.classList.add('loading-button')
    setTimeout(() => showuser.classList.remove('loading-button'), 500)
    registrationForm.style = "top:20%;"
    console.log(userList.getState())
}
exitbutton.onclick = (event) => {
    registrationForm.style = ""
}
chooseFile.onchange = (event) => {
    let photo = event.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(photo)
    reader.onload = (event) => {
        if (photo.type.indexOf("image") !== 0 || photo.size > 100000) return alert('Incorrect format file')
        avatar.src = URL.createObjectURL(photo)
        userPhoto.value = event.target.result
    }
}
pass1.oninput = function (event) {
    let pass = event.target.value
    event.target.valid = pass.length > 6 && !!pass.match(/\d/) && !!pass.match(/\D/)
    event.target.style.color = event.target.valid ? "green" : "red"
    pass2.disabled = !event.target.valid
}

pass2.oninput = function (event) {
    event.target.valid = event.target.value === pass1.value
    event.target.style.color = event.target.valid ? "green" : "red"
}
pass2.onchange = function (event) {
    event.target.valid ?
        passHash.value = Sha256.hash(event.target.value) : null
}
accept.onclick = (event) => {
    let formData = new FormData(registration)
    let result = {}
    formData.forEach(
        (val, key) => Object.assign(result, { [key]: val })
    )
    fetch(`https://fea-15-andry.glitch.me/user/${login.value}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(result)
    }).then(response => response.json())
        .then(response => {currentUser=response
                            document.cookie = `login=${login.value}`
                            document.cookie = `userPass=${currentUser['pass-hash']}` })
}