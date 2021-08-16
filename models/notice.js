module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Notice', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    user_id: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    from: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    checked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })
}
