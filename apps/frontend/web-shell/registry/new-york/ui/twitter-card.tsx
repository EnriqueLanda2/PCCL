/* ───────────────────────────────────────────
   twitter-card — RECONSTRUIDO A MANO.

   El registry sirve este ítem con `content` vacío,
   así que se reimplementó siguiendo la API del
   ejemplo oficial:
     <TwitterCard author={{name, handle, avatar, verified}}
                  content timestamp likes retweets replies />
   ─────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";

export interface TwitterCardAuthor {
	name: string;
	handle: string;
	avatar?: string;
	verified?: boolean;
}

export interface TwitterCardProps {
	author: TwitterCardAuthor;
	content: string;
	timestamp?: Date | string;
	likes?: number;
	retweets?: number;
	replies?: number;
	/** Acción al pulsar el corazón — si se omite, el contador es de solo lectura */
	onLike?: () => void;
	liked?: boolean;
	className?: string;
}

/** "hace 3 h", "hace 2 d" — relativo y corto, como en la referencia. */
function relativeTime(value?: Date | string): string {
	if (!value) return "";
	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "";

	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
	if (seconds < 60) return "ahora";
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `hace ${minutes} min`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `hace ${hours} h`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `hace ${days} d`;
	return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

function initials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0] ?? "")
		.join("")
		.toUpperCase();
}

function Stat({
	label,
	value,
	icon,
	onClick,
	active,
}: Readonly<{
	label: string;
	value?: number;
	icon: React.ReactNode;
	onClick?: () => void;
	active?: boolean;
}>) {
	if (value === undefined && !onClick) return null;

	const content = (
		<>
			<span aria-hidden>{icon}</span>
			{value !== undefined && <span className="tabular-nums">{value}</span>}
		</>
	);

	if (!onClick) {
		return (
			<span
				className="inline-flex items-center gap-1.5 text-[12.5px] text-zinc-500 dark:text-zinc-400"
				aria-label={`${value ?? 0} ${label}`}
			>
				{content}
			</span>
		);
	}

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			aria-pressed={active}
			className={cn(
				"inline-flex cursor-pointer items-center gap-1.5 rounded-full px-1.5 py-0.5 text-[12.5px] transition-colors",
				active
					? "text-[var(--red-500,#e0245e)]"
					: "text-zinc-500 hover:text-[var(--red-500,#e0245e)] dark:text-zinc-400",
			)}
		>
			{content}
		</button>
	);
}

export function TwitterCard({
	author,
	content,
	timestamp,
	likes,
	retweets,
	replies,
	onLike,
	liked = false,
	className,
}: Readonly<TwitterCardProps>) {
	return (
		<article
			className={cn(
				"flex gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950",
				className,
			)}
		>
			{author.avatar ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={author.avatar}
					alt=""
					className="h-10 w-10 shrink-0 rounded-full object-cover"
				/>
			) : (
				<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[13px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
					{initials(author.name)}
				</span>
			)}

			<div className="min-w-0 flex-1">
				<header className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
					<span className="truncate text-[14px] font-bold text-zinc-900 dark:text-zinc-50">
						{author.name}
					</span>
					{author.verified && (
						<span
							className="text-[var(--blue-600,#1d9bf0)]"
							aria-label="Cuenta verificada"
							title="Verificado"
						>
							<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2l2.2 2.3 3.2-.4.6 3.1 2.8 1.5-1.4 2.9 1.4 2.9-2.8 1.5-.6 3.1-3.2-.4L12 22l-2.2-2.3-3.2.4-.6-3.1L3.2 15.5l1.4-2.9-1.4-2.9L6 8.2l.6-3.1 3.2.4L12 2z" />
								<path
									d="M10.6 15.2l-2.9-2.9 1.1-1.1 1.8 1.8 4.1-4.1 1.1 1.1-5.2 5.2z"
									fill="#fff"
								/>
							</svg>
						</span>
					)}
					<span className="truncate text-[13px] text-zinc-500 dark:text-zinc-400">
						@{author.handle}
					</span>
					{timestamp && (
						<>
							<span className="text-zinc-400" aria-hidden>
								·
							</span>
							<time className="text-[13px] text-zinc-500 dark:text-zinc-400">
								{relativeTime(timestamp)}
							</time>
						</>
					)}
				</header>

				<p className="mt-1 whitespace-pre-wrap break-words text-[14px] leading-relaxed text-zinc-800 dark:text-zinc-200">
					{content}
				</p>

				{(replies !== undefined || retweets !== undefined || likes !== undefined || onLike) && (
					<footer className="mt-2.5 flex items-center gap-6">
						<Stat
							label="respuestas"
							value={replies}
							icon={
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
									<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.6A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							}
						/>
						<Stat
							label="republicaciones"
							value={retweets}
							icon={
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
									<path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							}
						/>
						<Stat
							label="me gusta"
							value={likes}
							onClick={onLike}
							active={liked}
							icon={
								<svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9">
									<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							}
						/>
					</footer>
				)}
			</div>
		</article>
	);
}
