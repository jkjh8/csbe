module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Zones', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    mode: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: 'Barix'
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
    location: {
      type: DataTypes.STRING
    },
    channel: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.BOOLEAN
    },
    mac: {
      type: DataTypes.STRING
    },
    info: {
      type: DataTypes.JSON
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true
  })
}