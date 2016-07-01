module.exports = {
  fix(array){
    array.forEach((module)=>{
      Object.keys(window[module]).forEach((name)=>{
        window[name] = window[module][name];
      });
    });
  }
}