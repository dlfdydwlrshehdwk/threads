import { Tabs, useRouter } from "expo-router";
import { Bell, Home, Search, SquarePlus } from "lucide-react-native";

export default function TabLayout() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // tabBarLabel: () => null, // 탭 라벨 숨기기
      }}
    >
      {/* 탭 순서변경 */}
      <Tabs.Screen
        name="index"
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
            <Search size={24} color={color} strokeWidth={focused ? 2.5 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        listeners={{
          tabPress: (e) => {
            // 탭이 눌렸을 때의 동작을 정의합니다.
            e.preventDefault(); // 기본 탭 전환 동작을 막습니다.
            router.navigate("/modal");
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
      />
      <Tabs.Screen
        name="following"
        options={{
          title: "Following",
          href: null, // 탭 숨기기 (탭바에서 보이지 않지만, 라우터로는 접근 가능)
        }}
      />
    </Tabs>
  );
}
