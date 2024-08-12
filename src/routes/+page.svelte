<script lang="ts">
	import { faker } from '@faker-js/faker';
	import { onMount } from 'svelte';
	import type {Channel, CurrentChannel} from '../types/types'
    import type { PageServerData } from './$types';
    export let data: PageServerData;
	// Components
	import { Avatar, CodeBlock, RadioItem, RadioGroup, ProgressRadial} from '@skeletonlabs/skeleton';
	import { PaneGroup, Pane, PaneResizer } from "paneforge";
	import Layout from './+layout.svelte';
	
	// Types
	interface Person {
		id: number;
		avatar: number;
		name: string;
	}
	interface MessageFeed {
		id: number;
		host: boolean;
		avatar: number;
		name: string;
		timestamp: string;
		message: string;
		color: string;
	}

	let elemChat: HTMLElement;
	const lorem = faker.lorem.paragraph();

	// Navigation List
	const people: Person[] = [
		{ id: 0, avatar: 14, name: 'Michael' },
		{ id: 1, avatar: 40, name: 'Janet' },
		{ id: 2, avatar: 31, name: 'Susan' },
		{ id: 3, avatar: 56, name: 'Joey' },
		{ id: 4, avatar: 24, name: 'Lara' },
		{ id: 5, avatar: 9, name: 'Melissa' },
		{ id: 6, avatar: 31, name: 'Susan' },
		{ id: 7, avatar: 56, name: 'Joey' },
		{ id: 8, avatar: 24, name: 'Lara' },
		{ id: 9, avatar: 9, name: 'Melissa' },
		{ id: 10, avatar: 14, name: 'Michael' },
		{ id: 11, avatar: 40, name: 'Janet' },
		{ id: 12, avatar: 31, name: 'Susan' },
		{ id: 13, avatar: 56, name: 'Joey' },
		{ id: 14, avatar: 24, name: 'Lara' },
		{ id: 15, avatar: 9, name: 'Melissa' },
		{ id: 16, avatar: 31, name: 'Susan' },
		{ id: 17, avatar: 56, name: 'Joey' },
		{ id: 18, avatar: 24, name: 'Lara' },
		{ id: 19, avatar: 9, name: 'Melissa' }
	];
	

	// Messages
	let messageFeed: MessageFeed[] = [
		{
			id: 0,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: 'Yesterday @ 2:30pm',
			message: lorem,
			color: 'variant-soft-primary'
		},
		{
			id: 1,
			host: false,
			avatar: 14,
			name: 'Michael',
			timestamp: 'Yesterday @ 2:45pm',
			message: lorem,
			color: 'variant-soft-primary'
		},
		{
			id: 2,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: 'Yesterday @ 2:50pm',
			message: lorem,
			color: 'variant-soft-primary'
		},
		{
			id: 3,
			host: false,
			avatar: 14,
			name: 'Michael',
			timestamp: 'Yesterday @ 2:52pm',
			message: lorem,
			color: 'variant-soft-primary'
		}
	];
	let currentMessage = '';

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}

	function addMessage(): void {
		const newMessage = {
			id: messageFeed.length,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: `Today @ ${getCurrentTimestamp()}`,
			message: currentMessage,
			color: 'variant-soft-primary'
		};
		// Update the message feed
		messageFeed = [...messageFeed, newMessage];
		// Clear prompt
		currentMessage = '';
		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}

	// When DOM mounted, scroll to bottom
	onMount(() => {
		scrollChatBottom();
	});
	let leftSize = 30;
	let rightSize = 70;
	let searchType = 0;

	let channelDataSorted = data.channelData.sort((a: Channel, b: Channel) => (a.name > b.name ? 1 : -1))
	
	let currentChannel: CurrentChannel = {
		id: channelDataSorted[0].id,
		name: channelDataSorted[0].name,
		topic: channelDataSorted[0].topic.value,
		purpose: channelDataSorted[0].purpose.value
	}
	
	function selectChannel(id: string): void {
		let currentChannelData = channelDataSorted.filter((a: Channel) => (a.id === id))[0]
		currentChannel = {
			id: id,
			name: currentChannelData.name,
			topic: currentChannelData.topic.value,
			purpose: currentChannelData.purpose.value
		}
	}

	let showSelectedChannelDetails: boolean = true;

</script>


<section class="card">
	<PaneGroup direction="horizontal" class="chat w-[100vw] h-[100vh] grid grid-cols-1 lg:grid-cols-[30%_1fr]">
		<!-- Navigation -->
		<Pane defaultSize={leftSize} class="hidden max-h-[100vh] lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
			<!-- Header -->
			 
			<header class="border-b border-surface-500/30 p-4 flex flex-col justify-between gap-2">
				<input class="input" type="search" placeholder="Search Channels..." />
				<RadioGroup class="p-0" active="variant-filled-primary" hover="hover:variant-soft-primary">
					<RadioItem bind:group={searchType} name="searchType" value={0}><small>Current Channel</small></RadioItem>
					<RadioItem bind:group={searchType} name="searchType" value={1}><small>All Channels</small></RadioItem>
				</RadioGroup>

					<div class="relative card px-4 pt-0 pb-2 flex flex-col variant-soft rounded space-y-2">
						<button class="badge-icon variant-soft-primary absolute top-2 right-2 z-10"
							on:click={() => (showSelectedChannelDetails = !showSelectedChannelDetails)}>
							{showSelectedChannelDetails ? '-':'+'}
						</button>
					
						<small><b>{currentChannel.name}</b></small>
						{#if showSelectedChannelDetails}
						
						<small>Topic: <span class="opacity-50">{currentChannel.topic}</span></small>
						
						<small>Purpose: <span class="opacity-50">{currentChannel.purpose}</span></small>
						{/if}
						
					</div>
					<input class="h-8 rounded-lg variant-soft-secondary " type="search" placeholder="Filter..." />

			</header>

			<!-- Sidebar -->
			<div class="p-4 max-h-[90vh] space-y-4 overflow-y-auto overflow-x-auto ">
	
				<div class="flex flex-col items-start space-y-1 w-auto">
					{#each channelDataSorted as channel}
				
						<button
							type="button"
							class="btn w-fit flex justify-start {channel.id === currentChannel.id ? 'variant-filled-primary':'bg-surface-hover-token'}"
							on:click={() => (selectChannel(channel.id))}
						>
							<Avatar  width="w-8" background="bg-secondary-500">
								{channel.name.slice(0,1)}
							</Avatar>
							<medium>{channel.name}</medium>
					</button>
				
						
					{/each}
				</div>
			</div>
			<!-- Footer -->
			<!-- <footer class="border-t border-surface-500/30 p-4">(footer)</footer> -->
		</Pane>
		<PaneResizer class="relative flex w-2 items-center justify-center bg-background"></PaneResizer>
	
		<!-- Chat -->
		<Pane defaultSize={rightSize} class="grid grid-row-[1fr_auto] max-h-[100vh]">
			
			<!-- Conversation -->
			<section bind:this={elemChat} class="max-h-[90vh] p-4 overflow-y-auto space-y-4">
				{#each messageFeed as bubble}
					{#if bubble.host === true}
						<div class="grid grid-cols-[auto_1fr] gap-2">
							<Avatar  width="w-12" background="bg-secondary-500">
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36" {...$$props}>
									<path fill="#ccd6dd" d="M34 16C34 6 26.837 0 18 0C9.164 0 2 6 2 16c0 5.574.002 10.388 6 12.64V33a3 3 0 1 0 6 0v-3.155c.324.027.659.05 1 .07V33a3 3 0 1 0 6 0v-3.085c.342-.021.676-.043 1-.07V33a3 3 0 0 0 6 0v-4.36c5.998-2.252 6-7.066 6-12.64" />
									<circle cx="11" cy="14" r="5" fill="#292f33" />
									<circle cx="25" cy="14" r="5" fill="#292f33" />
									<path fill="#292f33" d="M19.903 23.062C19.651 22.449 18.9 22 18 22s-1.652.449-1.903 1.062A1.494 1.494 0 0 0 15 24.5a1.5 1.5 0 0 0 1.5 1.5c.655 0 1.206-.422 1.41-1.007c.03.001.059.007.09.007s.06-.006.09-.007a1.496 1.496 0 1 0 1.813-1.931" />
								</svg>
							</Avatar>
							<div class="card p-4 variant-soft rounded-tl-none space-y-2">
								<header class="flex justify-between items-center">
									<p class="font-bold">{bubble.name}</p>
									<small class="opacity-50">{bubble.timestamp}</small>
								</header>
								<p>{bubble.message}</p>
							</div>
						</div>
					{:else}
						<div class="grid grid-cols-[1fr_auto] gap-2">
							<div class="card p-4 rounded-tr-none space-y-2 {bubble.color}">
								<header class="flex justify-between items-center">
									<p class="font-bold">{bubble.name}</p>
									<small class="opacity-50">{bubble.timestamp}</small>
								</header>
								<p>{bubble.message}</p>
							</div>
							<Avatar  width="w-12" background="bg-secondary-500">
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36" {...$$props}>
									<path fill="#ccd6dd" d="M34 16C34 6 26.837 0 18 0C9.164 0 2 6 2 16c0 5.574.002 10.388 6 12.64V33a3 3 0 1 0 6 0v-3.155c.324.027.659.05 1 .07V33a3 3 0 1 0 6 0v-3.085c.342-.021.676-.043 1-.07V33a3 3 0 0 0 6 0v-4.36c5.998-2.252 6-7.066 6-12.64" />
									<circle cx="11" cy="14" r="5" fill="#292f33" />
									<circle cx="25" cy="14" r="5" fill="#292f33" />
									<path fill="#292f33" d="M19.903 23.062C19.651 22.449 18.9 22 18 22s-1.652.449-1.903 1.062A1.494 1.494 0 0 0 15 24.5a1.5 1.5 0 0 0 1.5 1.5c.655 0 1.206-.422 1.41-1.007c.03.001.059.007.09.007s.06-.006.09-.007a1.496 1.496 0 1 0 1.813-1.931" />
								</svg>
							</Avatar>
						</div>
					{/if}
				{/each}
			</section>
		</Pane>
	</PaneGroup>
</section>
	