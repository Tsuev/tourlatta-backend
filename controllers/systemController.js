// controllers/guideController.js
import {Admin} from '../models/index.js';


export const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log(username, email, password)
    const admin = await Admin.create({ username, email, password });

    res.status(200).json({ message: 'Администратор успешно создан', admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};