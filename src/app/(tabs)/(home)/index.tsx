import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = false; // 로그인 상태를 나타내는 변수
  const insets = useSafeAreaInsets(); // 안전 영역의 패딩 값을 가져옵니다.
  const { width, height } = Dimensions.get("window"); // 화면의 너비와 높이를 가져옵니다.

  console.log(pathname);
  console.log(insets);
  console.log(`Window dimensions: ${width} x ${height}`);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <BlurView style={styles.header}>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.headerLogo}
        />
        {!isLoggedIn && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.navigate("/login")}
          >
            <Text>Login</Text>
          </TouchableOpacity>
        )}
      </BlurView>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.replace(`/`)}
        >
          <Text style={{ color: pathname === `/` ? "red" : "black" }}>
            For you
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.replace(`/following`)}
        >
          <Text style={{ color: pathname === `/following` ? "red" : "black" }}>
            Following
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  header: {
    alignItems: "center",
  },
  headerLogo: {
    width: 42, // DP, DIP 기기 독립 픽셀 이라는 뜻 (화면 크기에 따라 픽셀 수가 달라짐)
    height: 42,
  },
  loginButton: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "lightgray",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
