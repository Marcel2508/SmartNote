<script>

  import MarkdownCode from './MarkdownCode.svelte';
  import { createEventDispatcher } from 'svelte';
  import Fab, {Icon} from '@smui/fab';
  import Button, {Label} from '@smui/button';

  import Tutorial from './Tutorial.svelte';

  import PrintDocument from '../print.js';

	const dispatch = createEventDispatcher();

  export let fileName="unnamed";
  export let fileId=null;
  export let isStarred;

  let textContent="";

  let nameHasChanged = false;
  export let valueHasChanged = false;

  let syntaxTo;

  $: fileId, loadContent();

  function loadContent(){
    nameHasChanged=false;
    valueHasChanged=false;
    if(fileId==="LICENSE_NOTE"){
      //SPECIAL CASE - NO ACTUAL FILE!
      fetch("/license-notice.md").then(x=>x.text()).then((licenseNotes)=>{
        textContent=licenseNotes;
      }).catch(ex=>{
        console.error(ex);
        alert("Error loading License Info!");
      })
    }else{
      const fc = localStorage.getItem(fileId);
      if(fc==null)textContent="";
      else textContent=fc;
    }
    //Set URL
    if(history && history.replaceState && fileId!=null)
      history.replaceState(null,fileName,"?note="+fileId);
  }

  function getMarkdown(x){
    //wait
    clearTimeout(syntaxTo);
    syntaxTo = setTimeout(_=>{
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
    },30);
    return DOMPurify.sanitize(marked(x));
  }

  function updateFilename(){
    if(nameHasChanged==false)
      return jQuery("#nameInp").focus();
    
    nameHasChanged=false;
    dispatch("nameChange",{
      newName:fileName
    });
  }

  function deleteFile(){
    if(confirm("Are you sure?")){
      //localStorage.removeItem(fileId);
      dispatch("deleteFile");
    }
  }

  function nameChanged(){
    nameHasChanged = true;
  }

  function textChange(){
    valueHasChanged = true;
  }

  function saveValue(){
    valueHasChanged=false;
    dispatch("save");
  }

  function saveFile(){
    valueHasChanged = false;
    localStorage.setItem(fileId,textContent);
    dispatch("contentSave",{
      newContent:textContent
    });
  }
  
  function starNote(){
    dispatch("starNote");
  }

  function doPrint(){
    PrintDocument(fileName,getMarkdown(textContent));
  }

</script>
<div class="editorHalf {fileId==null?'invisible':''}">
  <div class="fileSettingsBar">
    <!--<div style="float:left;line-height:29px;padding-left:5px;font-size:13px;">{filePrefix}</div>-->
    <input type="text" bind:value={fileName} placeholder="Filename" on:input={nameChanged} id="nameInp">
    <Fab mini class="fab-btn {nameHasChanged?'':'disabled'}" on:click={updateFilename}><Icon class="material-icons">{nameHasChanged?"check":"edit"}</Icon></Fab>
    <Fab mini class="fab-btn star" on:click={starNote}><Icon class="material-icons">{isStarred?"star":"star_border"}</Icon></Fab>
    <Fab mini class="fab-btn del" on:click={deleteFile}><Icon class="material-icons">delete</Icon></Fab>
    <Button class="save-btn" color="secondary">
      <Label class="save-text {valueHasChanged?'':'disabled'}" on:click={saveFile}>Save</Label>
    </Button>
  </div>
  <MarkdownCode bind:value={textContent} on:change={textChange}></MarkdownCode>
</div>
  <Tutorial hidden={fileId==null?false:true}></Tutorial>
<div class="CodePreview">
<div class="fileSettingsBar right">
  <span class="previewText">Preview:</span>
  <Fab mini class="fab-btn del print" on:click={doPrint}><Icon class="material-icons">print</Icon></Fab>
</div>
<div class="inner">{@html getMarkdown(textContent)}</div>
</div>