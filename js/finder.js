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
        var $this=this;
        this._container.innerHTML = '';
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
                createButton.querySelector('button').setAttribute();
                listTemplate.querySelector('.actions').innerHTML = '';
                listTemplate.querySelector('.actions').appendChild(createButton);
                console.log(
                    listTemplate.querySelector('#mata'),
                    listTemplate.querySelector('#mata').addEventListener('click',this.clickCreate, true)
                );
            } else {
                var buttons = this.createNodesFromTemplate('update');
                buttons.querySelector('.inc').setAttribute('id', 'inc-' + result.key);
                buttons.querySelector('.dec').setAttribute('id', 'dec-' + result.key);
                buttons.querySelector('.inc').onclick = this.clickInc;
                buttons.querySelector('.dec').onclick = this.clickDec;
                listTemplate.querySelector('.actions').innerHTML = '';
                listTemplate.querySelector('.actions').appendChild(buttons);
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
        console.log(this);
    };
    this.clickInc = function () {
        console.log(this);
    };
    this.clickDec = function () {
        console.log(this);
    };

    return this;
}
