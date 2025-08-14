<template>
	<div>
		<section>
			<h2>Featured Video</h2>

			<div v-if="videoStore.loading">Loading video...</div>

			<div v-else-if="videoStore.error">Error: {{ videoStore.error }}</div>

			<div v-else-if="videoStore.featuredVideo">
				<div v-if="youtubeVideoId">
					<iframe
						:src="`https://www.youtube.com/embed/${youtubeVideoId}`"
						width="560"
						height="315"
						frameborder="0"
						allowfullscreen
					></iframe>
				</div>

				<div v-else>
					<p>Video URL: {{ videoStore.videoUrl }}</p>
				</div>
			</div>

			<div v-else>No video available</div>
		</section>

		<section>
			<h2>Class Schedule</h2>

			<div v-if="calendarStore.loading">Loading schedule...</div>

			<div v-else-if="calendarStore.error">
				Error: {{ calendarStore.error }}
			</div>

			<div v-else-if="calendarStore.hasEvents">
				<div v-for="event in calendarStore.upcomingEvents" :key="event.id">
					<h3>{{ event.attributes.activity }}</h3>
					<p>Date: {{ event.attributes.date }}</p>
					<p>
						Time: {{ event.attributes.start_time }} -
						{{ event.attributes.end_time }}
					</p>
					<p>
						Instructor: {{ event.attributes.instructor_first_name }}
						{{ event.attributes.instructor_last_name }}
					</p>
				</div>
			</div>

			<div v-else>No upcoming classes</div>
		</section>

		<section>
			<h2>Contact Us</h2>

			<form @submit.prevent="submitForm">
				<div>
					<label>First Name:</label>
					<input v-model="form.first_name" type="text" required />
				</div>

				<div>
					<label>Last Name:</label>
					<input v-model="form.last_name" type="text" required />
				</div>

				<div>
					<label>Mobile:</label>
					<input v-model="form.mobile" type="tel" required />
				</div>

				<button type="submit" :disabled="contactStore.submitting">
					{{ contactStore.submitting ? "Submitting..." : "Submit" }}
				</button>
			</form>

			<div v-if="contactStore.error">Error: {{ contactStore.error }}</div>
			<div v-if="contactStore.lastSubmission">
				Thank you! We'll contact you soon.
			</div>
		</section>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import { useCalendarStore } from "../stores/calendar";
	import { useVideoStore } from "../stores/video";
	import { useContactStore } from "../stores/contact";

	const calendarStore = useCalendarStore();
	const videoStore = useVideoStore();
	const contactStore = useContactStore();

	const form = ref({
		first_name: "",
		last_name: "",
		mobile: "",
	});

	const youtubeVideoId = computed(() => {
		const url = videoStore.videoUrl;
		if (!url) return null;

		const regExp =
			/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[7].length === 11 ? match[7] : null;
	});

	onMounted(async () => {
		await Promise.all([
			calendarStore.fetchEvents(),
			videoStore.fetchFeaturedVideo(),
		]);
	});

	const submitForm = async () => {
		try {
			await contactStore.submitContact(form.value);

			form.value = {
				first_name: "",
				last_name: "",
				mobile: "",
			};
		} catch (error) {
			console.error("Form submission failed:", error);
		}
	};
</script>
