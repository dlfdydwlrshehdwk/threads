import { type BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import { Bell, Home, Search, SquarePlus, User, X } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AnimatedTabBarButton = ({
  children,
  onPress,
  style,
}: BottomTabBarButtonProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  // 눌렀을 때 애니메이션 효과를 주는 함수
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 12,
      speed: 20,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        { flex: 1, justifyContent: "center", alignItems: "center" },
        style,
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

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
        backBehavior="history"
        screenOptions={{
          headerShown: false,
          // tabBarLabel: () => null, // 탭 라벨 숨기기
          tabBarButton: (props) => <AnimatedTabBarButton {...(props as any)} />, // 커스텀 탭 버튼 사용, 버전 문제 타입 as any
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

// ================================================================
// [React Native 인터랙션 만드는 방법]
//
// React Native에서 애니메이션은 CSS가 없기 때문에
// Animated API를 사용해서 직접 구현해야 합니다.
//
// 구조는 항상 3단계입니다.
//
// 1단계. 애니메이션 값 만들기
//    const scaleValue = useRef(new Animated.Value(1)).current;
//    - Animated.Value : 부드럽게 바뀔 수 있는 숫자 (일반 숫자 X)
//    - useRef로 감싸는 이유 : 리렌더링돼도 값이 초기화되지 않게 하기 위해
//    - .current : useRef가 값을 .current 안에 담기 때문에 꺼낼 때 필요
//
// 2단계. 값을 어떻게 바꿀지 함수로 정의
//    Animated.spring(바꿀값, { toValue: 목표값, useNativeDriver: true }).start();
//    - Animated.spring    : 스프링처럼 탄성 있게 값을 바꿈
//    - Animated.sequence  : 배열 안의 애니메이션을 순서대로 실행
//    - toValue            : 바꾸고 싶은 목표 숫자
//    - useNativeDriver    : 성능을 위해 항상 true로 설정
//    - .start()           : 없으면 애니메이션이 실행 안 됨
//
// 3단계. JSX에 연결
//    - Pressable의 onPressIn / onPressOut에 2단계 함수 연결
//    - Animated.View의 style에 1단계 값 연결
//    - 일반 View는 Animated.Value를 인식 못하므로 반드시 Animated.View 사용
// ================================================================
