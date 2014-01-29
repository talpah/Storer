window.onload = function () {
    store = new Storer();
    finder = new Finder('#results', '#list-item-template', '#list-buttons-create-template', '#list-buttons-update-template');

    var searchBox = document.querySelector('#search');
    var searchResults = store.findAll();
    finder.setResults(searchResults);
    finder.render();

    searchBox.onkeypress = function (e) {
        if (e.keyCode == 13) {
            var words = cleanArray(searchBox.value.split(' '), '');
            var location = false;
            searchResults = store.find(words.join(' '));
            if (words.length > 1) {
                location = words.pop();
            }
            var searchedItem = words.join(' ');

            if (searchResults.length === 0) {
                /* Search assuming the last word is a location, display below proposed creation */
                var searchResultsWithLocation = store.find(searchedItem);
                var locationsFound = [];
                if (searchResultsWithLocation.length > 0) {
                    for (var srwl in searchResultsWithLocation) {
                        searchResults.push(searchResultsWithLocation[srwl]);
                        locationsFound.push(searchResultsWithLocation[srwl].location);
                    }
                }
                /* Nothing found matching all the words, propose create */
                var proposeAdd;
                if (location) {
                    if (locationsFound.indexOf(location) == -1) {
                        proposeAdd = new Item(searchedItem, location, 'Create 1', true);
                    }
                } else {
                    proposeAdd = new Item(searchBox.value, '...', 'Create 1', true);
                }
                if (proposeAdd) {
                    searchResults.unshift(proposeAdd);
                }

            }

            finder.setResults(searchResults);
            finder.render();
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

function cleanArray(arr, deleteValue) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == deleteValue) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}