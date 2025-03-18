// controllers/guideController.js
import {Admin, Guide} from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let isMatch;
        let user = await Admin.findOne({ where: { email } });
        if (user != null) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            user = await Guide.findOne({ where: { email } });
            if(user != null) {
                isMatch = password == user.password;
            } else {
                return res.status(404).json({ error: 'Ползователь с такими данными не обнаружен' });
            }
        }
    

        if (!isMatch) return res.status(401).json({ error: 'Неверный логин или пароль' });
    
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
          expiresIn: '24h',
        });
    
        res.status(200).json({ token, userInfo: user });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};


