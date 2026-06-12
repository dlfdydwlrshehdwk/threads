import { Tabs, useRouter } from "expo-router";
import { Bell, Home, Search, SquarePlus, User, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const isLoggedIn = true; // 로그인 상태를 나타내는 변수
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          // tabBarLabel: () => null, // 탭 라벨 숨기기
        }}
      >
        {/* 탭 순서변경 */}
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Home size={24} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, focused }) => (
              <Search
                size={24}
                color={color}
                strokeWidth={focused ? 2.5 : 1.5}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          listeners={{
            tabPress: (e) => {
              // 탭이 눌렸을 때의 동작을 정의합니다.
              e.preventDefault(); // 기본 탭 전환 동작을 막습니다.

              if (isLoggedIn) {
                router.navigate("/modal");
              } else {
                openLoginModal();
              }
            },
          }}
          options={{
            title: "Add",
            tabBarIcon: ({ color, focused }) => (
              <SquarePlus
                size={24}
                color={color}
                strokeWidth={focused ? 2.5 : 1.5}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: "Activity",
            tabBarIcon: ({ color, focused }) => (
              <Bell size={24} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              // 탭이 눌렸을 때의 동작을 정의합니다.
              if (!isLoggedIn) {
                e.preventDefault(); // 기본 탭 전환 동작을 막습니다.
                openLoginModal();
              }
            },
          }}
        />
        <Tabs.Screen
          name="[username]"
          options={{
            title: "My",
            tabBarIcon: ({ color, focused }) => (
              <User size={24} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              // 탭이 눌렸을 때의 동작을 정의합니다.
              if (!isLoggedIn) {
                e.preventDefault(); // 기본 탭 전환 동작을 막습니다.
                openLoginModal();
              }
            },
          }}
        />
        <Tabs.Screen
          name="following"
          options={{
            title: "Following",
            href: null,
          }}
        />

        <Tabs.Screen
          name="(post)/[username]/post/[postId]"
          options={{
            title: "Post",
            href: null, // 탭 숨기기 (탭바에서 보이지 않지만, 라우터로는 접근 가능)
          }}
        />
      </Tabs>

      <Modal visible={isLoginModalOpen} animationType="fade" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>로그인 모달</Text>
              <TouchableOpacity onPress={closeLoginModal}>
                <X size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
