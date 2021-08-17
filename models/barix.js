module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Barix', {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    index: {
      type: DataTypes.INTEGER
    },
    mac: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    alarm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    info: {
      type: DataTypes.JSON
    },
    zones: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.JSON
    },
    checked: {
      type: DataTypes.BOOLEAN,
      default: false
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true
  })
}