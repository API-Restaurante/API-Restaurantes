// Verificar se o token está presente no localStorage; caso contrário, redirecionar para login
if (!localStorage.getItem("token")) {
window.location.href = "index.html";
}
