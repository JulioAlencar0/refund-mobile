import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function App() {
  type Refund = {
    id: string;
    name: string;
    category: string;
    value: string;
    fileName: string;
    fileUri: string;
  };

  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // Dropdown Picker states
  const [openCategory, setOpenCategory] = useState(false);
  const [categories, setCategories] = useState([
    { label: "Alimentação", value: "Alimentação" },
    { label: "Hospedagem", value: "Hospedagem" },
    { label: "Transporte", value: "Transporte" },
    { label: "Serviços", value: "Serviços" },
    { label: "Outros", value: "Outros" },
  ]);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFileName(file.name || "Arquivo selecionado");
        setFileUri(file.uri);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openFile = async (uri: string) => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Não é possível abrir o arquivo neste dispositivo.");
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Erro ao abrir o arquivo:", error);
    }
  };

  const addRefund = () => {
    if (!name || !selectedCategory || !value || !fileName || !fileUri) {
      Alert.alert("Preencha todos os campos antes de adicionar!");
      return;
    }

    const newRefund: Refund = {
      id: Date.now().toString(),
      name,
      category: selectedCategory,
      value,
      fileName,
      fileUri,
    };

    setRefunds([...refunds, newRefund]);
    setShowAddModal(false);
    setSuccessModal(true);
    setName("");
    setSelectedCategory("");
    setValue("");
    setFileName("");
    setFileUri(null);
  };

  const deleteRefund = (id: string) => {
    setRefunds(refunds.filter((r) => r.id !== id));
    setShowViewModal(false);
  };

  const confirmDeleteRefund = (id: string) => {
    Alert.alert(
      "Excluir solicitação",
      "Você quer mesmo apagar essa solicitação? Não tem mais volta.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", style: "destructive", onPress: () => deleteRefund(id) },
      ]
    );
  };

  const filteredRefunds = refunds.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Alimentação":
        return <MaterialIcons name="restaurant" size={20} color="#1F8459" />;
      case "Hospedagem":
        return <FontAwesome5 name="hotel" size={20} color="#1F8459" />;
      case "Transporte":
        return <FontAwesome5 name="car" size={20} color="#1F8459" />;
      case "Serviços":
        return <Entypo name="tools" size={20} color="#1F8459" />;
      default:
        return <MaterialIcons name="help-outline" size={20} color="#1F8459" />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E4ECE9" barStyle="dark-content" />
      <Image source={require("../assets/Logo.png")} style={styles.logo} />
      <TouchableOpacity
        style={styles.btnRefund}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={{ color: "#fff", fontWeight: "500" }}>
          Nova solicitação
        </Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Suas solicitações</Text>
        <TextInput
          style={styles.input}
          placeholder="Pesquise pelo nome"
          placeholderTextColor="#A1A2A1"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

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
              <View style={styles.refundLeft}>
                <View style={styles.iconCircle}>
                  {getCategoryIcon(item.category)}
                </View>
                <View>
                  <Text style={styles.refundName}>{item.name}</Text>
                  <Text style={styles.refundCategory}>{item.category}</Text>
                </View>
              </View>
              <Text style={styles.refundValue}>
                R$ {parseFloat(item.value).toFixed(2).replace(".", ",")}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 200, color: "#555" }}>
              Nenhuma solicitação encontrada!
            </Text>
          }
        />
      </View>

      {/* Modal Nova Solicitação */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nova solicitação</Text>

            <Text style={styles.label}>Nome da solicitação</Text>
            <TextInput
              placeholder="Digite o nome"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              style={styles.modalInput}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Text style={styles.label}>Categoria</Text>
                <DropDownPicker
                  open={openCategory}
                  value={selectedCategory}
                  items={categories}
                  setOpen={setOpenCategory}
                  setValue={setSelectedCategory}
                  setItems={setCategories}
                  placeholder="Selecione"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#dcdcdc",
                    borderRadius: 8,
                    height: 45,
                  }}
                  textStyle={{ color: "#000000ff", fontSize: 14 }}
                  dropDownContainerStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#dcdcdc",
                    borderRadius: 8,
                  }}
                />
              </View>

              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text style={styles.label}>Valor</Text>
                <TextInput
                  placeholder="0,00"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={setValue}
                  style={styles.modalInput}
                />
              </View>
            </View>

            <Text style={styles.label}>Comprovante</Text>
            <TouchableOpacity style={styles.filePicker} onPress={handlePickFile}>
              <Text>{fileName || "Selecionar arquivo"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addBtn} onPress={addRefund}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Enviar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={{ color: "#333" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Visualização */}
      {selectedRefund && (
        <Modal visible={showViewModal} transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalDetails}>
              <Text style={styles.modalTitle}>Detalhes da solicitação</Text>

              <Text style={styles.label}>Nome da solicitação</Text>
              <TextInput
                value={selectedRefund.name}
                editable={false}
                style={styles.modalInput}
              />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 5 }}>
              <Text style={styles.label}>Categoria</Text>
              <TextInput
                value={selectedRefund.category}
                editable={false}
                style={styles.modalInput}
              />
              </View>

              <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                value={selectedRefund.value}
                editable={false}
                style={styles.modalInput}
                />
                </View>
                </View>

              <Text style={styles.label}>Comprovante</Text>
              <TouchableOpacity
                style={styles.fileOpen}
                onPress={() => openFile(selectedRefund.fileUri)}
              >
                 <MaterialIcons style={{position:"absolute", right: 140}} name="book" size={20} color="#1F8459" />;
                <Text style={{color: "#1F8459", fontWeight:"600"}}>Abrir Comprovante</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addDetails}
                onPress={() => confirmDeleteRefund(selectedRefund.id)}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowViewModal(false)}
              >
                <Text style={{ color: "#333" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E4ECE9", alignItems: "center" },
  logo: { width: 120, height: 30, position: "absolute", top: 60, left: 20 },
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
  input: {
    backgroundColor: "#fbfbfb",
    borderRadius: 6,
    paddingLeft: 14,
    height: 38,
    marginBottom: 10,
  },
  refundItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refundLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: "#E4ECE9",
    justifyContent: "center",
    alignItems: "center",
  },
    refundName: { fontWeight: "700", color: "#1a1a1a", fontSize: 14 },
  refundCategory: { color: "#666", fontSize: 13 },
  refundValue: { fontWeight: "700", color: "#000", fontSize: 14 },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    height: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalDetails: {
    width: "90%",
    height: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  label: { fontSize: 13, color: "#333", marginBottom: 5, marginTop: 10 },
  modalInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    padding: 15.5,
    color: "#000",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  filePicker: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: "#1F8459",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addDetails: {
    backgroundColor: "#bf0b0bff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  fileOpen: {
    width: 150,
    alignItems: "center",
    marginLeft: "31%",    
    margin: 5
  },
});
