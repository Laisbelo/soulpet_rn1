//Modelo para gerar a tabela de clientes no MySQL
//Mapeamento: cada propriedade vira uma coluna da tavela

const {DataTypes} = require("sequelize"); //DataTypes = serve para definir qual o tipo da coluna
const {connection} = require("./database")

const Cliente = connection.define("cliente", {
    nome: {//Configura a coluna nome  //nome VARCHAR NOT NULL
        type: DataTypes.STRING(130),
        allowNull: false, //NOT NULL - não permite valores nulos
    },
    email: { //VARCHAR UNIQUE NOT NULL
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefone: { //telefone VARCHAR NOT NULL
        type: DataTypes.STRING,
        allowNull: false,
    }
});

//Associação 1:1 (One-to-one)
//Cliente tem um endereço
//Endereço ganha uma chave estrangeira (nome do model + id)
//Chave estrangeira = clienteId
const Endereco = require("./endereco");
//CASCADE = apagar o cliente, faz o endcereço associado ser apagado junto
Cliente.hasOne(Endereco, {onDelete: "CASCADE"}); //Cliente tem um endereço
Endereco.belongsTo(Cliente); //Endereço pertence a um cliente
module.exports = Cliente;