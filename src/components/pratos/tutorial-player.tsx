"use client";

import type { DishMedia } from "@/types/dish";
import { getStorageUrl } from "@/lib/utils";
import { Play, AlertCircle, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

interface Props {
  media: DishMedia[];
}

export function TutorialPlayer({ media }: Props) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const video = media.find((m) => m.media_type === "video");
  const poster = media.find((m) => m.media_type === "thumbnail");

  if (!video) {
    return (
      <div className="flex items-center gap-3 text-sm text-text-muted p-4 bg-surface rounded-xl border border-border">
        <AlertCircle size={16} className="shrink-0 text-text-muted" />
        <span>Tutorial em vídeo não disponível para este prato. Siga os passos acima para o preparo.</span>
      </div>
    );
  }

  const videoUrl = getStorageUrl(video.storage_bucket, video.storage_path);
  const posterUrl = poster
    ? getStorageUrl(poster.storage_bucket, poster.storage_path)
    : undefined;

  if (!showPlayer) {
    return (
      <button
        onClick={() => {
          setShowPlayer(true);
          setVideoLoading(true);
        }}
        className="w-full flex items-center justify-center gap-3 py-5 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-colors active:scale-[0.98] min-h-[56px]"
        aria-label="Assistir tutorial em vídeo"
      >
        <Play size={24} fill="currentColor" />
        <span className="text-base">Assistir Tutorial</span>
      </button>
    );
  }

  if (videoError) {
    return (
      <div className="rounded-xl bg-surface border border-border p-5 space-y-2">
        <div className="flex items-center gap-2 text-error">
          <AlertCircle size={18} />
          <span className="font-semibold text-sm">Vídeo indisponível</span>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          O vídeo não pôde ser carregado. Verifique sua conexão ou consulte os
          passos acima para seguir o preparo.
        </p>
        <button
          onClick={() => {
            setVideoError(false);
            setShowPlayer(false);
          }}
          className="text-sm text-primary font-medium underline underline-offset-2 mt-1"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden bg-black relative">
      {videoLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
          <Loader2 size={40} className="text-white animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        controls
        autoPlay
        preload="metadata"
        playsInline
        controlsList="nodownload"
        className="w-full aspect-video"
        style={{ minHeight: 200 }}
        onCanPlay={() => setVideoLoading(false)}
        onLoadedData={() => setVideoLoading(false)}
        onError={() => {
          setVideoError(true);
          setVideoLoading(false);
        }}
      >
        <p className="p-4 text-white text-sm">
          Seu navegador não suporta reprodução de vídeo. Consulte os passos
          acima para o preparo.
        </p>
      </video>
    </div>
  );
}
