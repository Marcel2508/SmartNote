<script>
  import Dialog,{Title,Content,Actions} from '@smui/dialog';
  import Button,{Label} from '@smui/button';
  import Textfield from '@smui/textfield';

  let dialog;
  let curValue="";
  let deleteFn;
  let renameFn;

  function cleanRefs(){
    curValue="";
    deleteFn=null;
    renameFn=null;
  }
  function deleteClickFn(){
    if(deleteFn)deleteFn();
  }
  function renameClickFn(){
    if(renameFn)renameFn(curValue);
  }

  export function showDeleteDialog(oldValue,_renameCallback,_deleteCallback){
    curValue = oldValue;
    deleteFn=_deleteCallback;
    renameFn=_renameCallback;
    dialog.open();
  }

</script>

<Dialog
  bind:this={dialog}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-content"
  on:MDCDialog:closed={cleanRefs}
>
  <Title id="dialog-title">Edit entry</Title>
  <Content id="dialog-content">
    Enter new Name, or click "Delete" to delete this entry!<br/>
    <Textfield bind:value={curValue}></Textfield>
  </Content>
  <Actions>
    <Button color="secondary">
      <Label>Cancel</Label>
    </Button>
    <Button on:click={deleteClickFn}>
      <Label>Delete</Label>
    </Button>
    <Button on:click={renameClickFn} color="secondary" class="txt">
      <Label class="txt">Change Name</Label>
    </Button>
  </Actions>
</Dialog>