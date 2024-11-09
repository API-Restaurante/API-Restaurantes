//Listar Reservas do usuario logado ao carregar a pagina 
window.onload = async () => {
  try {
    const response = await fetch('/reserva', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`erro: ${response.statusText}`);
    }

    const reservas = await response.json();
    
    const reservaList = document.getElementById('reservaCard');
    reservaList.style.display = 'block'; 

    if (reservas.length === 0) {
      reservaList.innerHTML = `
          <div class="card-body">
            <p class="card-text">Você não possui reservas cadastradas.</p>
          </div>
        `;
    } else {
        reservaList.innerHTML = '';

        reservas.forEach(reserva => {
          // Criar um novo card para cada reserva
          const card = document.createElement('div');
          card.classList.add('card', 'mt-3'); // Adicionar classe para espaçamento
    
          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body');
    
          // Adicionar informações da reserva ao card
          cardBody.innerHTML = `
            <h5 class="card-title">Reserva</h5>
            <p class="card-text">
              <strong>Data:</strong> ${new Date(reserva.dia).toLocaleDateString()}<br>
              <strong>Horário:</strong> ${reserva.horario}<br>
              <strong>Mesa:</strong> ${reserva.mesa}<br>
              <strong>Pessoas:</strong> ${reserva.quantidadePessoas}
            </p>
                <button class="btn btn-danger" data-reserva-id="${reserva._id}">Cancelar</button>
          `;
    
          card.appendChild(cardBody);
          reservaList.appendChild(card);
        });

        // Adicionar evento para os botões de cancelar
    document.querySelectorAll('.btn-danger').forEach(button => {
        button.addEventListener('click', () => {
          const reservaId = button.dataset.reservaId;
          // Chamar a função para cancelar a reserva com o ID correspondente
          cancelarReserva(reservaId);
        });
      });
      }
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
  }
};


//Criar nova Reserva
const reservaForm = document.getElementById('reservaForm');

reservaForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dia = document.getElementById('dia').value;
    const horario = document.getElementById('horario').value;
    const mesa = document.getElementById('mesa').value;
    const quantidadePessoas = document.getElementById('quantidadePessoas').value;

    const novaReserva = {
        dia,
        horario,
        mesa,
        quantidadePessoas
    };

    try {
        const response = await fetch("/reserva", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(novaReserva)
        });

        if (response.ok) {
            alert("Reserva agendada!")
            window.location.reload(); // Recarregar a página
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});


//deletar reserva do usuario
function cancelarReserva(reservaId) {
    fetch(`reserva/${reservaId}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          const card = document.querySelector(`[data-reserva-id="${reservaId}"]`).closest('.card');
          card.remove();
        } else {
          console.error('Erro ao cancelar a reserva');
        }
      })
      .catch(error => {
        console.error('Erro na requisição:', error);
      });
  }