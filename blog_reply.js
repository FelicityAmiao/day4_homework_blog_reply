Ext.onReady(() => {
    let editorMenu = new Ext.menu.Menu({
        items: [{
            text: 'Reset',
            listeners: {
                click: function () {
                    Ext.getCmp('replyHtmlEditor').setValue('');
                    disableReplyButton();
                }
            }
        }]
    });

    function drawTable(rowNum, colNum) {
        let tbody = '<table border>';
        for (let i = 0; i < rowNum; i++) {
            tbody += '<tr>';
            for (j = 0; j < colNum; j++) {
                tbody += "<td>" + i + "," + j + "</td>";
            }
            tbody += '</tr>';
        }
        tbody += '</table>';
        return tbody;
    }

    function createTablePanelByNumber(number) {
        let tableStr = drawTable(parseInt(number[0]), parseInt(number[1]));
        let tableTemplate = new Ext.XTemplate([
            tableStr
        ]);
        return new Ext.Panel({
            renderTo: Ext.getBody(),
            tpl: tableTemplate
        });
    }

    function getRowAndColInput() {
        let rowAndCol = Ext.getCmp('tableForm').form.getValues();
        let number = [];
        for (let key in rowAndCol) {
            number.push(rowAndCol[key]);
        }
        return number;
    }

    function activeReplyButton() {
        Ext.getCmp('replyButton').enable();
    }

    function disableReplyButton() {
        Ext.getCmp('replyButton').disable();
    }

    Ext.QuickTips.init();
    let isFocus = false;
    let insertMenu = new Ext.menu.Menu({
        items: [{
            text: 'Table',
            listeners: {
                click: function () {
                    if (!isFocus) {
                        Ext.MessageBox.alert("Hint", "Please select the target first!");
                    } else {
                        let customTable = new Ext.Window({
                            title: 'Custom Your Table',
                            items: [{
                                id: 'tableForm',
                                xtype: 'form',
                                style: 'padding: 10px',
                                items: [{
                                    xtype: 'numberfield',
                                    fieldLabel: 'row',
                                    emptyText: 'input number',
                                    allowBlank: false
                                }, {
                                    xtype: 'numberfield',
                                    fieldLabel: 'col',
                                    emptyText: 'input number',
                                    allowBlank: false
                                }, {
                                    xtype: 'button',
                                    text: 'ok',
                                    listeners: {
                                        click: function () {
                                            if(Ext.getCmp('tableForm').form.isValid()) {
                                                let number = getRowAndColInput();
                                                customTable.close();
                                                if (number[0] === 'input number') return;
                                                let panel = createTablePanelByNumber(number);
                                                Ext.getCmp('replyHtmlEditor').insertAtCursor(panel.tpl.html);
                                            }
                                        }
                                    }
                                }]
                            }]
                        });
                        customTable.show();
                    }
                }
            }
        }]
    });
    let menus = [{
        text: 'Editor',
        menu: editorMenu
    }, '-', {
        text: 'Insert',
        menu: insertMenu
    }];
    let blogReply = new Ext.Toolbar({
        anchor: '100% 5%',
        items: menus
    });

    let mainMenu = new Ext.menu.Menu({
        items: menus
    });
    Ext.get(document).on('contextmenu', function (e) {
        e.preventDefault();
        mainMenu.showAt(e.getXY());
    });

    let progressBar = new Ext.ProgressBar({
        renderTo: 'progressbar',
        hidden: true
    });

    let replyForm = new Ext.form.FormPanel({
        anchor: '100% 95%',
        layout: 'fit',
        items: [{
            id: 'replyHtmlEditor',
            xtype: 'htmleditor',
            listeners: {
                activate: function () {
                    isFocus = true;
                },
                sync: function (htmleditor, html) {
                    if (!Ext.isEmpty(html)) {
                        activeReplyButton();
                    } else {
                        disableReplyButton();
                    }
                }
            }
        }],
        buttons: [{
            id: 'replyButton',
            text: 'reply',
            disabled: true,
            listeners: {
                click: function () {
                    progressBar.show();
                    progressBar.wait({
                        interval: 200,
                        duration: 3000,
                        increment: 15,
                        text: 'loading...',
                        fn: function () {
                            progressBar.hide();
                            Ext.Msg.alert('success', "success!")
                        }
                    });
                }
            }
        }]
    });
    let window = new Ext.Window({
        width: 600,
        height: 600,
        layout: 'anchor',
        title: 'Blog reply',
        items: [blogReply, replyForm]
    });
    window.show();
});