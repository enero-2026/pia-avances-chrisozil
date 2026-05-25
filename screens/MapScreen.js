import React, { useContext } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { TravelContext } from '../context/TravelContext';

// Solo importamos los mapas nativos si NO estamos en la plataforma Web
let MapView, Marker;
if (Platform.OS !== 'web') {
  const ReactFontMaps = require('react-native-maps');
  MapView = ReactFontMaps.default;
  Marker = ReactFontMaps.Marker;
}

export default function MapScreen() {
  const { places } = useContext(TravelContext);

  const defaultRegion = {
    latitude: 25.6866,
    longitude: -100.3161,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  // SI ESTAMOS EN LA PC (WEB): Mostramos una interfaz limpia de simulación para que la app no crashee
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.webContainer]}>
        <Text style={styles.webTitle}>🗺️ Vista de Mapa (Simulación Web)</Text>
        <Text style={styles.webSubtitle}>
          Los mapas nativos de 'react-native-maps' solo se renderizan en dispositivos móviles (Expo Go) o emuladores.
        </Text>
        <View style={styles.webList}>
          <Text style={{fontWeight: 'bold', marginBottom: 5, color: '#1e293b'}}>Marcadores activos en memoria:</Text>
          {places.length === 0 ? (
            <Text style={{color: '#64748b'}}>No hay marcadores registrados.</Text>
          ) : (
            places.map(place => (
              <Text key={place.id} style={styles.webItem}>
                {place.visited ? '🟢' : '🔵'} {place.name} - ({place.coords?.latitude?.toFixed(4)}, {place.coords?.longitude?.toFixed(4)})
              </Text>
            ))
          )}
        </View>
      </View>
    );
  }

  // SI ESTAMOS EN EL CELULAR: Renderiza el mapa real con los pines dinámicos
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={defaultRegion}>
        {places.map(place => {
          // Validamos que el lugar realmente tenga coordenadas válidas antes de pintar el Marker
          if (!place.coords?.latitude || !place.coords?.longitude) return null;
          
          return (
            <Marker
              key={place.id}
              coordinate={place.coords}
              title={place.name}
              description={place.desc}
              pinColor={place.visited ? '#10b981' : '#3b82f6'} 
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  // Estilos exclusivos para que se vea ordenado en la PC
  webContainer: { padding: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  webTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
  webSubtitle: { fontSize: 14, color: '#475569', textAlign: 'center', maxWidth: 400, marginBottom: 20 },
  webList: { backgroundColor: '#fff', padding: 16, borderRadius: 12, width: '100%', maxWidth: 400, elevation: 2 },
  webItem: { fontSize: 13, color: '#334155', marginVertical: 3, fontFamily: 'sans-serif' }
});