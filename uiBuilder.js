/**
 * @NApiVersion 2.0
 * @NModuleScope Public
 * @Description Creates custom UIs and sublists
 * @FileCreated: September 11, 2018 7:36:48 AM
 * @Author: Alexis Claire Marcelo
 *
 * © 2018–2025 Alexis Claire Marcelo. All rights reserved.
 * You are free to use, modify, and share this script with proper attribution.
 * Commercial use is allowed, but no warranty is provided.
 *
 * ⚠️ DISCLAIMER:
 * This script is provided "as is" and is not affiliated with or endorsed by Oracle or NetSuite.
 * Use at your own risk. Always test in a sandbox environment before deploying to production.
 * The author is not responsible for any loss of data, misconfiguration, or system errors resulting from its use.
 *
 * ⚠️ DO NOT EDIT THIS SCRIPT DIRECTLY.
 * Please ensure that saved searches used with this script have default values aligned with their field types:
 *   - For DATE or SELECT fields, default value should be `null`
 *   - For INTEGER or FLOAT fields, default value should be `0`
 *   - For TEXT and others, use a single blank space `" "`
 */



/*

How to use this library


//++++++++++++++++++[ Add field tabs ]+++++++++++++++++++++++++++
var tabs = [{
    id: 'tabs',
    label: 'Tabs'
}];

//add field group
form = uibuilder.addTabs(tabs, form);

//++++++++++++++++++[ Add field group ]+++++++++++++++++++++++++++
var grouping = [{
    id: 'filters',
    label: 'Filters'
}];

//add field group
form = uibuilder.addGroups(grouping, form);

//++++++++++++++++++[ Add fields mainline ]+++++++++++++++++++++++++++
var fields = [{
    props: {
        id: 'custpage_07_subsidiary',
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
}, ];

form = uibuilder.addFields(fields, form);

//++++++++++++++++++[ Set Default value of a field]+++++++++++++++++++++++++++

var subField = form.getField({
    id: 'custpage_07_subsidiary'
});
subField.defaultValue = subsidiary;

//++++++++++++++++++[ Add Submit and Custom Button ]+++++++++++++++++++++++++++

form.addSubmitButton({
    label: 'Submit',
});

form.addButton({
    id: 'custpage_07_backtomain',
    label: 'Back To Main',
    functionName: 'backToMain'
});

//++++++++++++++++++[ Set Form Title ]+++++++++++++++++++++++++++

form.title = "Currently processing data...please wait."

//++++++++++++++++++[ Add Sublist ]+++++++++++++++++++++++++++

fields.push({
    props: {
        id: 'custpage_07_account',
        type: ui.FieldType.TEXT,
        label: 'Account',
        source: null,
        
    },
    value: null,
    options: null,
    isMandatory: false,
    updateBreakType: ui.FieldBreakType.NONE,
    updateDisplayType: ui.FieldDisplayType.INLINE,
}, {
    props: {
        id: 'custpage_07_tenantid',
        type: ui.FieldType.TEXT,
        label: 'Tenant',
        source: null,
        
    },
    value: null,
    options: null,
    isMandatory: false,
    updateBreakType: ui.FieldBreakType.NONE,
    updateDisplayType: ui.FieldDisplayType.HIDDEN,
}, {
    props: {
        id: 'custpage_07_tenant',
        type: ui.FieldType.TEXT,
        label: 'Tenant',
        source: null,
        
    },
    value: null,
    options: null,
    isMandatory: false,
    updateBreakType: ui.FieldBreakType.NONE,
    updateDisplayType: ui.FieldDisplayType.INLINE,
});

sublists = [{ // ++++++++++++++++++++++++++++++++[ ]+++++++++++++++++++++++++++++++++
    'props': {
        'id': 'custpage_07_accountlist',
        'type': ui.SublistType.LIST, //STATIC
        'label': 'Results(' + accountValues.length + ')',
    },
    'fields': fields,
}];

form = uibuilder.addSublists(sublists, form);

//++++++++++++++++++[ Set sublist value ]+++++++++++++++++++++++++++
*NOTE: {accountValues} is an array of object with keys set to internalids of sublist fields

var sublistValues = [{
    sublistId: 'custpage_07_accountlist',
    values: accountValues
}];

form = uibuilder.populateSublists(sublistValues, form);
*/

define(['N/log'],
    
    function (log) {
    
        /**
         * Adds field grouping in the UI
         * @param {array} grps array of objects  options.id and options.label
         * @param {object} form this is the serverWidget.form
         * @returns {*}
         */
        var addGroups = function addGroups(grps, form) {
            try {
                grps.forEach(function(grp) {
                    form.addFieldGroup(grp);
                });
            } catch (e) {
                log.error({ title: 'error in sublist...', details: e.message })
            }
            return form;
        }
    
        /**
         * Common function for addFields and addSublists
         * Used for adding standard field properties
         *
         * @param {object} ref this is the serverWidget.form
         * @returns {function(*): *}
         */
        var addField = function addField(ref) {
            return function(x) {
                var fld = ref.addField(x.props);
                if (!!x.hasOwnProperty('isMandatory')) fld.isMandatory = x.isMandatory;
                if (!!x.hasOwnProperty('updateBreakType')) fld.updateBreakType({ breakType: x.updateBreakType });
                if (!!x.hasOwnProperty('updateDisplayType')) fld.updateDisplayType({ displayType: x.updateDisplayType });
                if (!!x.hasOwnProperty('updateLayoutType')) fld.updateLayoutType({ layoutType: x.updateLayoutType });
                if (!!x.hasOwnProperty('height') && !!x.hasOwnProperty('width')) fld.updateDisplaySize({ height: x.height, width: x.width });
                if (!!x.hasOwnProperty('richTextHeight')) fld.richTextHeight = x.richTextHeight;
                if (!!x.hasOwnProperty('richTextWidth')) fld.richTextWidth = x.richTextWidth;
                if (!!x.hasOwnProperty('linkText')) fld.linkText = x.linkText;
                if (!!x.hasOwnProperty('maxLength')) fld.maxLength = x.maxLength;
                if (!!x.hasOwnProperty('padding')) fld.padding = x.padding;
                if (!!x.hasOwnProperty('alias')) fld.alias = x.alias;
                if (!!x.options) {
                    log.error({ title: 'options', details: JSON.stringify(x.options) });
                    x.options.forEach(function(opt) {
                        fld.addSelectOption({
                            value: opt.id,
                            text: opt.txt,
                            selected: ((!!opt.selected) ? opt.selected : false)
                        });
                    });
                }
                if (!!x.hasOwnProperty('value')) fld.defaultValue = x.value; // must be done after custom options
                
                return fld;
            }
        }
    
        /**
         * Used for List type SUITELET
         * @param flds
         * @param {object} ref this is the serverWidget.form
         * @returns {*}
         */
        var addColumns = function addColumns(flds, ref) {
            try {
                flds.forEach(function (fld){
                    ref.addColumn(fld);
                });
            } catch (e) {
                log.error({ title: 'error in columns...', details: e.message })
            }
            return ref;
        }
    
        /**
         * Utilizes addField function for setup and renders the fields to the forms
         * @param {array} flds field properties options.props options.props.id, options.props.type, options.props.label, options.props.source, options.props.container
         * and attributes options.isMandatory, options.updateBreakType, options.updateDisplayType, options.updateLayoutType, options.height, options.width, options.richTextHeight, options.richTextWidth, options.linkText, options.maxLength, options.padding, options.alias
         * @param {object} ref this is the serverWidget.form
         * @returns {*}
         */
        var addFields = function addFields(flds, ref) {
            try {
                flds.forEach(addField(ref));
            } catch (e) {
                log.error({ title: 'error in fields...', details: e.message })
            }
            return ref;
        }
    
        /**
         * Adds tabs in the UI
         * @param {array} tabs array of objects  options.id and options.label
         * @param {object} ref this is the serverWidget.form
         * @returns {*}
         */
        var addTabs = function addTabs(tabs, ref) {
            try {
                tabs.forEach(function(tab) {
                    ref.addTab(tab);
                });
            } catch (e) {
                log.error({ title: 'error in sublist...', details: e.message })
            }
            return ref;
        }
    
        /**
         * Adds sublist in the UI
         * @param {array} obj array of objects
         * @param {object} ref this is the serverWidget.form
         * @returns {*}
         */
        var addSublists = function addSublists(obj, ref) {
            try {
                obj.forEach(function(sublist) {
                    var list = ref.addSublist(sublist.props);
                    sublist.fields.forEach(addField(list));
                });
            } catch (e) {
                log.error({ title: 'error in sublist...', details: e.message })
            }
            return ref;
        }
    
        /**
         * Populates values in the sublists in the UI
         * @param {array} obj array of objects with mapping of custpage prefix fields
         * @param {object} ref this is the serverWidget.form
         * @returns {*}
         */
        var populateSublist = function populateSublist(obj, ref) {
            var tempsub = '';
            var tempfield = '';
            try {
                log.error({ title: 'obj', details: "obj: " + JSON.stringify(obj) })
                obj.forEach(function(x) {
                    tempsub = x.sublistId;
                    var sublist = ref.getSublist({ id: x.sublistId });
                    if (sublist) {
                        x.values.forEach(function(row, i) {
                            for (var col in row) {
                                if (col.indexOf('custpage') >= 0) {
                                    tempfield = col;
                                    sublist.setSublistValue({
                                        id: col,
                                        line: i,
                                        value: row[col],
                                    });
                                }
                            }
                        });
                    }
                });
                
            } catch (e) {
                log.error({ title: 'error in populating sublist: ' + tempsub + ' on field: ' + tempfield, details: e.message })
            }
            return ref;
        }
        
        return {
            'addGroups': addGroups,
            'addTabs': addTabs,
            'addFields': addFields,
            'addColumns': addColumns,
            'addSublists': addSublists,
            'populateSublist': populateSublist,
        }
        
    });