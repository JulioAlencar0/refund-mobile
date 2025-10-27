import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Alert,
  FlatList, Modal,
  StatusBar,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";

export default function App() {

type Refund = {
    id: string;
    name: string;
    category: string;
    value: string;
    fileName: string;
  };

  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const addRefund = () => {
    if (!name || !category || !value || !fileName) {
      Alert.alert("Preencha todos os campos antes de adicionar!");
      return;
    }
    const newRefund = {
      id: Date.now().toString(),
      name,
      category,
      value,
      fileName,
    };
    setRefunds([...refunds, newRefund]);
    setShowAddModal(false);
    setSuccessModal(true);
    setName("");
    setCategory("");
    setValue("");
    setFileName("");
  };

  const deleteRefund = (id: string) => {
    setRefunds(refunds.filter((r) => r.id !== id));
    setShowViewModal(false);
  };

  const filteredRefunds = refunds.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E4ECE9" barStyle="dark-content" />

      {/* Header */}
      <Image source={require("../assets/Logo.png")} style={styles.logo} />
      <TouchableOpacity
        style={styles.btnRefund}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={{ color: "#fff", fontWeight: "500" }}>Nova solicitação</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Solicitações</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Pesquise pelo nome"
            placeholderTextColor="#A1A2A1"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity style={styles.btnSearch}>
            <Image
              style={styles.search}
              source={require("../assets/Icon.png")}
            />
          </TouchableOpacity>
        </View>

        {/* Lista */}
        <FlatList
          data={filteredRefunds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.refundItem}
              onPress={() => {
                setSelectedRefund(item);
                setShowViewModal(true);
              }}
            >
              <Text style={styles.refundName}>{item.name}</Text>
              <Text style={styles.refundValue}>
                R$ {parseFloat(item.value).toFixed(2).replace(".", ",")}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
              Nenhuma solicitação encontrada!
            </Text>
          }
        />
      </View>

      {/* Modal Nova Solicitação */}
<Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nova Solicitação</Text>
            <TextInput
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Categoria"
              value={category}
              onChangeText={setCategory}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Valor"
              keyboardType="numeric"
              value={value}
              onChangeText={setValue}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Nome do comprovante"
              value={fileName}
              onChangeText={setFileName}
              style={styles.modalInput}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addRefund}>
              <Text style={{ color: "#fff" }}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: "#ccc" }]}
              onPress={() => setShowAddModal(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Detalhes */}
      <Modal visible={showViewModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Detalhes</Text>
            {selectedRefund && (
              <>
                <Text>Nome: {selectedRefund.name}</Text>
                <Text>Categoria: {selectedRefund.category}</Text>
                <Text>
                  Valor: R$ {parseFloat(selectedRefund.value).toFixed(2)}
                </Text>
                <Text>Comprovante: {selectedRefund.fileName}</Text>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteRefund(selectedRefund.id)}
                >
                  <Text style={{ color: "#fff" }}>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addBtn, { backgroundColor: "#ccc" }]}
                  onPress={() => setShowViewModal(false)}
                >
                  <Text>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Sucesso */}
      <Modal visible={successModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.successModal}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              Solicitação adicionada!
            </Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setSuccessModal(false)}
            >
              <Text style={{ color: "#fff" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4ECE9",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 30,
    position: "absolute",
    top: 60,
    left: 20,
  },
  btnRefund: {
    position: "absolute",
    top: 55,
    right: 20,
    backgroundColor: "#1F8459",
    padding: 9,
    borderRadius: 8,
  },
  content: {
    marginTop: 120,
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#fbfbfb",
    borderRadius: 6,
    paddingLeft: 14,
    height: 38,
  },
  btnSearch: {
    backgroundColor: "#1F8459",
    width: 38,
    height: 38,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    width: 22,
    height: 22,
  },
  refundItem: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  refundName: {
    fontWeight: "600",
  },
  refundValue: {
    color: "#1F8459",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: "#1F8459",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  deleteBtn: {
    backgroundColor: "#d9534f",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 15,
  },
  successModal: {
    width: "75%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
});
