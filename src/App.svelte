<script>
  import Drawer, {AppContent, Content, Header, Title, Subtitle, Scrim} from '@smui/drawer';
  import List, {Item, Text, Separator, Subheader} from '@smui/list';
	import H6 from '@smui/common/H6.svelte';
	import {Icon} from '@smui/button';

	import Sidebar from './components/Sidebar.svelte';
	import NoteEditor from './components/NoteEditor.svelte';

	let textContent = "";

	function addNote(){
		textContent = "HALLO WELT!";
	}

</script>

<div class="drawer-container">
	<Drawer class="app-drawer">
		<Header>
			<Title>Notes App</Title>
			<Subtitle>Take Notes - The easy way!</Subtitle>
		</Header>
		<Content>
			<Item href="javascript:void(0)" on:click={addNote}>
				<Icon class="material-icons ico">add</Icon>
				<Text class="txt">Add</Text>
			</Item>
			<Separator nav/>
			<List>
				<Sidebar></Sidebar>

				<Separator nav />
				<Subheader component={H6}>Starred</Subheader>
			</List>
		</Content>
		<div class="numCount">Charachter Count: {textContent.length}</div>
	</Drawer>

	<AppContent class="app-app-content">
		<main class="app-main-content">
			<NoteEditor bind:textContent={textContent}></NoteEditor>
		</main>
	</AppContent>
</div>

<style>

* :global(.ico){
	float:left;
	margin-right:30px;
	color: #00FF00;
}
* :global(.txt){
	float:left;
	margin-right:10px;
	color: #00FF00;
}
</style>