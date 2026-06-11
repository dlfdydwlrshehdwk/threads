import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Modal() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>modal</Text>
      <Pressable onPress={() => router.back()}>
        <Text>close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "red",
  },
});
