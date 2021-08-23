module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Logs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(16),
      defaultValue: 'info'
    },
    priority: {
      type: DataTypes.STRING(16),
      defaultValue: 'row'
    },
    zones: {
      type: DataTypes.STRING(512)
    },
    message: {
      type: DataTypes.STRING(512)
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true
  })
}