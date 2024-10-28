import { Request, Response } from 'express';
import prisma from '../utils/db';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class PlantController {
    async getAllPlants(req: Request, res: Response) {
        try {
            const plants = await prisma.plant.findMany();
            res.json(plants);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch plants' });
        }
    }

    async getPlantById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const plant = await prisma.plant.findUnique({
                where: { id_plant: Number(id) },
            });
            if (plant) {
                res.json(plant);
            } else {
                res.status(404).json({ error: 'Plant not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch plant' });
        }
    }

    async createPlant(req: Request, res: Response) {
        const { name, species, description, userId } = req.body;
        try {
            // Fetch health status from Flask API
            const response = await axios.post(`${process.env.FLASK_API_URL}`, { name, species });
            const health_status = response.data.health_status;

            const newPlant = await prisma.plant.create({
                data: { name, species, description, health_status, userId },
            });
            res.status(201).json(newPlant);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create plant' });
        }
    }

    async updatePlant(req: Request, res: Response) {
        const { id } = req.params;
        const { name, species, description, userId } = req.body;
        try {
            // Fetch health status from Flask API
            const response = await axios.post(`${process.env.FLASK_API_URL}`, { name, species });
            const health_status = response.data.health_status;

            const updatedPlant = await prisma.plant.update({
                where: { id_plant: Number(id) },
                data: { name, species, description, health_status, userId },
            });
            res.json(updatedPlant);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update plant' });
        }
    }

    async deletePlant(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.plant.delete({
                where: { id_plant: Number(id) },
            });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete plant' });
        }
    }
}

export default new PlantController();