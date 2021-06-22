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
    return(isValidHttpUrl(url) && url.match(/\.(jpg|jpeg|png|gif|svg)$/) != null);
}

function isValidVideoUrl(urlString) {
    var url = urlString.substring(1, urlString.length-1);
    return(isValidHttpUrl(url) && url.match(/\.(mp4|avi|mov|flv|wmv)$/) != null);
}

function isValidAudioUrl(urlString) {
    var url = urlString.substring(1, urlString.length-1);
    return(isValidHttpUrl(url) && url.match(/\.(mp3|wav|aiff|aac|flac)$/) != null);
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
        this.setNextStatement(true, 'action');
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['say'] = function(block) {
    var value_dialogue = Blockly.JavaScript.valueToCode(block, 'DIALOGUE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    // TODO: Assemble JavaScript into code variable.
    if (value_dialogue === "") value_dialogue = "''";
    var code = "" + 
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
        this.setNextStatement(true, 'action');
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    }
  };

  Blockly.JavaScript['send_image'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    // TODO: Assemble JavaScript into code variable.
    var code;
    if (isValidImageUrl(value_url)) {
        code = "" + 
        "say({attachment: 'image', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
    else {
        code = "" + 
        "// ERROR: Image URL invalid. Must start with 'https://' or 'http://' and end with jpeg/jpg/gif/png/svg\n" + 
        "say('Included image was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
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
        this.setNextStatement(true, 'action');
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    }
  };

  Blockly.JavaScript['send_video'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    // TODO: Assemble JavaScript into code variable.
    var code;
    if (isValidVideoUrl(value_url)) {
        code = "" + 
        "say({attachment: 'video', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
    else {
        code = "" + 
        "// ERROR: Video URL invalid. Must start with 'https://' or 'http://' and end with mp3/wav/aiff/aac/flac\n" + 
        "say('Included video was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
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
      this.setNextStatement(true, 'action');
      this.setColour(30);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

  Blockly.JavaScript['send_audio'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    // TODO: Assemble JavaScript into code variable.
    var code;
    if (isValidAudioUrl(value_url)) {
        code = "" + 
        "say({attachment: 'audio', url:" + value_url + "}).then(() => {\n" + 
            statements_actions + 
        "});\n";
    }
    else {
        code = "" + 
        "// ERROR: Audio URL invalid. Must start with 'https://' or 'http://' and end with mp4/avi/mov/flv/wmv\n" + 
        "say('Included audio was not found in the given link: " + value_url.substring(1, value_url.length-1) + "').then(() => {\n" + 
            statements_actions + 
        "});\n";
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
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['ask'] = function(block) {
    var value_dialogue = Blockly.JavaScript.valueToCode(block, 'DIALOGUE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    if (value_dialogue === "") value_dialogue = "''";
    statements_actions = statements_actions.replaceAll("// ERROR: the following option must be in an 'ask' block - ", "// new option for ")
    var code = "" + 
        "const curPayload = summarizeVariables();\n" +
        "let options = [];\n" + 
        statements_actions.replaceAll("\n  ", "\n").substring(2) + 
        "sendButton(" + value_dialogue + ", options);\n";
    return code;
};

Blockly.Blocks['option'] = {
    init: function() {
        this.appendValueInput("TITLE")
            .setCheck(["String", "Number"])
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
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['option'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    var variable_payload_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('PAYLOAD_VAR'), Blockly.Variables.NAME_TYPE);
    var value_payload_val = Blockly.JavaScript.valueToCode(block, 'PAYLOAD_VAL', Blockly.JavaScript.ORDER_ATOMIC);
    if (value_title === "") value_title = "''";
    if (value_payload_val === "") value_payload_val = "''";
    var code = "" + 
        "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n" +  
        "updateVariables(curPayload); // restores variables \n" + 
        variable_payload_var + ' = ' + value_payload_val + ';\n' + 
        "options.push({title: " + value_title +", payload: JSON.stringify(summarizeVariables())});\n";
    return code;
};

Blockly.Blocks['option_only'] = {
    init: function() {
        this.appendValueInput("TITLE")
            .setCheck(["String", "Number"])
            .appendField("add");
        this.appendDummyInput()
            .appendField("option");
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'option');
        this.setNextStatement(true, 'option');
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['option_only'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    if (value_title === "") value_title = "''";
    var code = "" + 
        "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n" + 
        "updateVariables(curPayload); // restores variables \n" + 
        "options.push({title: " + value_title +", payload: JSON.stringify(summarizeVariables())});\n"
    return code;
};

Blockly.Blocks['option_do'] = {
    init: function() {
        this.appendValueInput("TITLE")
            .setCheck(["Number", "String"])
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
        this.setTooltip("Changes to variables are reflected only if this option is chosen.");
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
    var code = "" + 
        "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n" + 
        "updateVariables(curPayload); // restores variables \n" + 
        statements_actions + 
        variable_payload_var + ' = ' + value_payload_val + ';\n' + 
        "options.push({title: " + value_title +", payload: JSON.stringify(summarizeVariables())});\n"
    return code;
  };

Blockly.Blocks['option_do_only'] = {
    init: function() {
        this.appendValueInput("TITLE")
            .setCheck(["Number", "String"])
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
        this.setTooltip("Changes to variables are reflected only if this option is chosen.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['option_do_only'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    if (value_title === "") value_title = "''";
    var code = "" + 
        "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n" + 
        "updateVariables(curPayload); // restores variables \n" + 
        statements_actions + 
        "options.push({title: " + value_title +", payload: JSON.stringify(summarizeVariables())});\n"
    return code;
};

Blockly.Blocks['option_restart'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("add");
        this.appendValueInput("TITLE")
            .setCheck(["String", "Number"]);
        this.appendDummyInput()
            .appendField("option to restart");
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'option');
        this.setNextStatement(true, 'option');
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['option_restart'] = function(block) {
    var value_title = Blockly.JavaScript.valueToCode(block, 'TITLE', Blockly.JavaScript.ORDER_ATOMIC);
    if (value_title === "") value_title = "''";
    var code = "" + 
        "// ERROR: the following option must be in an 'ask' block - " + value_title + "\n" + 
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
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['start'] = function(block) {
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    var varList = Blockly.Variables.allUsedVarModels(block.workspace);
    var unique_payload = Blockly.JavaScript.variableDB_.getDistinctName('payload', Blockly.Variables.NAME_TYPE);
    var code = "" +
        "// puts all used variables in a dictionary object\n" + 
        "const summarizeVariables = () => { \n" +
            "  return { \n" +
                varList.reduce((sum, cur)  => sum + "    " + Blockly.JavaScript.variableDB_.getName(cur.name, Blockly.Variables.NAME_TYPE) + ": " + Blockly.JavaScript.variableDB_.getName(cur.name, Blockly.Variables.NAME_TYPE) + ",\n", "") + 
            "  }; \n" + 
        "}; \n\n\n" +   
        "// updates all used variables based on the payload dictionary object \n" + 
        "const updateVariables = (" + unique_payload + ") => { \n" + 
            varList.reduce((sum, cur)  => {
                let newSum = sum;
                let varName = Blockly.JavaScript.variableDB_.getName(cur.name, Blockly.Variables.NAME_TYPE);
                let illegalNames = ["state", "start", "curPayload", "options", "summarizeVariables", "updateVariables", "sendButton", "say"];
                if (illegalNames.includes(varName)) newSum = newSum + "  // ERROR: the name '" + varName + "' is already used\n";
                return newSum + "  " + varName + " = " + unique_payload + "." + varName + ";\n";
            }, "") + 
        "}; \n\n\n" +
        "// run at the start of the program or when restart option is chosen\n" + 
        "const start = (say, sendButton) => { \n" + 
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
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['repeat'] = function(block) {
    var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
    var code =  "// repeated every time a button is pressed\n" + 
    "const state = (payload, say, sendButton) => { \n" + 
        "  updateVariables(JSON.parse(payload)); \n" + 
        statements_actions + 
    "}; \n\n\n";
    return code;
};

// TODO: Error check for options out of place
// TODO: Error check for infinite loops
// TODO: Error check for variables with name 'state' and 'start' and other function names and curPayload and options