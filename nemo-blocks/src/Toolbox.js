const toolbox = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Logic",
        colour: "#5C81A6",
        contents: [
          {
            kind: "block",
            type: "controls_if",
          },
          {
            kind: "block",
            type: "logic_compare",
          },
          {
            kind: "block",
            type: "logic_operation",
          },
          {
            kind: "block",
            type: "logic_negate",
          },
          {
            kind: "block",
            type: "logic_boolean",
          },
          {
            kind: "block",
            type: "logic_null",
          },
          {
            kind: "block",
            type: "logic_ternary",
          },
        ],
      },
      {
        kind: "category",
        name: "Loops",
        colour: "#5ba55b",
        contents: [
          {
            kind: "block",
            type: "controls_repeat_ext",
          },
          {
            kind: "block",
            type: "controls_whileUntil",
          },
          {
            kind: "block",
            type: "controls_for",
          },
          {
            kind: "block",
            type: "controls_forEach",
          },
          {
            kind: "block",
            type: "controls_flow_statements",
          },
        ],
      },
      {
        kind: "category",
        name: "Math",
        colour: "#5b67a5",
        contents: [
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_arithmetic",
          },
          {
            kind: "block",
            type: "math_single",
          },
          {
            kind: "block",
            type: "math_trig",
          },
          {
            kind: "block",
            type: "math_constant",
          },
          {
            kind: "block",
            type: "math_number_property",
          },
          {
            kind: "block",
            type: "math_round",
          },
          {
            kind: "block",
            type: "math_on_list",
          },
          {
            kind: "block",
            type: "math_modulo",
          },
          {
            kind: "block",
            type: "math_constrain",
          },
          {
            kind: "block",
            type: "random_number",
          },
          {
            kind: "block",
            type: "math_random_float",
          },
        ],
      },
      {
        kind: "category",
        name: "Text",
        colour: "#5ba58c",
        contents: [
          {
            kind: "block",
            type: "text",
          },
          {
            kind: "block",
            type: "new_line",
          },
          {
            kind: "block",
            type: "text_from",
          },
          {
            kind: "block",
            type: "text_join",
          },
          {
            kind: "block",
            type: "text_append",
          },
          {
            kind: "block",
            type: "text_isEmpty",
          },
          {
            kind: "block",
            type: "text_indexOf",
          },
          {
            kind: "block",
            type: "text_charAt",
          },
          {
            kind: "block",
            type: "text_getSubstring",
          },
          {
            kind: "block",
            type: "text_changeCase",
          },
          {
            kind: "block",
            type: "text_trim",
          },
        ],
      },
      {
        kind: "category",
        name: "Lists",
        colour: "#745ba5",
        contents: [
          {
            kind: "block",
            type: "lists_create_with",
          },
          {
            kind: "block",
            type: "lists_repeat",
          },
          {
            kind: "block",
            type: "lists_length",
          },
          {
            kind: "block",
            type: "lists_isEmpty",
          },
          {
            kind: "block",
            type: "lists_indexOf",
          },
          {
            kind: "block",
            type: "lists_getIndex",
          },
          {
            kind: "block",
            type: "lists_setIndex",
          },
          {
            kind: "block",
            type: "lists_getSublist",
          },
          {
            kind: "block",
            type: "lists_split",
          },
          {
            kind: "block",
            type: "lists_sort",
          },
        ],
      },
      {
        kind: "category",
        name: "Variables",
        custom: "VARIABLE",
        colour: "#a55b80",
      },
      {
        kind: "category",
        name: "Functions",
        custom: "PROCEDURE",
        colour: "#995ba5",
      },
      {
        kind: "category",
        name: "Chat",
        colour: "#a5805b",
        contents: [
          {
            kind: "block",
            type: "say",
          },
          {
            kind: "block",
            type: "send_image_new",
          },
          {
            kind: "block",
            type: "send_video_new",
          },
          {
            kind: "block",
            type: "send_audio_new",
          },
          {
            kind: "block",
            type: "ask",
          },
          {
            kind: "block",
            type: "option_only",
          },
          {
            kind: "block",
            type: "option",
          },
          {
            kind: "block",
            type: "option_do_only",
          },
          {
            kind: "block",
            type: "option_restart",
          },
        ],
      },
      {
        kind: "category",
        name: "Advanced",
        colour: "#9fa55b",
        contents: [
          {
            kind: "block",
            type: "obj_create",
          },
          {
            kind: "block",
            type: "obj_get",
          },
          {
            kind: "block",
            type: "obj_set",
          },
          {
            kind: "block",
            type: "axios_call",
          },
          {
            kind: "block",
            type: "axios_call_simple",
          },
          {
            kind: "block",
            type: "axios_result",
          },
        ],
      },
    ],
  };

  export default toolbox;