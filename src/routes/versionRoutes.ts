import { Router } from "express";
import VersionController from "../controllers/VersionsController";
import { authenticateToken } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";

const router = Router();

router.use(authenticateToken);

router.post(
  "/plants/:plantId/versions",
  uploadFile,
  VersionController.createVersion
);

router.get("/plants/:plantId/versions", VersionController.getAllVersions);

router.get(
  "/plants/:plantId/versions/:versionId",
  VersionController.getVersionById
);

router.put(
  "/plants/:plantId/versions/:versionId",
  uploadFile,
  VersionController.updateVersion
);

router.delete(
  "/plants/:plantId/versions/:versionId",
  VersionController.deleteVersion
);

router.get(
  "/plants/:plantId/versions/:versionId/heatmap",
  VersionController.getHeatmap
);

export default router;
