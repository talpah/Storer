$(document).ready(function () {
    store = new Storer();
    finder = new Finder('#results', '#list-item-template', '#list-buttons-create-template', '#list-buttons-update-template');

    var searchResults = store.findAll();
    finder.setResults(searchResults);
    finder.render();

    $('#searcher')
        .on('submit', function (e) {
            event.preventDefault();
            if ($('#search').val() == '') {
                $(this).trigger('reset');
            } else {
                if (finder._lastSearchQuery == $('#search').val()) {
                    var createButton = $('button.cre');
                    if (createButton.length > 0) {
                        createButton.click();
                    }
                } else {
                    finder.search($('#search').val());
                }
            }
            $('#clearer').prop('disabled', false);
        })
        .on('reset', function (e) {
            var searchResults = store.findAll();
            finder.setResults(searchResults);
            finder.render();
            $('#clearer').prop('disabled', true);
        });

});
