import update from 'react/lib/update';

const initalState = {
  'workspaces': [],
  'projects': [],
  'sections': [
    {
      'name': 'Todo:',
      'id': 1,
      'cards': [
        {
          'id': 2,
          'name': 'Select a workspace',
          'completed': false,
          'completed_at': null,
          'due_on': null,
          'due_at': null
        },
        {
          'id': 3,
          'name': 'Select a project',
          'completed': false,
          'completed_at': null,
          'due_on': null,
          'due_at': null
        }
      ]
    },
    {
      'name': 'Completed:',
      'id': 0,
      'cards': []
    }
  ]
};

const moveCard = (state, idToMove, idToInsertAfter) => {
  // Get from/to coords -->> [swimlaneIndex, listIndex]
  let { fromXY, toXY } = function() {
    let moveFrom = [],
        moveTo = [];

    for (let sectionIndex = 0; sectionIndex < state.sections.length; sectionIndex++) {
      let section = state.sections[sectionIndex];

      for (let listIndex = 0; listIndex < section.cards.length; listIndex++) {
        let card = section.cards[listIndex];

        if (card.id === idToMove) {
          moveFrom = [sectionIndex, listIndex]
        }
        if (card.id === idToInsertAfter) {
          moveTo = [sectionIndex, listIndex]
        }

        if (moveFrom.length > 0 && moveTo.length > 0) {
          return { fromXY: moveFrom, toXY: moveTo} ;
        }
      }
    }
  }();

  if (!fromXY.length) {
    //error
    console.log('err wat, love fromXY')
  }

  if(!toXY.length) {
    toXY = fromXY;
  }

  return { fromXY: fromXY, toXY: toXY };
};

export default function reducer(state = initalState, action) {

  switch (action.type) {
    case 'RECEIVE_WORKSPACES': {
      return Object.assign({}, state, {
        workspaces: action.payload.workspaces
      });
    }
    case 'RECEIVE_PROJECTS': {
      return Object.assign({}, state, {
        projects: action.payload.projects
      });
    }
    case 'SET_SWIMLANES_AND_INITIAL_TASKS': {
      return Object.assign({}, state, {
        sections: action.payload.swimlanes
      });
    }
    case 'MOVING_TASK': {
      console.log('reducer MOVING_TASK')
      const { idToMove, idToInsertAfter } = action.payload;
      const { fromXY, toXY } = moveCard(state, idToMove, idToInsertAfter);

      // Get the card to move
      const card = state.sections[fromXY[0]].cards[fromXY[1]];

      let sectionIndex = fromXY[0];

      console.log(sectionIndex);

      // Remove the card from the state
      const newState = update(state, {
        sections: {
          [fromXY[0]]: {
            cards: {
              $splice: [[fromXY[1],1]]
            }
          }
        }
      });

      console.log('new state -->', newState);

      return update(newState, {
        sections: {
          [toXY[0]]: {
            cards: {
              $splice: [[toXY[1],0, card]]
            }
          }
        }
      });

    // let card = state.sections[fromXY[0]].cards.splice(fromXY[1], 1)[0];
    // state.sections[toXY[0]].cards.splice(toXY[1], 0, card);;

    }
    default: {
      return state;
    }
  }
}
