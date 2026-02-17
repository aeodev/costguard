import { Link } from 'react-router-dom';
import { blogPosts } from '../shared/constants/blog-posts';
import { Button } from '../shared/ui/button';
import { Card } from '../shared/ui/card';

export const BlogListPage = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p className="mt-2 text-sm text-slate-400">
          Practical guidance for AI subscription governance, policy design, and cross-functional operating rhythms.
        </p>
      </div>
      <Link to="/contact">
        <Button>Request a governance workshop</Button>
      </Link>
    </div>

    <div className="space-y-4">
      {blogPosts.map((post) => (
        <Card key={post.slug}>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}{' '}
            • {post.readingTime}
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            <Link to={`/blog/${post.slug}`} className="hover:text-emerald-300">
              {post.title}
            </Link>
          </h2>
          <p className="mt-2 text-sm text-slate-400">{post.excerpt}</p>
          <Link to={`/blog/${post.slug}`} className="mt-3 inline-block text-sm text-emerald-300 hover:text-emerald-200">
            Read article
          </Link>
        </Card>
      ))}
    </div>
  </div>
);
