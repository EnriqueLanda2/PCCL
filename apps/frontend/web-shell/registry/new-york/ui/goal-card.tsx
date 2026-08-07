/* ───────────────────────────────────────────
   goal-card — RECONSTRUIDO A MANO.

   El registry sirve este ítem con `content` vacío.
   Reimplementado siguiendo la API del ejemplo:
     <GoalCard id title progress createdAt
               roadmap={{ title, nodes: [{id,title,isComplete}] }}
               onClick={(id) => …} />
   ─────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";

export interface GoalRoadmapNode {
	id: string;
	title: string;
	isComplete: boolean;
}

export interface GoalRoadmap {
	title: string;
	nodes: GoalRoadmapNode[];
}

export interface GoalCardProps {
	id: string;
	title: string;
	/** Avance 0–100 */
	progress: number;
	createdAt?: Date | string;
	roadmap?: GoalRoadmap;
	onClick?: (id: string) => void;
	className?: string;
}

function clamp(n: number): number {
	return Math.max(0, Math.min(100, Math.round(n)));
}

function formatDate(value?: Date | string): string {
	if (!value) return "";
	const date = typeof value === "string" ? new Date(value) : value;
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}

export function GoalCard({
	id,
	title,
	progress,
	createdAt,
	roadmap,
	onClick,
	className,
}: Readonly<GoalCardProps>) {
	const value = clamp(progress);
	const complete = value >= 100;
	const done = roadmap?.nodes.filter((n) => n.isComplete).length ?? 0;
	const total = roadmap?.nodes.length ?? 0;

	const Wrapper = onClick ? "button" : "div";

	return (
		<Wrapper
			{...(onClick
				? { type: "button" as const, onClick: () => onClick(id) }
				: {})}
			className={cn(
				"flex w-full flex-col gap-3 rounded-2xl border border-[var(--neutral-200)] bg-white p-4 text-left transition-shadow",
				onClick && "cursor-pointer hover:shadow-md",
				className,
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<span className="text-[14px] font-semibold leading-snug text-[var(--ink)]">
					{title}
				</span>
				<span
					className={cn(
						"shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
						complete
							? "bg-[var(--green-50,#E9F8EF)] text-[var(--green-700)]"
							: "bg-[var(--neutral-100)] text-[var(--ink-soft)]",
					)}
				>
					{value}%
				</span>
			</div>

			{/* Barra de progreso — gris claro de pista, verde de avance */}
			<div
				className="h-2 w-full overflow-hidden rounded-full bg-[var(--neutral-100)]"
				role="progressbar"
				aria-valuenow={value}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label={title}
			>
				<div
					className="h-full rounded-full transition-[width] duration-500"
					style={{
						width: `${value}%`,
						background: complete
							? "var(--green-600)"
							: "linear-gradient(90deg, var(--green-500), var(--green-400))",
					}}
				/>
			</div>

			{/* Hitos del roadmap */}
			{roadmap && total > 0 && (
				<div className="flex flex-wrap items-center gap-1.5">
					{roadmap.nodes.map((node) => (
						<span
							key={node.id}
							title={node.title}
							className={cn(
								"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]",
								node.isComplete
									? "border-[var(--green-200,#99DEAF)] bg-[var(--green-50,#E9F8EF)] text-[var(--green-700)]"
									: "border-[var(--neutral-200)] bg-[var(--neutral-100)] text-[var(--ink-soft)]",
							)}
						>
							<span aria-hidden>{node.isComplete ? "✓" : "○"}</span>
							{node.title}
						</span>
					))}
				</div>
			)}

			<div className="flex items-center justify-between text-[11.5px] text-[var(--ink-muted)]">
				<span>{total > 0 ? `${done} de ${total} hitos` : "Sin hitos"}</span>
				{createdAt && <span>{formatDate(createdAt)}</span>}
			</div>
		</Wrapper>
	);
}
