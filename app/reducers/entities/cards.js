import { combineReducers } from 'redux'
import update from 'react/lib/update';

import { isNumeric } from '../../utils';

const getSubTaskIndex = (state, cardId, parentId) => {
  return state[parentId].subtasks.indexOf(cardId);
};

const addCard = (state, id, card) => {
  return {
    ...state,
    [id]: {
      ...card
    }
  };
};

const removeSubtask = (state, cardId, parentId) => {
  const index = getSubTaskIndex(state, cardId, parentId);

  return update(state, {
    [parentId]: {
      subtasks: {
        $splice: [[index, 1]]
      }
    }
  });
};

const records = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_CARD':
    case 'ADD_CARD_SUCCESS':
    case 'UPDATE_CARD': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.card
        }
      };
    }
    case 'ADD_CARDS': {
      return {
        ...state,
        ...action.payload.cards
      }
    }
    case 'ADD_SUBTASK': {
      const { id, card, parentId } = action.payload;

      const clonedCard = { ...card };

      clonedCard.subtasks = [];

      // First add the card
      const addedCardState = addCard(state, id, clonedCard);

      // Then add the subtask id to the parent card
      return update(addedCardState, {
        [parentId]: {
          subtasks: {
            $push: [id]
          }
        }
      });
    }
    case 'ADD_SUBTASKS': {
      const { subtasks, cardId, addToTop } = action.payload;

      const newState = {
        ...state,
        ...subtasks
      };

      let subtaskIds = [];

      // Go through each comment and check if it doesnt already exists
      for(let key in subtasks) {
        if(subtasks.hasOwnProperty(key)) {
          key = isNumeric(key) ? parseInt(key) : key;
          if (newState[cardId].subtasks.indexOf(key) === -1) {
            subtaskIds.push(key);
          }
        }
      }

      if (addToTop) {
        return update(newState, {
          [cardId]: {
            subtasks: {
              $splice: [[0, 0, ...subtaskIds]]
            }
          }
        });
      } else {
        return update(newState, {
          [cardId]: {
            subtasks: {
              $push: [...subtaskIds]
            }
          }
        });
      }
    }
    case 'REMOVE_SUBTASK': {
      const { id, parentId } = action.payload;
      return removeSubtask(state, id, parentId);
    }
    case 'ADD_COMMENT': {
      const { id, cardId } = action.payload;
      // First check if the id is already in the list

      if (state[cardId].comments.indexOf(id) > -1) {
        return state;
      }

      return update(state, {
        [cardId]: {
          comments: {
            $push: [id]
          }
        }
      });
    }
    case 'ADD_COMMENTS': {
      const { comments, cardId } = action.payload;

      let commentIds = [];

      // Go through each comment and check if it doesnt already exists
      for(let key in comments) {
        if(comments.hasOwnProperty(key)) {
          key = isNumeric(key) ? parseInt(key) : key;
          if (state[cardId].comments.indexOf(key) === -1) {
            commentIds.push(key);
          }
        }
      }

      return update(state, {
        [cardId]: {
          comments: {
            $push: [...commentIds]
          }
        }
      });
    }
    default: {
      return state;
    }
  }
};

const conditions = (state = {}, action) => {
  switch (action.type) {
    case 'CARD_SELECTED': {
      return {
        ...state,
        currentId: action.payload.id
      }
    }
    case 'REQUEST_SECTIONS_AND_TASKS': {
      return {
        ...state,
        currentId: undefined
      }
    }
    default: {
      return state;
    }
  }
};

const cards = combineReducers({
  records,
  conditions
});

export default cards;
