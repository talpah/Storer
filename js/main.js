window.onload = function () {
    store = new Storer();
    finder = new Finder('#results', '#list-item-template', '#list-buttons-create-template', '#list-buttons-update-template');

    var searchBox = document.querySelector('#search');
    var searchResults = store.findAll();
    finder.setResults(searchResults);
    finder.render();

    searchBox.onkeypress = function (e) {
        if (e.keyCode == 13) {
            finder.search(searchBox.value);
            return false;
        }

        return true;
    };
};

var resizeButton = document.querySelector('#resizer');
resizeButton.addEventListener('click', function (e) {
    var sizer = document.querySelector('#sizer');

    if (sizer.className == 'sizer100') {
        sizer.className = 'sizer50';
    } else {
        sizer.className = 'sizer100';
    }
});

