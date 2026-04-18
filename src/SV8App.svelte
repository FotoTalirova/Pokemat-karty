<script>
	import { onMount } from "svelte";
	import Search from "./Search.svelte";
	import CardList from "./Cards.svelte";
	import Card from "./lib/components/CardProxy.svelte";

	let sv8Full = [];
	let isLoading = true;
	let query = "";

	const loadSV8 = async() => {
		try {
	const response = await fetch("/data/sv8.json");
			sv8Full = await response.json();
		} catch (e) {
			console.warn('SV8 full data unavailable:', e);
		}
		isLoading = false;
	};

	onMount(loadSV8);
</script>

<main>
	<header>
		<h1>Scarlet & Violet - SV8 Phantasmal Flames ({sv8Full.length || 0} karet)</h1>
		<p>Všechny karty ze setu SV8</p>
	</header>

	<Search bind:query />

	{#if query.length < 3}
	<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each sv8Full as card}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set?.id || 'sv8'}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
						img={card.images?.large}
					/>
				{/each}
			{/if}
		</CardList>
	{:else}
		<p>Vyhledávání na této stránce není podporováno.</p>
	{/if}
</main>

<style>
	/* Copy style from App.svelte */
	main {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1rem;
	}
</style>
