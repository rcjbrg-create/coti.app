# Padrao de Midias — COTI Restaurante

> Referencia tecnica para upload e gestao de midias no sistema operacional do COTI.

---

## 1. Imagens de Prato (Hero Image)

| Atributo | Valor |
|---|---|
| Formatos aceitos | JPEG (`.jpg`), PNG (`.png`), WebP (`.webp`) |
| Tamanho maximo | 5 MB por arquivo |
| Resolucao recomendada | **1200 x 900 px** (proporcao 4:3) |
| Compressao automatica | Sim — o sistema comprime para JPEG com qualidade 85% e redimensiona para no maximo 1200 px |
| Bucket de storage | `dish-images` |
| Caminho no storage | `dishes/{dish_id}/images/{timestamp}.jpg` |

**Boas praticas:**
- Fotografe o prato montado, em ambiente claro e fundo neutro.
- Prefira proporcao 4:3 ou 16:9 para melhor exibicao na galeria.
- Evite imagens com texto ou watermark sobrepostos.
- Use JPEGs diretamente da camera para melhor qualidade antes da compressao automatica.

---

## 2. Videos Tutorial

| Atributo | Valor |
|---|---|
| Formatos aceitos | MP4 (`.mp4`), MOV (`.mov`) |
| Tamanho maximo | 100 MB por arquivo |
| Container recomendado | MP4 |
| Codec de video recomendado | H.264 |
| Codec de audio recomendado | AAC |
| Resolucao alvo | **720p (1280 x 720 px)** |
| Bucket de storage | `dish-videos` |
| Caminho no storage | `dishes/{dish_id}/videos/{timestamp}.mp4` |

**Boas praticas:**
- Grave videos curtos e objetivos (idealmente entre 1 e 5 minutos).
- Foque nas tecnicas criticas de producao e montagem.
- Mantenha camera estavel; use tripé quando possivel.
- Ilumine adequadamente a area de trabalho.
- Evite musica de fundo com direitos autorais.

**Thumbnail automatica:** O sistema gera uma thumbnail a partir do frame 0.5s do video automaticamente. Nao e necessario fazer upload manual.

---

## 3. Thumbnails de Video

| Atributo | Valor |
|---|---|
| Formato | JPEG (gerado automaticamente) |
| Resolucao maxima | 640 px de largura (proporcao original preservada) |
| Qualidade | 85% |
| Bucket de storage | `dish-thumbnails` |
| Caminho no storage | `dishes/{dish_id}/thumbs/{timestamp}.jpg` |

> Thumbnails sao geradas automaticamente no momento do upload do video. Nao e necessario upload manual.

---

## 4. Imagens de Etapas (Passos)

| Atributo | Valor |
|---|---|
| Formatos aceitos | JPEG, PNG, WebP |
| Tamanho maximo | 5 MB |
| Resolucao recomendada | 800 x 600 px |
| Bucket de storage | `step-images` |
| Caminho no storage | `steps/{step_id}/{timestamp}.jpg` |

**Uso recomendado:**
- Use imagens de etapa apenas para passos com tecnica visual critica.
- Nao e obrigatorio; foque nos passos mais complexos.

---

## 5. Capas de Categorias

| Atributo | Valor |
|---|---|
| Formatos aceitos | JPEG, PNG, WebP |
| Tamanho maximo | 5 MB |
| Resolucao recomendada | 1200 x 600 px (proporcao 2:1) |
| Bucket de storage | `category-covers` |

---

## 6. Convencoes de Nomenclatura

O sistema gera nomes de arquivo automaticamente usando timestamp Unix. Internamente, os arquivos sao organizados por:

```
/dishes/{dish_id}/images/         → imagens hero do prato
/dishes/{dish_id}/videos/         → videos tutorial
/dishes/{dish_id}/thumbs/         → thumbnails dos videos
/steps/{step_id}/                 → imagens de etapas
/categories/{category_id}/        → capas de categorias
```

**Nao renomeie arquivos manualmente** no bucket de storage; o vinculo com o banco de dados pode ser perdido.

---

## 7. Limites e Restricoes

| Tipo | Limite |
|---|---|
| Imagem | 5 MB maximo |
| Video | 100 MB maximo |
| Formatos de imagem | JPEG, PNG, WebP |
| Formatos de video | MP4, MOV |

Uploads que excedam esses limites ou usem formatos nao suportados serao rejeitados pelo sistema.

---

## 8. Performance e Recomendacoes Operacionais

- Sempre comprime imagens antes do upload para reduzir consumo de banda na cozinha.
- Para videos, exporte na resolucao 720p diretamente do editor para evitar recompressao desnecessaria.
- Mantenha videos com duracao entre 1 e 5 minutos; videos longos prejudicam a experiencia em redes moveis.
- O sistema usa CDN do Supabase para entrega; nao e necessario configurar cache manualmente.
- Thumbnails garantem carregamento visual rapido antes do play — nunca pule este passo.
