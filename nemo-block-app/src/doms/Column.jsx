import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Block from './Block';
import IfBlock from './IfBlock';
import { Droppable } from 'react-beautiful-dnd';

export default class Column extends React.Component {
    render() {
        const mystyle = {
            minHeight: this.props.state.minHeight/2+"px",
        };
        const state = this.props.state;
        const column = state.columns[this.props.columnId];
        const blocks = column.blockIds.map(blockId => state.blocks[blockId]);
        let isDropDisabled = (state.homeId === column.id);
        isDropDisabled = (column.id === 'blocks') | isDropDisabled;
        isDropDisabled = this.props.parentDropDisabled | isDropDisabled;
        // TODO: Make program blocks scrollable
        return (
            <Card>
                {(column.isFunc) ? <Card.Title>{column.title}</Card.Title> : null}
                <Droppable droppableId={column.id} isDropDisabled={Boolean(isDropDisabled)} type="block">
                    {provided => {
                        return (
                        <ListGroup as="ul" style={mystyle}
                            ref={provided.innerRef} 
                            {...provided.droppableProps}
                        >
                            {blocks.map((block,index) => {
                                if (block.command === 'if' || block.command === 'for') {
                                    return <IfBlock key={block.id} block={block} index={index} state={state} parentDropDisabled={isDropDisabled}/>;
                                } else {
                                    return <Block key={block.id} block={block} index={index} state={state} parentDropDisabled={isDropDisabled}/>;
                                }
                            })}
                            {provided.placeholder}
                        </ListGroup>
                    )}}
                </Droppable>
            </Card>
        );
    }
}
