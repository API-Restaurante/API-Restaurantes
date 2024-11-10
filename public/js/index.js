// JavaScript para interceptar o envio do formulário de login
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Coletar os dados do formulário
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        // Enviar dados de login para a API
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });

        // Processar a resposta da API
        const data = await response.json();

        if (response.ok) {
            // Armazena o token no localStorage
            localStorage.setItem("token", data.token);

            // Redireciona com base no nível de acesso do usuário
            const redirectUrl = data.nivel_acesso === 1 ? "/admin-dashboard.html" : "/home.html";
            window.location.href = redirectUrl;
        } else {
            // Exibe mensagem de erro se houver falha na resposta
            alert(data.message || "Erro no login");
        }
    } catch (error) {
        // Exibe mensagem de erro se houver falha na requisição
        console.error("Erro ao fazer login:", error);
        alert("Erro ao fazer login. Tente novamente.");
    }
});
