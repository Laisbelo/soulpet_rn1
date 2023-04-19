const Cliente = require("../database/cliente");
const Endereco = require("../database/endereco");

const {Router} = require("express");

//Criar o grupo de rotas
const router = Router();

router.get("/clientes", async (req,res)=>{
    //SELECT * FROM clientes;
    const listaClientes = await Cliente.findAll();
    res.json(listaClientes);
});

// /clientes/:id
router.get("/clientes/:id", async (req,res)=>{
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

router.post("/clientes", async (req,res) =>{
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
router.put("/clientes/:id", async (req,res)=>{
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
router.delete("/clientes/:id", async (req,res) =>{
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

module.exports = router;