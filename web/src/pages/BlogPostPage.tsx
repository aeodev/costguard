import { Link, useParams } from 'react-router-dom';
import { getBlogPostBySlug } from '../shared/constants/blog-posts';
import { Button } from '../shared/ui/button';
import { Card } from '../shared/ui/card';

export const BlogPostPage = () => {
  const params = useParams();
  const post = getBlogPostBySlug(params.slug ?? '');

  if (!post) {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-slate-100">Post not found</h1>
        <p className="mt-2 text-sm text-slate-400">The article you requested does not exist.</p>
        <Link to="/blog" className="mt-4 inline-block">
          <Button variant="secondary">Back to blog</Button>
        </Link>
      </Card>
    );
  }

  return (
    <article className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} •{' '}
          {post.readingTime}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-400">{post.excerpt}</p>
      </div>

      {post.sections.map((section) => (
        <Card key={section.heading}>
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul className="space-y-1">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </Card>
      ))}

      <Card className="bg-emerald-500/10">
        <h3 className="text-lg font-semibold">{post.cta.title}</h3>
        <p className="mt-2 text-sm text-slate-400">{post.cta.description}</p>
        <div className="mt-4 flex gap-2">
          <Link to={post.cta.to}>
            <Button>{post.cta.label}</Button>
          </Link>
          <Link to="/blog">
            <Button variant="secondary">Back to blog</Button>
          </Link>
        </div>
      </Card>
    </article>
  );
};
