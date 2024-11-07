const fs = require('fs');
const path = require('path');

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
        res.status(200).json({ message: "Logado", userId: user.id });
    } else {
        res.status(401).json({ message: "credenciais invalidas" });
    }
};