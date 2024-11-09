const usuarioId = "672e915d64f1701296c4112d"; 

    // Manipula o envio do formulário
    document.getElementById('reservaForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const dia = document.getElementById('dia').value;
        const horario = document.getElementById('horario').value;
        const mesa = document.getElementById('mesa').value;
        const quantidadePessoas = document.getElementById('quantidadePessoas').value;

        try {
            const response = await fetch(`http://localhost:3000/reserva/${usuarioId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dia, horario, quantidadePessoas, mesa })
            });
            const reserva = await response.json();
            console.log(reserva)

            if (response.ok) {
                exibirReserva(reserva);
            } else {
                alert(reserva.message || "Erro ao fazer a reserva.");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    });

    // Função para exibir a reserva no card
    function exibirReserva(reserva) {
        document.getElementById('reservaInfo').innerHTML = `
            <strong>Dia:</strong> ${reserva.dia} <br>
            <strong>Horário:</strong> ${reserva.horario} <br>
            <strong>Mesa:</strong> ${reserva.mesa} <br>
            <strong>Pessoas:</strong> ${reserva.quantidadePessoas}
        `;
        document.getElementById('reservaCard').style.display = 'block';
    }

    // Função para cancelar a reserva
    document.getElementById('cancelarReserva').addEventListener('click', async () => {
        try {
            const response = await fetch(`http://localhost:3000/reserva/${usuarioId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert("Reserva cancelada com sucesso.");
                document.getElementById('reservaCard').style.display = 'none';
            } else {
                const error = await response.json();
                alert(error.message || "Erro ao cancelar a reserva.");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    });