const GITHUB_USER = "Boujaafariadam-dotcom1";
const REPO = "masaha-blog";
const POSTS_PATH = "content/posts";

const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${REPO}/contents/${POSTS_PATH}`;

async function loadPosts() {
    const container = document.querySelector(".articles-grid");

    if (!container) {
        console.error("لم يتم العثور على articles-grid");
        return;
    }

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("تعذر الاتصال بـ GitHub");
        }

        const files = await response.json();

        const posts = files.filter(file => file.name.endsWith(".md"));

        container.innerHTML = "";

        for (const file of posts) {
            const contentResponse = await fetch(file.download_url);
            const markdown = await contentResponse.text();

            const titleMatch = markdown.match(/^#\s+(.+)$/m);
            const title = titleMatch ? titleMatch[1] : file.name;

            const excerpt = markdown
                .replace(/^#.*$/gm, "")
                .trim()
                .slice(0, 150);

            const article = document.createElement("article");
            article.className = "article-card";

            article.innerHTML = `
                <div class="article-info">
                    <span>تجارب وأفكار</span>
                    <h3>${title}</h3>
                    <p>${excerpt}</p>
                    <a href="post.html?file=${encodeURIComponent(file.name)}">
                        اقرأ المزيد ←
                    </a>
                </div>
            `;

            container.appendChild(article);
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>تعذر تحميل المقالات حالياً.</p>";
    }
}

loadPosts();
