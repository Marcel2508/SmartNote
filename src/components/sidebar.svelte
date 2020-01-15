<script>
  import {Item, Text, Graphic, Subheader} from '@smui/list';
  import H6 from '@smui/common/H6.svelte';


  export let files = [];

</script>

{#each files as file}
  {#if file.type=="dir"}
    <Item href="javascript:void(0)">
      <Graphic class="material-icons">folder</Graphic>
      <Text style="padding-left:10px;">{file.name}</Text>
    </Item>
    {#each file.files as file2}
      <Item href="javascript:void(0)" style="padding-left:20px;">
        <Graphic class="material-icons">notes</Graphic>
        <Text style="padding-left:10px;">{file.name}</Text>
      </Item>
    {/each}
  {:else if file.type=="note"}
    <Item href="javascript:void(0)">
      <Graphic class="material-icons">notes</Graphic>
      <Text style="padding-left:10px;">{file.name}</Text>
    </Item>
  {/if}
{/each}
{#if files.length==0}
  <span class="disabled">No Notes available</span>
{/if}

<style>
</style>