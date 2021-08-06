module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Mlocation', {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    parent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'single'
    },
    vol: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mute: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    relay: {
      type: DataTypes.BOOLEAN
    }
  })
}