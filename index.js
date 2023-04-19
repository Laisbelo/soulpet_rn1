//Vai disponibilizar o uso de variáveis de ambiente
//Importações principais e variáveis de ambiente
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

//Configuração do App
const app = express();
app.use(express.json()); //Possibilitar transitar dados usando json

//Configuração do Banco de Dados
const {connection, authenticate} = require("./database/database");
authenticate(connection);

//Juantar ao app as rotas dos arquivos
//Definição de Rotas
const rotasClientes = require("./routes/clientes");
const rotasPets = require("./routes/pets");

app.use(rotasClientes); //Configura o grupo de rotas no app;
app.use(rotasPets);
app.use(morgan("dev"));


app.listen(3000, () =>{
    //Gerar as tabelas a partir do model
    //Force = apaga tudo e recria as tabelas
    connection.sync();
    console.log("Servidor rodando em http://localhost:3000");
})