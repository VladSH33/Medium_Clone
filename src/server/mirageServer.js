import { createServer, Model, Response, Factory, hasMany, belongsTo } from "miragejs";

export function makeServer() {
    createServer({
        models: {
            user: Model.extend({
                articles: hasMany(),
                comments: hasMany(),
                likes: hasMany(),
            }),
            article: Model.extend({
                author: belongsTo('user'),
                comments: hasMany(),
                tags: hasMany('tag'),
                likes: hasMany(),
            }),
            like: Model.extend({
                user: belongsTo(),
                article: belongsTo(),
            }),
            comment: Model.extend({
                article: belongsTo(),
                author: belongsTo('user'),
                tags: hasMany(),
            }),
            tag: Model.extend({
                article: belongsTo(),
            }),
        },

        factories: {
            user: Factory.extend({
                username(i) {
                return `user${i}`;
                },
                bio: 'This is a bio',
                image: 'https://randomuser.me/api/portraits/lego/1.jpg',
            }),
            article: Factory.extend({
                title(i) {
                return `Article ${i}`;
                },
                description: 'Article description',
                body: 'Article body',
                slug(i) {
                return `article-${i}`;
                },
                createdAt() {
                return new Date().toISOString();
                },
            }),
            comment: Factory.extend({
                body: 'Comment body',
                createdAt() {
                return new Date().toISOString();
                },
            }),
            tag: Factory.extend({
                name(i) {
                return `tag${i}`;
                },
            }),
        },

        seeds(server) {
            const storedToken = localStorage.getItem("token");

            const user1 = server.create("user", { 
                email: "test@example.com", 
                password: "password", 
                username: "Паша", 
                bio: "Frontend",
                image: 'https://randomuser.me/api/portraits/lego/1.jpg',
                token: storedToken || generateToken(),
            });

            const user2 = server.create("user", { 
                email: "test2@example.com", 
                password: "password2", 
                username: "Маша", 
                bio: "Backend",
                image: 'https://randomuser.me/api/portraits/lego/1.jpg',
                token: storedToken || generateToken()
            });

            const tag1 = server.create('tag', { name: 'react' });
            const tag2 = server.create('tag', { name: 'javascript' });
            const tag3= server.create('tag', { name: 'CAR' });

            const tagNames = ['vue', 'node', 'css', 'global', 'fuck', 'add', 'blak'];

            tagNames.forEach(name => {
                server.create('tag', { name });
            });

            const article1 = server.create('article', { author: user1 });
            const article2 = server.create('article', { author: user2 });

            article1.update({ tags: [tag1, tag2] });
            article2.update({ tags: [tag2] });
            
            article1.save();
            article2.save();

            server.createList("article", 20, { author: user1, tags: [tag3] });
            server.createList("article", 30, { author: user2 });
      
            server.create('comment', { article: article1, author: user2 });
            server.create('comment', { article: article2, author: user1 });
        },

        routes() {
            this.namespace = "api";
            this.post("/register", (schema, request) => {
                const { user } = JSON.parse(request.requestBody);
                let existingUser = schema.users.findBy({ email: user.email });
                if (existingUser) {
                    return new Response(400, {}, { error: "Этот email уже используется" });
                }

                const token = generateToken();

                let newUser = schema.users.create({
                    ...user,
                    token,
                });
                return {
                    user: {
                        username: newUser.username,
                        email: newUser.email,
                        bio: newUser.bio,
                        image: newUser.image,
                        token
                    },
                };
            });

            this.post("/login", (schema, request) => {
                const { user } = JSON.parse(request.requestBody);

                let existingUser = schema.users.findBy({ email: user.email, password: user.password });
                if (!existingUser) {
                    return new Response(401, {}, { error: "Неправильные учетные данные" });
                }

                const newToken = generateToken();
                existingUser.update({ token: newToken });

                return {
                    user: {
                        email: existingUser.email,
                        username: existingUser.username,
                        bio: existingUser.bio,
                        image: existingUser.image,
                        token: newToken,
                    },
                };
            });

            this.post("/user", (schema, request) => {
                const authHeader = request.requestHeaders.authorization;

                if (!authHeader || !authHeader.startsWith("Token ")) {
                    return new Response(401, {}, { error: "Токен отсутствует или неверный" });
                }

                const token = authHeader.replace("Token ", "");
                let existingUser = schema.users.findBy({ token });

                if (!existingUser) {
                    return new Response(401, {}, { error: "Пользователь не найден" });
                }

                return {
                    user: {
                        email: existingUser.email,
                        username: existingUser.username,
                        bio: existingUser.bio,
                        image: existingUser.image,
                        token: existingUser.token,

                    },
                };
            });

            this.put("/user", (schema, request) => {
                const { user } = JSON.parse(request.requestBody); // Изменил на user, а не userNewData
            
                const token = request.requestHeaders.authorization?.replace("Token ", "");
                const existingUser = schema.users.findBy({ token });
            
                if (!existingUser) {
                    return new Response(401, {}, { error: "User not found" });
                }
            
                existingUser.update(user);
            
                return { user: existingUser.attrs };
            });

            this.get('/profiles/:username', (schema, request) => {
                const username = request.params.username;
                const user = schema.users.findBy({ username });

                console.log(user)
        
                if (user) {
                  return {
                    profile: {
                      username: user.username,
                      bio: user.bio,
                      image: user.image,
                      following: false, // Логика подписки может быть добавлена позже
                    },
                  };
                } else {
                  return new Response(404, { some: 'header' }, { errors: ['User not found'] });
                }
            });

            this.post('/profiles/:username/follow', (schema, request) => {
                return new Response(200);
            });

            this.delete('/profiles/:username/follow', (schema, request) => {
                // Логика отписки от пользователя
                return new Response(200);
            });

            this.get('/articles', (schema, request) => {
                let { limit, offset, tag, author } = request.queryParams;
                const token = request.requestHeaders.authorization?.replace('Token ', '');
                const currentUser = schema.users.findBy({ token });
            
                limit = limit ? parseInt(limit, 10) : 10;
                offset = offset ? parseInt(offset, 10) : 0;
            
                let allArticles = schema.articles.all().models;

                if (tag && tag.trim()) {
                    allArticles = allArticles.filter(article =>
                        article.tags.models.some(tagArticle => tagArticle.name.toLowerCase() === tag.toLowerCase())
                    );
                }

                if (author && author.trim()) {
                    const authorUser = schema.users.findBy({ username: author });
                    if (authorUser) {
                        allArticles = allArticles.filter(article => article.authorId === authorUser.id);
                    }
                }

                const paginatedArticles = allArticles.slice(offset, offset + limit).map(article => {
                    const authorUser = schema.users.find(article.authorId);
                    const tags = article.tags.models.map(tag => tag.name);
                    const likesCount = article.likes.models.length;
                    const isLiked = currentUser ? article.likes.models.some(like => like.userId === currentUser.id) : false;
            
                    return {
                        ...article.attrs,
                        author: {
                            username: authorUser.username,
                            bio: authorUser.bio,
                            image: authorUser.image,
                            following: false,
                        },
                        tagList: tags,
                        favoritesCount: likesCount,
                        favorited: isLiked,
                    };
                });
            
                return {
                    articles: paginatedArticles,
                    articlesCount: allArticles.length,
                };
            });

            this.get('/articles/feed', (schema, request) => {

                const token = request.requestHeaders.authorization?.replace('Token ', '');
                const currentUser = schema.users.findBy({ token });

                if (!currentUser || currentUser == null) {
                    return new Response(401, {}, { errors: { message: 'Unauthorized' } });
                }

                let { limit, offset } = request.queryParams;
            
                limit = limit ? parseInt(limit, 10) : 10;
                offset = offset ? parseInt(offset, 10) : 0;
            
                const allArticles = schema.articles.where({ authorId: currentUser.id }).models;
            
                const paginatedArticles = allArticles.slice(offset, offset + limit).map(article => {
                    const author = schema.users.find(article.authorId);
                    const tags = article.tags.models.map(tag => tag.name);

                    return {
                        ...article.attrs,
                        author: {
                            username: author.username,
                            bio: author.bio,
                            image: author.image,
                            following: false,
                        },
                        tagList: tags,
                    };
                });
            
                return {
                    articles: paginatedArticles,
                    articlesCount: allArticles.length,
                };
            });

            this.post('/articles', (schema, request) => {
                const attrs = JSON.parse(request.requestBody).article;

                const errors = {};

                if (!attrs.title || attrs.title.trim() === '') {
                    errors.title = ["can't be blank"];
                }
                if (!attrs.description || attrs.description.trim() === '') {
                    errors.description = ["can't be blank"];
                }
                if (!attrs.body || attrs.body.trim() === '') {
                    errors.body = ["can't be blank"];
                }
                if (!attrs.tagList || !Array.isArray(attrs.tagList) || attrs.tagList.length === 0) {
                    errors.tagList = ["can't be blank"];
                }

                if (Object.keys(errors).length > 0) {
                    return new Response(422, {}, { errors });
                }

                const slug = attrs.title.toLowerCase()

                const attrNew = {
                    ...attrs,
                    createdAt: new Date().toISOString(),
                    slug
                };

                const user = schema.users.first();
                const article = schema.articles.create({ ...attrNew, author: user });
                return { article: article.attrs };
            });

            this.get('/articles/favorites/:username', (schema, request) => {
                const username = request.params.username;
                const user = schema.users.findBy({ username });
            
                if (!user) {
                    return new Response(404, {}, { errors: ['User not found'] });
                }
            
                // Находим все лайки пользователя
                const likedArticles = schema.likes.where({ userId: user.id }).models.map(like => like.article);
            
                // Формируем ответ
                const articles = likedArticles.map(article => {
                    const author = schema.users.find(article.authorId);
                    const tags = article.tags.models.map(tag => tag.name);
                    return {
                        ...article.attrs,
                        author: {
                            username: author.username,
                            bio: author.bio,
                            image: author.image,
                            following: false,
                        },
                        tagList: tags,
                        favoritesCount: article.likes.models.length,
                        favorited: true, // Так как это список лайкнутых статей
                    };
                });
            
                return {
                    articles,
                    articlesCount: articles.length,
                };
            });

            this.get('/articles/:slug', (schema, request) => {
                const slug = request.params.slug;
                const article = schema.articles.findBy({ slug });

                if (article) {
                const author = schema.users.find(article.authorId);
                const tags = article.tags.models.map(tag => tag.name);

                    return {
                        article: {
                        ...article.attrs,
                        author: {
                            username: author.username,
                            bio: author.bio,
                            image: author.image,
                            following: false,
                        },
                        tagList: tags,
                        },
                    };
                } else {
                return new Response(404, { some: 'header' }, { errors: ['Article not found'] });
                }
            });

            this.put('/articles/:slug', (schema, request) => {
                const slug = request.params.slug;
                const attrs = JSON.parse(request.requestBody).article;
                const article = schema.articles.findBy({ slug });

                const errors = {};

                if (!attrs.title || attrs.title.trim() === '') {
                    errors.title = ["can't be blank"];
                }
                if (!attrs.description || attrs.description.trim() === '') {
                    errors.description = ["can't be blank"];
                }
                if (!attrs.body || attrs.body.trim() === '') {
                    errors.body = ["can't be blank"];
                }
                if (!attrs.tagList || !Array.isArray(attrs.tagList) || attrs.tagList.length === 0) {
                    errors.tagList = ["can't be blank"];
                }

                if (Object.keys(errors).length > 0) {
                    return new Response(422, {}, { errors });
                }

                if (article) {
                article.update(attrs);
                return { article: article.attrs };
                } else {
                    return new Response(404, { some: 'header' }, { errors: ['Article not found'] });
                }
            });

            this.delete('/articles/:slug', (schema, request) => {
                const slug = request.params.slug;
                console.log(slug)
                const article = schema.articles.findBy({ slug });
                console.log(article)
                if (article) {
                article.destroy();
                return new Response(204);
                } else {
                return new Response(404, { some: 'header' }, { errors: ['Article not found'] });
                }
            });

            this.post('/articles/:slug/favorite', (schema, request) => {
                const slug = request.params.slug;
                const token = request.requestHeaders.authorization?.replace('Token ', '');
                const currentUser = schema.users.findBy({ token });
            
                if (!currentUser) {
                    return new Response(401, {}, { errors: { message: 'Unauthorized' } });
                }
            
                const article = schema.articles.findBy({ slug });
            
                if (!article) {
                    return new Response(404, {}, { errors: ['Article not found'] });
                }
            
                const existingLike = schema.likes.findBy({ userId: currentUser.id, articleId: article.id });
            
                if (!existingLike) {
                    schema.likes.create({ user: currentUser, article });
                }
            
                return {
                    article: {
                        ...article.attrs,
                        favoritesCount: article.likes.models.length,
                        favorited: true,
                    },
                };
            });

            this.delete('/articles/:slug/favorite', (schema, request) => {
                const slug = request.params.slug;
                const token = request.requestHeaders.authorization?.replace('Token ', '');
                const currentUser = schema.users.findBy({ token });
            
                if (!currentUser) {
                    return new Response(401, {}, { errors: { message: 'Unauthorized' } });
                }
            
                const article = schema.articles.findBy({ slug });
            
                if (!article) {
                    return new Response(404, {}, { errors: ['Article not found'] });
                }
            
                const existingLike = schema.likes.findBy({ userId: currentUser.id, articleId: article.id });
            
                if (existingLike) {
                    existingLike.destroy();
                }
            
                return {
                    article: {
                        ...article.attrs,
                        favoritesCount: article.likes.models.length,
                        favorited: false,
                    },
                };
            });

            this.get('/articles/:slug/comments', (schema, request) => {
                const slug = request.params.slug;
                const article = schema.articles.findBy({ slug });
            
                    if (article) {
                            const comments = article.comments.models.map(comment => ({
                                id: comment.id,
                                body: comment.body,
                                createdAt: comment.createdAt,
                                author: {
                                    username: comment.author.username,
                                    bio: comment.author.bio,
                                    image: comment.author.image,
                                },
                            }));
                            return { comments };
                    } else {
                        return new Response(404, {}, { errors: ['Article not found'] });
                    }
            });

            this.get('/tags', (schema, request) => {
                return {
                    tags: schema.tags.all().models.map(tag => tag.name),
                };
            })
        }
    });
};

function generateToken() {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
}