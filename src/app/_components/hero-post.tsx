import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import { type Author } from "@/interfaces/author";
import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

export function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md p-6 md:p-8 mb-12">
      <div className="mb-6 md:mb-10">
        <CoverImage title={title} src={coverImage} slug={slug} />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-12 lg:gap-x-16">
        <div>
          <h3 className="mb-3 text-3xl lg:text-4xl leading-tight font-semibold">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-base md:text-lg text-neutral-600 dark:text-slate-400">
            <DateFormatter dateString={date} />
          </div>
        </div>
        <div>
          <p className="text-base md:text-lg leading-relaxed mb-4 text-neutral-800 dark:text-slate-200">{excerpt}</p>
          <div className="pt-2 border-t border-neutral-100 dark:border-slate-700">
            <Avatar name={author.name} picture={author.picture} />
          </div>
        </div>
      </div>
    </section>
  );
}
