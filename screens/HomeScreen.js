import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, Alert, Modal, TextInput } from 'react-native';
import { TravelContext } from '../context/TravelContext';

export default function HomeScreen() {
  const { places, deletePlace, toggleVisited, updatePlace } = useContext(TravelContext);
  const [showVisited, setShowVisited] = useState(false);
  
  // Estados para el Modal de Edición
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const filteredPlaces = places.filter(p => p.visited === showVisited);

  const confirmDelete = (id) => {
    Alert.alert("Eliminar destino", "¿Seguro que quieres borrar este lugar de tu bitácora?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deletePlace(id) }
    ]);
  };

  const openEditModal = (place) => {
    setSelectedId(place.id);
    setEditName(place.name);
    setEditDesc(place.desc);
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editName.trim() || !editDesc.trim()) {
      Alert.alert("Error", "Los campos no pueden estar vacíos.");
      return;
    }
    updatePlace(selectedId, editName, editDesc);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Botones de Filtro */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterBtn, !showVisited && styles.activeFilter]} 
          onPress={() => setShowVisited(false)}
        >
          <Text style={styles.filterText}>📋 Por Visitar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, showVisited && styles.activeFilter]} 
          onPress={() => setShowVisited(true)}
        >
          <Text style={styles.filterText}>✅ Visitados</Text>
        </TouchableOpacity>
      </View>

      {/* Listado */}
      <FlatList
        data={filteredPlaces}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No tienes destinos en esta lista.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
              {/* CORREGIDO: Uso de ?. para evitar que la app crashee en blanco si coords no existe */}
              <Text style={styles.coords}>
                Gps: {item.coords?.latitude ? item.coords.latitude.toFixed(4) : '0.0000'}, {item.coords?.longitude ? item.coords.longitude.toFixed(4) : '0.0000'}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.statusBtn} onPress={() => toggleVisited(item.id)}>
                <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>
                  {item.visited ? "Marcar Pendiente" : "Completar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEditModal(item)}>
                <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item.id)}>
                <Text style={{color: '#fff', fontSize: 12, fontWeight: 'bold'}}>🗑️ Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal para Editar Lugar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalCenter}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Editar Destino</Text>
            <TextInput style={styles.input} value={editName} onChangeText={setEditName} placeholder="Nombre" />
            <TextInput style={styles.input} value={editDesc} onChangeText={setEditDesc} placeholder="Descripción" />
            <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
              <Button title="Cancelar" color="#64748b" onPress={() => setModalVisible(false)} />
              <Button title="Guardar Cambios" color="#3b82f6" onPress={handleSaveEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  filterContainer: { flexDirection: 'row', marginBottom: 16, gap: 10 },
  filterBtn: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#cbd5e1', borderRadius: 8 },
  activeFilter: { backgroundColor: '#3b82f6' },
  filterText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.2, shadowRadius: 1.41 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  desc: { fontSize: 14, color: '#475569', marginVertical: 4 },
  coords: { fontSize: 11, color: '#94a3b8', fontWeight: 'bold' },
  actions: { gap: 6, marginLeft: 10 },
  statusBtn: { backgroundColor: '#10b981', padding: 6, borderRadius: 6, alignItems: 'center' },
  editBtn: { backgroundColor: '#f59e0b', padding: 6, borderRadius: 6, alignItems: 'center' },
  deleteBtn: { backgroundColor: '#ef4444', padding: 6, borderRadius: 6, alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 40, color: '#64748b', fontSize: 16 },
  modalCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#0f172a' },
  input: { width: '100%', backgroundColor: '#f1f5f9', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#cbd5e1' }
});