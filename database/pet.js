const {DataTypes} = require("sequelize");
const { connection } = require("./database");
const Cliente = require("./cliente");

const Pet = connection.define("pet", {
    nome:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    porte: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dataNasc: {
        type:DataTypes.DATEONLY,
        allowNull: false,
    }
});

//Cliente pode ter muitos Pets
//Relacionamento 1:N
Cliente.hasMany(Pet ,{onDelete: "CASCADE"}); //quando o cliene for deletado todos os pets serão deletados
//Pet pertence ao cliente
Pet.belongsTo(Cliente);

module.exports = Pet;