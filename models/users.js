module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Users', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nick_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    loginAt: {
      type: DataTypes.DATE
    }
  })
}