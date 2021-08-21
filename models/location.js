module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Locations', {
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
      type: DataTypes.STRING
    },
    ip: {
      type: DataTypes.STRING
    },
    port: {
      type: DataTypes.BIGINT
    },
    status: {
      type: DataTypes.BOOLEAN
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true
  })
}