import jwt from "jsonwebtoken"

const generateToken = (userid) => {
    const token = jwt.sign({userid},process.env.JWT_SECRET,{
        expiresIn:"30d"
    });
    return token;
};

export default generateToken;