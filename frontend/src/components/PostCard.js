import { useState } from "react";
import { getFlag } from "@/components/WorldMap";
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const flag = getFlag(post.country);

  return (
    <article className="glass-panel p-4" data-testid={`post-${post.id}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
          {post.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{post.author}</h3>
              <p className="text-xs text-muted-foreground">{post.role}</p>
            </div>
            <button
              type="button"
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-sm leading-none" aria-hidden="true">{flag}</span>
            <MapPin className="h-3 w-3" />
            <span>{post.location}</span>
            <span className="text-border">·</span>
            <span>{post.timeAgo}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground">{post.content}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-6">
        <button
          type="button"
          onClick={handleLike}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors select-none"
          data-testid={`like-btn-${post.id}`}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              liked && "fill-red-500 text-red-500"
            )}
          />
          <span>{likeCount}</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors select-none"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments}</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors select-none"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
