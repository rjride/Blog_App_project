// user_controller.js
import bcrypt from 'bcrypt';
import User from '../modal/user.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../modal/token.js';




dotenv.config();

export const signupUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        const user = { username: req.body.username, name: req.body.name, password: hashedPassword}             //req.body;
        console.log('Received user data:', user);
        const newUser = new User(user);
        await newUser.validate(); // Mongoose validation
        await newUser.save();
        console.log('Received user data:', newUser);
        return res.status(200).json({ msg: 'Signup successful' });
    } catch (error) {
        console.error('Error in signupUser controller:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ msg: error.message }); // Bad request
        }
        return res.status(500).json({ msg: 'Error while signup the user' });
    }
}
export const loginUser =async(req,res)=>{
    let user = await User.findOne({username: req.body.username});
     if(!user){
        return res.status(400).json({ msg: 'username does not match'});
     }

     try{
      let match = await bcrypt.compare(req.body.password,user.password);
      if(match){
       const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, {expiresIn: '15m'});
       const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY); 

      const newToken = new Token({ token: refreshToken});
      await newToken.save();
      return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken, name: user.name, username: user.username })
      }else{
      return res.status(400).json({ msg:'password does not match' });
      }
     }catch(error){
        return res.status(500).json({ msg: 'error while login in user'})
     }

}







