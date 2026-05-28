import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import type { Express } from "express";
import { env } from "../config/env.js";
import { supabase } from "../config/supabase.js";
import { AppError } from "../utils/http.js";

export const StorageService = {
  async uploadListingImages(listingId: string, files: Express.Multer.File[]) {
    const uploaded = [];

    for (const [index, file] of files.entries()) {
      const extension = extname(file.originalname) || ".jpg";
      const path = `listings/${listingId}/${randomUUID()}${extension}`;
      const { error } = await supabase.storage
        .from(env.SUPABASE_STORAGE_BUCKET)
        .upload(path, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) throw new AppError(502, `Rasm yuklashda xatolik: ${error.message}`);

      const { data } = supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
      uploaded.push({ url: data.publicUrl, path, sortOrder: index });
    }

    return uploaded;
  }
};
