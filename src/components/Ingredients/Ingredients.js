import React, { useReducer, useState, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../hooks/http';

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
};


const Ingredients = () => {
  // second argument is starting state
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  const { isLoading, error, data, sendRequest } = useHttp();



  // const [ userIngredients, setUserIngredients ] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

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

  const addIngredientHandler = useCallback(ingredient => {
    // dispatchHttp({type: 'SEND'});
    // fetch('https://react-hooks-update-3a9dd.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json'}
    // }).then(response => {
    //   dispatchHttp({type: 'RESPONSE'});
    //   return response.json();
    // }).then(responseData => {
    //   // setUserIngredients(prevIngredients =>
    //   //   [...prevIngredients,
    //   //     {
    //   //       id: responseData.name,
    //   //       ...ingredient
    //   //     }
    //   // ]);
    //   dispatch({type: 'ADD', ingredient: {
    //           id: responseData.name,
    //           ...ingredient
    //         }});
    // });
  }, []); // optional dispatchHttp cuz reack knows not to rerender it

  const removeIngredientHandler = useCallback(ingredientId => {
    // dispatchHttp({type: 'SEND'});
    sendRequest(`https://react-hooks-update-3a9dd.firebaseio.com/ingredients/${ingredientId}.json`, 'DELETE');

  }, [sendRequest]);

  const clearError = useCallback(() => {
    // synchronously every function inside, not trigger mamny rerender cycles
    // the new state value is only available in the next component render cycle
    // dispatchHttp({type: 'CLEAR'});
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
        ingredients={userIngredients} 
        onRemoveItem={removeIngredientHandler} 
      />
    )
  }, [userIngredients, removeIngredientHandler]);


  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
        />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
