const fs = require('fs');
const path = require('path');

// Função para ler o arquivo JSON
const readData = () => {
    const dataPath = path.join(__dirname, '../data/memoria.json');
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(jsonData);
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    const data = readData();
    const user = data.users.find(u => u.username === username && u.password === password);

    if (user) {
        // Retorna o ID do usuário para ser usado em reservas futuras
        res.status(200).json({ message: "Login successful", userId: user.id });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
};