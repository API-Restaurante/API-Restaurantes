// Redireciona para login caso o token não esteja presente
if (!localStorage.getItem("token")) {
    window.location.href = "index.html";
}

// Logout: remove o token e redireciona para a página de login
document.getElementById("logout").addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

// Função para buscar usuários e preencher a tabela
async function fetchUsers() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch('/api/auth/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Se o token não for autorizado, redireciona para a página de login
        if (response.status === 401) {
            window.location.href = "index.html";
            return;
        }

        const users = await response.json();

        // Verifica se a resposta é uma lista válida de usuários
        if (!Array.isArray(users)) {
            throw new Error("Resposta inválida do servidor");
        }

        // Atualiza a contagem de usuários e preenche a tabela com os dados recebidos
        document.querySelector("#userCount").innerHTML = `Total de Usuários: ${users.length}`;
        const tableBody = document.querySelector("#userTable tbody");
        tableBody.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td data-id="${user._id}">${user.nome}</td>
            <td>${user.email}</td>
            <td><button class="btn btn-delete btn-sm" onclick="deleteUser('${user._id}')">Excluir</button></td>
            <td>
                <button type="button" class="btn btn-edit edit-btn" data-bs-toggle="modal" 
                data-bs-target="#exampleModal" data-id="${user._id}">Editar</button>
            </td>
        `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

// Função para obter os dados completos do usuário e preencher o formulário
async function loadUserData(userId) {
    try {
        const response = await fetch(`/api/auth/user/${userId}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar dados do usuário");
        }

        const user = await response.json();

        // Preenche o formulário com os dados do usuário
        document.getElementById('edit-id').value = user._id;
        document.getElementById('edit-nome').value = user.nome;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-senha').value = '';  // Não exibe a senha, apenas permite editá-la
        document.getElementById('edit-nivel-acesso').value = user.nivel_acesso;

    } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
    }
}

// Adiciona o evento de clique para os botões de edição
document.addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('edit-btn')) {
        const userId = event.target.getAttribute('data-id');
        loadUserData(userId);  // Chama a função que preenche o formulário com os dados
    }
});

// Função para atualizar os dados do usuário
async function updateUser(event) {
    event.preventDefault();  // Previne o comportamento padrão do formulário

    const userId = document.getElementById('edit-id').value;
    const updatedUser = {
        nome: document.getElementById('edit-nome').value,
        email: document.getElementById('edit-email').value,
        senha: document.getElementById('edit-senha').value,
        nivel_acesso: document.getElementById('edit-nivel-acesso').value,
    };

    try {
        const response = await fetch(`/api/auth/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });

        const contentType = response.headers.get("Content-Type");
        let result;

        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Resposta inesperada: ${text}`);
        }

        if (response.ok) {
            alert('Usuário atualizado com sucesso!');
            fetchUsers();  // Atualiza a lista de usuários após a atualização
        } else {
            alert('Erro ao atualizar usuário: ' + result.message || result.error);
        }
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        alert('Erro ao atualizar usuário: ' + error.message);
    }
}

// Adiciona o evento de envio do formulário para atualizar o usuário
document.getElementById('edit-form').addEventListener('submit', updateUser);

// Função para excluir um usuário
async function deleteUser(userId) {
    try {
        const response = await fetch(`/api/auth/delete/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            fetchUsers(); // Atualiza a tabela após a exclusão
        } else {
            alert(result.message || 'Erro ao excluir usuário');
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário');
    }
}

// Chama a função fetchUsers ao carregar a página
window.onload = fetchUsers;


// Adiciona o event listener para o botão de carregamento
document.getElementById("loadReservesBtn").addEventListener("click", async function () {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch('/reserva/todasReservas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const reservas = await response.json();
            console.log("Reservas:", reservas);

            // Inicia a animação de contagem a partir de zero até reservas.length
            animateCount(reservas.length);
        } else {
            console.error("Erro ao buscar reservas:", response.statusText);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
});

// Função para animar a contagem no elemento
function animateCount(targetCount) {
    const reserveCountEl = document.getElementById("reserveCount");
    let count = 0;
    reserveCountEl.textContent = count; // Garante que o contador comece do zero

    const interval = setInterval(() => {
        if (count < targetCount) {
            count++;
            reserveCountEl.textContent = count;
        } else {
            clearInterval(interval); // Para o loop ao alcançar o valor máximo
        }
    }, 60);
            // Chama a função para buscar e animar o número de reservas
fetchReserve();
}