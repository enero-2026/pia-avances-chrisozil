import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { TravelContext } from '../context/TravelContext';

export default function AddScreen({ navigation }) {
  const { addPlace } = useContext(TravelContext);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesitan permisos de GPS para guardar la ubicación exacta del destino.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      // Mock de coordenadas por si estás probando en Web de PC y el navegador bloquea el GPS
      setCoords({ latitude: 25.6866, longitude: -100.3161 });
    }
    setLoading(false);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Falta información', 'Por favor, introduce el nombre del destino turístico.');
      return;
    }
    if (!desc.trim()) {
      Alert.alert('Falta información', 'Escribe una breve reseña o nota sobre qué planeas hacer ahí.');
      return;
    }
    if (!coords) {
      Alert.alert('Falta GPS', 'Es obligatorio presionar el botón de capturar ubicación actual.');
      return;
    }

    addPlace(name, desc, coords);
    Alert.alert('¡Excelente!', 'El destino ha sido añadido correctamente a tu plan de viaje.');
    
    setName('');
    setDesc('');
    setCoords(null);
    navigation.navigate('Inicio');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📍 Nombre del Destino:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ej. Parque Fundidora" placeholderTextColor="#94a3b8" />

      <Text style={styles.label}>📝 ¿Qué vas a hacer ahí? (Notas):</Text>
      <TextInput style={[styles.input, { height: 90, textAlignVertical: 'top' }]} value={desc} onChangeText={setDesc} placeholder="Ej. Rentar una bicicleta..." placeholderTextColor="#94a3b8" multiline />

      <TouchableOpacity style={[styles.geoBtn, coords && styles.geoSuccess]} onPress={handleGetLocation} disabled={loading}>
        <Text style={styles.btnText}>
          {loading ? "Buscando satélites..." : coords ? "✔️ Coordenadas Listas" : "🛰️ Capturar Mi Ubicación Actual"}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#3b82f6" style={{ marginVertical: 10 }} />}

      {coords && (
        <View style={styles.coordsCard}>
          <Text style={styles.coordsText}>Latitud: {coords.latitude.toFixed(5)}</Text>
          <Text style={styles.coordsText}>Longitud: {coords.longitude.toFixed(5)}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.btnText}>💾 Guardar en Bitácora</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 6 },
  input: { backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 18, fontSize: 16, color: '#334155' },
  geoBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  geoSuccess: { backgroundColor: '#059669' },
  saveBtn: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  coordsCard: { backgroundColor: '#e2e8f0', padding: 12, borderRadius: 8, marginBottom: 15 },
  coordsText: { color: '#334155', fontSize: 13, textAlign: 'center', fontWeight: '600' } // CORREGIDO: Se removió fontFamily inválido
});