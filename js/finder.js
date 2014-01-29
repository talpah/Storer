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
                listTemplate.querySelector('.actions').innerHTML = '';
                listTemplate.querySelector('.actions').appendChild(buttons);
                listTemplate.querySelector('#inc-' + result.key).addEventListener('click', this.clickInc, true);
                listTemplate.querySelector('#dec-' + result.key).addEventListener('click', this.clickDec, true);
            }
            this._container.appendChild(listTemplate);
        }

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
        data.amount=1;
        Storer().add(data);
    };
    this.clickInc = function () {
        console.log(this);
    };
    this.clickDec = function () {
        console.log(this);
    };

    return this;
}
