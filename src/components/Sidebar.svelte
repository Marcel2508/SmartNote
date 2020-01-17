<script context="module">
  let initiated = false;
  let refreshCallback = null;
  export function selectEntry(id){
    if(initiated && id!=null){
      const fn = ()=>{
        const el = jQuery("#fileTree");
        el.jstree("deselect_all");
        el.jstree(true).select_node(id,false);
      }
      if(refreshCallback)
        refreshCallback(fn);
      else fn();
    }
  }
</script>

<script>
  import {onMount,createEventDispatcher} from 'svelte';

  import {convertFileArray} from '../fileEntry.js';
  import DeleteDialog from './DeleteDialog.svelte';

  const dispatchEvent = createEventDispatcher();

  export let files=[];
  let dialog;

  $: if(files && true){
    if(initiated){
      const tree = jQuery("#fileTree");
      tree.jstree(true).settings.core.data = files;
      tree.jstree(true).refresh();
      let rWaiting = [];
      refreshCallback = (x)=>{
        rWaiting.push(x);
      };
      tree.one("refresh.jstree",()=>{
        rWaiting.forEach(x=>x());
        refreshCallback=null;
      });
    }
  }

  function initTree(){
    const el = jQuery("#fileTree");
    el.jstree({
      plugins:["wholerow","dnd","conditionalselect"],
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

    let selectTo;
    el.on("changed.jstree",(e,data)=>{
      clearTimeout(selectTo);
      selectTo=setTimeout(_=>dispatchEvent("nodeSelect",{nodeId:data.selected[0]}),100);
    });
    el.on("move_node.jstree",(e,data)=>{
      const f= files.find(x=>x.id==data.node.id);
      f.changeParent(data.parent);
      files = files;
      dispatchEvent("nodeMove",{
        modified: f,
        id: f.id,
        parent:data.parent
      });
    });

    el.on("dblclick.jstree",(e,data)=>{
      const instance = jQuery.jstree.reference(e.target);
      if(!instance)return;
      const dataEntry = instance.get_node(e.target);
      if(!dataEntry)return;
      const id = dataEntry.id;
      if(!id)return;

      const foundEntry = files.find(x=>x.id==id);

      
      dialog.showDeleteDialog(foundEntry.name,(newName)=>{
        foundEntry.updateName(newName);
        files=files;
        dispatchEvent("nodeRename",{
          modified:foundEntry,
          newName,
          id
        });
      },()=>{
        dispatchEvent("nodeDelete",{
          id
        });
      });
    });
    initiated = true;

  }
  onMount(initTree);

</script>

<div id="fileTree"></div>
<DeleteDialog bind:this={dialog}></DeleteDialog>