import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();



// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        plants: true,
        versions: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        posts: true,
        plants: true,
        versions: true,
      },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nom, email, motDePasse, role } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        nom,
        email,
        motDePasse,
        role,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    console.log(deletedUser); // Log the deleted user
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as any).message });
  }
};
