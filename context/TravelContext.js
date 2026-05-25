import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);

  // Cargar datos del dispositivo al iniciar
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const savedPlaces = await AsyncStorage.getItem('@travel_places');
        if (savedPlaces !== null) {
          setPlaces(JSON.parse(savedPlaces));
        }
      } catch (e) {
        console.error("Error al cargar los lugares", e);
      }
    };
    loadPlaces();
  }, []);

  // Guardar datos en el dispositivo automáticamente cuando cambie el estado
  const saveToStorage = async (newPlaces) => {
    try {
      await AsyncStorage.setItem('@travel_places', JSON.stringify(newPlaces));
    } catch (e) {
      console.error("Error al guardar los lugares", e);
    }
  };

  // CREATE
  const addPlace = (name, desc, coords) => {
    const newPlaces = [
      ...places,
      { id: Date.now().toString(), name, desc, visited: false, coords }
    ];
    setPlaces(newPlaces);
    saveToStorage(newPlaces);
  };

  // UPDATE (Editar nombre y descripción)
  const updatePlace = (id, updatedName, updatedDesc) => {
    const newPlaces = places.map(place =>
      place.id === id ? { ...place, name: updatedName, desc: updatedDesc } : place
    );
    setPlaces(newPlaces);
    saveToStorage(newPlaces);
  };

  // TOGGLE VISITED
  const toggleVisited = (id) => {
    const newPlaces = places.map(place =>
      place.id === id ? { ...place, visited: !place.visited } : place
    );
    setPlaces(newPlaces);
    saveToStorage(newPlaces);
  };

  // DELETE
  const deletePlace = (id) => {
    const newPlaces = places.filter(place => place.id !== id);
    setPlaces(newPlaces);
    saveToStorage(newPlaces);
  };

  return (
    <TravelContext.Provider value={{ places, addPlace, updatePlace, deletePlace, toggleVisited }}>
      {children}
    </TravelContext.Provider>
  );
};