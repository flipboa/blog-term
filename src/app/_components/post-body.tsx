import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="max-w-3xl mx-auto">
      <div
        className={`${markdownStyles["markdown"]} prose prose-lg prose-slate dark:prose-invert`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
