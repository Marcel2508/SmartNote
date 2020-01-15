<script>
  import {onMount} from 'svelte';

  export let value = "";

  let codeEditor;
  let innerValue = value;


  $: if(value != innerValue){
    innerValue = value;
    codeEditor.setValue(innerValue);
  }

  onMount(_=>{
    innerValue=value;
    codeEditor = CodeMirror.fromTextArea(document.getElementById("myTextEditor"),{
      mode:"markdown",
      lineNumbers:true
    });
    codeEditor.on("change",handleChange);
  });

  let bumpStart = -1;
  let debumpTimeout;
  function handleChange(){
    clearTimeout(debumpTimeout);
    debumpTimeout = setTimeout(()=>{
      innerValue = codeEditor.getValue();
      value=innerValue;
    },400);
  }

</script>

<textarea id="myTextEditor" class="textarea" {value} contenteditable="true"></textarea>