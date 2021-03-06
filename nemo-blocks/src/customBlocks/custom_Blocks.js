/********************************************************************************************/
/* custom_Blocks.js                                                                         */
/*__________________________________________________________________________________________*/
/* Contains definition and translation of each custom block.                                */
/* Requires the Blockly library.                                                            */
/********************************************************************************************/

import Blockly from 'blockly';
import 'blockly/python';

// Checks if the input string is a valid url
function isValidHttpUrl(urlString) {
    let url;

    try {
        url = new URL(urlString);
    } catch (_) {
        return false;  
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

// Checks if the input string is a url and contains an image extension
function isValidImageUrl(urlString) {
    var url = urlString.substring(1, urlString.length-1);
    return(isValidHttpUrl(url) && url.match(/\.(jpg|jpeg|png|gif|svg)($|\?)/) != null);
}

// Checks if the input string is a url and contains a video extension
function isValidVideoUrl(urlString) {
    var url = urlString.substring(1, urlString.length-1);
    return(isValidHttpUrl(url) && url.match(/\.(mp4|avi|mov|flv|wmv)($|\?)/) != null);
}

// Checks if the input string is a url and contains an audio extension
function isValidAudioUrl(urlString) {
    var url = urlString.substring(1, urlString.length-1);
    return(isValidHttpUrl(url) && url.match(/\.(mp3|wav|aiff|aac|flac)($|\?)/) != null);
}

// Checks if the block is a child of some Option block, returns true if it is
// Valid option blocks must not be in another option block
function isOptionInOption(block) {
    var curBlock = block;
    while (curBlock.getSurroundParent() !== null && !['option_do', 'option_do_only'].includes(curBlock.getSurroundParent().type)) {
        curBlock = curBlock.getSurroundParent();
    }
    return curBlock.getSurroundParent() !== null;
}

// Checks if the block is a child of some Ask block, returns true if it is
// Valid option blocks must be in an ask block
function isValidOption(block) {
    var curBlock = block;
    while (curBlock.getSurroundParent() !== null && !['ask'].includes(curBlock.getSurroundParent().type)) {
        curBlock = curBlock.getSurroundParent();
    }
    return curBlock.getSurroundParent() !== null;
}

// Checks if the block is a child of some an Ask or Option block, returns true if it is not
// Valid say block must be NOT be in an Ask or Option block 
function isValidSay(block) {
    var curBlock = block;
    while (curBlock.getSurroundParent() !== null && !['ask', 'option_do', 'option_do_only'].includes(curBlock.getSurroundParent().type)) {
        curBlock = curBlock.getSurroundParent();
    }
    return curBlock.getSurroundParent() === null;
}

// Checks if the block is in an Axios call block, returns true if it is
// Valid axios_result block must be in an Axios call block
function isValidAxiosRes(block) {
    var curBlock = block;
    while (curBlock.getSurroundParent() !== null && !['axios_call', 'axios_call_simple'].includes(curBlock.getSurroundParent().type)) {
        curBlock = curBlock.getSurroundParent();
    }
    return curBlock.getSurroundParent() !== null;
}

// Say block definition
Blockly.Blocks['say'] = {
    init: function() {
        this.appendValueInput("DIALOGUE")
            .setCheck("String")
            .appendField("say");
        this.appendStatementInput("ACTIONS")
            .setCheck('action')
            .appendField("then");
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'action');
        this.setColour(30);
        this.setTooltip("Nemobot sends a message then does the nested blocks.");
        this.setHelpUrl("");
    }
};

// Say block translation
Blockly.JavaScript['say'] = function(block) {
    var value_dialogue = Blockly.JavaScript.valueToCode(block, 'DIALOGUE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');

    if (value_dialogue === "") value_dialogue = "''";
    
    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'say' block needs to be in a 'start','repeat', or function block - " + value_dialogue + "\n";
    } else if (!isValidSay(block)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'say' block needs to be outside an 'ask' or 'option' block - " + value_dialogue + "\n";
    } else {
        block.setColour("#a5805b");
        return "say(" + value_dialogue + ").then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
};

// Send image definition
Blockly.Blocks['send_image'] = {
    init: function() {
        this.appendValueInput("URL")
            .setCheck("String")
            .appendField("send image from link:");
        this.appendStatementInput("ACTIONS")
            .setCheck('action')
            .appendField("then");
        this.setPreviousStatement(true, 'action');
        this.setColour(30);
        this.setTooltip("Nemobot sends an image then does the nested blocks.");
        this.setHelpUrl("");
    }
};

// Send image translation
Blockly.JavaScript['send_image'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');

    if (value_url === "") value_url = "''";

    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send image' block needs to be in a 'start', 'repeat', or function block - " + value_url + "\n";
    } else if (!isValidSay(block)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send image' block needs to be outside an 'ask' or 'option' block - " + value_url + "\n";
    }

    if (isValidImageUrl(value_url)) {
        block.setColour("#a5805b");
        return "say({attachment: 'image', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
    else {
        block.setColour("#FF2222"); 
        return "// ERROR: Image URL invalid. Must start with 'https://' or 'http://' and end with jpeg/jpg/gif/png/svg\n" + 
        "say('Included image was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
};

// Send image definition (new, but old is kept since others might be using it)
Blockly.Blocks['send_image_new'] = {
    init: function() {
        this.appendValueInput("URL")
            .setCheck("String")
            .appendField("send image from the link");
        this.appendStatementInput("ACTIONS")
            .setCheck("action")
            .appendField("then");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("ignore errors?")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "IGNORE");
        this.setPreviousStatement(true, null);
        this.setColour(30);
        this.setTooltip("Nemobot sends an image then does the nested blocks.");
        this.setHelpUrl("");
    }
};

// Send image translation (new, but old is kept since others might be using it)
Blockly.JavaScript['send_image_new'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var checkbox_ignore = (block.getFieldValue('IGNORE') === 'TRUE');
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');

    if (value_url === "") value_url = "''";

    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send image' block needs to be in a 'start', 'repeat', or function block - " + value_url + "\n";
    } else if (!isValidSay(block)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send image' block needs to be outside an 'ask' or 'option' block - " + value_url + "\n";
    }

    if (checkbox_ignore || isValidImageUrl(value_url)) {
        block.setColour("#a5805b");
        return "say({attachment: 'image', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
        
    }
    else {
        block.setColour("#FF2222");
        return "// ERROR: Image URL invalid. Must start with 'https://' or 'http://' and end with jpeg/jpg/gif/png/svg\n" + 
        "say('Included image was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
};

// Send video definition
Blockly.Blocks['send_video'] = {
    init: function() {
        this.appendValueInput("URL")
            .setCheck("String")
            .appendField("send video from link:");
        this.appendStatementInput("ACTIONS")
            .setCheck('action')
            .appendField("then");
        this.setPreviousStatement(true, 'action');
        this.setColour(30);
        this.setTooltip("Nemobot sends a video then does the nested blocks.");
        this.setHelpUrl("");
    }
};

// Send video translation
Blockly.JavaScript['send_video'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');

    if (value_url === "") value_url = "''";

    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send video' block needs to be in a 'start', 'repeat', or function block - " + value_url + "\n";
    } else if (!isValidSay(block)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send video' block needs to be outside an 'ask' or 'option' block - " + value_url + "\n";
    }

    if (isValidVideoUrl(value_url)) {
        block.setColour("#a5805b");
        return "say({attachment: 'video', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
    else {
        block.setColour("#FF2222");
        return "// ERROR: Video URL invalid. Must start with 'https://' or 'http://' and end with mp4/avi/mov/flv/wmv\n" + 
        "say('Included video was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
};

// Send video definition (new, but old is kept since others might be using it)
Blockly.Blocks['send_video_new'] = {
    init: function() {
        this.appendValueInput("URL")
            .setCheck("String")
            .appendField("send video from the link");
        this.appendStatementInput("ACTIONS")
            .setCheck("action")
            .appendField("then");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("ignore errors?")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "IGNORE");
        this.setPreviousStatement(true, null);
        this.setColour(30);
        this.setTooltip("Nemobot sends a video then does the nested blocks.");
        this.setHelpUrl("");
    }
};

// Send video translation (new, but old is kept since others might be using it)
Blockly.JavaScript['send_video_new'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var checkbox_ignore = (block.getFieldValue('IGNORE') === 'TRUE');
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');

    if (value_url === "") value_url = "''";

    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send video' block needs to be in a 'start', 'repeat', or function block - " + value_url + "\n";
    } else if (!isValidSay(block)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send video' block needs to be outside an 'ask' or 'option' block - " + value_url + "\n";
    }

    if (checkbox_ignore || isValidVideoUrl(value_url)) {
        block.setColour("#a5805b");
        return "say({attachment: 'video', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
    else {
        block.setColour("#FF2222");
        return "// ERROR: Video URL invalid. Must start with 'https://' or 'http://' and end with mp4/avi/mov/flv/wmv\n" + 
        "say('Included video was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
};

// Send audio definition
Blockly.Blocks['send_audio'] = {
    init: function() {
        this.appendValueInput("URL")
            .setCheck("String")
            .appendField("send audio from link:");
        this.appendStatementInput("ACTIONS")
            .setCheck('action')
            .appendField("then");
        this.setPreviousStatement(true, 'action');
        this.setColour(30);
        this.setTooltip("Nemobot sends an audio file then does the nested blocks.");
        this.setHelpUrl("");
    }
};

// Send audio translation
Blockly.JavaScript['send_audio'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');

    if (value_url === "") value_url = "''";

    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send audio' block needs to be in a 'start', 'repeat', or function block - " + value_url + "\n";
    } else if (!isValidSay(block)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send audio' block needs to be outside an 'ask' or 'option' block - " + value_url + "\n";
    }

    if (isValidAudioUrl(value_url)) {
        block.setColour("#a5805b");
        return "say({attachment: 'audio', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
    else {
        block.setColour("#FF2222");
        return "// ERROR: Audio URL invalid. Must start with 'https://' or 'http://' and end with mp4/avi/mov/flv/wmv\n" + 
        "say('Included audio was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
};

// Send audio definition (new, but old is kept since others might be using it)
Blockly.Blocks['send_audio_new'] = {
    init: function() {
        this.appendValueInput("URL")
            .setCheck("String")
            .appendField("send audio from the link");
        this.appendStatementInput("ACTIONS")
            .setCheck("action")
            .appendField("then");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("ignore errors?")
            .appendField(new Blockly.FieldCheckbox("FALSE"), "IGNORE");
        this.setPreviousStatement(true, null);
        this.setColour(30);
        this.setTooltip("Nemobot sends an audio file then does the nested blocks.");
        this.setHelpUrl("");
    }
};

// Send audio translation (new, but old is kept since others might be using it)
Blockly.JavaScript['send_audio_new'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var checkbox_ignore = (block.getFieldValue('IGNORE') === 'TRUE');
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');

    if (value_url === "") value_url = "''";

    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send audio' block needs to be in a 'start', 'repeat', or function block - " + value_url + "\n";
    } else if (!isValidSay(block)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'send audio' block needs to be outside an 'ask' or 'option' block - " + value_url + "\n";
    }

    if (checkbox_ignore || isValidAudioUrl(value_url)) {
        block.setColour("#a5805b");
        return "say({attachment: 'audio', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
    else {
        block.setColour("#FF2222");
        return "// ERROR: Audio URL invalid. Must start with 'https://' or 'http://' and end with mp4/avi/mov/flv/wmv\n" + 
        "say('Included audio was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
    } 
};

// Ask block definition
Blockly.Blocks['ask'] = {
    init: function() {
        this.appendValueInput("DIALOGUE")
            .setCheck("String")
            .appendField("ask");
        this.appendStatementInput("ACTIONS")
            .setCheck(['option'])
            .appendField("options");
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'action');
        this.setColour(30);
        this.setTooltip("Nemobot sends a question. The options the user can choose are determined by the nested option blocks.");
        this.setHelpUrl("");
    }
};

// Ask block translation
Blockly.JavaScript['ask'] = function(block) {
    var value_dialogue = Blockly.JavaScript.valueToCode(block, 'DIALOGUE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');

    if (value_dialogue === "") value_dialogue = "''";

    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'ask' block needs to be in a 'start','repeat', or function block - " + value_dialogue + "\n";
    } else if (!isValidSay(block)) {
        block.setColour("#FF2222");
        return "// ERROR: this 'ask' block needs to be outside an 'ask' or 'option' block - " + value_dialogue + "\n";
    } else {
        block.setColour("#a5805b");
        return "let curPayload = JSON.parse(summarizeVariables());\n" +
        "let options = [];\n" + 
        statements_actions.replaceAll("\n  ", "\n").substring(2) +
        "sendButton(" + value_dialogue + ", options);\n";
    }
};

// Option with Variable block definition
Blockly.Blocks['option'] = {
    init: function() {
        this.appendValueInput("TITLE")
            .setCheck(["String"])
            .appendField("add");
        this.appendValueInput("PAYLOAD_VAL")
            .setCheck(["String", "Number"])
            .appendField("option which will set ")
            .appendField(new Blockly.FieldVariable("item"), "PAYLOAD_VAR")
            .appendField(" to");
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'option');
        this.setNextStatement(true, 'option');
        this.setColour(30);
        this.setTooltip("Adds an option. If chosen, it will update the given variable and goes back to the top of the repeat block.");
        this.setHelpUrl("");
    }
};

// Option with Variable block translation
Blockly.JavaScript['option'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    var variable_payload_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('PAYLOAD_VAR'), Blockly.Variables.NAME_TYPE);
    var value_payload_val = Blockly.JavaScript.valueToCode(block, 'PAYLOAD_VAL', Blockly.JavaScript.ORDER_ATOMIC);

    if (value_title === "") value_title = "''";
    if (value_payload_val === "") value_payload_val = "''";
    
    if (!isValidOption(block)) {
        block.setColour("#FF2222");
        return "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n";
    } else if (isOptionInOption(block)) {
        block.setColour("#FF2222");
        return "// ERROR: the following option must be outside other options - " + value_title + "\n";
    } else {
        block.setColour("#a5805b");
        return "// " + value_title + " option\n" +  
        "curPayload = JSON.parse(summarizeVariables()); \n" +
        variable_payload_var + ' = ' + value_payload_val + ';\n' + 
        "options.push({title: " + value_title +", payload: summarizeVariables()});\n" + 
        "updateVariables(curPayload); // restores variables \n";
    }
};

// Option only block definition
Blockly.Blocks['option_only'] = {
    init: function() {
        this.appendValueInput("TITLE")
            .setCheck(["String"])
            .appendField("add");
        this.appendDummyInput()
            .appendField("option");
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'option');
        this.setNextStatement(true, 'option');
        this.setColour(30);
        this.setTooltip("Adds an option. If chosen, nothing changes, but it still goes back to the top of the repeat block.");
        this.setHelpUrl("");
    }
};

// Option only block translation
Blockly.JavaScript['option_only'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);

    if (value_title === "") value_title = "''";

    if (!isValidOption(block)) {
        block.setColour("#FF2222");
        return "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n";
    } else if (isOptionInOption(block)) {
        block.setColour("#FF2222");
        return "// ERROR: the following option must be outside other options - " + value_title + "\n";
    } else {
        block.setColour("#a5805b");
        return "// " + value_title + " option\n" + 
        "options.push({title: " + value_title +", payload: summarizeVariables()});\n";
    }
};

// Option with variable and action block definition
Blockly.Blocks['option_do'] = {
    init: function() {
        this.appendValueInput("TITLE")
            .setCheck(["String"])
            .appendField("add");
        this.appendDummyInput()
            .appendField("option");
        this.appendStatementInput("ACTIONS")
            .setCheck('action')
            .appendField("if chosen, do");
        this.appendValueInput("PAYLOAD_VAL")
            .setCheck(["Number", "String"])
            .appendField("then set")
            .appendField(new Blockly.FieldVariable("item"), "PAYLOAD_VAR")
            .appendField(" to");
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'option');
        this.setNextStatement(true, 'option');
        this.setColour(30);
        this.setTooltip("Adds an option. If chosen, it will do the nested blocks, update the given variable, and go back to the top of the repeat block.");
        this.setHelpUrl("");
    }
  };

// Option with variable and action block translation
Blockly.JavaScript['option_do'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    var variable_payload_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('PAYLOAD_VAR'), Blockly.Variables.NAME_TYPE);
    var value_payload_val = Blockly.JavaScript.valueToCode(block, 'PAYLOAD_VAL', Blockly.JavaScript.ORDER_ATOMIC);
    
    if (value_title === "") value_title = "''";
    if (value_payload_val === "") value_payload_val = "''";
    
    if (!isValidOption(block)) {
        block.setColour("#FF2222");
        return "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n";
    } else if (isOptionInOption(block)) {
        block.setColour("#FF2222");
        return "// ERROR: the following option must be outside other options - " + value_title + "\n";
    } else {
        block.setColour("#a5805b");
        return "// " + value_title + " option\n" + 
        "curPayload = JSON.parse(summarizeVariables()); \n" +
        statements_actions + 
        variable_payload_var + ' = ' + value_payload_val + ';\n' + 
        "options.push({title: " + value_title +", payload: summarizeVariables()});\n" + 
        "updateVariables(curPayload); // restores variables \n";
    }
};

// Option with action block definition
Blockly.Blocks['option_do_only'] = {
    init: function() {
        this.appendValueInput("TITLE")
            .setCheck(["String"])
            .appendField("add");
        this.appendDummyInput()
            .appendField("option");
        this.appendStatementInput("ACTIONS")
            .setCheck('action')
            .appendField("if chosen, do");
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'option');
        this.setNextStatement(true, 'option');
        this.setColour(30);
        this.setTooltip("Adds an option. If chosen, it will do the nested blocks and go back to the top of the repeat block.");
        this.setHelpUrl("");
    }
};

// Option with action block translation
Blockly.JavaScript['option_do_only'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');

    if (value_title === "") value_title = "''";

    if (!isValidOption(block)) {
        block.setColour("#FF2222");
        return "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n";
    } else if (isOptionInOption(block)) {
        block.setColour("#FF2222");
        return "// ERROR: the following option must be outside other options - " + value_title + "\n";
    } else {
        block.setColour("#a5805b");
        return "// " + value_title + " option\n" + 
        "curPayload = JSON.parse(summarizeVariables()); \n" + 
        statements_actions + 
        "options.push({title: " + value_title +", payload: summarizeVariables()});\n" +
        "updateVariables(curPayload); // restores variables \n";
    }
};

// Option with restart block definition
Blockly.Blocks['option_restart'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("add");
        this.appendValueInput("TITLE")
            .setCheck(["String"]);
        this.appendDummyInput()
            .appendField("option to restart");
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'option');
        this.setNextStatement(true, 'option');
        this.setColour(30);
        this.setTooltip("Adds an option. If chosen, all variables are reset and it goes back to the start block.");
        this.setHelpUrl("");
    }
};

// Option with restart block translation
Blockly.JavaScript['option_restart'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);

    if (value_title === "") value_title = "''";

    if (!isValidOption(block)) {
        block.setColour("#FF2222");
        return "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n";
    } else if (isOptionInOption(block)) {
        block.setColour("#FF2222");
        return "// ERROR: the following option must be outside other options - " + value_title + "\n";
    } else {
        block.setColour("#a5805b");
        return "// " + value_title + " option\n" + 
        "options.push({title: " + value_title +", payload: 'restart'});\n";
    }
};

// Start block definition
Blockly.Blocks['start'] = {
    init: function() {
        this.appendStatementInput("ACTIONS")
            .setCheck(null)
            .appendField("start");
        this.setColour(15);
        this.setTooltip("Nested blocks are run at the start of the program or when the restart option is chosen. All variables are reset to null.");
        this.setHelpUrl("");
    }
};

// Start block translation
Blockly.JavaScript['start'] = function(block) {
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    return "" +
        "// run at the start of the program or when restart option is chosen\n" + 
        "const start = (sayIn, sendButtonIn) => { \n" + 
            "  say = sayIn;\n" +
            "  sendButton = sendButtonIn;\n" +
            statements_actions + 
        "}; \n\n\n";
};

// Repeat block definition
Blockly.Blocks['repeat'] = {
    init: function() {
        this.appendStatementInput("ACTIONS")
            .setCheck(null)
            .appendField("repeat");
        this.setColour(15);
        this.setTooltip("Nested blocks are run whenever an option is chosen by a user after Nemobot asks a question. ");
        this.setHelpUrl("");
    }
};

// Repeat block translation
Blockly.JavaScript['repeat'] = function(block) {
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    return "// repeated every time a button is pressed\n" + 
    "const repeat = (payload, sayIn, sendButtonIn) => { \n" + 
        "  say = sayIn;\n" +
        "  sendButton = sendButtonIn;\n" +
        "  updateVariables(JSON.parse(payload)); \n" + 
        statements_actions + 
    "}; \n\n\n";
};

// New line block definition
Blockly.Blocks['new_line'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("new line");
        this.setOutput(true, "String");
        this.setColour(160);
        this.setTooltip("Returns a new line character like pressing the enter button.");
        this.setHelpUrl("");
    }
};

// New line block translation
Blockly.JavaScript['new_line'] = function(block) {
    var code = "'\\n'";
    return [code, Blockly.JavaScript.ORDER_NONE];
};
// Text from block definition
Blockly.Blocks['text_from'] = {
    init: function() {
        this.appendValueInput("input")
            .setCheck(null)
            .appendField("text from");
        this.setOutput(true, "String");
        this.setColour(160);
        this.setTooltip("Returns a string or text version of the input.");
        this.setHelpUrl("");
    }
};

// Text from block translation
Blockly.JavaScript['text_from'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'input', Blockly.JavaScript.ORDER_ATOMIC);
    var code = 'String(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

// Random number block definition
Blockly.Blocks['random_number'] = {
    init: function() {
        this.appendValueInput("START")
            .setCheck("Number")
            .appendField("random number from");
        this.appendValueInput("END")
            .setCheck("Number")
            .appendField("to");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("Return a random integer between the two specified limits, inclusive.");
        this.setHelpUrl("");
    }
};

// Random number block translation
Blockly.JavaScript['random_number'] = function(block) {
    var value_start = Blockly.JavaScript.valueToCode(block, 'START', Blockly.JavaScript.ORDER_ATOMIC) | "0";
    var value_end = Blockly.JavaScript.valueToCode(block, 'END', Blockly.JavaScript.ORDER_ATOMIC) | "0";
    var code = 'Math.floor(Math.random() * Math.abs(' + value_end + ' - ' + value_start + ' + 1) + ' + value_start + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

// New object block definition
Blockly.Blocks['obj_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("new object");
        this.setOutput(true, "Object");
        this.setColour(65);
        this.setTooltip("Create an empty object.");
        this.setHelpUrl("");
    }
};

// New object block translation
Blockly.JavaScript['obj_create'] = function(block) {
    var code = '{}';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

// Get object block definition
Blockly.Blocks['obj_get'] = {
    init: function() {
        this.appendValueInput("KEY")
            .setCheck("String")
            .appendField("get");
        this.appendValueInput("OBJ")
            .setCheck("Object")
            .appendField("in");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(65);
        this.setTooltip("Get a value from the object in the second input.");
        this.setHelpUrl("");
    }
};

// Get object block translation
Blockly.JavaScript['obj_get'] = function(block) {
    var value_obj = Blockly.JavaScript.valueToCode(block, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC);
    var value_key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);

    if (value_key === "") value_key = "''";

    if (value_obj === "") {
        block.setColour("#FF2222");
        return ["/* ERROR: missing object input for the key " + value_key + "*/ null", Blockly.JavaScript.ORDER_NONE];
    } else {
        block.setColour("#9FA55B");
    }

    var code = "(typeof " + value_obj + " === 'object' && " + value_key + " in " + value_obj + ") ? " + value_obj + "[" + value_key + "] : null";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

// Set object block definition
Blockly.Blocks['obj_set'] = {
    init: function() {
        this.appendValueInput("KEY")
            .setCheck("String")
            .appendField("set");
        this.appendValueInput("OBJ")
            .setCheck("Object")
            .appendField("from the");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("object to");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip("Set a value in the input object.");
        this.setHelpUrl("");
    }
};

// Set object block translation
Blockly.JavaScript['obj_set'] = function(block) {
    var value_key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
    var value_obj = Blockly.JavaScript.valueToCode(block, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC);
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC);
    
    var code = "if (typeof " + value_obj + " !== 'object') " + value_obj + " = {};\n" + 
    value_obj + "[" + value_key + "] = " + value_input + ";\n";
    return code;
};

// Set object block definition (new, but old is kept if someone is using it)
Blockly.Blocks['obj_set_new'] = {
    init: function() {
        this.appendValueInput("KEY")
            .setCheck("String")
            .appendField("set");
        this.appendValueInput("OBJ")
            .setCheck("Object")
            .appendField("in");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("to");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip("Set a value in the input object.");
        this.setHelpUrl("");
    }
};

// Set object block translation (new, but old is kept if someone is using it)
Blockly.JavaScript['obj_set_new'] = function(block) {
    var value_key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ATOMIC);
    var value_obj = Blockly.JavaScript.valueToCode(block, 'OBJ', Blockly.JavaScript.ORDER_ATOMIC);
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ATOMIC);

    if (value_key === "") value_key = "''";
    if (value_input === "") value_input = "''";

    if (value_obj === "") {
        block.setColour("#FF2222");
        return "// ERROR: missing object input for the key '" + value_key + "'\n";
    } else if (value_obj === "({})") {
        block.setColour("#FF2222");
        return "// ERROR: input object cannot be a new object, store it in a vairable first'\n";
    } else {
        block.setColour("#9FA55B");
    }

    var code = "if (typeof " + value_obj + " !== 'object') " + value_obj + " = {};\n" + 
    value_obj + "[" + value_key + "] = " + value_input + ";\n";
    return code;
};

Blockly.Blocks['obj_text_from'] = {
    init: function() {
        this.appendValueInput("input")
            .setCheck("Object")
            .appendField("text from object");
        this.setOutput(true, "String");
        this.setColour(65);
        this.setTooltip("Returns a string or text version of the object.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['obj_text_from'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'input', Blockly.JavaScript.ORDER_ATOMIC);
    var code = 'JSON.stringify(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

// Axios call with objects block definition
Blockly.Blocks['axios_call'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("axios call using ");
        this.appendValueInput("PARAMS")
            .setCheck("Object")
            .appendField("parameters from");
        this.appendStatementInput("SCS_ACTIONS")
            .setCheck(null)
            .appendField("on success");
        this.appendStatementInput("ERR_ACTIONS")
            .setCheck(null)
            .appendField("on error");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setColour(65);
        this.setTooltip("Make an axios call with parameters from the input object. ");
        this.setHelpUrl("");
    }
};

// Axios call with objects block translation
Blockly.JavaScript['axios_call'] = function(block) {
    var value_params = Blockly.JavaScript.valueToCode(block, 'PARAMS', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_scs_actions = Blockly.JavaScript.statementToCode(block, 'SCS_ACTIONS');
    var statements_err_actions = Blockly.JavaScript.statementToCode(block, 'ERR_ACTIONS');
    
    if (value_params === "") {
        block.setColour("#FF2222");
        return "// ERROR: axios call is missing parameters\n";
    } else {
        block.setColour("#9FA55B");
    }

    var code = "if ('method' in " + value_params + " && 'url' in " + value_params + ') axios(' + value_params + ')\n' + 
    '.then((axios_res) => {\n' + statements_scs_actions + '})\n' + 
    '.catch((axios_res) => {\n' + statements_err_actions + '});\n';
    return code;
};

// Axios call with inputs block definition
Blockly.Blocks['axios_call_simple'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("axios call");
        this.appendValueInput("METHOD")
            .setCheck("String")
            .appendField("method");
        this.appendValueInput("url")
            .setCheck("String")
            .appendField("url");
        this.appendStatementInput("SCS_ACTIONS")
            .setCheck(null)
            .appendField("on success");
        this.appendStatementInput("ERR_ACTIONS")
            .setCheck(null)
            .appendField("on error");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setColour(65);
        this.setTooltip("Make an axios call with parameters from the input object. ");
        this.setHelpUrl("");
    }
};

// Axios call with inputs block translation
Blockly.JavaScript['axios_call_simple'] = function(block) {
    var value_method = Blockly.JavaScript.valueToCode(block, 'METHOD', Blockly.JavaScript.ORDER_ATOMIC);
    var value_url = Blockly.JavaScript.valueToCode(block, 'url', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_scs_actions = Blockly.JavaScript.statementToCode(block, 'SCS_ACTIONS');
    var statements_err_actions = Blockly.JavaScript.statementToCode(block, 'ERR_ACTIONS');
    
    if (value_method === "" || value_url === "") {
        block.setColour("#FF2222");
        return "// ERROR: axios call is missing parameters\n";
    } else {
        block.setColour("#9FA55B");
    }

    var code = 'axios({\n' + 
    '  method: ' + value_method + ',\n' + 
    '  url: ' + value_url + 
    '\n})\n' + 
    '.then((axios_res) => {\n' + statements_scs_actions + '})\n' + 
    '.catch((axios_res) => {\n' + statements_err_actions + '});\n';
    return code;
};

// Axios result block definition
Blockly.Blocks['axios_result'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("axios result");
        this.setInputsInline(false);
        this.setOutput(true, "Object");
        this.setColour(65);
        this.setTooltip("Object result on a successful axios call.");
        this.setHelpUrl("");
    }
};

// Axios result block translation
Blockly.JavaScript['axios_result'] = function(block) {
    var comment = '';
    if (isValidAxiosRes(block)) {
        block.setColour("#9FA55B");
    } else {
        block.setColour("#FF2222");
        comment = ' /* ERROR: axios result block needs to be in an axios call block */';
    }
    var code = 'axios_res' + comment;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

// Add loading lists