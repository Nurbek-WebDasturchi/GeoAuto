import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/http.js";
import { signToken } from "../utils/jwt.js";

const publicUserSelect = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  avatarUrl: true,
  role: true,
  region: true,
  createdAt: true
};

export const AuthService = {
  async register(input: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    region: string;
  }) {
    const email = input.email.toLowerCase();
    const exists = await prisma.profile.findUnique({ where: { email } });
    if (exists) throw new AppError(409, "Bu email bilan akkaunt mavjud.");

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.profile.create({
      data: {
        email,
        passwordHash,
        fullName: input.fullName,
        phone: input.phone,
        region: input.region
      },
      select: publicUserSelect
    });

    return { user, token: signToken({ sub: user.id, role: user.role }) };
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.profile.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user) throw new AppError(401, "Email yoki parol noto‘g‘ri.");

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new AppError(401, "Email yoki parol noto‘g‘ri.");

    const publicUser = await prisma.profile.findUniqueOrThrow({
      where: { id: user.id },
      select: publicUserSelect
    });

    return { user: publicUser, token: signToken({ sub: user.id, role: user.role }) };
  },

  async me(userId: string) {
    return prisma.profile.findUniqueOrThrow({ where: { id: userId }, select: publicUserSelect });
  }
};
