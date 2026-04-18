<script>
	import pokemon from "pokemontcgsdk";
	import { onMount } from "svelte";

	import CardList from "./Cards.svelte";
	import Card from "./lib/components/CardProxy.svelte";

	export let query = "";

	let loadingQuery = false;
	let queryTimer;
	let queryResult = [];
	let isError = false;

	pokemon.configure({ apiKey: import.meta.env.VITE_API_KEY });

	const normalize = (str) => str?.toLowerCase().trim();

	const sets = {
		sv9: "Journey Together",
		sv5: "Temporal Forces",
		sv8: "Surging Sparks",
		sv6pt5: "Shrouded Fable"
	};

	const selectSet = (id) => {
		query = id; // naplní bind:query a spustí loadQuery
	};

	const loadQuery = async () => {
		if (!usableQuery) return;

		loadingQuery = true;
		clearTimeout(queryTimer);

		queryTimer = setTimeout(async () => {
			const q = normalize(query);

	let searchString = `name:"*${q}*"`;

// pokud query začíná na sv nebo je to konkrétní set id
if (
  q.startsWith("sv") || 
  q === "me3" || 
  q === "sv6pt5" || 
  q === "m2a_ja"
) {
  searchString = `(set.id:${q} OR name:"*${q}*")`;
}
			try {
				const result = await pokemon.card.where({
					q: searchString,
					select: `id,name,number,supertype,subtypes,rarity,images,types,set`,
					orderBy: `-set.releaseDate,-number`,
					pageSize: 36
				});

				const cards = result.data || [];

				queryResult = cards.map(card => {
					if (card.rarity === "Common" || card.rarity === "Uncommon") {
						card.isReverse = !!Math.round(Math.random());
					}
					card.set = card.set.id;
					return card;
				});

				isError = queryResult.length === 0;
				loadingQuery = false;

			} catch (err) {
				console.error(err);
				queryResult = [];
				loadingQuery = false;
				isError = true;
			}

			// @ts-ignore
			gtag("event", "search", { search_term: query });

		}, 666);
	};

	$: usableQuery = query.length > 2;
	$: query && loadQuery();
</script>

<section class="search-area">
	<input type="search" bind:value={query} placeholder="eg: Hledat" />

	<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.25" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
		<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
		<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
		<path d="M21 21l-6 -6"></path>
	</svg>

	<!-- Tlačítka setů -->
	<div class="set-buttons">
		{#each Object.entries(sets) as [id, name]}
			<button type="button" on:click={() => selectSet(id)}>
				{name}
			</button>
		{/each}
	</div>
</section>

{#if !query}
	<h3>Podívej se na detail karet a balíčků</h3>
{/if}

{#if usableQuery && loadingQuery}
	<h3>Hledám karty...</h3>
{/if}

{#if usableQuery && queryResult.length}
	<CardList>
		{#each queryResult as card (card.id)}
			<Card
				id={card.id}
				name={card.name}
				set={card.set}
				number={card.number}
				types={card.types}
				supertype={card.supertype}
				subtypes={card.subtypes}
				rarity={card.rarity}
				isReverse={card.isReverse}
			/>
		{/each}
	</CardList>
{/if}

{#if isError || (usableQuery && !loadingQuery && !queryResult.length)}
	<h3>Aj chyba - nic tu není</h3>

	<CardList>
		<Card 
			id="basep-16"
			name="Computer Error"
			set="basep"
			number="16"
			img="https://images.pokemontcg.io/basep/16_hires.png"
			supertype="Trainer"
			subtypes="Rocket's Secret Machine"
			rarity="Promo"
			isReverse={false}
		/>
	</CardList>
{/if}

<style>
	.search-area {
		font-size: 18px;
		display: grid;
		place-items: center start;
		max-width: 500px;
		margin: 120px 0 10px;
		padding: 5px;
		position: sticky;
		top: 10px;
		border-radius: .66em;
		backdrop-filter: blur(5px);
		z-index: 999;
	}

	.set-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 10px;
	}

	.set-buttons button {
		background: hsla(220, 7%, 17%, 0.8);
		color: white;
		border: none;
		padding: 4px 10px;
		border-radius: 5px;
		cursor: pointer;
		transition: all 0.3s;
	}
	.set-buttons button:hover {
		background: var(--primary);
	}

	input {
		font-family: Roboto;
		font-size: inherit;
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: .5em;
		padding: .5em 2em .5em .75em;
		background: hsla(220, 7%, 17%, .66);
		color: white;
		outline: none;
		width: 100%;
		margin-bottom: 8px;
	}
</style>