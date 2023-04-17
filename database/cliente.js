//Modelo para gerar a tabela de clientes no MySQL
//Mapeamento: cada propriedade vira uma coluna da tavela

const {DataTypes} = require("sequelize"); //DataTypes = serve para definir qual o tipo da coluna
const {connection} = require("./database")

const Cliente = connection.define("Cliente", {
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
})

module.exports = Cliente;