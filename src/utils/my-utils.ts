import { Alert } from "react-native";

export const fetchWithErrorHanding = async <T>(
  input: string | URL | globalThis.Request,
  init?: RequestInit,
): Promise<T> => {
  const res = await fetch(input, init);

  if (!res.ok) {
    if (res.status === 429) {
      const text = await res.text();
      Alert.alert(text);
    }

    throw new Error(
      `API request failed with status ${res.status}: ${res.statusText}`,
    );
  }

  return await res.json();
};
