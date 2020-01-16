class FileEntry{
  constructor(json){
    this._raw = json;

    this.id = this._raw.id;
    this.text = this._raw.name;
    this.parent = this._raw.parent;
    this.icon = this._raw.type==1?"/icons/folder.png":"/icons/note.png";
    this.type = this._raw.type;
    this.name = this._raw.name;
  }

  updateName(newName){
    this._raw.name = newName;
    this.name = this._raw.name;
    this.text = this._raw.name;
    //TODO SAVE
  }

  updateContent(newContent){
    if(this.type==2){
      localStorage.setItem(this.id,newContent);
    }else{
      throw new Error("Can't set Content of a directory!");
    }
  }

  delete(){
    localStorage.removeItem(this.id);
    const idx = arr.indexOf(this);
    if(idx!==-1)
      this._arr.splice(idx,1);
    else
      throw new Error("Element not in Array!");
  }
}

export default FileEntry;

export function convertFileArray(arr){
  return arr.map(x=>new FileEntry(x));
}