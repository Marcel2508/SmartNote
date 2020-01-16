<script>

  import MarkdownCode from './MarkdownCode.svelte';
  import { createEventDispatcher } from 'svelte';
  import Fab, {Icon} from '@smui/fab';
  import Button, {Label} from '@smui/button';

	const dispatch = createEventDispatcher();

  export let textContent="";
  export let fileName="unnamed";
  export let filePrefix="/";

  //Used to detect wether this change came from my Parent node, or myself
  let internalTextContent=textContent;
  let internalChange = false;

  let nameHasChanged = false;
  let valueHasChanged = false;

  $: if(textContent != internalTextContent){
    internalTextContent = textContent;
    if(!internalChange){
      nameHasChanged = false;
      valueHasChanged = false;
    }
    internalChange = false;
  }

  let syntaxTo;
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
      dispatch("delete");
    }
  }

  function nameChanged(){
    nameHasChanged = true;
  }

  function textChange(){
    internalTextContent=textContent;
    internalChange = true;
    valueHasChanged = true;
  }

  function saveValue(){
    valueHasChanged=false;
    dispatch("save");
  }

  function saveFile(){

    valueHasChanged = false;
    dispatch("contentSave",{
      newContent:textContent
    });
  }

</script>
<div class="editorHalf">
  <div class="fileSettingsBar">
    <div style="float:left;line-height:29px;padding-left:5px;font-size:13px;">{filePrefix}</div>
    <input type="text" bind:value={fileName} placeholder="Filename" on:input={nameChanged} id="nameInp">
    <Fab mini class="fab-btn {nameHasChanged?'':'disabled'}" on:click={updateFilename}><Icon class="material-icons">{nameHasChanged?"check":"edit"}</Icon></Fab>
    <Fab mini class="fab-btn del" on:click={deleteFile}><Icon class="material-icons">delete</Icon></Fab>
    <Button class="save-btn" color="secondary">
      <Label class="save-text {valueHasChanged?'':'disabled'}" on:click={saveFile}>Save</Label>
    </Button>
  </div>
  <MarkdownCode bind:value={textContent} on:change={textChange}></MarkdownCode>
</div>
<div class="CodePreview">
{@html getMarkdown(textContent)}
</div>