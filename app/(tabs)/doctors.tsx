import { AppContext, Doctor } from "@/context/AppContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { cssInterop } from "nativewind";
import React, { useContext, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

cssInterop(Image, { className: "style" });

const ALL = "All";

const specialities = [
  ALL,
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

const Doctors: React.FC = () => {
  const router = useRouter();
  const { doctors } = useContext(AppContext);
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>(ALL);

  const filtered =
    selectedSpeciality === ALL
      ? doctors
      : doctors.filter((doc) => doc.speciality === selectedSpeciality);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "left", "right"]}>

      {/* ── Header ── */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
          Find a Doctor
        </Text>
        <Text style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
          {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} available
        </Text>
      </View>

      {/* ── Specialty Filter Chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingVertical: 10, paddingLeft: 16, maxHeight: 56 }}
        contentContainerStyle={{ gap: 8, alignItems: "center", paddingRight: 16 }}
      >
        {specialities.map((item) => {
          const active = selectedSpeciality === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => setSelectedSpeciality(item)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: active ? "#5F6FFF" : "#f3f4f6",
                borderWidth: active ? 0 : 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: active ? "#fff" : "#374151",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Doctors Grid ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24, paddingTop: 8 }}
        columnWrapperStyle={{ gap: 12, marginBottom: 14 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: "center", marginTop: 60 }}>
            <Text style={{ color: "#9ca3af", fontSize: 15 }}>No doctors found for this specialty.</Text>
          </View>
        }
        renderItem={({ item }: { item: Doctor }) => (
          <TouchableOpacity
            onPress={() => router.push(`/appointment/${item._id}` as any)}
            style={{
              flex: 1,
              maxWidth: "48%",
              backgroundColor: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#e0e7ff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Image
              source={item.image}
              style={{ width: "100%", height: 148, backgroundColor: "#eef2ff" }}
              contentFit="cover"
            />
            <View style={{ padding: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#22c55e" }} />
                <Text style={{ fontSize: 11, color: "#16a34a", fontWeight: "600" }}>Available</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#111827" }} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }} numberOfLines={1}>
                {item.speciality}
              </Text>
              <Text style={{ fontSize: 12, color: "#5F6FFF", fontWeight: "600", marginTop: 4 }}>
                ${item.fees} · {item.experience}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Doctors;
