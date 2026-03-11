# uiBuilder.js

A NetSuite SuiteScript 2.0 utility library for building custom Suitelet UIs. Simplifies the creation of forms, tabs, field groups, fields, sublists, and sublist population through a clean, declarative API.

> ⚠️ **Do not edit this script directly.** Always test in a sandbox environment before deploying to production. This script is not affiliated with or endorsed by Oracle or NetSuite.

---

## Requirements

- NetSuite SuiteScript 2.0 (`@NApiVersion 2.0`)
- NetSuite module: `N/log`
- Intended for use within **Suitelet** scripts using `N/ui/serverWidget`

---

## Installation

Upload `uiBuilder.js` to your NetSuite File Cabinet and reference it as a custom module in your Suitelet:

```javascript
/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', '/path/to/uiBuilder'],
    function (ui, uibuilder) {
        // your Suitelet logic here
    }
);
```

---

## API Reference

### `addGroups(groups, form)`

Adds field groups (visual containers) to the form.

| Parameter | Type | Description |
|-----------|------|-------------|
| `groups` | `Array` | Array of `{ id, label }` objects |
| `form` | `Object` | The `serverWidget.Form` instance |

```javascript
var grouping = [{ id: 'filters', label: 'Filters' }];
form = uibuilder.addGroups(grouping, form);
```

---

### `addTabs(tabs, form)`

Adds tabs to the form for multi-section layouts.

| Parameter | Type | Description |
|-----------|------|-------------|
| `tabs` | `Array` | Array of `{ id, label }` objects |
| `form` | `Object` | The `serverWidget.Form` instance |

```javascript
var tabs = [{ id: 'maintab', label: 'Main' }];
form = uibuilder.addTabs(tabs, form);
```

---

### `addFields(fields, form)`

Adds fields to the form. Each field object supports the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `props.id` | `string` | Field internal ID (use `custpage_` prefix) |
| `props.type` | `ui.FieldType` | Field type (e.g. `SELECT`, `TEXT`, `DATE`) |
| `props.label` | `string` | Display label |
| `props.source` | `string \| null` | Record type source for SELECT fields |
| `props.container` | `string` | ID of the tab or group to place the field in |
| `isMandatory` | `boolean` | Whether the field is required |
| `updateBreakType` | `ui.FieldBreakType` | Layout break type |
| `updateDisplayType` | `ui.FieldDisplayType` | Display mode (NORMAL, INLINE, HIDDEN, etc.) |
| `updateLayoutType` | `ui.FieldLayoutType` | *(optional)* Layout type |
| `height` / `width` | `number` | *(optional)* Display size |
| `richTextHeight` / `richTextWidth` | `number` | *(optional)* Rich text field size |
| `linkText` | `string` | *(optional)* Hyperlink text |
| `maxLength` | `number` | *(optional)* Max character length |
| `padding` | `number` | *(optional)* Field padding |
| `alias` | `string` | *(optional)* Field alias |
| `options` | `Array` | *(optional)* Array of `{ id, txt, selected? }` for SELECT fields |
| `value` | `any` | Default value. Use `null` for DATE/SELECT, `0` for INTEGER/FLOAT, `" "` for TEXT |

```javascript
var fields = [{
    props: {
        id: 'custpage_subsidiary',
        type: ui.FieldType.SELECT,
        label: 'Subsidiary',
        source: 'subsidiary',
        container: 'filters'
    },
    value: null,
    options: null,
    isMandatory: true,
    updateBreakType: ui.FieldBreakType.STARTCOL,
    updateDisplayType: ui.FieldDisplayType.NORMAL,
}];

form = uibuilder.addFields(fields, form);
```

To set or override a field's default value after adding it:

```javascript
var subField = form.getField({ id: 'custpage_subsidiary' });
subField.defaultValue = subsidiaryId;
```

---

### `addColumns(columns, list)`

Adds columns to a `serverWidget.List` (for list-type Suitelets, not form sublists).

| Parameter | Type | Description |
|-----------|------|-------------|
| `columns` | `Array` | Array of column definition objects |
| `list` | `Object` | The `serverWidget.List` instance |

---

### `addSublists(sublists, form)`

Adds sublists to the form. Each sublist object contains its own fields array using the same field definition format as `addFields`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `sublists` | `Array` | Array of sublist definition objects |
| `form` | `Object` | The `serverWidget.Form` instance |

```javascript
var sublists = [{
    props: {
        id: 'custpage_accountlist',
        type: ui.SublistType.LIST,
        label: 'Results (' + accountValues.length + ')',
    },
    fields: sublistFields,   // same structure as addFields()
}];

form = uibuilder.addSublists(sublists, form);
```

---

### `populateSublist(sublistValues, form)`

Populates rows in one or more sublists. Row objects must use `custpage_`-prefixed keys matching the sublist field IDs.

| Parameter | Type | Description |
|-----------|------|-------------|
| `sublistValues` | `Array` | Array of `{ sublistId, values }` objects |
| `form` | `Object` | The `serverWidget.Form` instance |

```javascript
// accountValues is an array of objects whose keys match sublist field IDs
var sublistValues = [{
    sublistId: 'custpage_accountlist',
    values: accountValues   // e.g. [{ custpage_account: 'Acme', custpage_tenant: '123' }, ...]
}];

form = uibuilder.populateSublist(sublistValues, form);
```

> **Note:** Only columns whose ID contains `custpage` will be populated. Other keys are silently skipped.

---

## Default Value Guidelines

| Field Type | Default Value |
|------------|--------------|
| `DATE`, `SELECT` | `null` |
| `INTEGER`, `FLOAT` | `0` |
| `TEXT`, others | `" "` *(single space)* |

Mismatched defaults can cause saved search errors. Ensure your saved search column defaults align with this table.

---

## Full Suitelet Example

```javascript
define(['N/ui/serverWidget', '/SuiteScripts/uiBuilder'],
    function (ui, uibuilder) {

        function onRequest(context) {
            var form = serverWidget.createForm({ title: 'My Report' });

            // 1. Add a field group
            form = uibuilder.addGroups([{ id: 'filters', label: 'Filters' }], form);

            // 2. Add fields
            form = uibuilder.addFields([{
                props: {
                    id: 'custpage_subsidiary',
                    type: ui.FieldType.SELECT,
                    label: 'Subsidiary',
                    source: 'subsidiary',
                    container: 'filters'
                },
                value: null,
                isMandatory: true,
                updateBreakType: ui.FieldBreakType.STARTCOL,
                updateDisplayType: ui.FieldDisplayType.NORMAL,
            }], form);

            // 3. Add a sublist
            form = uibuilder.addSublists([{
                props: {
                    id: 'custpage_results',
                    type: ui.SublistType.LIST,
                    label: 'Results',
                },
                fields: [{
                    props: { id: 'custpage_account', type: ui.FieldType.TEXT, label: 'Account' },
                    value: ' ',
                    updateDisplayType: ui.FieldDisplayType.INLINE,
                }],
            }], form);

            // 4. Populate sublist rows
            form = uibuilder.populateSublist([{
                sublistId: 'custpage_results',
                values: [{ custpage_account: 'Acme Corp' }]
            }], form);

            // 5. Add buttons
            form.addSubmitButton({ label: 'Run' });
            form.addButton({
                id: 'custpage_back',
                label: 'Back',
                functionName: 'goBack'
            });

            context.response.writePage(form);
        }

        return { onRequest: onRequest };
    }
);
```

---

## License

© 2018–2025 IrisVenera08. All rights reserved.  
Free to use, modify, and share with proper attribution. Commercial use is permitted. No warranty is provided.
