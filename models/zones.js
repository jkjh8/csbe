module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Zones', {
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
    },
    data: {
      type: DataTypes.JSON
    },
    location: {
      type: DataTypes.STRING
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true
  })
}