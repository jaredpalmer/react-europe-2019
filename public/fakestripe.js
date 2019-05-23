(function() {
  window.FakeStripe = {
    charge() {
      alert("dolla dolla bills y'all");
    },
  };

  console.log('loaded fake stripe');
})();
