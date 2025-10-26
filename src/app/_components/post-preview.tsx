import { type Author } from "@/interfaces/author";
import Link from "next/link";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

export function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <div className="group rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="mb-0">
        <CoverImage slug={slug} title={title} src={coverImage} />
      </div>
      <div className="p-5">
        <h3 className="text-2xl md:text-3xl font-semibold mb-3 leading-snug">
          <Link href={`/posts/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        <div className="text-sm md:text-base mb-4 text-neutral-600 dark:text-slate-400">
          <DateFormatter dateString={date} />
        </div>
        <p className="text-base md:text-lg leading-relaxed mb-4 text-neutral-800 dark:text-slate-200">
          {excerpt}
        </p>
        <div className="pt-2 border-t border-neutral-100 dark:border-slate-700">
          <Avatar name={author.name} picture={author.picture} />
        </div>
      </div>
    </div>
  );
}
