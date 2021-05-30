import React from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { Draggable } from 'react-beautiful-dnd';

export default class Block extends React.Component {
  render() {
    return (
        <Draggable draggableId={this.props.block.id} index={this.props.index}>
            {(provided) => (
                <ListGroupItem as="li"
                    variant="flush"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <p {...provided.dragHandleProps}>{this.props.block.title}</p>
                </ListGroupItem>
            )}
        </Draggable>
    );
  }
}
