<script>
  import {onMount} from 'svelte';

  import {convertFileArray} from '../fileEntry.js';

  export let files=[];

  let initiated=false;

  $: if(files && true){
    if(initiated){
      jQuery("#fileTree").jstree(true).settings.core.data = files;
      jQuery("#fileTree").jstree(true).refresh();
      console.log("CHANGE X");
    }
  }

  function initTree(){
    const el = jQuery("#fileTree");
    el.jstree({
      plugins:["wholerow","dnd","conditionalselect","contextmenu"],
      core:{
        multiple:false,
        data:files,
        check_callback:(operation,node,node_parent)=>{
          if(operation=="move_node"){
            if(node_parent.id == "#" || node_parent.original.type==1)return true;
            else return false;
          }
          return true;
        }
      },
      conditionalselect:(node,event)=>{
        if(node.original.type==1)return false;
        return true;
      }
    });
    el.on("changed.jstree",(e,data)=>{
      
    });
    el.on("move_node.jstree",(e,data)=>{
      files.find(x=>x.id==data.node.id).parent = data.parent;
      files = files;
    });

    el.on("dblclick.jstree",(e,data)=>{
      const instance = jQuery.jstree.reference(e.target);
      if(!instance)return;
      const dataEntry = instance.get_node(e.target);
      if(!dataEntry)return;
      const id = dataEntry.id;
      if(!id)return;

      const foundEntry = files.find(x=>x.id==id);
      const newName = prompt("File/Folder Name?",foundEntry.name);
      if(newName==null)return;
      foundEntry.updateName(newName);
      files=files;
    });
    initiated = true;
  }
  onMount(initTree);
</script>

<div id="fileTree"></div>