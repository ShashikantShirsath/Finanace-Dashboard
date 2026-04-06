import { v4 as uuidv4 } from 'uuid';
import userRepo from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';
import { registerSchema, loginSchema } from '../utils/validation.js';

const register = async (data) => {
    const { error, value } = registerSchema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }

    const existingUser = await userRepo.findByEmail(value.email);
    if(existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(value.password);

    const user = await userRepo.createUser({
        id: uuidv4(),
        name: value.name,
        email: value.email,
        password: hashedPassword,
        role: value.role,
        status: 'active'
    });
    return user;
};

const login = async (data) => {
    const { error, value } = loginSchema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }

    const user = await userRepo.findByEmail(value.email);
    if (!user) throw new Error("User not found");
    if (user.status !== 'active') throw new Error("Account is inactive");

    const isMatch = await comparePassword(value.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user);

    return { token };
};

export { register, login };