import { defineStore } from "pinia";

export const useContactStore = defineStore("contact", {
	state: () => ({
		submitting: false,
		error: null,
		lastSubmission: null,
	}),

	actions: {
		async submitContact(contactData) {
			this.submitting = true;
			this.error = null;

			try {
				const { mutate } = useGraphQL();

				const CREATE_CONTACT = `
          mutation CreateContactSubmission($data: ContactSubmissionInput!) {
            createContactSubmission(data: $data) {
              data {
                id
                attributes {
                  first_name
                  last_name
                  mobile
                }
              }
            }
          }
        `;

				const submissionData = {
					...contactData,
					submitted_at: new Date().toISOString(),
				};

				const { data, error } = await mutate(CREATE_CONTACT, {
					data: submissionData,
				});

				if (error) throw error;

				this.lastSubmission = data.createContactSubmission?.data;
				return data;
			} catch (err) {
				this.error = err.message || "Failed to submit contact";
				throw err;
			} finally {
				this.submitting = false;
			}
		},
	},
});
