let dialog = document.getElementById('myDialog')
let dialogLogin = document.getElementById('myDialogLogin')
let moreInfo = document.getElementById('moreInfo')
let closeDialog = document.getElementById('closeDialog')

moreInfo.addEventListener('click', function () {
    dialog.showModal()
})

closeDialog.addEventListener('click', function () {
    dialog.close()
})

function login() {
    window.location.href = "login.html";
}

function fecharDialog() {
    dialogLogin.close()
}


function fazerLogin(event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (usuario === '') {
        alert("Campo [Usuário] é obrigatório");
        return;
    }

    if (senha === '') {
        alert("Campo [Senha] é obrigatório");
        return;
    }


    if (usuario === 'admin' && senha === '1234') {
        dialogLogin.showModal()
    } else {
        alert("Usuário ou senha incorretos!");
    }
}