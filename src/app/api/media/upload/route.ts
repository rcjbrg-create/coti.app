import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MEDIA_LIMITS, STORAGE_BUCKETS } from "@/lib/constants/app";

const ALLOWED_BUCKETS = Object.values(STORAGE_BUCKETS) as string[];

export async function POST(request: NextRequest) {
  const supabase = createClient();

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Requisição inválida" },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string | null;
  const storagePath = formData.get("path") as string | null;
  const dishId = formData.get("dish_id") as string | null;
  const mediaType = formData.get("media_type") as
    | "image"
    | "video"
    | "thumbnail"
    | null;

  if (!file || !bucket || !storagePath) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes: file, bucket, path" },
      { status: 400 }
    );
  }

  // Validate bucket
  if (!ALLOWED_BUCKETS.includes(bucket)) {
    return NextResponse.json({ error: "Bucket inválido" }, { status: 400 });
  }

  // Validate file type and size
  const isImage = MEDIA_LIMITS.ACCEPTED_IMAGE_TYPES.includes(
    file.type as (typeof MEDIA_LIMITS.ACCEPTED_IMAGE_TYPES)[number]
  );
  const isVideo = MEDIA_LIMITS.ACCEPTED_VIDEO_TYPES.includes(
    file.type as (typeof MEDIA_LIMITS.ACCEPTED_VIDEO_TYPES)[number]
  );

  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Tipo de arquivo não permitido" },
      { status: 400 }
    );
  }

  const maxSize = isVideo
    ? MEDIA_LIMITS.VIDEO_MAX_SIZE
    : MEDIA_LIMITS.IMAGE_MAX_SIZE;

  if (file.size > maxSize) {
    return NextResponse.json(
      {
        error: `Arquivo muito grande. Tamanho máximo: ${Math.round(maxSize / 1024 / 1024)}MB`,
      },
      { status: 400 }
    );
  }

  // Upload to storage
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: `Erro no upload: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(storagePath);

  // Record in dish_media if dishId and mediaType provided
  if (dishId && mediaType) {
    await supabase.from("dish_media").insert({
      dish_id: dishId,
      media_type: mediaType,
      storage_bucket: bucket,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type,
      file_size_bytes: file.size,
    });
  }

  return NextResponse.json({
    path: storagePath,
    publicUrl: urlData.publicUrl,
  });
}
