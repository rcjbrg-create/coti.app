"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { STORAGE_BUCKETS, MEDIA_LIMITS } from "@/lib/constants/app";
import { ImageIcon, Film, X, Upload } from "lucide-react";

interface UploadState {
  file: File | null;
  preview: string | null;
  progress: number;
  uploading: boolean;
  error: string;
  success: string;
  type: "image" | "video" | null;
}

interface Props {
  dishId: string;
  onUploaded?: (mediaType: "image" | "video", path: string) => void;
}

async function compressImage(file: File, maxDimension = 1200, quality = 0.85): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          resolve(blob ?? file);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

async function generateVideoThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = url;

    const cleanup = () => URL.revokeObjectURL(url);

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      const maxW = 640;
      const ratio = Math.min(maxW / (video.videoWidth || maxW), 1);
      canvas.width = Math.round((video.videoWidth || maxW) * ratio);
      canvas.height = Math.round((video.videoHeight || 360) * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        cleanup();
        resolve(null);
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          cleanup();
          resolve(blob);
        },
        "image/jpeg",
        0.85
      );
    };

    video.onerror = () => {
      cleanup();
      resolve(null);
    };

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(0.5, video.duration * 0.1);
    };
  });
}

export function MediaUpload({ dishId, onUploaded }: Props) {
  const [state, setState] = useState<UploadState>({
    file: null,
    preview: null,
    progress: 0,
    uploading: false,
    error: "",
    success: "",
    type: null,
  });

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    if (state.preview) URL.revokeObjectURL(state.preview);
    setState({
      file: null,
      preview: null,
      progress: 0,
      uploading: false,
      error: "",
      success: "",
      type: null,
    });
    if (imageRef.current) imageRef.current.value = "";
    if (videoRef.current) videoRef.current.value = "";
  }, [state.preview]);

  const handleFileSelect = useCallback(
    (file: File, type: "image" | "video") => {
      if (state.preview) URL.revokeObjectURL(state.preview);
      const preview = URL.createObjectURL(file);
      setState({
        file,
        preview,
        progress: 0,
        uploading: false,
        error: "",
        success: "",
        type,
      });
    },
    [state.preview]
  );

  const handleUpload = useCallback(async () => {
    if (!state.file || !state.type) return;
    const { file, type } = state;
    setState((s) => ({ ...s, uploading: true, error: "", progress: 0 }));

    const supabase = createClient();
    const bucket =
      type === "image" ? STORAGE_BUCKETS.DISH_IMAGES : STORAGE_BUCKETS.DISH_VIDEOS;
    const ext = type === "image" ? "jpg" : (file.name.split(".").pop() ?? "mp4");
    const path = `dishes/${dishId}/${type}s/${Date.now()}.${ext}`;

    let uploadBlob: Blob = file;
    if (type === "image") {
      setState((s) => ({ ...s, progress: 5 }));
      uploadBlob = await compressImage(file);
    }

    setState((s) => ({ ...s, progress: 10 }));

    // Simulate incremental progress (Supabase client does not expose upload progress)
    const progressInterval = setInterval(() => {
      setState((s) => ({
        ...s,
        progress: s.progress < 80 ? s.progress + 5 : s.progress,
      }));
    }, 400);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, uploadBlob, {
        contentType: type === "image" ? "image/jpeg" : file.type,
        upsert: false,
      });

    clearInterval(progressInterval);

    if (uploadError) {
      setState((s) => ({
        ...s,
        uploading: false,
        progress: 0,
        error: `Erro no upload: ${uploadError.message}`,
      }));
      return;
    }

    setState((s) => ({ ...s, progress: 88 }));

    await supabase.from("dish_media").insert({
      dish_id: dishId,
      media_type: type,
      storage_bucket: bucket,
      storage_path: path,
      file_name: file.name,
      mime_type: type === "image" ? "image/jpeg" : file.type,
      file_size_bytes: uploadBlob.size,
    });

    // Auto-generate thumbnail for videos
    if (type === "video") {
      setState((s) => ({ ...s, progress: 92 }));
      try {
        const thumb = await generateVideoThumbnail(file);
        if (thumb) {
          const thumbPath = `dishes/${dishId}/thumbs/${Date.now()}.jpg`;
          const { error: thumbError } = await supabase.storage
            .from(STORAGE_BUCKETS.DISH_THUMBNAILS)
            .upload(thumbPath, thumb, {
              contentType: "image/jpeg",
              upsert: false,
            });
          if (!thumbError) {
            await supabase.from("dish_media").insert({
              dish_id: dishId,
              media_type: "thumbnail",
              storage_bucket: STORAGE_BUCKETS.DISH_THUMBNAILS,
              storage_path: thumbPath,
              file_name: `thumbnail-${Date.now()}.jpg`,
              mime_type: "image/jpeg",
              file_size_bytes: thumb.size,
            });
          }
        }
      } catch {
        // Thumbnail generation is best-effort; continue without it
      }
    }

    setState((s) => ({
      ...s,
      progress: 100,
      uploading: false,
      success: `${type === "image" ? "Imagem" : "Vídeo"} enviado com sucesso!${
        type === "video" ? " Thumbnail gerada automaticamente." : ""
      }`,
    }));

    onUploaded?.(type, path);
  }, [state, dishId, onUploaded]);

  return (
    <div className="space-y-4">
      {/* File pickers */}
      <div className="flex gap-3 flex-wrap">
        <input
          ref={imageRef}
          type="file"
          accept={MEDIA_LIMITS.ACCEPTED_IMAGE_TYPES.join(",")}
          className="hidden"
          aria-label="Selecionar foto para upload"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0], "image")
          }
        />
        <input
          ref={videoRef}
          type="file"
          accept={MEDIA_LIMITS.ACCEPTED_VIDEO_TYPES.join(",")}
          className="hidden"
          aria-label="Selecionar vídeo para upload"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0], "video")
          }
        />

        {!state.file && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => imageRef.current?.click()}
            >
              <ImageIcon size={16} className="mr-1" /> Upload Foto
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => videoRef.current?.click()}
            >
              <Film size={16} className="mr-1" /> Upload Vídeo
            </Button>
          </>
        )}
      </div>

      {/* Preview card */}
      {state.file && (
        <div className="border border-border rounded-xl p-3 space-y-3 bg-surface">
          <div className="flex items-start gap-3">
            {/* Preview thumbnail */}
            {state.type === "image" && state.preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={state.preview}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover shrink-0 border border-border"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-beige-dark flex items-center justify-center shrink-0 border border-border">
                <Film size={24} className="text-text-muted" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">
                {state.file.name}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {(state.file.size / 1024 / 1024).toFixed(1)} MB
                {state.type === "image" && " · Será comprimida"}
                {state.type === "video" && " · Thumbnail gerada automaticamente"}
              </p>
            </div>

            {!state.uploading && !state.success && (
              <button
                onClick={reset}
                className="text-text-muted hover:text-error transition-colors p-1 shrink-0"
                aria-label="Remover arquivo selecionado"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Progress bar */}
          {state.uploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-text-muted">
                <span>Enviando{state.type === "video" ? " (pode demorar)..." : "..."}</span>
                <span>{state.progress}%</span>
              </div>
              <div className="w-full h-2 bg-beige-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${state.progress}%` }}
                />
              </div>
            </div>
          )}

          {state.error && (
            <p className="text-sm text-error">{state.error}</p>
          )}

          {state.success && (
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-success flex-1">{state.success}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={reset}
              >
                Enviar outro
              </Button>
            </div>
          )}

          {!state.uploading && !state.success && (
            <Button type="button" onClick={handleUpload} className="w-full">
              <Upload size={16} className="mr-2" />
              Confirmar Upload
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
