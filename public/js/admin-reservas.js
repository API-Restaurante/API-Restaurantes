// Verifica o token e redireciona para login se não estiver presente
if (!localStorage.getItem("token")) {
    window.location.href = "index.html";
}

// Configura o evento de logout
document.getElementById("logout").addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

// Função para carregar reservas com base na data selecionada
async function fetchReservasPorData(data) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/reserva/filtrar?data=${data}`, {  // Ajuste para a nova rota
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) window.location.href = "index.html";
            else throw new Error("Erro ao buscar reservas.");
        }

        const reservas = await response.json();

        // Para cada reserva, obtenha os detalhes do usuário associado
        const reservasComUsuarios = await Promise.all(
            reservas.map(async reserva => {
                const userResponse = await fetch(`/api/auth/user/${reserva.usuarioId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (userResponse.ok) {
                    const user = await userResponse.json();
                    return { ...reserva, usuarioNome: user.nome, usuarioEmail: user.email };
                } else {
                    console.error(`Erro ao buscar dados do usuário para a reserva ${reserva._id}`);
                    return { ...reserva, usuarioNome: "N/A", usuarioEmail: "N/A" };
                }
            })
        );

        atualizarTabelaReservas(reservasComUsuarios);

    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
    }
}

// Função para atualizar a tabela de reservas com os dados recebidos
function atualizarTabelaReservas(reservas) {
    const tabelaBody = document.querySelector("table tbody");
    tabelaBody.innerHTML = ""; // Limpa a tabela antes de atualizar

    if (reservas.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="6">Nenhuma reserva encontrada.</td></tr>';
    } else {
        reservas.forEach(reserva => {
            console.log("Dados do usuário na reserva:", reserva.usuarioNome, reserva.usuarioEmail); // Confirme que os dados aparecem aqui
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reserva.horario}</td>
                <td>${reserva.mesa}</td>
                <td>${reserva.usuarioNome || "N/A"}</td>
                <td>${reserva.usuarioEmail || "N/A"}</td>
                <td>${reserva.quantidadePessoas}</td>
                <td><button class="cancelarReserva btn btn-danger" data-id="${reserva._id}">Cancelar Reserva</button></td>
            `;
            tabelaBody.appendChild(row);
        });

        // Adiciona evento para o botão de cancelamento de reservas
        document.querySelectorAll(".cancelarReserva").forEach(button => {
            button.addEventListener("click", function () {
                const reservaId = this.getAttribute("data-id");
                cancelarReserva(reservaId);
            });
        });
    }
}

// Função para cancelar uma reserva
async function cancelarReserva(reservaId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/reserva/${reservaId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao cancelar reserva.");
        }

        alert("Reserva cancelada com sucesso!");
        const dataSelecionada = document.getElementById("dateFilter").value;
        fetchReservasPorData(dataSelecionada); // Atualiza a tabela após exclusão

    } catch (error) {
        console.error("Erro ao cancelar reserva:", error);
        alert("Erro ao cancelar reserva.");
    }
}

// Configura o evento para o filtro de data
document.getElementById("dateFilter").addEventListener("change", function () {
    const dataSelecionada = this.value;
    fetchReservasPorData(dataSelecionada);
});

// Carrega as reservas da data atual ao carregar a página
window.onload = () => {
    const hoje = new Date().toISOString().split("T")[0]; // Formata a data de hoje como 'YYYY-MM-DD'
    document.getElementById("dateFilter").value = hoje;
    fetchReservasPorData(hoje); // Carrega as reservas de hoje automaticamente
    fetchReservasUltimos7Dias(hoje);
};


// TAXA DE OCUPAÇÃO SEMANAL

// Número total de mesas disponíveis por dia = 12 mesas x 4 horários = 48 mesas para reserva por dia
const TOTAL_MESAS = 48;

// Função para carregar reservas dos últimos 7 dias com base na data selecionada
async function fetchReservasUltimos7Dias(dataSelecionada) {
    const token = localStorage.getItem("token");
    const dataInicial = new Date(dataSelecionada);
    const dataFinal = new Date(dataSelecionada);
    dataInicial.setDate(dataFinal.getDate() - 7);

    try {
        const response = await fetch(`/reserva/filtrar-inicial-e-final?dataInicial=${dataInicial.toISOString().split("T")[0]}&dataFinal=${dataFinal.toISOString().split("T")[0]}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar reservas.");
        }

        const reservas = await response.json();

        // Atualiza a tabela com reservas
        atualizarTabelaReservas(reservas);

        // Calcula a taxa de ocupação
        calcularTaxaOcupacao(reservas);

    } catch (error) {
        console.error("Erro ao buscar reservas dos últimos 7 dias:", error);
    }
}

// Função para calcular e exibir a taxa de ocupação
function calcularTaxaOcupacao(reservas) {
    // Conta o total de reservas feitas
    const totalReservas = reservas.length;

    // Calcula a taxa de ocupação semanal em porcentagem
    const taxaOcupacao = ((totalReservas / (TOTAL_MESAS * 7)) * 100).toFixed(2);
    console.log(reservas);

    // Exibe a taxa de ocupação na interface
    document.getElementById("occupancyRate").textContent = `${taxaOcupacao}%`;
}

// Modifica o evento de mudança de data para buscar reservas dos últimos 7 dias
document.getElementById("dateFilter").addEventListener("change", function () {
    const dataSelecionada = this.value;
    fetchReservasUltimos7Dias(dataSelecionada);
});