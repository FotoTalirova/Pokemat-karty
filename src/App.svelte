<script>
  import { onMount } from "svelte";

	import Filter from "./Filter.svelte";
	import Search from "./Search.svelte";
	import CardList from "./Cards.svelte";
	import Card from "./lib/components/CardProxy.svelte";

	let showcase, basics, reverse, holos, cosmos, amazings, radiant, basicGallery, 
			vee, veeUltra, veeAlt, veeMax, veeMaxAlt, veeStar, trainerHolo, rainbow, gold, veeGallery, shinyVault, sv8HighValue = [];

	let setFilter = '';
	let rarityFilter = '';
	let typeFilter = '';
	let query = "";
	let isLoading = true;
	let filteredCards = [];

	$: filteredCards = (window.cards || []).filter(card => {
		if (setFilter && card.set !== setFilter) return false;
		if (rarityFilter && !card.rarity?.toLowerCase().includes(rarityFilter.toLowerCase())) return false;
		if (typeFilter && !card.types?.includes(typeFilter)) return false;
		return true;
	});

	const getCards = async () => {
		let promiseArray = [];
		let cardFetch = await fetch("/data/cards.json");
		let cards = await cardFetch.json();
		return cards;
	};

	const loadCards = async() => {
		return getCards()
			.then(async (cards) => {
				window.cards = cards;
				showcase = cards[0];
				try {
					const sv8Fetch = await fetch("/data/sv8.json");
					const sv8 = await sv8Fetch.json();
					sv8HighValue = sv8;
				} catch (e) {
					console.warn('SV8 data unavailable:', e);
				}
			basics = filteredCards.slice(1, 4) || cards.slice(1, 4);
				reverse = filteredCards.filter(c => c.number >=4 && c.number <=76) || [...cards.slice(4, 7), ...cards.slice(70,76)];
				holos = cards.slice(7, 13);
				cosmos = cards.slice(13, 16);
				amazings = cards.slice(76, 85);
				radiant = cards.slice(16, 19);
				basicGallery = cards.slice(19, 22);
				vee = cards.slice(22, 25);
				veeUltra = cards.slice(25, 28);
				veeAlt = cards.slice(28, 34);
				veeMax = cards.slice(37, 40);
				veeMaxAlt = cards.slice(40, 43);
				veeStar = cards.slice(43, 46);
				trainerHolo = cards.slice(46, 52);
				rainbow = cards.slice(52, 58);
				gold = cards.slice(58, 64);
				veeGallery = cards.slice(64, 70);
				// SV8 already loaded above
				shinyVault = cards.slice(85,91);
				isLoading = false;
			});
	};

	onMount(() => {
		loadCards();
		const $headings = document.querySelectorAll("h1,h2,h3");
		const $anchor = [...$headings].filter((el) => {
			const id = el.getAttribute("id")?.replace(/^.*?-/g,"");
			const hash = window.location.hash?.replace(/^.*?-/g,"")
			return id === hash;
		})[0];
		if( $anchor ) {
			setTimeout(() => {
				$anchor.scrollIntoView();
			},100);
		}
	});
</script>

<main>
	<header>
		<h1 id="⚓-top">Pokemon karty <sup>V2</sup></h1>

		<p class="author">Vytvořeno <a href="https://www.kreativlab.cz"> Kreativlab</a>

		<section class="intro" id="⚓-intro">
			<p>
				
			</p>
		</section>

		<div class="showcase">
			{#if !showcase}
				loading...
			{:else}
				<Card
					id={showcase.id}
					name={showcase.name}
					set={showcase.set}
					number={showcase.number}
					types={showcase.types}
					supertype={showcase.supertype}
					subtypes={showcase.subtypes}
					rarity={showcase.rarity}
					isReverse={showcase.isReverse}
					showcase={true}
				/>
			{/if}
		</div>

		<section class="info">
			<h2>Klikni a prohlídni si kartu zblízka</h2>

			<hr />

			<p class="small">
			
					<br>
			</p>
		</section>
	</header>

	<Filter bind:setFilter bind:rarityFilter bind:typeFilter />
	<Search bind:query />

	{#if query.length < 3}

		<h2 id="⚓-common">
			<a href="#⚓-common">
				Běžné karty
			</a>
		</h2>
		<p>
			Běžné karty jsou základem každé sbírky. <br /> Tyto karty nemají žádný holo efekt, ale stále
			mají krásné umění a design. <br /> V této sekci jsou zobrazeny pouze základní karty, ale existují
			i holo verze těchto karet, které mají další efekty.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each basics as card, index}
					<Card
						id={card.id}
						name={card.name}
						img={card.images.large}
						number={card.number}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-reverse">
			<a href="#⚓-reverse">
				Reverse Holo non-rares
			</a>
		</h2>
		<p>
			Reverse Holo karty mají <mark>holo efekt pouze na pozadí karty</mark>, zatímco umění a text jsou
			ne-holo. Tento efekt se dosahuje pomocí <mark>gradientů a filtrů</mark> pro vytvoření holo efektu
			na pozadí, zatímco zůstává průhledný nad uměním a textem.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each reverse as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
						isReverse
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-holo">
			<a href="#⚓-holo">
				Holofoil Rare
			</a>
		</h2>
		<p>
			Holo karty mají <mark>holo efekt na umění a text</mark>, zatímco pozadí je ne-holo. Tento efekt se
			dosahuje pomocí <mark>gradientů a filtrů</mark> pro vytvoření holo efektu nad uměním a textem, zatímco
			zůstává průhledný na pozadí.
			<br>
			<br>
			Na rozdíl od Reverse Holo, kde je efekt pouze na pozadí, Holo karty mají efekt pouze na umění a textu.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each holos as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-galaxy">
			<a href="#⚓-galaxy">
				Galaxy/Cosmos Holofoil
			</a>
		</h2>
		<p>
			Galaxy/Cosmos karty mají <mark>holo efekt s galaxiemi a hvězdami</mark>, který se pohybuje, když
			otáčíte kartu. Tento efekt se dosahuje pomocí <mark>background image s hvězdami a galaxiemi</mark>,
			a <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
		</p>
		<h3>Kosmos holo foil</h3>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each cosmos as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-amazing">
			<a href="#⚓-amazing">
				Holofoil Amazing Rare
			</a>
		</h2>
		<p>
			Amazing Rare karty mají <mark>holo efekt s unikátním vzorem</mark>, který se pohybuje, když otáčíte
			kartu. Tento efekt se dosahuje pomocí <mark>background image s unikátním vzorem</mark>, a
			<mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each amazings as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-radiant">
			<a href="#⚓-radiant">
				Radiant Holofoil
			</a>
		</h2>
		<p>
			Nové Radiant karty mají <mark>holo efekt s kris-kros vzorem</mark>, který se pohybuje, když otáčíte kartu. Tento efekt se dosahuje pomocí <mark>background image s kris-kros vzorem</mark>, a <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each radiant as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-trainer-gallery-holo">
			<a href="#⚓-trainer-gallery-holo">
				Trainer Gallery Holofoil
			</a>
		</h2>
		<p>
			Trainer Gallery Holofoil karty mají <mark>holo efekt s unikátním vzorem</mark>, který se pohybuje, když otáčíte kartu. Tento efekt se dosahuje pomocí <mark>background image s unikátním vzorem</mark>, a <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných holo karet, které mají efekt pouze na umění a textu, Trainer Gallery Holofoil karty mají efekt pouze na pozadí karty.
			<br>
			<br>
			Také stojí za zmínku, že V a VMax karty v Trainer Gallery mají podobný efekt jako normální V a VMax karty, ale s jinou texturou pozadí.
			<br>
			<br>
			Zde jsou zobrazeny pouze non-rare holo verze, ale existují i reverse holo verze těchto karet, které mají další efekty.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each basicGallery as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-v">
			<a href="#⚓-v">
				Pokemon V
			</a>
		</h2>
		<p>
			V karty mají <mark>diagonální holografický efekt</mark>, který se zdá, že se pohybuje v opačných směrech, když nakloníte kartu do světla.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each vee as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-v-full-art">
			<a href="#⚓-v-full-art">
				Pokemon V <sup>(Full Art)</sup>
			</a>
		</h2>
		<p>
			Ultra Rare (Full Art) karty mají <mark>diagonální holografický efekt</mark>, který se zdá, že se pohybuje v opačných směrech, když nakloníte kartu do světla. Tento efekt se dosahuje pomocí <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných V karet, které mají efekt pouze na pozadí, Ultra Rare (Full Art) karty mají efekt pouze na umění a textu.
			<br>
			<br>
		</p>
		<p>
			Na některých kartách V a Ultra Rare (Full Art) se také objevuje <mark>texturovaný vzor</mark> v pozadí, který se pohybuje s holografickým efektem. Tento vzor se dosahuje pomocí <mark>background image s texturou</mark>, která se pohybuje spolu s gradienty a filtry pro vytvoření pohybu v efektu, když otáčíte kartu.
			<br>
			<br>
			Také stojí za zmínku, že existují některé karty V a Ultra Rare (Full Art) s alternativním uměním, které mají stejný holografický efekt, ale s jiným uměním a texturou pozadí.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each veeUltra as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-v-alternate-art">
			<a href="#⚓-v-alternate-art">
				Pokemon V <sup>(Alternate Art)</sup>
			</a>
		</h2>
		<p>
			Some V karty mají <mark>diagonální holografický efekt</mark>, který se zdá, že se pohybuje v opačných směrech, když nakloníte kartu do světla, stejně jako běžné V karty. Tento efekt se dosahuje pomocí <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných V karet, které mají efekt pouze na pozadí, tyto Alternate Art V karty mají efekt pouze na umění a textu.

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each veeAlt as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-v-max">
			<a href="#⚓-v-max">
				VMax
			</a>
		</h2>
		<p>
			VMax karty mají <mark>diagonální holografický efekt</mark>, který se zdá, že se pohybuje v opačných směrech, když nakloníte kartu do světla, stejně jako běžné V karty. Tento efekt se dosahuje pomocí <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných V karet, které mají efekt pouze na pozadí, VMax karty mají efekt pouze na umění a textu.
			<br>
			<br>
			Také stojí za zmínku, že existují některé karty VMax s alternativním uměním, které mají stejný holografický efekt, ale s jiným uměním a texturou pozadí.	
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each veeMax as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-v-max-alternate">
			<a href="#⚓-v-max-alternate">
				VMax <sup>(Alternate/Rainbow)</sup>
			</a>
		</h2>
		<p>
			Some VMax karty mají <mark>diagonální holografický efekt</mark>, který se zdá, že se pohybuje v opačných směrech, když nakloníte kartu do světla, stejně jako běžné V karty. Tento efekt se dosahuje pomocí <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných V karet, které mají efekt pouze na pozadí, tyto Alternate/Rainbow VMax karty mají efekt pouze na umění a textu.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each veeMaxAlt as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-v-star">
			<a href="#⚓-v-star">
				VStar
			</a>
		</h2>
		<p>
			VStar karty mají <mark>diagonální holografický efekt</mark>, který se zdá, že se pohybuje v opačných směrech, když nakloníte kartu do světla, stejně jako běžné V karty. Tento efekt se dosahuje pomocí <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných V karet, které mají efekt pouze na pozadí, VStar karty mají efekt pouze na umění a textu.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each veeStar as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-trainer-full-art">
			<a href="#⚓-trainer-full-art">
				Trainer Holo <sup>(Full Art / Trainer Gallery)</sup>
			</a>
		</h2>
		<p>
			Trainer Gallery Holofoil karty mají <mark>holo efekt s unikátním vzorem</mark>, který se pohybuje, když otáčíte kartu. Tento efekt se dosahuje pomocí <mark>background image s unikátním vzorem</mark>, a <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných holo karet, které mají efekt pouze na umění a textu, Trainer Gallery Holofoil karty mají efekt pouze na pozadí karty.
			<br>
			<br>
			Také stojí za zmínku, že V a VMax karty v Trainer Gallery mají podobný efekt jako normální V a VMax karty, ale s jinou texturou pozadí.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each trainerHolo as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-rainbow-rare">
			<a href="#⚓-rainbow-rare">
				Rainbow Rare <sup>(VMax, VStar)</sup>
			</a>
		</h2>
		<p>
			Rainbow Rare karty mají <mark>holo efekt s duhovými barvami</mark>, který se pohybuje, když otáčíte kartu. Tento efekt se dosahuje pomocí <mark>background image s duhovými barvami</mark>, a <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných V karet, které mají efekt pouze na pozadí, Rainbow Rare karty mají efekt pouze na umění a textu.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each rainbow as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-secret-rare">
			<a href="#⚓-secret-rare">
				Secret Rare <sup>(Gold)</sup>
			</a>
		</h2>
		<p>
			Secret Rare karty, často označované jako "Gold" nebo Zlaté karty, mají <mark>holo efekt s zlatou barvou</mark>, který se pohybuje, když otáčíte kartu. Tento efekt se dosahuje pomocí <mark>background image s zlatou barvou</mark>, a <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných karet, které mají efekt pouze na pozadí, Secret Rare karty mají efekt pouze na umění a textu.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each gold as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-trainer-gallery-v">
			<a href="#⚓-trainer-gallery-v">
				Trainer Gallery <sup>(V / VMax)</sup>
			</a>
		</h2>
		<p>
			Trainer Gallery V a VMax karty mají <mark>diagonální holografický efekt</mark>, který se zdá, že se pohybuje v opačných směrech, když nakloníte kartu do světla, stejně jako běžné V a VMax karty. Tento efekt se dosahuje pomocí <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných V a VMax karet, které mají efekt pouze na pozadí, tyto Trainer Gallery V a VMax karty mají efekt pouze na umění a textu.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each veeGallery as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-shiny-vault">
			<a href="#⚓-shiny-vault">
				Shiny Vault <sup>(Basic / Stage 1 / V / VMax)</sup>
			</a>
		</h2>
		<p>
			Shiny Vault karty mají <mark>holo efekt s unikátním vzorem</mark>, který se pohybuje, když otáčíte kartu. Tento efekt se dosahuje pomocí <mark>background image s unikátním vzorem</mark>, a <mark>gradientů a filtrů pro vytvoření pohybu</mark> v efektu, když otáčíte kartu.
			<br>
			<br>
			Na rozdíl od běžných holo karet, které mají efekt pouze na umění a textu, Shiny Vault karty mají efekt pouze na pozadí karty.
		</p>

		<CardList>
			{#if isLoading}
				loading...
			{:else}
				{#each shinyVault as card, index}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{/if}
		</CardList>

		<h2 id="⚓-sv8">
			<a href="#⚓-sv8">
				SV8 Phantasmal Flames (High Value)
			</a>
		</h2>
		<p>
			Nová kategorie SV8 z japonského setu Phantasmal Flames - high value rarities (SIR, IR, Hyper, UR).
		</p>

		<CardList>
			{#if sv8HighValue?.length > 0}
				{#each sv8HighValue as card}
					<Card
						id={card.id}
						name={card.name}
						number={card.number}
						set={card.set}
						types={card.types}
						supertype={card.supertype}
						subtypes={card.subtypes}
						rarity={card.rarity}
					/>
				{/each}
			{:else}
				<p>SV8 high-value cards loading or unavailable.</p>
			{/if}
		</CardList>

	{/if}
</main>

<div class="back-to-top">
  <a href="#⚓-top">Zpět</a>
</div>

<style>
  .back-to-top a {
    color: inherit;
    text-decoration: none;
		z-index: 999;
  }
</style>
