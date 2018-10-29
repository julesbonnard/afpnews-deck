<template>
	<nav>
		<p
	    v-if="slugs.length > 0"
	    class="slugs">
	    <router-link
	      v-for="slug in slugs"
	      :key="slug"
	      :to="`/slug/${slug}`">
	      {{ slug }}
	    </router-link> 
	  </p>
	  <p
	    v-if="keywords.length > 0"
	    class="keywords">
	    <router-link
	      v-for="keyword in keywords"
	      :key="keyword"
	      :to="`/keyword/${keyword}`">
	      {{ keyword }}
	    </router-link> 
	  </p>
	  <p
	    v-if="iptc.length > 0"
	    class="iptc">
	    <router-link
	      :to="`/iptc/${iptc.join(',')}`">
	      Sur les mêmes catégories
	    </router-link>
	  </p>
	  <p
	    v-if="events.length > 0"
	    class="events">
	    <router-link
	      :to="`/event/${events.join(',')}`">
	      Sur le même évenement
	    </router-link>
	  </p>
	</nav>
</template>

<script>
export default {
	name: 'Links',
	props: {
		slugs: {
			type: Array,
			default: () => ([])
		},
		keywords: {
			type: Array,
			default: () => ([])
		},
		iptc: {
			type: Array,
			default: () => ([])
		},
		events: {
			type: Array,
			default: () => ([])
		}
	}
}
</script>

<style lang="scss"></style>
