//Vai disponibilizar o uso de variáveis de ambiente
//Importações principais e variáveis de ambiente
require("dotenv").config();
const express = require("express");

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

//Configuração do App
const app = express();
app.use(express.json()); //Possibilitar transitar dados usando json

//Configuração do Banco de Dados
const {connection, authenticate} = require("./database/database")
authenticate(connection);
const Cliente = require("./database/cliente");//Configura o model da aplicação
const Endereco = require("./database/endereco");

//Definição de Rotas

app.post("/clientes", async (req,res) =>{
    //Coletar informações do req.body
    const {nome,email,telefone,endereco} = req.body;
    //Chamar o Model e a função create
    try{
        //Dentro de "novo" estara o objeto criado
        const novo = await Cliente.create(
            {nome,email,telefone,endereco},
            {include:[Endereco]} //include permite inserir clienre e endereço em um só comando
            );
            res.status(201).json(novo);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Um erro aconteceu."});
    }
})

app.listen(3000, () =>{
    //Gerar as tabelas a partir do model
    //Force = apaga tudo e recria as tabelas
    connection.sync({force:true});
    console.log("Servidor rodando em http://localhost:3000");
})