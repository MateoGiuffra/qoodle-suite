import * as cheerio from 'cheerio';

export interface DiscussionListItem {
    id: string;
    title: string;
    author: string;
    date: string | null;
    url: string;
}

export interface ForumDiscussionList {
    forumTitle: string;
    discussions: DiscussionListItem[];
}

export function parseForumView(html: string): ForumDiscussionList {
    const $ = cheerio.load(html);
    const forumTitle = $('title').text().trim();

    const discussions: DiscussionListItem[] = [];
    $('tr[data-discussionid]').each((_, el) => {
        const $row = $(el);
        const id = $row.attr('data-discussionid') || '';
        const $link = $row.find('th.topic a').first();
        const title = $link.text().trim();
        const url = $link.attr('href') || '';
        const author = $row.find('td.author .author-info div').first().text().trim();
        const date = $row.find('td.author time').first().attr('data-timestamp') || null;

        if (id && title) {
            discussions.push({ id, title, author, date, url });
        }
    });

    return { forumTitle, discussions };
}

export interface ForumPost {
    id: string;
    subject: string;
    author: string;
    authorUrl: string | null;
    date: string | null;
    html: string;
    text: string;
    replies: ForumPost[];
}

export interface DiscussionContent {
    title: string;
    posts: ForumPost[];
}

export function parseDiscussion(html: string): DiscussionContent {
    const $ = cheerio.load(html);
    const title = $('title').text().trim();

    function parseArticle($article: cheerio.Cheerio<any>): ForumPost {
        const id = ($article.attr('id') || '').replace(/^p/, '');
        const $core = $article.find('> div.forumpost').first();
        const subject = $core.find('[data-region-content="forum-post-core-subject"]').first().text().trim();
        const $authorLink = $core.find('header a[href*="/user/view.php"]').first();
        const author = $authorLink.text().trim();
        const authorUrl = $authorLink.attr('href') || null;
        const date = $core.find('header time').first().attr('datetime') || null;
        const $content = $core.find('.post-content-container').first();
        const contentHtml = $content.html() || '';
        const text = $content.text().trim();

        const replies: ForumPost[] = [];
        $article.find('> div[data-region="replies-container"] > article').each((_, replyEl) => {
            replies.push(parseArticle($(replyEl)));
        });

        return { id, subject, author, authorUrl, date, html: contentHtml, text, replies };
    }

    const posts: ForumPost[] = [];
    $('article.forum-post-container').each((_, el) => {
        const $article = $(el);
        // Solo los artículos de nivel raíz (no anidados dentro de otro replies-container)
        if ($article.parents('[data-region="replies-container"]').length === 0) {
            posts.push(parseArticle($article));
        }
    });

    return { title, posts };
}
