import { globalStyles } from "@/styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Account() {
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
        <Link href="/sign-in">
          <Info iconName="login" label="Sign In" />
        </Link>

        {/* <Info iconName="logout" label="Sign Out" /> */}
        <Divider />
        <Info iconName="person-add" label="Sign Up" />
        <Divider />
        <Info iconName="info" label="About App" />
      </View>
    </SafeAreaView>
  );
}

export const Info = ({
  iconName,
  label,
}: {
  iconName: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
}) => {
  return (
    <View style={styles.infoContainer}>
      <MaterialIcons size={24} name={iconName} />
      <Text style={styles.infoText}>{label}</Text>
    </View>
  );
};

export const Divider = () => {
  return <View style={globalStyles.divider} />;
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
  infoText: {
    fontSize: 16,
    fontWeight: 500,
  },
});
