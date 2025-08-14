import { defineStore } from "pinia";
import useGraphQL from "../composables/useGraphQL";

export const useCalendarStore = defineStore("calendar", {
	state: () => ({
		events: [],
		loading: false,
		error: null,
	}),

	actions: {
		async fetchEvents() {
			this.loading = true;
			this.error = null;

			try {
				const { query } = useGraphQL();

				const GET_EVENTS = `
    query GetCalendarEvents {
        calendar_events(sort: "date:asc") {
            data {
                id
                attributes {
                    date
                    start_time
                    end_time
                    activity
                    first_name
                    last_name
                }
            }
        }
    }`;

				const { data, error } = await query(GET_EVENTS);

				if (error) throw error;

				this.events = data.calendar_events?.data || [];
			} catch (err) {
				this.error = err.message || "Failed to fetch events";
			} finally {
				this.loading = false;
			}
		},
	},

	getters: {
		upcomingEvents: (state) => {
			const today = new Date().toISOString().split("T")[0];
			return state.events.filter((event) => event.attributes.date >= today);
		},

		getEventsByDate: (state) => (date) => {
			return state.events.filter((event) => event.attributes.date === date);
		},

		formatTimeRange: () => (startTime, endTime) => {
			return `${startTime} - ${endTime}`;
		},
	},
});
