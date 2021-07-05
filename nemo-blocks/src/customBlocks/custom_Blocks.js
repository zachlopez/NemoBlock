import Blockly from 'blockly';
import 'blockly/python';

function isValidHttpUrl(urlString) {
    let url;

    try {
        url = new URL(urlString);
    } catch (_) {
        return false;  
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

function isValidImageUrl(urlString) {
    var url = urlString.substring(1, urlString.length-1);
    return(isValidHttpUrl(url) && url.match(/\.(jpg|jpeg|png|gif|svg)($|\?)/) != null);
}

function isValidVideoUrl(urlString) {
    var url = urlString.substring(1, urlString.length-1);
    return(isValidHttpUrl(url) && url.match(/\.(mp4|avi|mov|flv|wmv)($|\?)/) != null);
}

function isValidAudioUrl(urlString) {
    var url = urlString.substring(1, urlString.length-1);
    return(isValidHttpUrl(url) && url.match(/\.(mp3|wav|aiff|aac|flac)($|\?)/) != null);
}

function isOptionInOption(block) {
    var curBlock = block;
    while (curBlock.getSurroundParent() !== null && !['option_do', 'option_do_only'].includes(curBlock.getSurroundParent().type)) {
        curBlock = curBlock.getSurroundParent();
    }
    return curBlock.getSurroundParent() !== null;
}

function isValidOption(block) {
    var curBlock = block;
    while (curBlock.getSurroundParent() !== null && !['ask'].includes(curBlock.getSurroundParent().type)) {
        curBlock = curBlock.getSurroundParent();
    }
    return curBlock.getSurroundParent() !== null;
}

function isValidSay(block) {
    var curBlock = block;
    while (curBlock.getSurroundParent() !== null && !['ask', 'option_do', 'option_do_only'].includes(curBlock.getSurroundParent().type)) {
        curBlock = curBlock.getSurroundParent();
    }
    return curBlock.getSurroundParent() === null;
}

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

Blockly.JavaScript['say'] = function(block) {
    var value_dialogue = Blockly.JavaScript.valueToCode(block, 'DIALOGUE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    // TODO: Assemble JavaScript into code variable.
    if (value_dialogue === "") value_dialogue = "''";
    var code = "";
    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        code = code + "// ERROR: this 'say' block needs to be in a 'start','repeat', or function block - " + value_dialogue + "\n";
        block.setColour("#FF2222");
    } else if (!isValidSay(block)) {
        code = code + "// ERROR: this 'say' block needs to be outside an 'ask' or 'option' block - " + value_dialogue + "\n";
        block.setColour("#FF2222");
    } else {
        block.setColour("#a5805b");
    }
    code = code + 
        "say(" + value_dialogue + ").then(() => {\n" + 
            statements_actions + 
        "});\n";
    return code;
};

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

  Blockly.JavaScript['send_image'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    // TODO: Assemble JavaScript into code variable.
    var code = "";
    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        code = code + "// ERROR: this 'send image' block needs to be in a 'start', 'repeat', or function block - " + value_url + "\n";
        block.setColour("#FF2222");
    } else if (!isValidSay(block)) {
        code = code + "// ERROR: this 'send image' block needs to be outside an 'ask' or 'option' block - " + value_url + "\n";
        block.setColour("#FF2222");
    } else {
        block.setColour("#a5805b");
    }
    if (isValidImageUrl(value_url)) {
        code = code + 
        "say({attachment: 'image', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
        block.setColour("#a5805b");
    }
    else {
        code = code + 
        "// ERROR: Image URL invalid. Must start with 'https://' or 'http://' and end with jpeg/jpg/gif/png/svg\n" + 
        "say('Included image was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
        block.setColour("#FF2222");
    }
    return code;
  };

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

  Blockly.JavaScript['send_video'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    // TODO: Assemble JavaScript into code variable.
    var code = "";
    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        code = code + "// ERROR: this 'send video' block needs to be in a 'start', 'repeat', or function block - " + value_url + "\n";
        block.setColour("#FF2222");
    } else if (!isValidSay(block)) {
        code = code + "// ERROR: this 'send video' block needs to be outside an 'ask' or 'option' block - " + value_url + "\n";
        block.setColour("#FF2222");
    } else {
        block.setColour("#a5805b");
    }
    if (isValidVideoUrl(value_url)) {
        code = code + 
        "say({attachment: 'video', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
        block.setColour("#a5805b");
    }
    else {
        code = code + 
        "// ERROR: Video URL invalid. Must start with 'https://' or 'http://' and end with mp3/wav/aiff/aac/flac\n" + 
        "say('Included video was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
        block.setColour("#FF2222");
    }
    return code;
  };

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

  Blockly.JavaScript['send_audio'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    // TODO: Assemble JavaScript into code variable.
    var code = "";
    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        code = code + "// ERROR: this 'send audio' block needs to be in a 'start', 'repeat', or function block - " + value_url + "\n";
        block.setColour("#FF2222");
    } else if (!isValidSay(block)) {
        code = code + "// ERROR: this 'send audio' block needs to be outside an 'ask' or 'option' block - " + value_url + "\n";
        block.setColour("#FF2222");
    } else {
        block.setColour("#a5805b");
    }
    if (isValidAudioUrl(value_url)) {
        code = code + 
        "say({attachment: 'audio', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
        block.setColour("#a5805b");
    }
    else {
        code = code + 
        "// ERROR: Audio URL invalid. Must start with 'https://' or 'http://' and end with mp4/avi/mov/flv/wmv\n" + 
        "say('Included audio was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
        block.setColour("#FF2222");
    }
    return code;
  };

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

Blockly.JavaScript['ask'] = function(block) {
    var value_dialogue = Blockly.JavaScript.valueToCode(block, 'DIALOGUE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    if (value_dialogue === "") value_dialogue = "''";
    var code = "";
    if (!['start', 'repeat', 'procedures_defnoreturn', 'procedures_defreturn'].includes(block.getRootBlock().type)) {
        code = code + "// ERROR: this 'ask' block needs to be in a 'start','repeat', or function block - " + value_dialogue + "\n";
        block.setColour("#FF2222");
    } else if (!isValidSay(block)) {
        code = code + "// ERROR: this 'ask' block needs to be outside an 'ask' or 'option' block - " + value_dialogue + "\n";
        block.setColour("#FF2222");
    } else {
        block.setColour("#a5805b");
    }
    code = code + 
        "const curPayload = JSON.parse(summarizeVariables());\n" +
        "let options = [];\n" + 
        statements_actions.replaceAll("\n  ", "\n").substring(2) +
        "sendButton(" + value_dialogue + ", options);\n";
    return code;
};

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

Blockly.JavaScript['option'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    var variable_payload_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('PAYLOAD_VAR'), Blockly.Variables.NAME_TYPE);
    var value_payload_val = Blockly.JavaScript.valueToCode(block, 'PAYLOAD_VAL', Blockly.JavaScript.ORDER_ATOMIC);
    if (value_title === "") value_title = "''";
    if (value_payload_val === "") value_payload_val = "''";
    var code = "";
    if (!isValidOption(block)) {
        code = code + "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n";
        block.setColour("#FF2222");
    } else if (isOptionInOption(block)) {
        code = code + "// ERROR: the following option must be outside other options - " + value_title + "\n";
        block.setColour("#FF2222");
    } else {
        code = code + "// " + value_title + " option\n";
        block.setColour("#a5805b");
    }
    code = code +  
        "updateVariables(curPayload); // restores variables \n" + 
        variable_payload_var + ' = ' + value_payload_val + ';\n' + 
        "options.push({title: " + value_title +", payload: summarizeVariables()});\n";
    return code;
};

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

Blockly.JavaScript['option_only'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    if (value_title === "") value_title = "''";
    var code = "";
    if (!isValidOption(block)) {
        code = code + "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n";
        block.setColour("#FF2222");
    } else if (isOptionInOption(block)) {
        code = code + "// ERROR: the following option must be outside other options - " + value_title + "\n";
        block.setColour("#FF2222");
    } else {
        code = code + "// " + value_title + " option\n";
        block.setColour("#a5805b");
    }
    code = code + 
        "updateVariables(curPayload); // restores variables \n" + 
        "options.push({title: " + value_title +", payload: summarizeVariables()});\n"
    return code;
};

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

  Blockly.JavaScript['option_do'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    var variable_payload_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('PAYLOAD_VAR'), Blockly.Variables.NAME_TYPE);
    var value_payload_val = Blockly.JavaScript.valueToCode(block, 'PAYLOAD_VAL', Blockly.JavaScript.ORDER_ATOMIC);
    if (value_title === "") value_title = "''";
    if (value_payload_val === "") value_payload_val = "''";
    var code = "";
    if (!isValidOption(block)) {
        code = code + "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n";
        block.setColour("#FF2222");
    } else if (isOptionInOption(block)) {
        code = code + "// ERROR: the following option must be outside other options - " + value_title + "\n";
        block.setColour("#FF2222");
    } else {
        code = code + "// " + value_title + " option\n";
        block.setColour("#a5805b");
    }
    code = code + 
        "updateVariables(curPayload); // restores variables \n" + 
        statements_actions + 
        variable_payload_var + ' = ' + value_payload_val + ';\n' + 
        "options.push({title: " + value_title +", payload: summarizeVariables()});\n"
    return code;
  };

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

Blockly.JavaScript['option_do_only'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    if (value_title === "") value_title = "''";
    var code = "";
    if (!isValidOption(block)) {
        code = code + "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n";
        block.setColour("#FF2222");
    } else if (isOptionInOption(block)) {
        code = code + "// ERROR: the following option must be outside other options - " + value_title + "\n";
        block.setColour("#FF2222");
    } else {
        code = code + "// " + value_title + " option\n";
        block.setColour("#a5805b");
    }
    code = code + 
        "updateVariables(curPayload); // restores variables \n" + 
        statements_actions + 
        "options.push({title: " + value_title +", payload: summarizeVariables()});\n"
    return code;
};

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

Blockly.JavaScript['option_restart'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    if (value_title === "") value_title = "''";
    var code = "";
    if (!isValidOption(block)) {
        code = code + "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n";
        block.setColour("#FF2222");
    } else if (isOptionInOption(block)) {
        code = code + "// ERROR: the following option must be outside other options - " + value_title + "\n";
        block.setColour("#FF2222");
    } else {
        code = code + "// " + value_title + " option\n";
        block.setColour("#a5805b");
    }
    code = code + 
        "updateVariables(curPayload); // restores variables \n" + 
        "options.push({title: " + value_title +", payload: 'restart'});\n"
    return code;
};

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

Blockly.JavaScript['start'] = function(block) {
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    var code = "\n\n" +
        "// run at the start of the program or when restart option is chosen\n" + 
        "const start = (sayIn, sendButtonIn) => { \n" + 
            "  say = sayIn;\n" +
            "  sendButton = sendButtonIn;\n" +
            statements_actions + 
        "}; \n\n\n";
    return code;
};

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

Blockly.JavaScript['repeat'] = function(block) {
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    var code =  "// repeated every time a button is pressed\n" + 
    "const state = (payload, sayIn, sendButtonIn) => { \n" + 
        "  say = sayIn;\n" +
        "  sendButton = sendButtonIn;\n" +
        "  updateVariables(JSON.parse(payload)); \n" + 
        statements_actions + 
    "}; \n\n\n";
    return code;
};

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

Blockly.JavaScript['new_line'] = function(block) {
    var code = "'\\n'";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

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

Blockly.JavaScript['text_from'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'input', Blockly.JavaScript.ORDER_ATOMIC);
    var code = 'String(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['random_number'] = {
    init: function() {
        this.appendValueInput("START")
            .setCheck(null)
            .appendField("random number from");
        this.appendValueInput("END")
            .setCheck(null)
            .appendField("to");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("Return a random integer between the two specified limits, inclusive.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['random_number'] = function(block) {
    var value_start = Blockly.JavaScript.valueToCode(block, 'START', Blockly.JavaScript.ORDER_ATOMIC) | "0";
    var value_end = Blockly.JavaScript.valueToCode(block, 'END', Blockly.JavaScript.ORDER_ATOMIC) | "0";
    // TODO: Assemble JavaScript into code variable.
    var code = 'Math.floor(Math.random() * Math.abs(' + value_end + ' - ' + value_start + ' + 1) + ' + value_start + ')';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

// TODO: Error check for infinite loops
// TODO: API/Axios
// TODO: Documentation
// TODO: Replace random integer blocks in db with random number blocks