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
        const token = this.generateToken(user);
        return { user: userWithoutPassword, token };
    }

    private generateToken(user: any): string {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            this.jwtSecret,
            { expiresIn: '1d' }
        );
    }

    async login(email: string, pass: string): Promise<string | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const isValid = await bcrypt.compare(pass, user.passwordHash);
        if (!isValid) return null;

        return this.generateToken(user);
    }

    async getUserById(id: string): Promise<any> {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                createdAt: true
            }
        });
        return user;
    }

    async updateUser(id: string, data: any): Promise<any> {
        const updateData: any = {
            name: data.name,
            phone: data.phone,
            address: data.address
        };

        if (data.password) {
            updateData.passwordHash = await bcrypt.hash(data.password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                createdAt: true
            }
        });

        return user;
    }
}
