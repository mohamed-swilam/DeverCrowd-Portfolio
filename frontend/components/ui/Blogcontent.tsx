import { cn } from "@/lib/utils";

interface BlogContentProps {
    html: string;
    className?: string;
}

export default function BlogContent({ html, className }: BlogContentProps) {
    return (
        <div
            className={cn("tiptap max-w-none text-sm leading-relaxed", className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}