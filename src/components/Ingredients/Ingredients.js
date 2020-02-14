import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
}

const Ingredients = () => {
  // second argument is starting state
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // const [ userIngredients, setUserIngredients ] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // useEffect(() => {
  //   fetch('https://react-hooks-update-3a9dd.firebaseio.com/ingredients.json').then(
  //     response => response.json()
  //   ).then(responseData => {
  //     const loadedIngredients = [];
  //     for (const key in responseData) {
  //       loadedIngredients.push({
  //         id: key,
  //         title: responseData[key].title,
  //         amount: responseData[key].amount
  //       });
  //     }
  //     setUserIngredients(loadedIngredients);
  //   });
  // }, []);
  // runs only once like componentDidMount

  useEffect(() => {
    // console.log('rendering ingredients'):
    // twice cuz we rerender when sertUserIngredients
    console.log('rendering ingredients');

  }, [userIngredients]);

  // useCallback - only when the function changes
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredeints);
    dispatch({type: 'SET', ingredients: filteredIngredients})

  }, []); // setUserIngredients will never change so we can omit it

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-update-3a9dd.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json'}
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      // setUserIngredients(prevIngredients =>
      //   [...prevIngredients,
      //     {
      //       id: responseData.name,
      //       ...ingredient
      //     }
      // ]);
      dispatch({type: 'ADD', ingredient: {
              id: responseData.name,
              ...ingredient
            }});
    });
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-update-3a9dd.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      // setUserIngredients(prevIngredients =>
      //   prevIngredients
      //   .filter(ingredient => ingredient.id !== ingredientId));
      dispatch({type: 'DELETE', id: ingredientId});
    }).catch(error => {
      setError('Sth is wrong');
      setIsLoading(false);
    })
  }

  const clearError = () => {
    // synchronously every function inside, not trigger mamny rerender cycles
    // the new state value is only available in the next component render cycle
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
        />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
