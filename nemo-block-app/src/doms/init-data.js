const initialData = {
    blocks: {
      'set': { id: 'set', title: 'Set', command: 'set' },
      'say': { id: 'say', title: 'Say', command: 'say' },
      'if': { id: 'if', title: 'If', command: 'if' },
      'if0': { id: 'if0', title: 'If', command: 'if' },
      'for': { id: 'for', title: 'For', command: 'for' },
      'for0': { id: 'for0', title: 'For', command: 'for' },
    },
    columns: {
      'blocks': {
        id: 'blocks',
        title: 'Blocks',
        blockIds: ['set', 'say', 'if', 'for'],
        isFunc: true,
      },
      'program': {
        id: 'program',
        title: 'Program',
        blockIds: ['for0'],
        isFunc: true,
      },
      'if': {
        id: 'if',
        title: 'If',
        blockIds: [],
        isFunc: false,
      },
      'if0': {
        id: 'if0',
        title: 'If',
        blockIds: [],
        isFunc: false,
      },
      'for': {
        id: 'for',
        title: 'For',
        blockIds: [],
        isFunc: false,
      },
      'for0': {
        id: 'for0',
        title: 'For',
        blockIds: ['if0'],
        isFunc: false,
      },
    },
    // Facilitate reordering of the columns
    columnOrder: ['blocks', 'program'],
    homeId: null,
    minHeight: 50,
    counts: {
      'set': 0,
      'say': 0,
      'if': 1,
      'for': 1,
    },
  };
  
  export default initialData;
  