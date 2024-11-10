document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;


    fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: senha
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Usuário cadastrado com sucesso') {
            alert(data.message);
            window.location.href = 'index.html'; 
        } else if (data.message === 'Este email já está em uso') {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao cadastrar:', error);
        alert('Ocorreu um erro ao cadastrar o usuário');
    });
});