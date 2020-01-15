<script>

  import MarkdownCode from './MarkdownCode.svelte';

  export let textContent="";

  function getMarkdown(x){
    return DOMPurify.sanitize(marked(x));
  }

</script>
<MarkdownCode bind:value={textContent}></MarkdownCode>
<div class="CodePreview">
{@html getMarkdown(textContent)}
</div>