/* ───────────────────────────────────────────
   file-preview — RECONSTRUIDO A MANO.

   El registry (ui.heygaia.io/r/file-preview.json)
   responde 200 pero sirve el archivo con `content`
   vacío, así que ni el CLI de shadcn ni una descarga
   directa pueden traerlo. Esta implementación cubre
   el contrato que `composer.tsx` consume:
     · UploadedFile { id, name, ... }
     · <FilePreview files onRemove className />
   Si algún día el registry publica el original,
   basta con sobrescribir este archivo.
   ─────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";

export interface UploadedFile {
	id: string;
	name: string;
	/** MIME type, cuando se conoce */
	type?: string;
	/** Tamaño en bytes */
	size?: number;
	/** URL de vista previa para imágenes */
	url?: string;
	/** Subida en curso */
	uploading?: boolean;
}

export interface FilePreviewProps {
	files: UploadedFile[];
	onRemove?: (id: string) => void;
	className?: string;
}

function formatSize(bytes?: number): string | null {
	if (!bytes && bytes !== 0) return null;
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilePreview({ files, onRemove, className }: FilePreviewProps) {
	if (!files || files.length === 0) return null;

	return (
		<div className={cn("flex flex-wrap gap-2 px-3 pt-3", className)}>
			{files.map((file) => {
				const size = formatSize(file.size);
				const isImage = file.type?.startsWith("image/") && file.url;

				return (
					<div
						key={file.id}
						className="group relative flex items-center gap-2 rounded-lg border border-zinc-200 bg-white py-1.5 pl-2 pr-7 dark:border-zinc-700 dark:bg-zinc-900"
					>
						{isImage ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={file.url}
								alt=""
								className="h-8 w-8 shrink-0 rounded object-cover"
							/>
						) : (
							<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
								>
									<path
										d="M14 3v5h5M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
						)}

						<span className="min-w-0 max-w-[160px]">
							<span className="block truncate text-xs font-medium text-zinc-800 dark:text-zinc-100">
								{file.name}
							</span>
							{(size || file.uploading) && (
								<span className="block text-[10px] text-zinc-500 dark:text-zinc-400">
									{file.uploading ? "Subiendo…" : size}
								</span>
							)}
						</span>

						{onRemove && (
							<button
								type="button"
								onClick={() => onRemove(file.id)}
								aria-label={`Quitar ${file.name}`}
								className="absolute right-1 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
							>
								<svg
									width="11"
									height="11"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.4"
								>
									<path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
								</svg>
							</button>
						)}
					</div>
				);
			})}
		</div>
	);
}
