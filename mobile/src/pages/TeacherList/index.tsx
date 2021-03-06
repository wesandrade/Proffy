import React, { useState } from "react";
import { View, ScrollView, Text, TextInput } from "react-native";
import { BorderlessButton, RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";

import PageHeader from "../../components/PageHeader";
import TeacherItem, { Teacher } from "../../components/TeacherItem";
import api from "../../services/api";

import styles from "./styles";
import { useFocusEffect } from "@react-navigation/native";

// instalar o expo-picker dentro de um Modal

function TeacherList() {
  // -------------------------- Storage --------------------------
  const [favorites, setFavorites] = useState<number[]>([]);
  function loadFavorites() {
    AsyncStorage.getItem("favorites").then((response) => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map(
          (teacher: Teacher) => {
            return teacher.id;
          }
        );

        setFavorites(favoritedTeachersIds);
      }
    });
  }
  // -------------------------^ Storage ^-------------------------

  // -------------------------- Axios --------------------------
  const [teachers, setTeachers] = useState([]);

  async function handleFiltersSubmit() {
    loadFavorites();

    const response = await api.get("classes", {
      params: { subject, week_day, time },
    });
    setIsFilterVisible(false);
    setTeachers(response.data);
  }
  // -------------------------^ Axios ^-------------------------

  // -------------------------- Filter --------------------------
  const [isFiltersVisible, setIsFilterVisible] = useState(false);
  const [week_day, setWeekday] = useState("");
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");

  function handleToggleFilterVisible() {
    setIsFilterVisible(!isFiltersVisible);
  }
  // -------------------------^ Filter ^-------------------------

  return (
    <View style={styles.container}>
      {/* Header */}
      <PageHeader
        title="Proffys disponíveis"
        headerRight={
          <BorderlessButton onPress={handleToggleFilterVisible}>
            <Feather name="filter" size={20} color="#fff" />
          </BorderlessButton>
        }
      >
        {isFiltersVisible && (
          <View style={styles.searchForm}>
            {/* Matéria */}
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={(text) => setSubject(text)}
              placeholder={"Qual a matéria?"}
              placeholderTextColor="#c1bcc"
            />

            <View style={styles.inputGroup}>
              {/* Dia */}
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da Semana</Text>
                <TextInput
                  style={styles.input}
                  value={week_day}
                  onChangeText={(text) => setWeekday(text)}
                  placeholder={"Qual o dia?"}
                  placeholderTextColor="#c1bcc"
                />
              </View>

              {/* Hora */}
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={(text) => setTime(text)}
                  placeholder={"Qual horário?"}
                  placeholderTextColor="#c1bcc"
                />
              </View>
            </View>
            <RectButton
              onPress={handleFiltersSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Filtar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      {/* Teacher List */}
      <ScrollView
        style={styles.teahcerList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

export default TeacherList;
