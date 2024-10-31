import { Request, Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import multer, { StorageEngine } from "multer";
import FormData from "form-data";
import axios from "axios";
import fs from "fs";
import prisma from "../utils/db";

// Set up multer for file uploads
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

class PlantController {
  // Create a new plant
  createPlant = async (req: CustomRequest, res: Response): Promise<void> => {
    const { description } = req.body;
    const file = req.file;

    // Ensure file is uploaded
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return; // Make sure to return to avoid executing further
    }

    // Ensure userId is available from req.user
    const userId = req.user?.userId; // Access userId from req.user

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: User ID not found" });
      return; // Handle case where userId is not present
    }

    try {
      // Prepare and send file to Flask API
      const formData = new FormData();
      formData.append("file", fs.createReadStream(file.path));

      const flaskResponse = await axios.post(
        `${process.env.FLASK_API_URL}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );

      const { plant_name, health_status } = flaskResponse.data;

      // Save plant data to PostgreSQL database using the authenticated user's ID
      const newPlant = await prisma.plant.create({
        data: {
          plant_name,
          description,
          health_status,
          userId,
        },
      });

      res.status(201).json(newPlant);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to create plant", details: error.message });
    } finally {
      fs.unlinkSync(file.path); // Clean up file
    }
  };

  // Get all plants for the authenticated user
  getAllPlants = async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    try {
      const plants = await prisma.plant.findMany({
        where: { userId }, // Fetch only the plants associated with the authenticated user
      });
      res.json(plants);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to fetch plants", details: error.message });
    }
  };

  // Get a single plant by ID
  getPlantById = async (req: CustomRequest, res: Response): Promise<void> => {
    const { id_plant } = req.params;
    const userId = req.user?.userId;

    try {
      const plant = await prisma.plant.findUnique({
        where: { id_plant: parseInt(id_plant) },
      });

      if (!plant || plant.userId !== userId) {
        res.status(404).json({ error: "Plant not found or not owned by user" });
        return;
      }

      res.json(plant);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to fetch plant", details: error.message });
    }
  };

  // Update a plant by ID
  updatePlant = async (req: CustomRequest, res: Response): Promise<void> => {
    const { id_plant } = req.params;
    const { description, health_status } = req.body;
    const userId = req.user?.userId;

    try {
      const plant = await prisma.plant.findUnique({
        where: { id_plant: parseInt(id_plant) },
      });

      if (!plant || plant.userId !== userId) {
        res.status(404).json({ error: "Plant not found or not owned by user" });
        return;
      }

      const updatedPlant = await prisma.plant.update({
        where: { id_plant: parseInt(id_plant) },
        data: { description, health_status },
      });

      res.json(updatedPlant);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to update plant", details: error.message });
    }
  };

  // Delete a plant by ID
  deletePlant = async (req: CustomRequest, res: Response): Promise<void> => {
    const { id_plant } = req.params;
    const userId = req.user?.userId;

    try {
      const plant = await prisma.plant.findUnique({
        where: { id_plant: parseInt(id_plant) },
      });

      if (!plant || plant.userId !== userId) {
        res.status(404).json({ error: "Plant not found or not owned by user" });
        return;
      }

      await prisma.plant.delete({
        where: { id_plant: parseInt(id_plant) },
      });

      res.status(204).send();
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Failed to delete plant", details: error.message });
    }
  };
}

export { upload };
export default new PlantController();
