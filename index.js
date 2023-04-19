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
const {connection, authenticate} = require("./database/database");
authenticate(connection);
const Cliente = require("./database/cliente");//Configura o model da aplicação
const Endereco = require("./database/endereco");
const Pet = require("./database/pet")

//Definição de Rotas
app.get("/clientes", async (req,res)=>{
    //SELECT * FROM clientes;
    const listaClientes = await Cliente.findAll();
    res.json(listaClientes);
});

// /clientes/:id
app.get("/clientes/:id", async (req,res)=>{
    const cliente = await Cliente.findOne({
        where: {id:req.params.id},
        include: [Endereco],
    }); //SELECT * FROM clientes WHERE id=5

    if(cliente){
        res.json(cliente);
    } else {
        res.status(404).json({message: "Usuário não encontrado"});
    }
})

app.post("/clientes", async (req,res) =>{
    //Coletar informações do req.body
    const {nome,email,telefone,endereco} = req.body;
    //Chamar o Model e a função create
    try{
        //Dentro de "novo" estara o objeto criado
        const novo = await Cliente.create(
            {nome,email,telefone,endereco},
            {include:[Endereco]} //include permite inserir cliente e endereço em um só comando
            );
            res.status(201).json(novo);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Um erro aconteceu."});
    }
});

//atualizar um cliente
app.put("/clientes/:id", async (req,res)=>{
//obter dados do corpo da requisição
const {nome, email, telefone, endereco} = req.body;
//obter identificação do cliente pelos parâmetros da rota
const {id} = req.params;
try{
    //buscar cliente pelo id passado
    const cliente = await Cliente.findOne({where:{id}})
    //validar a existência do cliente no banco de dados
    if(cliente){
        //valicar a existência desse endereço passado no corpo da requisição
        if(endereco){
            await Endereco.update(endereco,{where: { clienteId: id }})
        } 
        //atualizar o cliente com nome, email e telefone
        await cliente.update({nome,email,telefone});
        res.status(200).json({message:"Cliente editado com sucesso"});
    } else {
        res.status(404).json({message:"Cliente não encontrado"})
    }
} catch (err) {
    res.status(500).json({message: "Um erro aconteceu"});
}
})

//excluir cliente
app.delete("/clientes/:id", async (req,res) =>{
    //obter identificação do cliente através do id
    const {id} = req.params;
    const cliente = await Cliente.findOne({where:{id}});
    try{
        if(cliente){
            await cliente.destroy();
            res.status(200).json("Cliente removido")
        } else {
            res.status(400).json({message:"Cliente não encontrado"});
        }
    } catch (err){
        res.status(500).json({message:"Um erro aconteceu"});
    }
    
})

app.get("/pets", async (req,res) =>{
    const listaPet = await Pet.findAll();
    res.json(listaPet);
});

app.get("/pets/:id", async (req,res) =>{
    const {id} = req.params;
    const pet = await Pet.findByPk(id);
    if(pet){
        res.json(pet)
    } else {
        res.status(404).json({message:"Pet não encontrado"})
    }
});

//adicionar pet
app.post("/pets", async (req, res) =>{
    const {nome, tipo, dataNasc, porte, clienteId} = req.body;
    try{
        const cliente = await Cliente.findByPk(clienteId);
        if(cliente){
            const novoPet = await Pet.create({nome, tipo, dataNasc, porte, clienteId});
            res.status(201).json(novoPet)
        } else {
            res.status(404).json({message:"Cliente não encontrado"});
        }
    } catch (err){
        res.status(500).json({message:"Um erro aconteceu"})
    }
})

app.put("/pets/:id", async (req,res)=>{
    //Esses são os dados que virão no corpo JSON
    const  { nome, tipo, dataNasc, porte } = req.body;

    //É necessário checar a existência do PET
    //SELECT * FROM pets WHERE id = req.params.id;
    const pet = await Pet.findByPk(req.params.id);
    //se pet é null => não existe pet com o id
    try{
        if(pet){
            //Indicar qual pet vai ser atualizado
            //1º argumento -  dados novos
            //2º argumento - where
            await Pet.update(
                {nome, tipo, dataNasc, porte},
                {where:{id:req.params.id}}); //WHERE is = "req.params.id"
            res.json({message:"Pet atualizado com sucesso"})
        } else {
            res.status(404).json({message:"Pet não encontrado"})
        }
    } catch (err) {
        res.status(500).json({message:"Ocorreu um erro"})
        console.log(err)
    }
    
});

app.delete("/pets/:id", async (req,res)=>{
    //Precisamos chegar se existe antes de apagar
    const pet = await Pet.findByPk(req.params.id);

    try{
        if(pet){
            //pet existe, podemos apagar
            await pet.destroy();
            res.json({message: "O pet foi removido"})
        } else {
            res.status(404).json({message: "O pet não foi encontrado"})
        }
    } catch (err) {
        res.status(500).json({message:"Ocorreu um erro"})
    }
    
});


app.listen(3000, () =>{
    //Gerar as tabelas a partir do model
    //Force = apaga tudo e recria as tabelas
    connection.sync({force:true});
    console.log("Servidor rodando em http://localhost:3000");
})