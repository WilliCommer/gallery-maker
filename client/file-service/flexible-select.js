/**
 * Implements a HTMLElement that works like a &lt;select multiple &gt; but use &lt;div&gt; instead of &lt;option&gt;
 * Therefore, it allows for arbitrary options that can also include images. 
 * It self ist styled like a Bootstrap form-control.
 * <br>
 * It is defined as {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements|Custom Element}
 * &lt;flexible-select&gt; in this module and supports attributes "name", "multiple" and "tabindex".
 * It also supports "value" and "form" and the events "change" and "input".
 * If "multiple" the "value" is an array else a string.
 * <br>
 * The childen supports attributes "selected" and "value"
 * 
 * @class
 * @extends HTMLElement
 * 
 */

class FlexibleSelect extends HTMLElement {
    static formAssociated = true;

    // Überwacht Änderungen am 'multiple'-Attribut live
    static get observedAttributes() {
        return ['multiple'];
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._selectedValues = [];
        this._lastClickedIndex = 0;
    }

    connectedCallback() {
        // Basis-Styling und Bootstrap-Klassen für den Container selbst zuweisen
        // this.classList.add('form-control');
        if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');

        // Optionen vorbereiten und Bootstrap-Klassen injizieren
        this._getOptions().forEach(el => {
            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        });

        this.addEventListener('click', (e) => this._handleClick(e));
        this.addEventListener('keydown', (e) => this._handleKeyDown(e));
        this._enforceSingleSelectionRule();
        this._updateValuesFromDOM();
    }

    // Falls das Attribut dynamisch per JavaScript geändert wird
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'multiple') {
            this._enforceSingleSelectionRule();
            this._updateValuesFromDOM();
        }
    }

    _getOptions() {
        return Array.from(this.children);
    }

    _getMultiple() {
        return this.hasAttribute('multiple') &&  this.getAttribute('multiple') !== 'false';
    }

    // Stellt sicher, dass bei Einzelauswahl nur maximal ein Element aktiv ist
    _enforceSingleSelectionRule() {
        if (!this._getMultiple()) {
            const options = this._getOptions();
            const selected = options.filter(el => el.hasAttribute('selected'));
            if (selected.length > 1) {
                options.forEach(el => { el.removeAttribute('selected'); el.classList.remove('active'); });
                selected[0].setAttribute('selected', '');
            }
        }
    }

    _handleClick(e) {
        let target = e.target;
        // Wandert nach oben, bis es ein direktes Kind (die Option) findet
        while (target && target.parentElement !== this) {
            target = target.parentElement;
        }
        
        const options = this._getOptions();
        if (!target || !options.includes(target)) return;

        const currentIndex = options.indexOf(target);
        const isMultiple = this._getMultiple();

        if (isMultiple && e.shiftKey) {
            const start = Math.min(this._lastClickedIndex, currentIndex);
            const end = Math.max(this._lastClickedIndex, currentIndex);
            options.forEach((el, idx) => {
                if (idx >= start && idx <= end) {
                    el.setAttribute('selected', '');
                } else if (!e.ctrlKey && !e.metaKey) {
                    el.removeAttribute('selected');
                }
            });
        } else if (isMultiple && (e.ctrlKey || e.metaKey)) {
            if (target.hasAttribute('selected')) {
                target.removeAttribute('selected');
            } else {
                target.setAttribute('selected', '');
            }
            this._lastClickedIndex = currentIndex;
        } else {
            // Einzelauswahl oder normaler Klick ohne Sondertasten
            options.forEach(el => {
                el.removeAttribute('selected');
            });
            target.setAttribute('selected', '');
            this._lastClickedIndex = currentIndex;
        }

        target.focus();
        this._updateValuesFromDOM();
        this.dispatchEvent(new Event('input', { bubbles: true }));
        this.dispatchEvent(new Event('change', { bubbles: true }));
    }

    _handleKeyDown(e) {
        const options = this._getOptions();
        let currentFocusIdx = options.findIndex(el => el === document.activeElement);
        if (currentFocusIdx === -1) currentFocusIdx = this._lastClickedIndex;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIdx = Math.min(currentFocusIdx + 1, options.length - 1);
            this._navigateAndSelect(options, nextIdx, e.shiftKey && this._getMultiple());
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIdx = Math.max(currentFocusIdx - 1, 0);
            this._navigateAndSelect(options, prevIdx, e.shiftKey && this._getMultiple());
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            if (currentFocusIdx !== -1) {
                this._handleClick({ target: options[currentFocusIdx], shiftKey: e.shiftKey, ctrlKey: this.hasAttribute('multiple') });
            }
        }
    }

    _navigateAndSelect(options, targetIdx, isShift) {
        const targetElement = options[targetIdx];
        targetElement.focus();

        if (isShift) {
            const start = Math.min(this._lastClickedIndex, targetIdx);
            const end = Math.max(this._lastClickedIndex, targetIdx);
            options.forEach((el, idx) => {
                if (idx >= start && idx <= end) {
                    el.setAttribute('selected', '');
                }
            });
        } else {
            options.forEach(el => {
                el.removeAttribute('selected');
            });
            targetElement.setAttribute('selected', '');
            this._lastClickedIndex = targetIdx;
        }

        this._updateValuesFromDOM();
        this.dispatchEvent(new Event('input', { bubbles: true }));
        this.dispatchEvent(new Event('change', { bubbles: true }));
    }

    _updateValuesFromDOM() {
        const selectedElements = this.querySelectorAll(`${this.tagName.toLowerCase()} > div[selected]`);
        this._selectedValues = Array.from(selectedElements).map(el => el.getAttribute('value') || el.innerText.trim());

        // Daten an die ElementInternals für native Formularübertragung übergeben
        const formData = new FormData();
        this._selectedValues.forEach(val => formData.append(this.getAttribute('name') || 'select', val));
        this._internals.setFormValue(formData);
    }

    formResetCallback() {
        this._getOptions().forEach(el => {
            el.removeAttribute('selected');
        });
        this._updateValuesFromDOM();
    }

    // GETTER: Gibt String bei Einzelauswahl oder ein Array bei Mehrfachauswahl zurück
    get value() { 
        if (this._getMultiple()) {
            return this._selectedValues;
        }
        return this._selectedValues.length > 0 ? this._selectedValues[0] : ""; 
    }
    
    // SETTER: Akzeptiert String (Einzelwert) oder ein Array (Mehrfachwerte)
    set value(newValues) {
        const valuesToSet = Array.isArray(newValues) ? newValues : [newValues];
        this._getOptions().forEach(el => {
            const val = el.getAttribute('value');
            if (valuesToSet.includes(val)) {
                el.setAttribute('selected', '');
            } else {
                el.removeAttribute('selected');
            }
        });
        this._enforceSingleSelectionRule();
        this._updateValuesFromDOM();
    }

    get selected() { return this._selectedValues.length > 0; }
    get form() { return this._internals.form; }
    get name() { return this.getAttribute('name'); }
}

customElements.define('flexible-select', FlexibleSelect);
