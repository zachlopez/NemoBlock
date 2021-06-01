import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import ListGroup from 'react-bootstrap/ListGroup';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
 
export default class App extends Component {
  constructor(props) {
    super(props);
    this.curNode = {};
    this.state = {
      blocks: [
        { 
          id: 'Blocks',
          title: 'Blocks', 
          canNest: true, 
          isSource: true,
          children: [
            { 
              title: 'If',
              canNest: true,
            }, { 
              title: 'For',
              canNest: true,
            }, { 
              title: 'Say',
              canNest: false,
            }, { 
              title: 'Set',
              canNest: false,
            }, 
          ]
        }
      ],
      booleans: [
        { 
          id: 'Booleans',
          title: 'Booleans', 
          canNest: true, 
          isSource: true,
          children: [
            { 
              title: '=',
              canNest: false,
            }, { 
              title: '>',
              canNest: false,
            }, { 
              title: '<',
              canNest: false,
            }, { 
              title: 'or',
              canNest: false,
            }, { 
              title: 'and',
              canNest: false,
            }, 
          ]
        }
      ],
      program: [
        { 
          id: 'Program',
          title: 'Program', 
          canNest: true,
          isSource: false,
          children: [] 
        },
      ],
    };
  }
 
  render() {
    const canNodeHaveChildren = ( node ) => node.canNest;
    const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
      console.log(nextPath);
      return (nextPath.indexOf('Blocks') < 0 && nextPath.indexOf('Booleans') < 0 && nextPath.length > 1); 
    };
    const canDrag = ({ node, path, treeIndex, lowerSiblingCounts, isSearchMatch, isSearchFocus }) => {
      return (path.length > 1);
    };
    const onMoveNode = ({ treeData, node, nextParentNode, prevPath, prevTreeIndex, nextPath, nextTreeIndex }) => {
      let tmpState = this.state;
      if (prevPath[0] === 'Blocks' || prevPath[0] ==='Booleans') {
        tmpState.lastNode = node;
      }
      else {
        tmpState.lastNode = null;
      }
      this.setState(tmpState);
    };
    const onChange = (nodes) => {
      let tmpState = {
        ...this.state,
        [nodes[0].id.toLowerCase()]: nodes,
      }
      if (tmpState.lastNode !== null) {
        const nodeSrc = tmpState.lastNode.source;
        let tmpNode = tmpState[nodeSrc[0]][0].children[nodeSrc[1]];
        tmpNode.id = tmpNode.title + "-" + tmpNode.count;
        tmpNode.count += 1;
        tmpState[nodeSrc[0]][0].children[nodeSrc[1]] = tmpNode;
        tmpState.lastNode = null;
      }
      console.log(tmpState);
      this.setState(tmpState);
    };
    return (
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={this.state.blocks}
          canNodeHaveChildren={canNodeHaveChildren}
          onChange={blocks => this.setState({ blocks })}
          canDrag={canDrag}
          canDrop={canDrop}
          getNodeKey={({ node }) => node.id || node.title}
          dndType={'blocks'}
          shouldCopyOnOutsideDrop={Boolean(true)}
          isVirtualized={Boolean(false)}
        />
        <SortableTree
          treeData={this.state.booleans}
          canNodeHaveChildren={canNodeHaveChildren}
          onChange={booleans => this.setState({ booleans })}
          canDrag={canDrag}
          canDrop={canDrop}
          getNodeKey={({ node }) => node.id}
          dndType={'booleans'}
          shouldCopyOnOutsideDrop={Boolean(true)}
          isVirtualized={Boolean(false)}
        />
        <SortableTree
          treeData={this.state.program}
          canNodeHaveChildren={canNodeHaveChildren}
          onChange={program => this.setState({ program })}
          canDrag={canDrag}
          canDrop={canDrop}
          getNodeKey={({ node }) => node.id}
          dndType={'blocks'}
          shouldCopyOnOutsideDrop={Boolean(false)}
          isVirtualized={Boolean(false)}
        />
      </div>
    );
  }
}