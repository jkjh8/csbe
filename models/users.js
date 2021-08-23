module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Users', {
    id: {
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
    auth: {
      type: DataTypes.JSON
    },
    tts: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    number_of_login: {
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    loginAt: {
      type: DataTypes.DATE
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true
  })
}