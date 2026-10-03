import type {
  CopyObjectCommandInput,
  GetObjectCommandInput,
  HeadObjectCommandInput,
  PutObjectCommandInput,
  PutObjectTaggingCommandInput,
} from "@aws-sdk/client-s3"
import type { Readable } from "node:stream"
import {
  CopyObjectCommand,
  GetObjectCommand,
  GetObjectTaggingCommand,
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectTaggingCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { create as createContentDisposition } from "content-disposition"
import { env } from "~/env.mjs"

const DELETE_TAG = "deletedAt"

// Unlike Key params (which the SDK URL-encodes), CopySource is sent verbatim
// as the x-amz-copy-source header, so keys with spaces or reserved characters
// (e.g. "2026/Annual Reports/...") must be encoded per path segment here.
const getEncodedCopySource = (Bucket: string, Key: string) =>
  `${Bucket}/${Key?.split("/").map(encodeURIComponent).join("/")}`

// R2 credentials are only set for preview, but the choice of backend is
// driven by their presence rather than the environment name. Exported so
// other modules don't have to re-derive this from the raw env vars.
export const isR2Configured = !!(
  env.R2_ACCOUNT_ID &&
  env.R2_ACCESS_KEY_ID &&
  env.R2_SECRET_ACCESS_KEY
)

const storage = new S3Client(
  isR2Configured
    ? {
        region: "auto",
        endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        forcePathStyle: true,
        credentials: {
          accessKeyId: env.R2_ACCESS_KEY_ID ?? "",
          secretAccessKey: env.R2_SECRET_ACCESS_KEY ?? "",
        },
      }
    : { region: env.NEXT_PUBLIC_S3_REGION },
)

export const generateSignedPutUrl = async ({
  Bucket,
  Key,
  ContentType,
  ContentDisposition,
  ContentLength,
  Tagging,
}: Pick<
  PutObjectCommandInput,
  | "Bucket"
  | "Key"
  | "ContentType"
  | "ContentDisposition"
  | "ContentLength"
  | "Tagging"
>): Promise<string> => {
  return getSignedUrl(
    storage,
    new PutObjectCommand({
      Bucket,
      Key,
      ContentType,
      ContentDisposition,
      ContentLength,
      Tagging,
    }),
    {
      expiresIn: 60 * 5, // 5 minutes
      // Sign these headers so S3 rejects PUTs with different values (prevents type-confusion XSS and enforces exact upload size)
      signableHeaders: new Set([
        "content-type",
        "content-disposition",
        "content-length",
      ]),
    },
  )
}

export const generateSignedGetUrl = async (
  { Bucket, Key }: Pick<GetObjectCommandInput, "Bucket" | "Key">,
  // Default kept at 5 minutes so all existing callers are unchanged.
  expiresIn: number = 60 * 5,
): Promise<string> => {
  return getSignedUrl(
    storage,
    new GetObjectCommand({
      Bucket,
      Key,
    }),
    {
      expiresIn,
    },
  )
}

export const deleteFile = async ({
  Key,
  Bucket,
}: Pick<PutObjectTaggingCommandInput, "Key" | "Bucket">) => {
  // R2 doesn't implement the S3 object tagging API (GetObjectTagging/
  // PutObjectTagging), so this soft-delete tagging can't work there anyway.
  // It's also tied to the scheduled-publishing retention workflow,
  // which is meaningless for ephemeral preview data, so skip to a no-op.
  if (isR2Configured) return
  const objectTag = await storage.send(
    new GetObjectTaggingCommand({
      Bucket,
      Key,
    }),
  )

  const originalTagSet = objectTag.TagSet ?? []

  // If the file is already soft-deleted, short-circuit and skip the (paid,
  // expensive) PutObjectTagging call. The cheap GetObjectTagging above is
  // unavoidable, but re-tagging an already-deleted key would only overwrite
  // the original deletion timestamp with a fresh one — so skipping is both
  // cheaper and more correct (it preserves the original deletedAt).
  const isAlreadyDeleted = originalTagSet.some(({ Key }) => Key === DELETE_TAG)
  if (isAlreadyDeleted) {
    return
  }

  return storage.send(
    new PutObjectTaggingCommand({
      Bucket,
      Key,
      // NOTE: We perform a soft delete here so the file can be kept available
      // until the page is published
      Tagging: {
        TagSet: [
          ...originalTagSet,
          {
            Key: DELETE_TAG,
            // NOTE: milliseconds since epoch
            Value: Date.now().toString(),
          },
        ],
      },
    }),
  )
}

// A HeadObject error means "object is genuinely absent" only for a real
// not-found: AWS SDK v3 surfaces this as an error named "NotFound"/"NoSuchKey"
// or an HTTP 404. Every other failure (throttling, network blips, auth) is
// transient/operational and MUST propagate — swallowing it as `null` would let
// callers mistake a present object for a missing one.
export const isNotFoundError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) return false
  const { name, $metadata } = error as {
    name?: unknown
    $metadata?: { httpStatusCode?: unknown }
  }
  return (
    name === "NotFound" ||
    name === "NoSuchKey" ||
    $metadata?.httpStatusCode === 404
  )
}

export const getFileSize = async ({
  Key,
  Bucket,
}: Pick<HeadObjectCommandInput, "Key" | "Bucket">): Promise<number | null> => {
  try {
    const response = await storage.send(new HeadObjectCommand({ Bucket, Key }))
    return response.ContentLength ?? null
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }
    throw error
  }
}

export const copyFile = async ({
  SourceKey,
  DestKey,
  Bucket,
}: Pick<CopyObjectCommandInput, "Bucket"> & {
  SourceKey: string
  DestKey: string
}) => {
  if (!Bucket) throw new Error("Bucket must be defined")

  return storage.send(
    new CopyObjectCommand({
      Bucket,
      CopySource: getEncodedCopySource(Bucket, SourceKey),
      Key: DestKey,
    }),
  )
}

export const getBlob = async (bucketName: string, key: string) => {
  try {
    const data = await storage.send(
      new GetObjectCommand({ Bucket: bucketName, Key: key }),
    )
    const byteArr = await data.Body?.transformToByteArray()
    if (!byteArr) {
      throw new Error("Error when transforming blob to byte array")
    }
    return byteArr
  } catch (err) {
    console.error({
      message: "Error when getting blob",
      error: err,
      merged: { bucketName, key },
    })
    throw err
  }
}

export const putObjectDirect = async (
  props: Pick<
    PutObjectCommandInput,
    "Bucket" | "Key" | "Body" | "ContentType" | "ContentDisposition" | "Tagging"
  >,
): Promise<void> => {
  await storage.send(new PutObjectCommand(props))
}

// Resolves the private studio assets bucket — a dedicated bucket for
// Studio-generated artifacts (provisioned in isomer-next-infra, published to
// the env via SSM), separate from the public-facing website assets bucket; it
// has no CDN or public access point in front of it. Audit-log CSV exports
// live in it under the `audit-log-exports/` key prefix (see ADR 0007).
// Throws a clear error if the env var is unset, so misconfiguration fails
// loudly at call time rather than silently uploading to `undefined`. Exposed
// so the orchestrator (next layer) can build keys / sign URLs against the
// same bucket.
export const getStudioAssetsBucketName = (): string => {
  const bucket = env.S3_STUDIO_ASSETS_BUCKET_NAME
  if (!bucket) {
    throw new Error("S3_STUDIO_ASSETS_BUCKET_NAME is not configured")
  }
  return bucket
}

// Uploads a generated audit-log CSV export to the private studio assets
// bucket. The download disposition uses the key's basename as the filename so
// the browser saves a sensibly-named .csv rather than the full object key.
//
// `body` is streamed (the fulfilment path pipes a Postgres cursor through CSV
// serialisation straight into here), so we use lib-storage's `Upload` rather
// than a one-shot `PutObjectCommand`: it consumes a `Readable` without
// buffering the whole file, switching to a multipart upload automatically once
// the stream exceeds a single part and falling back to a single `PutObject`
// for small bodies. A plain string body is still accepted.
export const uploadAuditLogExport = async ({
  key,
  body,
}: {
  key: string
  body: Readable | string
}): Promise<void> => {
  const Bucket = getStudioAssetsBucketName()
  const filename = key.split("/").pop() ?? key
  const upload = new Upload({
    client: storage,
    params: {
      Bucket,
      Key: key,
      Body: body,
      ContentType: "text/csv",
      // Key segments can carry arbitrary site names (see
      // auditLogExport.service.ts); a raw template string would let a `"` in
      // `filename` break out of the quoted value. `createContentDisposition`
      // escapes quotes/backslashes and RFC 5987-encodes non-ASCII/control
      // chars instead.
      ContentDisposition: createContentDisposition(filename, {
        type: "attachment",
      }),
    },
  })
  await upload.done()
}
