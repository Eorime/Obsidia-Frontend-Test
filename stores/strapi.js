import { defineStore } from "pinia";

export const useStrapiStore = defineStore("strapi", {
	state: () => ({
		articles: [],
		loading: false,
		error: null,
	}),

	actions: {
		async fetchArticles() {
			this.loading = true;
			this.error = null;

			try {
				const { query } = useGraphQL();

				const GET_ARTICLES = `
          query GetArticles {
            articles {
              data {
                id
                attributes {
                  title
                  content
                  createdAt
                  updatedAt
                }
              }
            }
          }
        `;

				const { data, error } = await query(GET_ARTICLES);

				if (error) {
					throw error;
				}

				this.articles = data.articles?.data || [];
			} catch (err) {
				console.error("Error fetching articles:", err);
				this.error = err.message || "Failed to fetch articles";
			} finally {
				this.loading = false;
			}
		},

		async createArticle(articleData) {
			try {
				const { mutate } = useGraphQL();

				const CREATE_ARTICLE = `
          mutation CreateArticle($data: ArticleInput!) {
            createArticle(data: $data) {
              data {
                id
                attributes {
                  title
                  content
                  createdAt
                }
              }
            }
          }
        `;

				const { data, error } = await mutate(CREATE_ARTICLE, {
					data: articleData,
				});

				if (error) {
					throw error;
				}

				if (data.createArticle?.data) {
					this.articles.push(data.createArticle.data);
				}

				return data;
			} catch (err) {
				console.error("Error creating article:", err);
				this.error = err.message || "Failed to create article";
				throw err;
			}
		},
	},

	getters: {
		getArticleById: (state) => (id) => {
			return state.articles.find((article) => article.id === id);
		},

		articlesCount: (state) => state.articles.length,

		hasArticles: (state) => state.articles.length > 0,
	},
});
