import { Request,Response,RequestHandler } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import prisma from "../utils/db";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";




export const Register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { nom, email, password, role } = req.body;
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        nom,
        email,
        motDePasse: hashedPassword,
        role: role || 'Client',
      },
    });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  }  catch (error: any) { 
    console.error('Error creating user:', error);
    if (error instanceof PrismaClientValidationError) {
      res.status(400).json({ error: 'Validation error', details: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
};