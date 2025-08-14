import { defineStore } from "pinia";

export const useVideoStore = defineStore("video", {
	state: () => ({
		featuredVideo: null,
		loading: false,
		error: null,
	}),

	actions: {
		async fetchFeaturedVideo() {
			this.loading = true;
			this.error = null;

			try {
				const { query } = useGraphQL();

				const GET_FEATURED_VIDEO = `
                    query GetFeaturedVideo {
                     featuredVideo {
                        data {
                        attributes {
            video_url
          video_file {
            data {
              attributes {
                url
                name
                mime
              }
            }
          }
          thumbnail {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
        }
      }
    }
  }
`;
				const { data, error } = await query(GET_FEATURED_VIDEO);

				if (error) throw error;

				this.featuredVideo = data.featuredVideo?.data || null;
			} catch (err) {
				this.error = err.message || "Failed to fetch video";
			} finally {
				this.loading = false;
			}
		},
	},

	getters: {
		videoUrl: (state) => state.featuredVideo?.attributes?.video_url || "",

		thumbnailUrl: (state) => {
			const thumbnail = state.featuredVideo?.attributes?.thumbnail?.data;
			if (thumbnail) {
				const url = thumbnail.attributes.url;
				return url.startsWith("http") ? url : `http://localhost:1337${url}`;
			}
			return null;
		},
	},
});
