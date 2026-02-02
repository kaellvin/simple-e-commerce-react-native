import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "../components/app-text";
import Divider from "../components/divider";
import useAuth from "../hooks/use-auth";
import useToast from "../hooks/use-toast";

export default function Account() {
  const { session, signOut } = useAuth();
  const { showToast } = useToast();

  const onSignOutLabelClicked = async () => {
    try {
      await signOut();
      showToast("Sign out successfully.");
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message);
      }
    }
  };

  return (
    <SafeAreaView>
      <View>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/logos/company_logo.png")}
            style={{ width: 200, height: 50 }}
            contentFit="contain"
          />
        </View>
        {session && (
          <AppText variant="titleMedium" style={{ padding: 8 }}>
            Logged in as: {session.user.email}
          </AppText>
        )}
        {session ? (
          <Pressable onPress={onSignOutLabelClicked}>
            <Info iconName="logout" label="Sign Out" />
          </Pressable>
        ) : (
          <Link href="/sign-in">
            <Info iconName="login" label="Sign In" />
          </Link>
        )}

        <Divider />
        {!session && (
          <>
            <Link href="/sign-up">
              <Info iconName="person-add" label="Sign Up" />
            </Link>

            <Divider />
          </>
        )}
        <Info iconName="info" label="About App" />
      </View>
    </SafeAreaView>
  );
}

const Info = ({
  iconName,
  label,
}: {
  iconName: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
}) => {
  return (
    <View style={styles.infoContainer}>
      <MaterialIcons size={24} name={iconName} />
      <AppText variant="titleMedium">{label}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 8,
  },
});
