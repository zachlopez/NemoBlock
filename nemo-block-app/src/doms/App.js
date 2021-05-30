import React from 'react';
import '../styles/App.css';
import Column from './Column';
import initData from './init-data';
import { DragDropContext } from 'react-beautiful-dnd';

export default class App extends React.Component {
  state = initData;

  onDragStart = start => {
    this.setState({
      ...this.state,
      homeId: start.draggableId,
    });
  };

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
      destination.index === source.index)
    ) {
      this.setState({
        ...this.state,
        homeId: null,
      });
      return;
    }

    const srcColumn = this.state.columns[source.droppableId];
    const newSrcBlockIds = Array.from(srcColumn.blockIds);
    if (source.droppableId !== "blocks") newSrcBlockIds.splice(source.index, 1);

    const newSrcColumn = {
      ...srcColumn,
      blockIds: newSrcBlockIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newSrcColumn.id]: newSrcColumn,
      },
    };

    const desColumn = newState.columns[destination.droppableId];
    const newDesBlockIds = Array.from(desColumn.blockIds);
    if (source.droppableId === "blocks") {
        const oldId = draggableId;
        const newId = draggableId+newState.counts[oldId];
        newState.counts[oldId]++;
        newState.blocks[newId] = {
          ...newState.blocks[oldId],
          id: newId,
        };
        newDesBlockIds.splice(destination.index, 0, newId);
        if (newState.blocks[newId].command === "if" || newState.blocks[newId].command === "for") {
          newState.columns[newId] = {
            ...newState.columns[oldId],
            id: newId,
            blockIds: [],
          };
        }
    } else {
      newDesBlockIds.splice(destination.index, 0, draggableId);
    }

    const newDesColumn = {
      ...desColumn,
      blockIds: newDesBlockIds,
    };

    newState.columns[newDesColumn.id] = newDesColumn;
    newState.homeId = null;
    console.log(newState);
    this.setState(newState);
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
        {this.state.columnOrder.map(columnId => {
          return <Column key={columnId} columnId={columnId} state={this.state} parentDropDisabled={false}/>;
        })}
      </DragDropContext>
    );
  }
}
