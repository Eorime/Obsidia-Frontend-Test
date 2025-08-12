import { GraphQLClient } from "graphql-request";

export const useGraphQL = () => {
	const config = useRuntimeConfig();

	const client = new GraphQLClient(config.public.graphqlEndpoint);

	const query = async (query, variables = {}) => {
		try {
			const data = await client.request(query, variables);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	};

	const mutate = async (mutation, variables = {}) => {
		try {
			const data = await client.request(mutation, variables);
			return { data, error: null };
		} catch (error) {
			return { data: null, error };
		}
	};

	return {
		query,
		mutate,
	};
};
