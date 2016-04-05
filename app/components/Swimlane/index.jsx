import React from 'react';

import './style';
import Card from '../Card';
import SwimlaneHeader from './header';
import SwimlaneFooter from './footer';

const Swimlane = React.createClass({
  handleNewTaskSubmit(task) {
    // Add the swimlane id
    let { id, newTaskSubmit} = this.props;
    newTaskSubmit(task, id);
  },

  handleTaskSelected(taskId) {
    let { id, onTaskSelected } = this.props;
    onTaskSelected(taskId, id);
  },

  renderCards() {
    const { cards, moveCard, taskUpdate } = this.props;

    return cards.map((card) => (
      <Card
        key={card.id}
        card={card}
        moveCard={moveCard}
        taskUpdate={taskUpdate}
        onCardClick={this.handleTaskSelected} />
    ));
  },

  render() {
    const { id, name, moveCard, taskUpdate } = this.props;

    return (
      <section className="swimlane">
        <SwimlaneHeader id={id}
                        title={name}
                        moveCard={moveCard}
                        taskUpdate={taskUpdate} />

        <div className="swimlane__cards">
          { this.renderCards() }
          <SwimlaneFooter id={id} onSubmit={ this.handleNewTaskSubmit } />
        </div>
      </section>
    );
  }
});

export default Swimlane;
