import { combineReducers } from 'redux'
import update from 'react/lib/update';

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

const removeCard = (state, cardId, parentId) => {
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
    case 'ADD_CARD_SUCCESS': {
      return addCard(state, action.payload.id, action.payload.card);
    }
    case 'UPDATE_CARD': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.card
        }
      };
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
    case 'REMOVE_SUBTASK': {
      const { id, parentId } = action.payload; 
      return removeCard(state, id, parentId);
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