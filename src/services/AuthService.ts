import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';

export class AuthService {
    private readonly jwtSecret = process.env.JWT_SECRET || 'super-secret-key';

    async register(data: any): Promise<any> {
        const passwordHash = await bcrypt.hash(data.password, 10);
        
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: passwordHash,
                role: data.role || 'CUSTOMER',
                phone: data.phone,
                address: data.address
            }
        });

        // Auto-create cart for new users
        await prisma.cart.create({
            data: { userId: user.id }
        });

        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(email: string, pass: string): Promise<string | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const isValid = await bcrypt.compare(pass, user.passwordHash);
        if (!isValid) return null;

        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            this.jwtSecret,
            { expiresIn: '1d' }
        );
    }
}
