before(function () {  
    console.error = () => {};
});
  
after(function () {
    console.error = console.error;
});