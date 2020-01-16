<script>
  import Drawer, {AppContent, Content, Header, Title, Subtitle, Scrim} from '@smui/drawer';
  import List, {Item, Text, Separator, Subheader} from '@smui/list';
	import H6 from '@smui/common/H6.svelte';
	import {Icon} from '@smui/button';

	import {onMount} from 'svelte';

	import Sidebar from './components/Sidebar.svelte';
	import NoteEditor from './components/NoteEditor.svelte';

	export let appVersion;

	let textContent = "";
	let fileName = "new file";
	let appData={};

	function addNote(){
		textContent = "HALLO WELT!";
	}

	function loadLicense(){
		fetch("/license-notice.md").then(x=>x.text()).then((licenseNotes)=>{
			textContent=licenseNotes;
		}).catch(ex=>{
			alert("Error loading License Info!");
		})
	}

	function initApp(){
		//Load LocalStorage Data
		const fileConfig = localStorage.getItem("smartnote");
		if(fileConfig==null){
			//Bootstrap Data
			appData = {
				"created":new Date(),
				"version":appVersion,
				"fileTree":{}
			};
			localStorage.setItem("smartnote",JSON.stringify(appData));
		}else{
			appData = JSON.parse(localStorage.getItem("smartnote"));
			if(appData.version != appVersion)
				alert("Invalid App-Version!");
			console.log("Loaded From Storage");
			console.log(appData);
		}
	}

	onMount(initApp);

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
		<div class="numCount">
			<a on:click={loadLicense} href="javascript:void(0);" style="font-family:sans-serif;">Third party Libraries</a>
		</div>
	</Drawer>

	<AppContent class="app-app-content">
		<main class="app-main-content">
			<NoteEditor bind:textContent={textContent} fileName={fileName}></NoteEditor>
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