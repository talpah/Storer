/**
 * Created by cosmin on 1/27/14.
 */
/**
 *
 * @param container container #id
 * @param listTemplate template #id
 * @param createButtonTemplate template #id
 * @param updateButtonTemplate template #id
 * @returns Finder
 * @constructor
 */
function Finder(container, listTemplate, createButtonTemplate, updateButtonTemplate) {
    /** Singleton */
    if (arguments.callee._singletonInstance) return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    this._results = [];
    this._container = document.querySelector(container);
    this._listTemplate = listTemplate;
    this._updateButtonsTemplate = updateButtonTemplate;
    this._createButtonsTemplate = createButtonTemplate;

    this.setResults = function (results) {
        this._results = results;
    };

    this.render = function () {
        this._container.innerHTML = '';
        if (this._results.length == 0) {
            this._container.appendChild(
                document.createElement('span').appendChild(document.createTextNode('Nothing found.'))
            );
            return;
        }
        for (var resultIndex in this._results) {
            if (!this._results.hasOwnProperty(resultIndex)) {
                continue;
            }
            var result = this._results[resultIndex];
            var listTemplate = this.createNodesFromTemplate('list');
            listTemplate.querySelector('.item-name').textContent = result.name;
            listTemplate.querySelector('.item-location').textContent = result.location;
            listTemplate.querySelector('.amount').textContent = result.amount;
            if (result.isVirtual) {
                var createButton = this.createNodesFromTemplate('create');
                createButton.querySelector('button').setAttribute('id', 'create-item-' + result.key);
                createButton.querySelector('button').setAttribute('data', JSON.stringify(result));
                listTemplate.querySelector('.actions').innerHTML = '';
                listTemplate.querySelector('.actions').appendChild(createButton);
                listTemplate.querySelector('#create-item-' + result.key).addEventListener('click', this.clickCreate, true);
            } else {
                var buttons = this.createNodesFromTemplate('update');
                buttons.querySelector('.inc').setAttribute('id', 'inc-' + result.key);
                buttons.querySelector('.dec').setAttribute('id', 'dec-' + result.key);
                buttons.querySelector('.inc').setAttribute('data', JSON.stringify(result));
                buttons.querySelector('.dec').setAttribute('data', JSON.stringify(result));
                listTemplate.querySelector('.amount').setAttribute('id', 'amount-' + result.key);
                listTemplate.querySelector('.actions').innerHTML = '';
                listTemplate.querySelector('.actions').appendChild(buttons);
                listTemplate.querySelector('#inc-' + result.key).addEventListener('click', this.clickInc, true);
                listTemplate.querySelector('#dec-' + result.key).addEventListener('click', this.clickDec, true);
            }
            this._container.appendChild(listTemplate);
        }

    };

    this.updateAmount = function (key, value) {
        var amountElement = document.querySelector('amount-' + key);
        if (amountElement) {
            amountElement.innerHTML = value;
        }
    };

    this.search = function (searchQuery) {
        /* Split into words and remove empty elements */
        var words = filterArray(searchQuery.split(' '), '');
        var location = false;

        /* Initial full search */
        var searchResults = store.find(words.join(' '));

        /* When word count > 1, the last word is location */
        if (words.length > 1) {
            location = words.pop();
        }
        /* Reassemble search query, w/out location */
        var searchedItem = words.join(' ');

        /* If no matches found for full search, try without last word (location) */
        if (searchResults.length === 0) {
            /* Search assuming the last word is a location, display below proposed creation */
            var searchResultsWithLocation = store.find(searchedItem);
            var locationsFound = [];
            var fullMatchFound = false;
            if (searchResultsWithLocation.length > 0) {
                for (var srwl in searchResultsWithLocation) {
                    if (location
                        && searchResultsWithLocation[srwl].location == location
                        && searchedItem == searchResultsWithLocation[srwl].name
                        ) {
                        /* everything matches, put it first */
                        searchResults.unshift(searchResultsWithLocation[srwl]);
                        fullMatchFound = true;
                    } else if (
                        (location && searchResultsWithLocation[srwl].location == location)
                            || searchedItem == searchResultsWithLocation[srwl].name
                        ) {
                        /* Location matches OR item name matches, put it first */
                        searchResults.unshift(searchResultsWithLocation[srwl]);
                        locationsFound.push(searchResultsWithLocation[srwl].location);
                    } else {
                        /* just item matches, add it to the bottom */
                        searchResults.push(searchResultsWithLocation[srwl]);
                        locationsFound.push(searchResultsWithLocation[srwl].location);
                    }
                }
            }
            /* Nothing found matching all the words, propose to create item named after the full query */
            var proposeAdd;
            if (location) {
                /* If there's a location specified and the rest of the query
                 didn't match an item in a known location, suggest adding it  */
                if (!fullMatchFound) {
                    /* Propose item in location */
                    proposeAdd = new Item(searchedItem, location, 'Create 1', true);
                }
            } else {
                proposeAdd = new Item(searchQuery, '...', 'Create 1', true);
            }
            if (proposeAdd) {
                /* Prepend the proposition on top of the list */
                searchResults.unshift(proposeAdd);
            }
        }
        this.setResults(searchResults);
        this.render();
    };

    this.createNodesFromTemplate = function (template) {
        var currentTemplate = null;
        switch (template) {
            case 'create':
                currentTemplate = document.querySelector(this._createButtonsTemplate);
                break;
            case 'update':
                currentTemplate = document.querySelector(this._updateButtonsTemplate);
                break;
            case 'list':
                currentTemplate = document.querySelector(this._listTemplate);
                break;
            default:
                return false;
        }
        return currentTemplate.content.cloneNode(true);
    };

    this.clickCreate = function () {
        var data = JSON.parse(this.getAttribute('data'));
        data.amount = 1;
        Storer().add(data);
    };
    this.clickInc = function () {
        var data = JSON.parse(this.getAttribute('data'));
        data.amount += 1;
        if (Storer().add(data)) {
            Finder().updateAmount(data.key, data.amount);
        }
    };
    this.clickDec = function () {
        var data = JSON.parse(this.getAttribute('data'));
        data.amount -= 1;
        if (Storer().add(data)) {
            Finder().updateAmount(data.key, data.amount);
        }
    };

    return this;
}
