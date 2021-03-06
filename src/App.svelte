<script>
  import Drawer, {AppContent, Content, Header, Title, Subtitle, Scrim} from '@smui/drawer';
  import List, {Item, Text, Separator, Subheader} from '@smui/list';
	import H6 from '@smui/common/H6.svelte';
	import {Icon} from '@smui/button';
	import Menu from '@smui/menu';

	import {onMount} from 'svelte';

	import Sidebar, {selectEntry} from './components/Sidebar.svelte';
	import NoteEditor from './components/NoteEditor.svelte';

	import FileEntry from './fileEntry.js';
	import uniqId from './uniqId.js';

	let addMenu;

	export let appVersion;

	let appData={};
	let fileTree = [];
	let selectedFile = null;

	let fileName="";
	let isStarred;
	let initiated = false;
	let valueHasChanged = false;

	$: fileTree, initiated && saveFileTree();

	$: starredNotes = fileTree.filter(x=>x.starred);

	//For loading URLs
	function parseUrl(){
		try{
			let r = {};
			if(location.search && location.search.length)
				location.search.substr(1).split("&").forEach(x=>{const k = x.split("=");r[k[0]]=k[1];});
			return r;
		}catch(ex){
			console.error(ex);
			console.error("Cannot parse Parameters!");
			return {};
		}
	}


	function addNote(){
		//Create and initiate a new Node!
		const f = new FileEntry({id:uniqId(),name:"New Note",type:2,parent:"#",starred:false});
		fileTree.push(f);
		if(!valueHasChanged){
			selectedFile = f.id;
			isStarred=f.starred;
			selectFileEntry(f.id);
		}
		fileTree = fileTree;
	}

	function selectFileEntry(id){
		setTimeout(_=>selectEntry(id),1);
	}

	function addFolder(){
		fileTree.push(new FileEntry({id:uniqId(),name:"New Folder",type:1,parent:"#"}));
		fileTree = fileTree;
	}

	function loadLicense(){
		selectedFile="LICENSE_NOTE";
		fileName="LICENSE_NOTE";
		selectFileEntry("#");
	}

	function initApp(){
		//Load LocalStorage Data
		const fileConfig = localStorage.getItem("smartnote");
		if(fileConfig==null){
			//Bootstrap Data
			appData = {
				"created":new Date(),
				"version":appVersion,
				"lastChange":new Date(),
				"fileTree":[]
			};
			localStorage.setItem("smartnote",JSON.stringify(appData));
		}else{
			appData = JSON.parse(localStorage.getItem("smartnote"));
			if(appData.version != appVersion)
				alert("Invalid App-Version!");

			fileTree = appData.fileTree.map(k=>new FileEntry(k));
			console.log("Loaded From Storage");
			console.log(appData);
		}
		initiated=true;

		const urlArgs = parseUrl();
		if(urlArgs.hasOwnProperty("note")){
			if(fileTree.find(x=>x.id==urlArgs.note))//Check if Node already deleted
				nodeSelect({detail:{nodeId:urlArgs.note}},true);
		}
	}


	function nodeSelect(evt,force){
		if(evt.detail.nodeId==undefined)return;
		if(valueHasChanged && selectedFile != evt.detail.nodeId){
			if(!confirm("Are you sure you want to close without saving?")){
				selectFileEntry(selectedFile);
				return;
			}
		}	

		selectedFile = evt.detail.nodeId;
		const f = fileTree.find(x=>x.id==evt.detail.nodeId);
		if(f)
			fileName = f.name;
		isStarred = f.starred;
		if(force)selectFileEntry(evt.detail.nodeId);
	}

	function updateFilenameFromEditor(evt){
		const f = fileTree.find(x=>x.id==selectedFile);
		if(!f)return;
		f.updateName(evt.detail.newName);
		fileTree=fileTree;
	}

	function deleteCurrentFile(){
		if(!(selectedFile==null || selectedFile=="LICENSE_NOTE")){
			const f = fileTree.find(x=>x.id==selectedFile);
			if(!f)return;
			localStorage.removeItem(selectedFile);
			const idx = fileTree.indexOf(f);
			if(idx!=-1)fileTree.splice(idx,1);
			fileTree=fileTree;
			selectedFile=null;
			fileName="";
			isStarred=false;
			valueHasChanged=false;
		}
	}

	function nodeDeleteHandler(evt){
		const id = evt.detail.id;
		const foundEntry = fileTree.find(x=>x.id==id);
		if(foundEntry.isDirectory){
			//Travers tree to delete all children!
			//deleteFolder(foundEntry);
			deleteFolder(foundEntry);
			fileTree=fileTree;
		}else{
			localStorage.removeItem(foundEntry);
			fileTree.splice(fileTree.indexOf(foundEntry),1);
			fileTree=fileTree;
			if(id==selectedFile){
				selectedFile=null;
				fileName="";
				valueHasChanged=false;
			}
		}
	}

	function deleteFolder(entry){
		//TODO: Check for asynchronous timing problems!
		fileTree.filter(x=>x.parent==entry.id).forEach(x=>{
			if(x.isDirectory){
				deleteFolder(x);
			}else{
				localStorage.removeItem(x);
			}
			fileTree.splice(fileTree.indexOf(x),1);
			if(x.id==selectedFile){
				selectedFile=null;
				fileName="";
				valueHasChanged=false;
			}
		});
		fileTree.splice(fileTree.indexOf(entry),1);
		if(entry.id==selectedFile){
			selectedFile=null;
			fileName="";
			valueHasChanged=false;
		}
	}

	onMount(initApp);


	function saveFileTree(){
		appData.lastChange=new Date();
		appData.fileTree = fileTree.map(x=>x.asObject);
		localStorage.setItem("smartnote",JSON.stringify(appData));
	}

	function nodeMoved(){
		saveFileTree();
	}

	function nodeRenamed(){
		saveFileTree();
	}

	function toggleNoteStarred(){
		const f = fileTree.find(x=>x.id==selectedFile);
		if(f){
			f.starred=!f.starred;
		}
		fileTree=fileTree;
	}

	//Mobile
	let isSmall = false;
	let mobileMenuOpen=false;	
	let menuDrawer;
	function recalcScreenSize(){
		if(window.innerWidth<680)isSmall=true;
		else isSmall=false;
		mobileMenuOpen=false;
	}
	window.onresize = recalcScreenSize;
	recalcScreenSize();

	function dialogClickCheck(){
		if(isSmall&&mobileMenuOpen)mobileMenuOpen=false;
	}

</script>

<div class="drawer-container">
	<Drawer class="app-drawer" variant={isSmall?'dismissible':''} bind:this={menuDrawer} bind:open={mobileMenuOpen}>
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
				<Sidebar files={fileTree} {selectedFile} on:nodeSelect={nodeSelect} on:nodeDelete={nodeDeleteHandler} on:nodeMove={nodeMoved} on:nodeRename={nodeRenamed}></Sidebar>

				<Separator nav />
				<Subheader component={H6}>Starred</Subheader>
				{#each starredNotes as note}
					<Item href="javascript:void(0)" on:click={_=>nodeSelect({detail:{nodeId:note.id}},true)}>
						<Icon class="material-icons ico">star</Icon>
						<Text class="txt">{note.name}</Text>
					</Item>
				{/each}
			</List>
		</Content>
		<div class="numCount">
			<a on:click={loadLicense} href="javascript:void(0);" style="font-family:sans-serif;">Third Party Libraries</a>
		</div>
	</Drawer>

	<AppContent class="app-app-content" on:click={dialogClickCheck}>
		<main class="app-main-content">
			<NoteEditor fileName={fileName} fileId={selectedFile} on:nameChange={updateFilenameFromEditor} on:deleteFile={deleteCurrentFile} {isStarred} on:starNote={toggleNoteStarred} bind:valueHasChanged={valueHasChanged} on:openSidebarClick={_=>mobileMenuOpen=!mobileMenuOpen}></NoteEditor>
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