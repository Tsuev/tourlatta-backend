import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcrypt';

const Admin = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "ADMIN"
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

  });

  // Хэширование пароля перед сохранением
Admin.beforeCreate(async (admin) => {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
});


export default Admin;