$(document).ready(function () {
    store = new Storer();
    finder = new Finder('#results', '#list-item-template', '#list-buttons-create-template', '#list-buttons-update-template');

    var searchBox = document.querySelector('#search');
    var searchResults = store.findAll();
    finder.setResults(searchResults);
    finder.render();

    $('#searcher')
        .on('submit', function (e) {
            event.preventDefault();
            finder.search($('#search').val());
            $('#clearer').prop('disabled', false);
        })
        .on('reset', function (e) {
            var searchResults = store.findAll();
            finder.setResults(searchResults);
            finder.render();
            $('#clearer').prop('disabled', true);
        });

});
