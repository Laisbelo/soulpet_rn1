const Cliente = require ("../database/cliente");
const Pet = require ("../database/pet");

const {Router} = require("express");

//Cria o grupo de rotas (/pets)
const router = Router();

router.get("/pets", async (req,res) =>{
    const listaPet = await Pet.findAll();
    res.json(listaPet);
});

router.get("/pets/:id", async (req,res) =>{
    const {id} = req.params;
    const pet = await Pet.findByPk(id);
    if(pet){
        res.json(pet)
    } else {
        res.status(404).json({message:"Pet não encontrado"})
    }
});

//adicionar pet
router.post("/pets", async (req, res) =>{
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

router.put("/pets/:id", async (req,res)=>{
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

router.delete("/pets/:id", async (req,res)=>{
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

module.exports = router;