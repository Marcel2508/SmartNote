<script>
  import Drawer, {AppContent, Content, Header, Title, Subtitle, Scrim} from '@smui/drawer';
  import List, {Item, Text, Separator, Subheader} from '@smui/list';
	import H6 from '@smui/common/H6.svelte';
	import {Icon} from '@smui/button';
	import Menu from '@smui/menu';

	import {onMount} from 'svelte';

	import Sidebar from './components/Sidebar.svelte';
	import NoteEditor from './components/NoteEditor.svelte';

	import FileEntry from './fileEntry.js';
	import uniqId from './uniqId.js';

	let addMenu;

	export let appVersion;

	let textContent = "";
	let fileName = "new file";
	let appData={};
	let fileTree = [];
	let selectedFile = null;

	function addNote(){
		//Create and initiate a new Node!
		const f = new FileEntry({id:uniqId(),name:"undefined",type:2,parent:"#"});
		fileTree.push(f);
		textContent = "";
		fileName = "undefined";
		selectedFile = f;
		fileTree = fileTree;
	}

	function addFolder(){
		fileTree.push(new FileEntry({id:uniqId(),name:"New Folder",type:1,parent:"#"}));
		fileTree = fileTree;
	}

	function loadLicense(){
		fetch("/license-notice.md").then(x=>x.text()).then((licenseNotes)=>{
			textContent=licenseNotes;
			fileName = "LICENSE_NOTICE";
			selectedFile=null;
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
				"fileTree":[]
			};
			localStorage.setItem("smartnote",JSON.stringify(appData));
		}else{
			appData = JSON.parse(localStorage.getItem("smartnote"));
			if(appData.version != appVersion)
				alert("Invalid App-Version!");

			fileTree = appData.fileTree;
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
			<div style="min-width:100%;">
				<Item href="javascript:void(0)" on:click={()=>addMenu.setOpen(true)}>
					<Icon class="material-icons ico">add</Icon>
					<Text class="txt">Add</Text>
				</Item>
				<Menu bind:this={addMenu}>
					<List>
						<Item on:SMUI:action={addNote}>
							<Icon class="material-icons" style="padding-right:5px;">note_add</Icon>
							<Text>Note</Text>
						</Item>
						<Item on:SMUI:action={addFolder}>
							<Icon class="material-icons" style="padding-right:5px;">folder</Icon>
							<Text>Folder</Text>
						</Item>
					</List>
				</Menu>
			</div>
			<Separator nav/>
			<List>
				<Sidebar files={fileTree}></Sidebar>

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