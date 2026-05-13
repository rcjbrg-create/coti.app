export const APP_NAME = "COTI Restaurante";
export const APP_DESCRIPTION = "Sistema de Gestao Operacional e Padronizacao";

export const MEDIA_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
  ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ACCEPTED_VIDEO_TYPES: ["video/mp4", "video/quicktime"],
} as const;

export const STORAGE_BUCKETS = {
  DISH_IMAGES: "dish-images",
  DISH_VIDEOS: "dish-videos",
  DISH_THUMBNAILS: "dish-thumbnails",
  STEP_IMAGES: "step-images",
  CATEGORY_COVERS: "category-covers",
} as const;
